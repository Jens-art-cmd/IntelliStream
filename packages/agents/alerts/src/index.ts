/**
 * DistillFeed Alert-Delivery-Agent
 *
 * Läuft täglich um 08:00 UTC (GitHub Actions).
 * Prüft neue Artikel der letzten 24h gegen alle aktiven User-Alerts
 * und sendet bei Treffern eine E-Mail-Zusammenfassung via Resend.
 *
 * Benötigte Umgebungsvariablen:
 *   SUPABASE_URL        — Supabase-Projekt-URL
 *   SUPABASE_SERVICE_KEY — Service-Role-Key (liest user_alerts + users)
 *   RESEND_API_KEY      — Resend API Key
 *   RESEND_FROM         — Absenderadresse, z.B. "alerts@distillfeed.eu"
 *   APP_URL             — Basis-URL, z.B. "https://distillfeed.eu"
 */

import "dotenv/config";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

// ── Konfiguration ───────────────────────────────────────────────────────────
const SUPABASE_URL         = process.env["SUPABASE_URL"]!;
const SUPABASE_SERVICE_KEY = process.env["SUPABASE_SERVICE_KEY"]!;
const RESEND_API_KEY       = process.env["RESEND_API_KEY"]!;
const RESEND_FROM          = process.env["RESEND_FROM"] ?? "DistillFeed Alerts <alerts@distillfeed.eu>";
const APP_URL              = process.env["APP_URL"] ?? "https://distillfeed.eu";
const DRY_RUN              = process.env["DRY_RUN"] === "true";
const LOOKBACK_HOURS       = parseInt(process.env["LOOKBACK_HOURS"] ?? "24", 10);

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error("[Alerts] SUPABASE_URL oder SUPABASE_SERVICE_KEY fehlt");
  process.exit(1);
}
if (!RESEND_API_KEY && !DRY_RUN) {
  console.error("[Alerts] RESEND_API_KEY fehlt — Dry-Run-Modus empfohlen: DRY_RUN=true");
  process.exit(1);
}

// ── Typen ───────────────────────────────────────────────────────────────────
type ImpactLevel = "high" | "medium" | "low";

interface UserAlert {
  id: string;
  name: string;
  keywords: string[];
  min_impact: ImpactLevel;
  is_active: boolean;
  user_id: string;
}

interface Article {
  id: string;
  title: string;
  summary_short: string | null;
  impact_level: ImpactLevel | null;
  tags: string[];
  source_url: string;
  published_at: string | null;
  industry_id: number;
}

interface MatchGroup {
  alert: UserAlert;
  userEmail: string;
  userName: string | null;
  articles: Article[];
}

// ── Impact-Filterlogik ──────────────────────────────────────────────────────
const IMPACT_ORDER: Record<ImpactLevel, number> = { high: 3, medium: 2, low: 1 };

function meetsImpact(articleImpact: ImpactLevel | null, minImpact: ImpactLevel): boolean {
  if (!articleImpact) return false;
  return IMPACT_ORDER[articleImpact] >= IMPACT_ORDER[minImpact];
}

// ── Stichwort-Matching ──────────────────────────────────────────────────────
function matchesAlert(article: Article, alert: UserAlert): boolean {
  if (!meetsImpact(article.impact_level, alert.min_impact)) return false;

  const searchText = [
    article.title,
    article.summary_short ?? "",
    ...article.tags,
  ].join(" ").toLowerCase();

  return alert.keywords.some(kw => searchText.includes(kw.toLowerCase()));
}

// ── Impact-Farben ────────────────────────────────────────────────────────────
const IMPACT_DOT: Record<ImpactLevel, string> = {
  high:   "#DC2626",
  medium: "#E08900",
  low:    "#2D7553",
};
const IMPACT_LABEL: Record<ImpactLevel, string> = {
  high:   "Hoher Impact",
  medium: "Mittlerer Impact",
  low:    "Geringer Impact",
};

