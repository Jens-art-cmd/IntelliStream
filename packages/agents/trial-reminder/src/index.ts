/**
 * DistillFeed Trial-Reminder-Agent
 *
 * Läuft täglich um 08:30 UTC (GitHub Actions).
 * Sendet 3 automatische E-Mails während des Trial-Zeitraums:
 *
 *   1. 7 Tage vor Ablauf  — Features-Recap + Upgrade-CTA
 *   2. 1 Tag  vor Ablauf  — Dringlichkeits-Mail
 *   3. Ablauf-Tag         — "Zugang abgelaufen" + letzter CTA
 *
 * Verhindert Duplikate via trial_reminder_*_sent_at Spalten in users.
 */

import "dotenv/config";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

// ── Konfiguration ─────────────────────────────────────────────────────────
const SUPABASE_URL         = process.env["SUPABASE_URL"]!;
const SUPABASE_SERVICE_KEY = process.env["SUPABASE_SERVICE_KEY"]!;
const RESEND_API_KEY       = process.env["RESEND_API_KEY"]!;
const RESEND_FROM          = process.env["RESEND_FROM"] ?? "DistillFeed <newsletter@distillfeed.eu>";
const APP_URL              = process.env["APP_URL"] ?? "https://distillfeed.eu";
const DRY_RUN              = process.env["DRY_RUN"] === "true";

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error("[TrialReminder] SUPABASE_URL oder SUPABASE_SERVICE_KEY fehlt");
  process.exit(1);
}

// ── E-Mail-Templates ──────────────────────────────────────────────────────
function header(title: string) {
  return `
    <table width="100%" cellpadding="0" cellspacing="0" style="background:linear-gradient(135deg,#1A1813 0%,#2D2820 100%);padding:32px 40px;">
      <tr><td>
        <p style="margin:0 0 6px 0;font-size:10px;font-weight:700;letter-spacing:0.2em;text-transform:uppercase;color:#FFB300;">DistillFeed</p>
        <h1 style="margin:0;font-size:22px;font-weight:300;color:#FFFFFF;letter-spacing:-0.01em;line-height:1.3;">${title}</h1>
      </td></tr>
    </table>`;
}

function upgradeButton(label: string) {
  return `
    <table cellpadding="0" cellspacing="0" style="margin:24px 0 0 0;">
      <tr>
        <td style="background:#FFB300;border-radius:8px;">
          <a href="${APP_URL}/dashboard/settings"
             style="display:inline-block;padding:14px 28px;font-size:13px;font-weight:700;color:#1A1100;text-decoration:none;">
            ${label}
          </a>
        </td>
      </tr>
    </table>`;
}

function footer() {
  return `
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#FAF8F4;border-top:1px solid #E2DDD2;padding:20px 40px;">
      <tr><td>
        <p style="margin:0;font-size:11px;color:#C8C2B6;line-height:1.5;">
          DistillFeed · <a href="${APP_URL}" style="color:#C8C2B6;">distillfeed.eu</a>
        </p>
      </td></tr>
    </table>`;
}

