import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

const BUCKET = "cms-media";

export async function GET() {
  const { data, error } = await supabaseAdmin.storage
    .from(BUCKET)
    .list("", { limit: 200, sortBy: { column: "created_at", order: "desc" } });

  if (error) return NextResponse.json({ error: error.message }, { status: 503 });

  const assets = (data || [])
    .filter((item) => item.id)
    .map((item) => ({
      ...item,
      url: supabaseAdmin.storage.from(BUCKET).getPublicUrl(item.name).data.publicUrl,
    }));

  return NextResponse.json({ assets }, { headers: { "Cache-Control": "no-store" } });
}

export async function DELETE(request) {
  const { name } = await request.json();
  if (!name || typeof name !== "string" || name.includes("..") || name.includes("/")) {
    return NextResponse.json({ error: "Invalid asset name" }, { status: 400 });
  }

  const { error } = await supabaseAdmin.storage.from(BUCKET).remove([name]);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}

