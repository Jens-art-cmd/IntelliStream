import { runScout } from "./runner.js";

/**
 * HR & Arbeitsmarkt — Scout
 *
 * Zielgruppe: HR-Direktoren, Personalleiter, Arbeitsrechts-Anwälte,
 *   Betriebsräte, Tarifrechts-Experten, CFOs (Personalkosten),
 *   Recruiting-Verantwortliche, Verbandsjuristen
 *
 * Relevanzkriterien:
 *   ✔ Arbeitsrecht: BAG-Grundsatzurteile, neue Gesetze (Arbeitszeitgesetz, BetrVG)
 *   ✔ Tarifpolitik: Tarifabschlüsse Pilotbranchen (Metall, ÖD, Chemie), Streiks
 *   ✔ Arbeitsmarktdaten: Bundesagentur Monatsbericht, Kurzarbeiter-Zahlen, Fachkräftemangel
 *   ✔ Mindestlohn: Kommissionsempfehlungen, Anhebungen, Dokumentationspflichten
 *   ✔ Regulatorik: Entgelttransparenzgesetz, LkSG (Sorgfaltspflichten Personal), NIS2 HR
 *   ✗ Allgemeine HR-Trends, Employer-Branding-Ratgeber, Recruitment-Marketing
 */

const INDUSTRY_ID = 11; // HR & Arbeitsmarkt

runScout(INDUSTRY_ID, [
  // ── Offiziell / Behörden ─────────────────────────────────────────────────
  {
    name: "BAG — Pressemitteilungen",
    url: "https://www.bundesarbeitsgericht.de/presse/pressemitteilungen/rss/",
    trust_level: "official",
  },
  {
    name: "Bundesagentur für Arbeit — Presse",
    url: "https://www.arbeitsagentur.de/presse/rss/pressemitteilungen.xml",
    trust_level: "official",
  },
  {
    name: "BMAS — Pressemitteilungen",
    url: "https://www.bmas.de/SiteGlobals/Functions/RSSFeed/DE/RSSNewsfeed_Presse/RSSNewsfeed_Presse.xml",
    trust_level: "official",
  },
  // ── Verbände ─────────────────────────────────────────────────────────────
  {
    name: "ver.di — Pressemitteilungen",
    url: "https://www.verdi.de/presse/pressemitteilungen/rss",
    trust_level: "official",
  },
  {
    name: "BDA — Bundesvereinigung dt. Arbeitgeberverbände",
    url: "https://arbeitgeber.de/presse/rss/",
    trust_level: "official",
  },
  // ── Fachmedien ────────────────────────────────────────────────────────────
  {
    name: "Personalwirtschaft",
    url: "https://www.personalwirtschaft.de/rss/",
    trust_level: "media",
  },
  {
    name: "Haufe Personal",
    url: "https://www.haufe.de/personal/rss/news.xml",
    trust_level: "media",
  },
], "HR & Arbeitsmarkt").catch((err) => {
  console.error("[Scout:HR] Fatal:", err);
  process.exit(1);
});
