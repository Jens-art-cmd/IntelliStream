import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import type { Database } from "@/types/database";

type UserAlertUpdate = Database["public"]["Tables"]["user_alerts"]["Update"];

// Next.js 15: params ist ein Promise
interface Props { params: Promise<{ id: string }> }

export async function PATCH(request: NextRequest, { params }: Props) {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();

  // Nur erlaubte Felder akzeptieren
  const allowed = ["name", "keywords", "companies", "laws", "min_impact", "channel", "is_active"];
  const update = Object.fromEntries(
    Object.entries(body).filter(([k]) => allowed.includes(k))
  ) as UserAlertUpdate;

  const { data, error } = await supabase
    .from("user_alerts")
    .update(update)
    .eq("id", id)
    .eq("user_id", user.id) // RLS: nur eigene Alerts
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ alert: data });
}

export async function DELETE(_: NextRequest, { params }: Props) {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { error } = await supabase
    .from("user_alerts")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id); // RLS: nur eigene Alerts

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return new NextResponse(null, { status: 204 });
}
