import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");

  if (!token) {
    return NextResponse.redirect(
      new URL("/newsletter/bestaetigt?status=invalid", request.url),
    );
  }

  const admin = createClient(
    process.env["NEXT_PUBLIC_SUPABASE_URL"]!,
    process.env["SUPABASE_SERVICE_ROLE_KEY"]!,
    { auth: { persistSession: false } },
  );

  // Fetch token row
  const { data: tokenRow, error } = await admin
    .from("newsletter_opt_in_tokens")
    .select("user_id, expires_at, used_at")
    .eq("token", token)
    .single();

  if (error || !tokenRow) {
    return NextResponse.redirect(
      new URL("/newsletter/bestaetigt?status=invalid", request.url),
    );
  }

  // Already used
  if (tokenRow.used_at) {
    return NextResponse.redirect(
      new URL("/newsletter/bestaetigt?status=already", request.url),
    );
  }

  // Expired
  if (new Date(tokenRow.expires_at) < new Date()) {
    return NextResponse.redirect(
      new URL("/newsletter/bestaetigt?status=expired", request.url),
    );
  }

  // Mark token as used + activate opt-in (transaction-style, two quick writes)
  const now = new Date().toISOString();

  const [{ error: tokenErr }, { error: userErr }] = await Promise.all([
    admin
      .from("newsletter_opt_in_tokens")
      .update({ used_at: now })
      .eq("token", token),
    admin
      .from("users")
      .update({
        newsletter_opt_in: true,
        newsletter_opt_in_at: now,
      })
      .eq("id", tokenRow.user_id),
  ]);

  if (tokenErr || userErr) {
    console.error("[Newsletter Confirm]", tokenErr ?? userErr);
    return NextResponse.redirect(
      new URL("/newsletter/bestaetigt?status=error", request.url),
    );
  }

  return NextResponse.redirect(
    new URL("/newsletter/bestaetigt?status=success", request.url),
  );
}
