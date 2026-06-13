import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { createClient } from "@supabase/supabase-js";

const ALLOWED_FIELDS = ["newsletter_frequency", "newsletter_time"] as const;
type AllowedField = typeof ALLOWED_FIELDS[number];

/**
 * PATCH /api/user/settings
 * Updates safe user preference fields (no plan/billing changes here).
 */
export async function PATCH(request: NextRequest) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  // Whitelist: only allow specific fields
  const update: Partial<Record<AllowedField, unknown>> = {};
  for (const field of ALLOWED_FIELDS) {
    if (field in body) update[field] = body[field];
  }

  if (Object.keys(update).length === 0) {
    return NextResponse.json({ error: "Keine gültigen Felder" }, { status: 400 });
  }

  // Validate newsletter_frequency
  if (update.newsletter_frequency !== undefined) {
    const valid = ["daily", "weekly", "realtime"];
    if (!valid.includes(update.newsletter_frequency as string)) {
      return NextResponse.json({ error: "Ungültige Frequenz" }, { status: 400 });
    }
  }

  // Validate newsletter_time (HH:MM format, allowed hours 06–20)
  if (update.newsletter_time !== undefined) {
    const valid = ["06:00", "07:00", "08:00", "09:00", "10:00", "11:00", "12:00", "16:00", "18:00", "20:00"];
    if (!valid.includes(update.newsletter_time as string)) {
      return NextResponse.json({ error: "Ungültige Uhrzeit" }, { status: 400 });
    }
  }

  const admin = createClient(
    process.env["NEXT_PUBLIC_SUPABASE_URL"]!,
    process.env["SUPABASE_SERVICE_ROLE_KEY"]!,
    { auth: { persistSession: false } },
  );

  const { error } = await admin
    .from("users")
    .update(update)
    .eq("id", user.id);

  if (error) {
    console.error("[User Settings]", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: "Gespeichert" });
}
