import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase";
import { getAdminCmsEntries } from "@/lib/cms-server";
import { getCmsDefinition } from "@/lib/cms-defaults";

const KEY_PATTERN = /^[a-zA-Z][a-zA-Z0-9_-]{1,79}$/;
const MAX_DOCUMENT_BYTES = 1_500_000;

function response(body, status = 200) {
  return NextResponse.json(body, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}

function validateDocument(key, content) {
  if (!KEY_PATTERN.test(key || "")) return "Invalid CMS document key";
  if (content === undefined) return "Document content is required";
  if (Buffer.byteLength(JSON.stringify(content), "utf8") > MAX_DOCUMENT_BYTES) {
    return "CMS document is too large";
  }
  return null;
}

async function upsertDraft({ key, content, label, section, description, contentType, sortOrder }) {
  const definition = getCmsDefinition(key);
  const validationError = validateDocument(key, content);
  if (validationError) return { error: { message: validationError } };

  return supabaseAdmin.from("cms_entries").upsert({
    key,
    label: label || definition?.label || key,
    section: section || definition?.section || "custom",
    description: description ?? definition?.description ?? "Custom CMS document",
    content_type: contentType || definition?.contentType || "object",
    draft_content: content,
    sort_order: sortOrder ?? definition?.sortOrder ?? 999,
  }, { onConflict: "key" });
}

function revalidateCms() {
  revalidatePath("/", "layout");
  revalidatePath("/sitemap.xml");
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const historyKey = searchParams.get("history");

  if (historyKey) {
    if (!KEY_PATTERN.test(historyKey)) return response({ error: "Invalid CMS document key" }, 400);
    const { data, error } = await supabaseAdmin
      .from("cms_revisions")
      .select("id,entry_key,version,change_type,created_at")
      .eq("entry_key", historyKey)
      .order("created_at", { ascending: false })
      .limit(30);

    if (error) return response({ error: error.message, setupRequired: true }, 503);
    return response({ revisions: data || [] });
  }

  const result = await getAdminCmsEntries();
  return response(result, result.setupRequired && result.configured ? 503 : 200);
}

export async function PUT(request) {
  try {
    const payload = await request.json();
    const { error } = await upsertDraft(payload);
    if (error) return response({ error: error.message, setupRequired: true }, 503);

    const { data, error: readError } = await supabaseAdmin
      .from("cms_entries")
      .select("key,version,updated_at")
      .eq("key", payload.key)
      .single();

    if (readError) return response({ error: readError.message }, 500);
    return response({ success: true, entry: data });
  } catch (error) {
    return response({ error: error.message || "Could not save CMS draft" }, 400);
  }
}

export async function POST(request) {
  try {
    const payload = await request.json();
    const documents = Array.isArray(payload.entries)
      ? payload.entries
      : [{ key: payload.key, content: payload.content }];

    if (documents.length === 0 || documents.length > 50) {
      return response({ error: "Publish between 1 and 50 documents at a time" }, 400);
    }

    for (const document of documents) {
      const { error } = await upsertDraft(document);
      if (error) return response({ error: error.message, key: document.key, setupRequired: true }, 503);

      const { error: publishError } = await supabaseAdmin.rpc("cms_publish_entry", {
        p_key: document.key,
      });
      if (publishError) {
        return response({ error: publishError.message, key: document.key, setupRequired: true }, 503);
      }
    }

    revalidateCms();
    return response({ success: true, published: documents.map((document) => document.key) });
  } catch (error) {
    return response({ error: error.message || "Could not publish CMS content" }, 400);
  }
}

export async function PATCH(request) {
  try {
    const { key, revisionId } = await request.json();
    if (!KEY_PATTERN.test(key || "") || !Number.isInteger(Number(revisionId))) {
      return response({ error: "A valid key and revision are required" }, 400);
    }

    const { error } = await supabaseAdmin.rpc("cms_restore_revision", {
      p_key: key,
      p_revision_id: Number(revisionId),
    });

    if (error) return response({ error: error.message }, 500);
    return response({ success: true });
  } catch (error) {
    return response({ error: error.message || "Could not restore revision" }, 400);
  }
}

