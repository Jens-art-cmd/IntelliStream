/**
 * DistillFeed Newsletter-Delivery-Agent
 *
 * Versendet personalisierte Newsletter an alle opt-in User.
 *
 * Frequenz-Logik:
 *   FREQUENCY=daily   → nur User mit newsletter_frequency = 'daily'
 *   FREQUENCY=weekly  → nur User mit newsletter_frequency = 'weekly'
 *
 * Artikel-Auswahl:
 *   - Letzte 24h (daily) oder letzte 7 Tage (weekly)
 *   - Gefiltert nach user.industry_subscriptions
 *   - Sortiert nach impact_score DESC, published_at DESC
 *   - Max. MAX_ARTICLES_PER_USER pro Newsletter
 *
 * Benötigte Umgebungsvariablen:
 *   SUPABASE_URL, SUPABASE_SERVICE_KEY, RESEND_API_KEY,
 *   RESEND_FROM, APP_URL, FREQUENCY, DRY_RUN
 */

import "dotenv/config";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import { buildNewsletterHtml, type ArticleItem } from "./template.js";

// ── Konfiguration ───────────────────────────────────────────────────────────
const SUPABASE_URL         = process.env["SUPABASE_URL"]!;
const SUPABASE_SERVICE_KEY = process.env["SUPABASE_SERVICE_KEY"]!;
const RESEND_API_KEY       = process.env["RESEND_API_KEY"]!;
const RESEND_FROM          = process.env["RESEND_FROM"] ?? "DistillFeed <newsletter@distillfeed.eu>";
const APP_URL              = process.env["APP_URL"] ?? "https://distillfeed.eu";
const DRY_RUN              = process.env["DRY_RUN"] === "true";
const FREQUENCY            = "weekly" as const;
const MAX_ARTICLES         = parseInt(process.env["MAX_ARTICLES"] ?? "5", 10);

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error("[Delivery] SUPABASE_URL oder SUPABASE_SERVICE_KEY fehlt");
  process.exit(1);
}
if (!RESEND_API_KEY && !DRY_RUN) {
  console.error("[Delivery] RESEND_API_KEY fehlt");
  process.exit(1);
}

// ── Typen ───────────────────────────────────────────────────────────────────
interface User {
  id: string;
  email: string;
  newsletter_frequency: "daily" | "weekly" | "realtime";
  industry_subscriptions: number[];
}

interface Industry {
  id: number;
  name: string;
}

// ── Hilfsfunktionen ─────────────────────────────────────────────────────────
function lookbackDate(frequency: "daily" | "weekly"): string {
  const d = new Date();
  d.setHours(d.getHours() - (frequency === "weekly" ? 168 : 24));
  return d.toISOString();
}

