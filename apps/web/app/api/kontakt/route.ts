import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { Resend } from "resend";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  // Rate Limiting: max. 3 Anfragen pro IP pro Stunde
  const rl = checkRateLimit(getClientIp(request), "kontakt:send", { limit: 3, windowSecs: 3600 });
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "Zu viele Anfragen. Bitte versuche es später erneut." },
      { status: 429, headers: { "Retry-After": String(rl.resetAfter) } },
    );
  }

  let body: { name?: string; email?: string; subject?: string; message?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Ungültige Anfrage" }, { status: 400 });
  }

  const { name, email, subject, message } = body;

  if (!name?.trim() || !email?.trim() || !message?.trim()) {
    return NextResponse.json({ error: "Name, E-Mail und Nachricht sind Pflichtfelder." }, { status: 400 });
  }

  // Basic email validation
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Bitte gib eine gültige E-Mail-Adresse ein." }, { status: 400 });
  }

  const resend = new Resend(process.env["RESEND_API_KEY"]);

  const html = `
<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8" />
  <title>Neue Kontaktanfrage – DistillFeed</title>
</head>
<body style="margin:0;padding:0;background:#FAF8F4;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#FAF8F4;padding:40px 20px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#FFFFFF;border:1px solid #E2DDD2;border-radius:12px;overflow:hidden;max-width:560px;">
        <tr>
          <td style="background:linear-gradient(135deg,#1A1813 0%,#2D2820 100%);padding:28px 36px;">
            <p style="margin:0 0 4px 0;font-size:10px;font-weight:700;letter-spacing:0.2em;text-transform:uppercase;color:#FFB300;">
              DistillFeed Support
            </p>
            <h1 style="margin:0;font-size:20px;font-weight:300;color:#FFFFFF;line-height:1.3;">
              Neue Kontaktanfrage
            </h1>
          </td>
        </tr>
        <tr>
          <td style="padding:32px 36px;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="padding:0 0 12px 0;">
                  <p style="margin:0 0 2px 0;font-size:10px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:#8C887E;">Von</p>
                  <p style="margin:0;font-size:14px;color:#1A1813;">${name} &lt;${email}&gt;</p>
                </td>
              </tr>
              ${subject ? `
              <tr>
                <td style="padding:0 0 12px 0;">
                  <p style="margin:0 0 2px 0;font-size:10px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:#8C887E;">Betreff</p>
                  <p style="margin:0;font-size:14px;color:#1A1813;">${subject}</p>
                </td>
              </tr>` : ""}
              <tr>
                <td style="padding:16px 0 0 0;border-top:1px solid #E2DDD2;">
                  <p style="margin:0 0 8px 0;font-size:10px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:#8C887E;">Nachricht</p>
                  <p style="margin:0;font-size:14px;color:#57534A;line-height:1.7;white-space:pre-wrap;">${message.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="background:#FAF8F4;border-top:1px solid #E2DDD2;padding:16px 36px;">
            <p style="margin:0;font-size:11px;color:#C8C2B6;">
              Direkt antworten an: <a href="mailto:${email}" style="color:#E08900;">${email}</a>
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

  const { error: mailError } = await resend.emails.send({
    from: process.env["RESEND_FROM"] ?? "DistillFeed <no-reply@distillfeed.eu>",
    to: ["support@distillfeed.eu"],
    replyTo: email,
    subject: `[Support] ${subject?.trim() || "Neue Anfrage"} — ${name}`,
    html,
  });

  if (mailError) {
    console.error("[Kontakt] Resend-Fehler:", mailError);
    return NextResponse.json({ error: "Nachricht konnte nicht gesendet werden. Bitte versuche es erneut." }, { status: 500 });
  }

  return NextResponse.json({ message: "Nachricht gesendet" });
}
