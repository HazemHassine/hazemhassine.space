import "server-only";

import { cache } from "react";
import { isSupabaseConfigured, supabase, supabaseAdmin } from "@/lib/supabase";
import { CMS_CLIENT_KEYS } from "@/lib/cms-shared";
import { cmsDefaults, getDefaultCmsEntries } from "@/lib/cms-defaults";

function mergeCmsRows(rows, contentField = "content") {
  const result = { ...cmsDefaults };
  for (const row of rows || []) {
    const value = row?.[contentField];
    if (row?.key && value !== null && value !== undefined) {
      result[row.key] = value;
    }
  }
  return result;
}

export const getPublishedCmsData = cache(async () => {
  if (!isSupabaseConfigured) return { ...cmsDefaults };

  try {
    const { data, error } = await supabase
      .from("cms_published")
      .select("key,content");

    if (error) {
      console.warn("CMS published content unavailable; using repository defaults:", error.message);
      return { ...cmsDefaults };
    }

    return mergeCmsRows(data);
  } catch (error) {
    console.warn("CMS published content fetch failed; using repository defaults:", error.message);
    return { ...cmsDefaults };
  }
});

export async function getDraftCmsData() {
  if (!isSupabaseConfigured) return { ...cmsDefaults };

  const { data, error } = await supabaseAdmin
    .from("cms_entries")
    .select("key,draft_content");

  if (error) {
    console.warn("CMS draft content unavailable; using repository defaults:", error.message);
    return { ...cmsDefaults };
  }

  return mergeCmsRows(data, "draft_content");
}

export function getClientCmsData(cmsData) {
  return Object.fromEntries(CMS_CLIENT_KEYS.map((key) => [key, cmsData[key] ?? cmsDefaults[key]]));
}

export async function getAdminCmsEntries() {
  const defaults = getDefaultCmsEntries();
  if (!isSupabaseConfigured) {
    return { entries: defaults, configured: false, setupRequired: true };
  }

  const { data, error } = await supabaseAdmin
    .from("cms_entries")
    .select("key,label,section,description,content_type,draft_content,published_content,version,sort_order,updated_at,published_at")
    .order("sort_order", { ascending: true });

  if (error) {
    return {
      entries: defaults,
      configured: true,
      setupRequired: true,
      error: error.message,
    };
  }

  const rowsByKey = new Map((data || []).map((row) => [row.key, row]));
  const entries = defaults.map((fallback) => {
    const row = rowsByKey.get(fallback.key);
    if (!row) return fallback;
    return {
      ...fallback,
      label: row.label || fallback.label,
      section: row.section || fallback.section,
      description: row.description || fallback.description,
      contentType: row.content_type || fallback.contentType,
      sortOrder: row.sort_order ?? fallback.sortOrder,
      draftContent: row.draft_content ?? fallback.draftContent,
      publishedContent: row.published_content,
      status: row.published_content === null ? "draft" : "published",
      version: row.version,
      updatedAt: row.updated_at,
      publishedAt: row.published_at,
    };
  });

  for (const row of data || []) {
    if (!entries.some((entry) => entry.key === row.key)) {
      entries.push({
        key: row.key,
        label: row.label,
        section: row.section,
        description: row.description || "Custom CMS document",
        contentType: row.content_type || "object",
        previewPath: "/",
        sortOrder: row.sort_order,
        draftContent: row.draft_content,
        publishedContent: row.published_content,
        status: row.published_content === null ? "draft" : "published",
        version: row.version,
        updatedAt: row.updated_at,
        publishedAt: row.published_at,
      });
    }
  }

  return { entries, configured: true, setupRequired: false };
}

