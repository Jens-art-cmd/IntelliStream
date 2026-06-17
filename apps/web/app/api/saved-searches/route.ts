import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-server";

export async function GET() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any)
    .from("saved_searches")
    .select("id, name, query, impact_filter, industry_ids, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ searches: data ?? [] });
}

export async function POST(req: Request) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json() as {
    name?: string;
    query?: string;
    impact_filter?: string | null;
    industry_ids?: number[];
  };

  const name = (body.name ?? "").trim().slice(0, 80);
  const query = (body.query ?? "").trim().slice(0, 200);

  if (!name) return NextResponse.json({ error: "Name fehlt" }, { status: 400 });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any)
    .from("saved_searches")
    .insert({
      user_id:       user.id,
      name,
      query,
      impact_filter: body.impact_filter ?? null,
      industry_ids:  body.industry_ids  ?? [],
    })
    .select("id, name, query, impact_filter, industry_ids, created_at")
    .single();

  if (error) {
    if (error.code === "23505") {
      return NextResponse.json({ error: "Name bereits vergeben" }, { status: 409 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ search: data }, { status: 201 });
}
