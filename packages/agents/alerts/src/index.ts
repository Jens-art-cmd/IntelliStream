/**
 * IntelliStream Alert-Delivery-Agent
 *
 * Läuft täglich um 08:00 UTC (GitHub Actions).
 * Prüft neue Artikel der letzten 24h gegen alle aktiven User-Alerts
 * und sendet bei Treffern eine E-Mail-Zusammenfassung via Resend.
 *
 * Benötigte Umgebungsvariablen:
 *   SUPABASE_URL        — Supabase-Projekt-URL
 *   SUPABASE_SERVICE_KEY — Service-Role-Key (liest user_alerts + users)
 *   RESEND_API_KEY      — Resend API Key
 *   RESEND_FROM         — Absenderadresse, z.B. "alerts@intellistream.de"
 *   APP_URL             — Basis-URL, z.B. "https://intellistream.de"
 */

import "dotenv/config";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

// ── Konfiguration ───────────────────────────────────────────────────────────
const SUPABASE_URL         = process.env["SUPABASE_URL"]!;
const SUPABASE_SERVICE_KEY = process.env["SUPABASE_SERVICE_KEY"]!;
const RESEND_API_KEY       = process.env["RESEND_API_KEY"]!;
const RESEND_FROM          = process.env["RESEND_FROM"] ?? "IntelliStream Alerts <alerts@intellistream.de>";
const APP_URL              = process.env["APP_URL"] ?? "https://intellistream.de";
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

// ── E-Mail-Template ─────────────────────────────────────────────────────────
function buildEmailHtml(group: MatchGroup): string {
  const { alert, userName, articles } = group;
  const greeting = userName ? `Hallo ${userName}` : "Hallo";
  const articleRows = articles
    .map(a => `
      <tr>
        <td style="padding: 12px 0; border-bottom: 1px solid #f0f0f0;">
          <p style="margin:0 0 4px; font-size:14px; font-weight:600; color:#1a1a1a;">
            <a href="${APP_URL}/dashboard/article/${a.id}" style="color:#1a1a1a; text-decoration:none;">
              ${a.title}
            </a>
          </p>
          ${a.summary_short ? `<p style="margin:0 0 4px; font-size:13px; color:#555; line-height:1.5;">${a.summary_short}</p>` : ""}
          <p style="margin:0; font-size:11px; color:#999;">
            ${a.impact_level === "high" ? "🔴 Hoher Impact" : a.impact_level === "medium" ? "🟡 Mittlerer Impact" : "🟢 Geringer Impact"}
            ${a.published_at ? " · " + new Date(a.published_at).toLocaleDateString("de-DE") : ""}
          </p>
        </td>
      </tr>`)
    .join("");

  return `<!DOCTYPE html>
<html lang="de">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f5f7fa;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f7fa;padding:32px 16px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">

        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(135deg,#ffca28,#ffb300);padding:24px 32px;">
            <p style="margin:0;font-size:11px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:#7a5200;">IntelliStream Alerts</p>
            <h1 style="margin:4px 0 0;font-size:20px;font-weight:800;color:#1a1a1a;">🔔 ${alert.name}</h1>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:24px 32px;">
            <p style="margin:0 0 20px;font-size:14px;color:#555;">
              ${greeting}, hier sind <strong>${articles.length} neue Treffer</strong> für Ihren Alert.
            </p>
            <table width="100%" cellpadding="0" cellspacing="0">
              ${articleRows}
            </table>
          </td>
        </tr>

        <!-- CTA -->
        <tr>
          <td style="padding:0 32px 24px;">
            <a href="${APP_URL}/dashboard/feed"
               style="display:inline-block;background:linear-gradient(135deg,#ffca28,#ffb300);color:#1a1a1a;font-size:13px;font-weight:700;padding:10px 24px;border-radius:10px;text-decoration:none;">
              Zum Feed →
            </a>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="padding:16px 32px;border-top:1px solid #f0f0f0;">
            <p style="margin:0;font-size:11px;color:#aaa;">
              Sie erhalten diese E-Mail, weil Sie den Alert „${alert.name}" in IntelliStream eingerichtet haben.
              <a href="${APP_URL}/dashboard/alerts" style="color:#aaa;">Alerts verwalten</a>
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

  for (const alert of alerts as (UserAlert & { users: { email: string; name: string | null } })[]) {
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