// ── E-Mail-Template ─────────────────────────────────────────────────────────
function buildEmailHtml(group: MatchGroup): string {
  const { alert, userName, articles } = group;
  const firstName = userName ? userName.split(" ")[0] : null;
  const greeting  = firstName ? `Hallo ${firstName},` : "Hallo,";

  const articleRows = articles.map(a => {
    const dot   = a.impact_level ? IMPACT_DOT[a.impact_level]   : "#C8C2B6";
    const label = a.impact_level ? IMPACT_LABEL[a.impact_level] : "";
    const date  = a.published_at
      ? new Date(a.published_at).toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" })
      : "";
    return `
      <tr>
        <td style="padding:12px 0;border-bottom:1px solid #F1EDE4;vertical-align:top;">
          <p style="margin:0 0 4px 0;font-size:13px;font-weight:700;color:#1A1813;line-height:1.4;">
            <a href="${APP_URL}/dashboard/article/${a.id}" style="color:#1A1813;text-decoration:none;">${a.title}</a>
          </p>
          ${a.summary_short ? `<p style="margin:0 0 6px 0;font-size:12px;color:#57534A;line-height:1.55;">${a.summary_short}</p>` : ""}
          <div style="display:flex;align-items:center;gap:6px;">
            <span style="display:inline-block;width:6px;height:6px;border-radius:50%;background:${dot};flex-shrink:0;"></span>
            <span style="font-size:11px;color:#8C887E;">${label}${date ? " · " + date : ""}</span>
          </div>
        </td>
      </tr>`;
  }).join("");

  return `<!DOCTYPE html>
<html lang="de">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>Alert: ${alert.name}</title></head>
<body style="margin:0;padding:0;background:#FAF8F4;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#FAF8F4;padding:40px 20px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#FFFFFF;border:1px solid #E2DDD2;border-radius:12px;overflow:hidden;max-width:560px;">

        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(135deg,#1A1813 0%,#2D2820 100%);padding:32px 40px;">
            <p style="margin:0 0 6px 0;font-size:10px;font-weight:700;letter-spacing:0.2em;text-transform:uppercase;color:#FFB300;">DistillFeed · Alert</p>
            <h1 style="margin:0;font-size:22px;font-weight:300;color:#FFFFFF;letter-spacing:-0.01em;line-height:1.3;">${alert.name}</h1>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:32px 40px 24px 40px;">
            <p style="margin:0 0 4px 0;font-size:14px;color:#57534A;line-height:1.7;">${greeting}</p>
            <p style="margin:0 0 20px 0;font-size:14px;color:#57534A;line-height:1.7;">
              es gibt <strong style="color:#1A1813;">${articles.length} neue${articles.length === 1 ? "n Treffer" : " Treffer"}</strong> für deinen Alert.
            </p>

            <table width="100%" cellpadding="0" cellspacing="0">
              ${articleRows}
            </table>

            <!-- CTA -->
            <table cellpadding="0" cellspacing="0" style="margin:24px 0 0 0;">
              <tr>
                <td style="background:#FFB300;border-radius:8px;">
                  <a href="${APP_URL}/dashboard/feed"
                     style="display:inline-block;padding:13px 26px;font-size:13px;font-weight:700;color:#1A1100;text-decoration:none;">
                    Zum Feed →
                  </a>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#FAF8F4;border-top:1px solid #E2DDD2;padding:18px 40px;">
            <p style="margin:0;font-size:11px;color:#C8C2B6;line-height:1.5;">
              Du erhältst diese Mail, weil du den Alert „${alert.name}" in DistillFeed eingerichtet hast. ·
              <a href="${APP_URL}/dashboard/alerts" style="color:#C8C2B6;">Alerts verwalten</a>
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

// ── Hauptlogik ──────────────────────────────────────────────────────────────
async function main() {
  console.log(`[Alerts] Start ${DRY_RUN ? "(DRY RUN)" : ""} — Lookback: ${LOOKBACK_HOURS}h`);

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
  const resend   = DRY_RUN ? null : new Resend(RESEND_API_KEY);

  // 1. Alle aktiven Alerts inkl. User-E-Mail laden
  const { data: alerts, error: alertsError } = await supabase
    .from("user_alerts")
    .select("id, name, keywords, min_impact, is_active, user_id, users!inner(email, name)")
    .eq("is_active", true);

  if (alertsError) { console.error("[Alerts] Fehler beim Laden der Alerts:", alertsError); process.exit(1); }
  if (!alerts || alerts.length === 0) { console.log("[Alerts] Keine aktiven Alerts."); return; }

  console.log(`[Alerts] ${alerts.length} aktive Alert(s) gefunden`);

  // 2. Neue Artikel der letzten LOOKBACK_HOURS Stunden laden
  const since = new Date(Date.now() - LOOKBACK_HOURS * 60 * 60 * 1000).toISOString();
  const { data: articles, error: articlesError } = await supabase
    .from("articles")
    .select("id, title, summary_short, impact_level, tags, source_url, published_at, industry_id")
    .gte("ingested_at", since)
    .not("impact_level", "is", null)
    .eq("is_suppressed", false);

  if (articlesError) { console.error("[Alerts] Fehler beim Laden der Artikel:", articlesError); process.exit(1); }
  if (!articles || articles.length === 0) { console.log("[Alerts] Keine neuen Artikel im Lookback-Zeitraum."); return; }

  console.log(`[Alerts] ${articles.length} neue Artikel seit ${since}`);

  // 3. Matching — Alerts gegen Artikel prüfen
  const groups: MatchGroup[] = [];

  for (const alert of alerts as unknown as (UserAlert & { users: { email: string; name: string | null } })[]) {
    const matches = (articles as Article[]).filter(a => matchesAlert(a, alert));
    if (matches.length === 0) continue;

    groups.push({
      alert,
      userEmail: alert.users.email,
      userName: alert.users.name,
      articles: matches,
    });

    console.log(`[Alerts] Alert "${alert.name}" → ${matches.length} Treffer für ${alert.users.email}`);
  }

  if (groups.length === 0) { console.log("[Alerts] Keine Treffer — keine E-Mails nötig."); return; }

  // 4. E-Mails senden (eine pro Alert, nicht pro User — so bleiben sie thematisch getrennt)
  let sent = 0;
  let failed = 0;

  for (const group of groups) {
    const subject = `🔔 ${group.articles.length} neue Treffer: ${group.alert.name}`;
    const html    = buildEmailHtml(group);

    if (DRY_RUN) {
      console.log(`[DRY RUN] Würde senden: "${subject}" an ${group.userEmail}`);
      sent++;
      continue;
    }

    const { error } = await resend!.emails.send({
      from: RESEND_FROM,
      to: group.userEmail,
      subject,
      html,
    });

    if (error) {
      console.error(`[Alerts] Fehler beim Senden an ${group.userEmail}:`, error);
      failed++;
    } else {
      console.log(`[Alerts] ✓ Gesendet: "${subject}" → ${group.userEmail}`);
      sent++;
    }
  }

  console.log(`[Alerts] Fertig — ${sent} gesendet, ${failed} fehlgeschlagen`);
}

main().catch(err => {
  console.error("[Alerts] Unerwarteter Fehler:", err);
  process.exit(1);
});
