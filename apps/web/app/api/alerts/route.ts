import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { getTrialInfo } from "@/lib/trial";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

export async function GET() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data, error } = await supabase
    .from("user_alerts")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ alerts: data ?? [] });
}

export async function POST(request: NextRequest) {
  // Rate Limiting: max. 20 Alert-Erstellungen pro IP pro Stunde
  const rl = checkRateLimit(getClientIp(request), "alerts:post", { limit: 20, windowSecs: 3600 });
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "Zu viele Anfragen. Bitte versuche es später erneut." },
      { status: 429, headers: { "Retry-After": String(rl.resetAfter) } },
    );
  }

  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Plan gate — Alerts sind Pro-Feature
  const { data: userData } = await supabase
    .from("users")
    .select("plan, trial_ends_at")
    .eq("id", user.id)
    .single();

  const { isFullAccess } = getTrialInfo({
    plan: userData?.plan ?? "free",
    trial_ends_at: userData?.trial_ends_at,
  });

  if (!isFullAccess) {
    return NextResponse.json({ error: "Pro-Plan erforderlich" }, { status: 403 });
  }

  const body = await request.json();
  const { name, keywords, companies, laws, min_impact, channel } = body;

  if (!name?.trim()) {
    return NextResponse.json({ error: "Name ist erforderlich" }, { status: 400 });
  }
  if (!Array.isArray(keywords) || keywords.length === 0) {
    return NextResponse.json({ error: "Mindestens ein Stichwort erforderlich" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("user_alerts")
    .insert({
      user_id: user.id,
      name: name.trim(),
      keywords: keywords.map((k: string) => k.toLowerCase().trim()).filter(Boolean),
      companies: companies ?? [],
      laws: laws ?? [],
      min_impact: min_impact ?? "medium",
      channel: channel ?? "email",
      is_active: true,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ alert: data }, { status: 201 });
}
