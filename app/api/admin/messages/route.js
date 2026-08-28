import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

const VALID_STATUSES = new Set(["new", "read", "archived"]);

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from("contact_messages")
    .select("id,name,email,message,status,created_at")
    .order("created_at", { ascending: false })
    .limit(200);

  if (error) return NextResponse.json({ error: error.message }, { status: 503 });
  return NextResponse.json({ messages: data || [] }, { headers: { "Cache-Control": "no-store" } });
}

export async function PATCH(request) {
  const { id, status } = await request.json();
  if (!id || !VALID_STATUSES.has(status)) {
    return NextResponse.json({ error: "Invalid message update" }, { status: 400 });
  }

  const { error } = await supabaseAdmin.from("contact_messages").update({ status }).eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}

