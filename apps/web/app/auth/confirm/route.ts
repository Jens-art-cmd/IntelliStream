import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type");
  const next = searchParams.get("next") ?? "/onboarding";

  if (token_hash && type) {
    // Create the redirect response first so the cookie setter can attach to it
    const successResponse = NextResponse.redirect(`${origin}${next}`);

    const supabase = createServerClient(
      process.env["NEXT_PUBLIC_SUPABASE_URL"]!,
      process.env["NEXT_PUBLIC_SUPABASE_ANON_KEY"]!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
            cookiesToSet.forEach(({ name, value, options }) => {
              successResponse.cookies.set(name, value, options as Parameters<typeof successResponse.cookies.set>[2]);
            });
          },
        },
      },
    );

    const { data: otpData, error } = await supabase.auth.verifyOtp({
      type: type as "signup",
      token_hash,
    });

    if (!error) {
      // Onboarding-Mail async senden (kein await — blockiert Redirect nicht)
      if (type === "signup" && otpData?.user?.id) {
        const appUrl    = process.env["APP_URL"] ?? "https://distillfeed.eu";
        const secret    = process.env["INTERNAL_WEBHOOK_SECRET"] ?? "";
        fetch(`${appUrl}/api/onboarding/welcome`, {
          method:  "POST",
          headers: { "Content-Type": "application/json", "x-webhook-secret": secret },
          body:    JSON.stringify({ user_id: otpData.user.id }),
        }).catch(() => {}); // Fehler still ignorieren — Redirect nicht blockieren
      }
      return successResponse;
    }
  }

  return NextResponse.redirect(`${origin}/login?error=invalid_token`);
}
