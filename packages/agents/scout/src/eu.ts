import { runScout } from "./runner.js";

/**
 * EU-Regulatorik & Gesetzgebung — Scout
 *
 * Zielgruppe: Public-Affairs-Manager, General Counsel, Regulatory-Affairs-Teams,
 *   Compliance-Beauftragte aller Branchen, Lobbyisten, Unternehmensberater,
 *   Wirtschaftsprüfer, Investoren (regulatorisches Risiko), Verbandsjuristen
 *
 * Relevanzkriterien:
 *   ✔ Neue Verordnungen & Richtlinien im Amtsblatt (L-Serie)
 *   ✔ Trilog-Einigungen: AI Act, Data Act, DMA, DSA, DORA, CSRD, Supply Chain
 *   ✔ EU-Kommission Legislativvorschläge + Impact Assessments
 *   ✔ EU-Parlament Ausschussbeschlüsse mit Mehrheitsverhältnissen
 *   ✔ EU-Rat allgemeine Ausrichtungen + Mandate
 *   ✔ EuGH-Urteile mit Grundsatzwirkung (alle Rechtsbereiche)
 *   ✔ Konsultationsfristen die ablaufen (Stakeholder-Beteiligung)
 *   ✗ Nationale Umsetzungsgesetze (→ Recht & Compliance-Branche)
 *   ✗ Reine EU-Innenpolitik ohne Unternehmensrelevanz
 */

const INDUSTRY_ID = 21; // EU-Regulatorik & Gesetzgebung

runScout(INDUSTRY_ID, [
  // ── Primärquellen: EU-Institutionen ─────────────────────────────────────
  {
    name: "EUR-Lex — Amtsblatt (Neue Rechtsakte)",
    url: "https://eur-lex.europa.eu/rss/rss.xml",
    trust_level: "official",
  },
  {
    name: "EU-Parlament — Pressemitteilungen",
    url: "https://www.europarl.europa.eu/rss/doc/latest-news/de.rss",
    trust_level: "official",
  },
  {
    name: "EU-Rat — Pressemitteilungen",
    url: "https://www.consilium.europa.eu/de/press/press-releases/rss",
    trust_level: "official",
  },
  {
    name: "EU-Kommission — Pressemitteilungen",
    url: "https://ec.europa.eu/commission/presscorner/api/rss",
    trust_level: "official",
  },
  {
    name: "EuGH — Urteile & Schlussanträge",
    url: "https://curia.europa.eu/jcms/upload/docs/application/rss/2011-06/juris.rss",
    trust_level: "official",
  },
  // ── Fachmedien EU-Politik ────────────────────────────────────────────────
  {
    name: "Euractiv",
    url: "https://www.euractiv.com/feed/",
    trust_level: "media",
  },
  {
    name: "Politico Europe",
    url: "https://www.politico.eu/feed/",
    trust_level: "media",
  },
], "EU-Regulatorik & Gesetzgebung").catch((err) => {
  console.error("[Scout:EU] Fatal:", err);
  process.exit(1);
});
