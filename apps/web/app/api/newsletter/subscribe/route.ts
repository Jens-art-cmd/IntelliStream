import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

function buildConfirmationEmail(confirmUrl: string, email: string): string {
  return `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Newsletter bestätigen – DistillFeed</title>
</head>
<body style="margin:0;padding:0;background:#FAF8F4;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#FAF8F4;padding:40px 20px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#FFFFFF;border:1px solid #E2DDD2;border-radius:12px;overflow:hidden;max-width:560px;">

        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(135deg,#1A1813 0%,#2D2820 100%);padding:32px 40px;">
            <p style="margin:0 0 6px 0;font-size:10px;font-weight:700;letter-spacing:0.2em;text-transform:uppercase;color:#FFB300;">
              DistillFeed
            </p>
            <h1 style="margin:0;font-size:22px;font-weight:300;color:#FFFFFF;letter-spacing:-0.01em;line-height:1.3;">
              Newsletter bestätigen
            </h1>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:36px 40px;">
            <p style="margin:0 0 16px 0;font-size:14px;color:#57534A;line-height:1.6;">
              Hallo,
            </p>
            <p style="margin:0 0 24px 0;font-size:14px;color:#57534A;line-height:1.6;">
              bitte bestätigen Sie Ihr Newsletter-Abonnement für <strong style="color:#1A1813;">${email}</strong>.
              Nach der Bestätigung erhalten Sie täglich oder wöchentlich die wichtigsten
              Nachrichten aus Ihren Branchen — KI-kuratiert, impact-gewichtet.
            </p>

            <!-- CTA Button -->
            <table cellpadding="0" cellspacing="0" style="margin:0 0 28px 0;">
              <tr>
                <td style="background:#FFB300;border-radius:8px;">
                  <a href="${confirmUrl}"
                     style="display:inline-block;padding:14px 28px;font-size:13px;font-weight:700;color:#1A1100;text-decoration:none;letter-spacing:0.01em;">
                    Abonnement bestätigen →
                  </a>
                </td>
              </tr>
            </table>

            <!-- Divider -->
            <hr style="border:none;border-top:1px solid #E2DDD2;margin:0 0 24px 0;" />

            <p style="margin:0 0 8px 0;font-size:12px;color:#8C887E;line-height:1.5;">
              Wenn der Button nicht funktioniert, kopieren Sie diesen Link in Ihren Browser:
            </p>
            <p style="margin:0 0 24px 0;font-size:11px;color:#C8C2B6;word-break:break-all;line-height:1.4;">
              ${confirmUrl}
            </p>
            <p style="margin:0;font-size:12px;color:#C8C2B6;line-height:1.5;">
              Dieser Link ist 24 Stunden gültig. Falls Sie sich nicht angemeldet haben,
              können Sie diese E-Mail ignorieren.
            </p>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#FAF8F4;border-top:1px solid #E2DDD2;padding:20px 40px;">
            <p style="margin:0;font-size:11px;color:#C8C2B6;line-height:1.5;">
              DistillFeed · distillfeed.eu ·
              <a href="${process.env["APP_URL"] ?? "https://distillfeed.eu"}/api/newsletter/unsubscribe"
                 style="color:#C8C2B6;">Abmelden</a>
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

export async function POST(request: NextRequest) {
  // 0. Rate Limiting: max. 5 Anfragen pro IP pro Stunde
  const rl = checkRateLimit(getClientIp(request), "newsletter:subscribe", { limit: 5, windowSecs: 3600 });
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "Zu viele Anfragen. Bitte versuche es später erneut." },
      { status: 429, headers: { "Retry-After": String(rl.resetAfter) } },
    );
  }

  // 1. Auth check via session cookie
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // 2. Service-role client for privileged writes
  const admin = createClient(
    process.env["NEXT_PUBLIC_SUPABASE_URL"]!,
    process.env["SUPABASE_SERVICE_ROLE_KEY"]!,
    { auth: { persistSession: false } },
  );

  // 3. Check already opted in
  const { data: userData } = await admin
    .from("users")
    .select("newsletter_opt_in, email")
    .eq("id", user.id)
    .single();

  if (userData?.newsletter_opt_in) {
    return NextResponse.json({ message: "Bereits abonniert" });
  }

  const email = user.email ?? userData?.email ?? "";

  // 4. Invalidate any previous unused tokens for this user
  await admin
    .from("newsletter_opt_in_tokens")
    .update({ used_at: new Date().toISOString() })
    .eq("user_id", user.id)
    .is("used_at", null);

  // 5. Create new token
  const { data: tokenRow, error: tokenError } = await admin
    .from("newsletter_opt_in_tokens")
    .insert({ user_id: user.id })
    .select("token")
    .single();

  if (tokenError || !tokenRow) {
    console.error("[Newsletter] Token-Fehler:", tokenError);
    return NextResponse.json({ error: "Token konnte nicht erstellt werden" }, { status: 500 });
  }

  // 6. Send confirmation email
  const resend = new Resend(process.env["RESEND_API_KEY"]);
  const appUrl = process.env["APP_URL"] ?? "https://distillfeed.eu";
  const confirmUrl = `${appUrl}/api/newsletter/confirm?token=${tokenRow.token}`;

  const { error: mailError } = await resend.emails.send({
    from: process.env["RESEND_FROM"] ?? "DistillFeed <newsletter@distillfeed.eu>",
    to: email,
    subject: "Newsletter bestätigen – DistillFeed",
    html: buildConfirmationEmail(confirmUrl, email),
  });

  if (mailError) {
    const detail = JSON.stringify(mailError);
    console.error("[Newsletter] Mail-Fehler name:", (mailError as { name?: string }).name);
    console.error("[Newsletter] Mail-Fehler message:", (mailError as { message?: string }).message);
    console.error("[Newsletter] Mail-Fehler detail:", detail);
    return NextResponse.json({ error: "E-Mail konnte nicht gesendet werden", detail }, { status: 500 });
  }

  return NextResponse.json({ message: "Bestätigungs-Mail gesendet" });
}
