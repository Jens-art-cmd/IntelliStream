/**
 * POST /api/onboarding/welcome
 *
 * Sendet die Willkommens-Mail an neu registrierte User.
 * Wird intern von /auth/confirm nach erfolgreicher E-Mail-Verifizierung aufgerufen.
 *
 * Verhindert Duplikate via onboarding_email_sent_at Spalte in users.
 */

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

const APP_URL    = process.env["APP_URL"] ?? "https://distillfeed.eu";
const RESEND_FROM = process.env["RESEND_FROM"] ?? "DistillFeed <newsletter@distillfeed.eu>";

function buildWelcomeEmail(email: string): string {
  const features = [
    ["KI-Analyse", "Vollständige Zusammenfassungen mit Handlungsempfehlungen"],
    ["Impact-Filter", "Artikel nach Relevanz — Hoch, Mittel, Niedrig"],
    ["15 Branchen", "Energie, IT-Security, Finanzen, Recht und mehr"],
    ["Stichwort-Alerts", "E-Mail-Benachrichtigung bei relevanten Themen"],
    ["Personalisierter Feed", "Wird mit jeder Interaktion besser"],
    ["Tägliches Briefing", "Die wichtigsten Nachrichten, kurz und klar"],
  ];

  return `<!DOCTYPE html>
<html lang="de">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>Willkommen bei DistillFeed</title></head>
<body style="margin:0;padding:0;background:#FAF8F4;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#FAF8F4;padding:40px 20px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#FFFFFF;border:1px solid #E2DDD2;border-radius:12px;overflow:hidden;max-width:560px;">

        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(135deg,#1A1813 0%,#2D2820 100%);padding:32px 40px;">
            <p style="margin:0 0 6px 0;font-size:10px;font-weight:700;letter-spacing:0.2em;text-transform:uppercase;color:#FFB300;">DistillFeed</p>
            <h1 style="margin:0;font-size:24px;font-weight:300;color:#FFFFFF;letter-spacing:-0.01em;line-height:1.3;">
              Willkommen — dein Test-Zugang ist aktiv.
            </h1>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:36px 40px;">
            <p style="margin:0 0 20px 0;font-size:14px;color:#57534A;line-height:1.7;">
              Du hast jetzt <strong style="color:#1A1813;">30 Tage kostenlosen Pro-Zugang</strong> —
              vollständige KI-Analysen, alle Branchen, personalisierter Feed.
              Hier ist, was dich erwartet:
            </p>

            <!-- Feature-Grid -->
            <table cellpadding="0" cellspacing="0" style="width:100%;margin:0 0 28px 0;">
              ${features.map(([title, desc]) => `
              <tr>
                <td style="padding:10px 0;border-bottom:1px solid #F1EDE4;vertical-align:top;">
                  <table cellpadding="0" cellspacing="0"><tr>
                    <td style="vertical-align:top;padding-right:12px;">
                      <span style="display:inline-block;width:20px;height:20px;background:#FFB300;border-radius:50%;text-align:center;line-height:20px;font-size:10px;font-weight:700;color:#1A1100;">✓</span>
                    </td>
                    <td style="vertical-align:top;">
                      <p style="margin:0 0 2px 0;font-size:13px;font-weight:700;color:#1A1813;">${title}</p>
                      <p style="margin:0;font-size:12px;color:#8C887E;line-height:1.5;">${desc}</p>
                    </td>
                  </tr></table>
                </td>
              </tr>`).join("")}
            </table>

            <!-- CTA -->
            <table cellpadding="0" cellspacing="0">
              <tr>
                <td style="background:#FFB300;border-radius:8px;">
                  <a href="${APP_URL}/dashboard/feed"
                     style="display:inline-block;padding:14px 28px;font-size:13px;font-weight:700;color:#1A1100;text-decoration:none;">
                    Feed öffnen →
                  </a>
                </td>
              </tr>
            </table>

            <!-- Tipp -->
            <div style="background:#FFF6E0;border:1px solid #FFD966;border-left:3px solid #FFB300;border-radius:8px;padding:14px 18px;margin:24px 0 0 0;">
              <p style="margin:0;font-size:12px;color:#57534A;line-height:1.6;">
                <strong style="color:#1A1813;">Tipp:</strong>
                Wähle deine Branchen unter <a href="${APP_URL}/dashboard/settings" style="color:#E08900;font-weight:600;">Einstellungen</a> aus
                und aktiviere den Newsletter für dein tägliches Briefing.
              </p>
            </div>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#FAF8F4;border-top:1px solid #E2DDD2;padding:20px 40px;">
            <p style="margin:0;font-size:11px;color:#C8C2B6;line-height:1.5;">
              DistillFeed · <a href="${APP_URL}" style="color:#C8C2B6;">distillfeed.eu</a> ·
              Fragen? <a href="mailto:hello@distillfeed.eu" style="color:#C8C2B6;">hello@distillfeed.eu</a>
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
  // Interner Aufruf — WEBHOOK_SECRET als einfacher Schutz
  const secret = request.headers.get("x-webhook-secret");
  if (secret !== process.env["INTERNAL_WEBHOOK_SECRET"]) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let userId: string;
  try {
    const body = await request.json();
    userId = body.user_id;
    if (!userId) throw new Error("user_id fehlt");
  } catch {
    return NextResponse.json({ error: "Ungültiger Body" }, { status: 400 });
  }

  const admin = createClient(
    process.env["NEXT_PUBLIC_SUPABASE_URL"]!,
    process.env["SUPABASE_SERVICE_ROLE_KEY"]!,
    { auth: { persistSession: false } },
  );

  // User laden + Duplikat-Schutz
  const { data: user } = await admin
    .from("users")
    .select("email, onboarding_email_sent_at")
    .eq("id", userId)
    .single();

  if (!user?.email || user.onboarding_email_sent_at) {
    return NextResponse.json({ skipped: true });
  }

  const resend = new Resend(process.env["RESEND_API_KEY"]);
  const { error: mailErr } = await resend.emails.send({
    from:    RESEND_FROM,
    to:      user.email,
    subject: "Willkommen bei DistillFeed — dein 30-Tage-Test ist aktiv",
    html:    buildWelcomeEmail(user.email),
  });

  if (mailErr) {
    console.error("[Onboarding] Mail-Fehler:", (mailErr as { message?: string }).message);
    return NextResponse.json({ error: "Mail-Fehler" }, { status: 500 });
  }

  // Versand markieren
  await admin
    .from("users")
    .update({ onboarding_email_sent_at: new Date().toISOString() })
    .eq("id", userId);

  console.log(`[Onboarding] ✓ Welcome-Mail gesendet an ${user.email}`);
  return NextResponse.json({ sent: true });
}