// ── Hauptlogik ──────────────────────────────────────────────────────────────
async function run() {
  console.log(`[Delivery] Start — Frequenz: ${FREQUENCY}${DRY_RUN ? " (dry run)" : ""}`);

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
    auth: { persistSession: false },
  });
  const resend = DRY_RUN ? null : new Resend(RESEND_API_KEY);

  // 1. Alle opt-in User mit passender Frequenz laden
  const { data: users, error: usersErr } = await supabase
    .from("users")
    .select("id, email, newsletter_frequency, industry_subscriptions")
    .eq("newsletter_opt_in", true)
    .eq("newsletter_frequency", FREQUENCY)
    .not("industry_subscriptions", "is", null);

  if (usersErr) {
    console.error("[Delivery] User-Abfrage fehlgeschlagen:", usersErr.message);
    process.exit(1);
  }

  if (!users?.length) {
    console.log(`[Delivery] Keine ${FREQUENCY}-User mit opt-in gefunden. Fertig.`);
    return;
  }
  console.log(`[Delivery] ${users.length} User gefunden.`);

  // 2. Alle aktiven Branchen laden (für Namen)
  const { data: industries } = await supabase
    .from("industries")
    .select("id, name")
    .eq("is_active", true);

  const industryMap = new Map<number, string>(
    (industries ?? []).map((i: Industry) => [i.id, i.name])
  );

  // 3. Alle relevanten Artikel laden (eine Query für alle User)
  const allIndustryIds = [...new Set(
    (users as User[]).flatMap(u => u.industry_subscriptions ?? [])
  )];

  const since = lookbackDate(FREQUENCY);

  const IMPACT_RANK: Record<string, number> = { high: 0, medium: 1, low: 2 };

  const { data: rawArticles, error: artErr } = await supabase
    .from("articles")
    .select("id, title, summary_short, impact_level, source_url, published_at, industry_id")
    .in("industry_id", allIndustryIds)
    .gte("published_at", since)
    .not("processed_at", "is", null)
    .order("published_at", { ascending: false })
    .limit(500);

  // Sortiere nach impact_level (high > medium > low), dann published_at
  const allArticles = (rawArticles ?? []).sort((a, b) => {
    const rankA = IMPACT_RANK[a.impact_level ?? "low"] ?? 2;
    const rankB = IMPACT_RANK[b.impact_level ?? "low"] ?? 2;
    return rankA - rankB;
  });

  if (artErr) {
    console.error("[Delivery] Artikel-Abfrage fehlgeschlagen:", artErr.message);
    process.exit(1);
  }

  console.log(`[Delivery] ${allArticles.length} Artikel seit ${since} verfügbar.`);

  // 4. Pro User: Artikel filtern, Mail bauen, versenden
  let sent = 0;
  let skipped = 0;

  for (const user of users as User[]) {
    const userIndustries = new Set(user.industry_subscriptions ?? []);

    // Artikel für diesen User filtern
    const userArticles: ArticleItem[] = (allArticles ?? [])
      .filter((a: { industry_id: number }) => userIndustries.has(a.industry_id))
      .slice(0, MAX_ARTICLES)
      .map((a: {
        id: string;
        title: string;
        summary_short: string | null;
        impact_level: "high" | "medium" | "low" | null;
        source_url: string;
        published_at: string | null;
        industry_id: number;
      }): ArticleItem => ({
        id:            a.id,
        title:         a.title,
        summary_short: a.summary_short,
        impact_level:  a.impact_level,
        source_url:    a.source_url,
        published_at:  a.published_at,
        industry_name: industryMap.get(a.industry_id) ?? "Allgemein",
      }));

    if (!userArticles.length) {
      console.log(`[Delivery] [${user.email}] Keine Artikel — übersprungen.`);
      skipped++;
      continue;
    }

    const subject = `Dein Weekly Briefing — KW ${getCalendarWeek()}`;

    const unsubscribeUrl = `${APP_URL}/api/newsletter/unsubscribe`;
    const html = buildNewsletterHtml(
      userArticles,
      user.email,
      FREQUENCY,
      APP_URL,
      unsubscribeUrl,
    );

    if (DRY_RUN) {
      console.log(`[Delivery] [dry run] ${user.email} — ${userArticles.length} Artikel — Betreff: "${subject}"`);
      sent++;
      continue;
    }

    // Mail versenden
    const { data: mailData, error: mailErr } = await resend!.emails.send({
      from:    RESEND_FROM,
      to:      user.email,
      subject,
      html,
    });

    if (mailErr) {
      console.error(`[Delivery] [${user.email}] Mail-Fehler:`, (mailErr as { message?: string }).message);
      skipped++;
      continue;
    }

    // Versand protokollieren (inkl. Resend-ID für Webhook-Tracking)
    await supabase.from("newsletters").insert({
      user_id:         user.id,
      article_ids:     userArticles.map(a => a.id),
      subject_line:    subject,
      html_content:    html,
      variant:         FREQUENCY,
      resend_email_id: mailData?.id ?? null,
    });

    console.log(`[Delivery] ✓ ${user.email} — ${userArticles.length} Artikel`);
    sent++;
  }

  console.log(`\n[Delivery] Fertig — gesendet: ${sent}, übersprungen: ${skipped}`);
}

function getCalendarWeek(): number {
  const d = new Date();
  const startOfYear = new Date(d.getFullYear(), 0, 1);
  return Math.ceil(((d.getTime() - startOfYear.getTime()) / 86400000 + startOfYear.getDay() + 1) / 7);
}

run().catch(err => {
  console.error("[Delivery] Fataler Fehler:", err);
  process.exit(1);
});
