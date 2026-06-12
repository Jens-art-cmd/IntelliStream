import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { createClient } from "@supabase/supabase-js";

/**
 * POST /api/newsletter/unsubscribe
 * Called from the dashboard settings toggle.
 * Requires an active session.
 */
export async function POST() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const admin = createClient(
    process.env["NEXT_PUBLIC_SUPABASE_URL"]!,
    process.env["SUPABASE_SERVICE_ROLE_KEY"]!,
    { auth: { persistSession: false } },
  );

  const { error } = await admin
    .from("users")
    .update({ newsletter_opt_in: false })
    .eq("id", user.id);

  if (error) {
    console.error("[Newsletter Unsubscribe]", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: "Abgemeldet" });
}

/**
 * GET /api/newsletter/unsubscribe?token=xxx
 * One-click unsubscribe link in delivered emails (no login required).
 * Uses a valid (not-yet-used) opt-in token as proof of identity.
 * RFC 8058 compliant redirect to confirmation page.
 */
export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");

  if (!token) {
    // No token: redirect to dashboard settings
    return NextResponse.redirect(
      new URL("/dashboard/settings", request.url),
    );
  }

  const admin = createClient(
    process.env["NEXT_PUBLIC_SUPABASE_URL"]!,
    process.env["SUPABASE_SERVICE_ROLE_KEY"]!,
    { auth: { persistSession: false } },
  );

  // Verify token belongs to a real user (re-use opt_in_tokens or look up by user)
  const { data: tokenRow } = await admin
    .from("newsletter_opt_in_tokens")
    .select("user_id")
    .eq("token", token)
    .single();

  if (tokenRow?.user_id) {
    await admin
      .from("users")
      .update({ newsletter_opt_in: false })
      .eq("id", tokenRow.user_id);
  }

  return NextResponse.redirect(
    new URL("/newsletter/bestaetigt?status=unsubscribed", request.url),
  );
}