function wrapHtml(content: string) {
  return `<!DOCTYPE html>
<html lang="de">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#FAF8F4;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#FAF8F4;padding:40px 20px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#FFFFFF;border:1px solid #E2DDD2;border-radius:12px;overflow:hidden;max-width:560px;">
        ${content}
        ${footer()}
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function build7DayEmail(email: string, daysLeft: number): { subject: string; html: string } {
  return {
    subject: `Dein DistillFeed-Testzeitraum endet in ${daysLeft} Tagen`,
    html: wrapHtml(`
      ${header("Noch " + daysLeft + " Tage im Pro-Test")}
      <tr><td style="padding:36px 40px;">
        <p style="margin:0 0 16px 0;font-size:14px;color:#57534A;line-height:1.6;">
          Hallo,
        </p>
        <p style="margin:0 0 16px 0;font-size:14px;color:#57534A;line-height:1.6;">
          dein kostenloser DistillFeed-Test endet in <strong style="color:#1A1813;">${daysLeft} Tagen</strong>.
          Danach wechselst du automatisch in den kostenlosen Zugang — mit eingeschränkten Funktionen.
        </p>
        <p style="margin:0 0 8px 0;font-size:13px;font-weight:700;color:#1A1813;">Was du im Pro-Plan behältst:</p>
        <table cellpadding="0" cellspacing="0" style="margin:0 0 16px 0;">
          ${["Vollständige KI-Analysen zu jedem Artikel", "Alle 15 Branchen gleichzeitig", "Täglicher kuratierter Newsletter", "Stichwort-Alerts per E-Mail", "Semantische Volltextsuche"].map(f => `
          <tr>
            <td style="padding:4px 0;vertical-align:top;">
              <span style="display:inline-block;width:18px;height:18px;background:#FFB300;border-radius:50%;text-align:center;line-height:18px;font-size:10px;font-weight:700;color:#1A1100;margin-right:8px;">✓</span>
            </td>
            <td style="padding:4px 0;font-size:13px;color:#57534A;line-height:1.5;">${f}</td>
          </tr>`).join("")}
        </table>
        ${upgradeButton("Jetzt auf Pro upgraden →")}
        <p style="margin:20px 0 0 0;font-size:12px;color:#C8C2B6;line-height:1.5;">
          Du kannst auch nach dem Test jederzeit upgraden — deine Daten bleiben erhalten.
        </p>
      </td></tr>
    `),
  };
}

function build1DayEmail(email: string): { subject: string; html: string } {
  return {
    subject: "Morgen endet dein DistillFeed-Testzeitraum",
    html: wrapHtml(`
      ${header("Morgen endet dein Test-Zugang")}
      <tr><td style="padding:36px 40px;">
        <p style="margin:0 0 16px 0;font-size:14px;color:#57534A;line-height:1.6;">Hallo,</p>
        <p style="margin:0 0 16px 0;font-size:14px;color:#57534A;line-height:1.6;">
          morgen endet dein kostenloser DistillFeed-Test. Ab dann stehen dir nur noch
          <strong style="color:#1A1813;">2 Branchen</strong> und keine KI-Analysen mehr zur Verfügung.
        </p>
        <p style="margin:0 0 16px 0;font-size:14px;color:#57534A;line-height:1.6;">
          Upgrade jetzt und behalte deinen vollen Zugang ohne Unterbrechung:
        </p>
        <table cellpadding="0" cellspacing="0" style="width:100%;margin:0 0 8px 0;">
          <tr>
            <td style="width:50%;padding:12px;border:1px solid #E2DDD2;border-radius:8px;text-align:center;vertical-align:top;">
              <p style="margin:0 0 4px 0;font-size:10px;font-weight:700;color:#8C887E;text-transform:uppercase;letter-spacing:0.1em;">Monatlich</p>
              <p style="margin:0;font-size:22px;font-weight:900;color:#1A1813;">49 €<span style="font-size:12px;font-weight:400;color:#8C887E;">/Monat</span></p>
            </td>
            <td style="width:8px;"></td>
            <td style="width:50%;padding:12px;border:2px solid #FFB300;border-radius:8px;text-align:center;vertical-align:top;background:#FFF6E0;">
              <p style="margin:0 0 4px 0;font-size:10px;font-weight:700;color:#E08900;text-transform:uppercase;letter-spacing:0.1em;">Jährlich — 2 Monate gratis</p>
              <p style="margin:0;font-size:22px;font-weight:900;color:#1A1813;">39 €<span style="font-size:12px;font-weight:400;color:#57534A;">/Monat</span></p>
            </td>
          </tr>
        </table>
        ${upgradeButton("Jetzt upgraden — Zugang sichern →")}
      </td></tr>
    `),
  };
}

function buildExpiredEmail(email: string): { subject: string; html: string } {
  return {
    subject: "Dein DistillFeed-Testzeitraum ist abgelaufen",
    html: wrapHtml(`
      ${header("Dein Test-Zugang ist abgelaufen")}
      <tr><td style="padding:36px 40px;">
        <p style="margin:0 0 16px 0;font-size:14px;color:#57534A;line-height:1.6;">Hallo,</p>
        <p style="margin:0 0 16px 0;font-size:14px;color:#57534A;line-height:1.6;">
          dein kostenloser Testzeitraum ist heute abgelaufen. Du hast jetzt Zugriff auf
          den kostenlosen Plan mit 2 Branchen und eingeschränkten Funktionen.
        </p>
        <p style="margin:0 0 16px 0;font-size:14px;color:#57534A;line-height:1.6;">
          Mit <strong style="color:#1A1813;">DistillFeed Pro</strong> bekommst du wieder
          vollständigen Zugang — alle 15 Branchen, komplette KI-Analysen, tägliche Briefings.
        </p>
        <div style="background:#FFF6E0;border:1px solid #FFD966;border-left:3px solid #FFB300;border-radius:8px;padding:16px 20px;margin:0 0 8px 0;">
          <p style="margin:0;font-size:13px;color:#57534A;line-height:1.6;">
            Deine Daten, Lesezeichen und Einstellungen bleiben erhalten — der Upgrade ist jederzeit möglich.
          </p>
        </div>
        ${upgradeButton("Jetzt auf Pro upgraden →")}
      </td></tr>
    `),
  };
}

// ── Hauptlogik ────────────────────────────────────────────────────────────
async function run() {
  console.log(`[TrialReminder] Start${DRY_RUN ? " (dry run)" : ""}`);

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
    auth: { persistSession: false },
  });
  const resend = DRY_RUN ? null : new Resend(RESEND_API_KEY);

  // Alle User mit aktivem oder gerade abgelaufenem Trial laden
  const { data: users, error } = await supabase
    .from("users")
    .select("id, email, trial_ends_at, trial_reminder_7d_sent_at, trial_reminder_1d_sent_at, trial_expired_sent_at")
    .eq("plan", "free")
    .not("trial_ends_at", "is", null);

  if (error) {
    console.error("[TrialReminder] DB-Fehler:", error.message);
    process.exit(1);
  }

  if (!users?.length) {
    console.log("[TrialReminder] Keine Trial-User gefunden. Fertig.");
    return;
  }

  console.log(`[TrialReminder] ${users.length} Trial-User gefunden.`);

  let sent = 0;
  let skipped = 0;

  for (const user of users) {
    const trialEndsAt = new Date(user.trial_ends_at);
    const now         = new Date();
    const daysLeft    = Math.ceil((trialEndsAt.getTime() - now.getTime()) / 86_400_000);

    let emailType: "7d" | "1d" | "expired" | null = null;
    let sentAtColumn: string | null = null;

    if (daysLeft <= 0 && daysLeft >= -3 && !user.trial_expired_sent_at) {
      emailType    = "expired";
      sentAtColumn = "trial_expired_sent_at";
    } else if (daysLeft === 1 && !user.trial_reminder_1d_sent_at) {
      emailType    = "1d";
      sentAtColumn = "trial_reminder_1d_sent_at";
    } else if (daysLeft <= 7 && daysLeft > 1 && !user.trial_reminder_7d_sent_at) {
      emailType    = "7d";
      sentAtColumn = "trial_reminder_7d_sent_at";
    }

    if (!emailType) {
      skipped++;
      continue;
    }

    const { subject, html } =
      emailType === "7d"      ? build7DayEmail(user.email, daysLeft) :
      emailType === "1d"      ? build1DayEmail(user.email) :
                                buildExpiredEmail(user.email);

    if (DRY_RUN) {
      console.log(`[TrialReminder] [dry run] ${user.email} — ${emailType} — "${subject}" (${daysLeft} Tage)`);
      sent++;
      continue;
    }

    const { error: mailErr } = await resend!.emails.send({
      from:    RESEND_FROM,
      to:      user.email,
      subject,
      html,
    });

    if (mailErr) {
      console.error(`[TrialReminder] Mail-Fehler [${user.email}]:`, (mailErr as { message?: string }).message);
      skipped++;
      continue;
    }

    // Versand markieren
    await supabase
      .from("users")
      .update({ [sentAtColumn!]: now.toISOString() })
      .eq("id", user.id);

    console.log(`[TrialReminder] ✓ ${user.email} — ${emailType}`);
    sent++;
  }

  console.log(`\n[TrialReminder] Fertig — gesendet: ${sent}, übersprungen: ${skipped}`);
}

run().catch(err => {
  console.error("[TrialReminder] Fataler Fehler:", err);
  process.exit(1);
});
