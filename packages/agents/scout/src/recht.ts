import { runScout } from "./runner.js";

/**
 * Recht & Compliance — Scout
 *
 * Zielgruppe: Rechtsanwälte, General Counsel, Syndikusanwälte,
 *   Compliance-Beauftragte, Datenschutzbeauftragte, Regulatory-Affairs-Manager,
 *   Legal-Tech-Verantwortliche, Wirtschaftsprüfer (Compliance-Aspekte)
 *
 * Relevanzkriterien:
 *   ✔ Höchstgerichtliche Urteile: BGH, BFH, EuGH, BAG, BVerfG — Praxiswirkung
 *   ✔ Neue EU-Rechtsakte & nationale Umsetzungsgesetze (EUR-Lex, Bundesrat)
 *   ✔ DSGVO-Bußgelder >100.000 € & Leitentscheidungen der Datenschutzbehörden
 *   ✔ Compliance-Fristen (LkSG, GwG, CSRD, DORA)
 *   ✔ Gesetzgebungsverfahren mit Auswirkung auf Unternehmenspraxis
 *   ✗ Strafrecht Consumer-Ebene, Familienrecht, lokale OLG-Urteile ohne Leitwirkung
 */

const INDUSTRY_ID = 3; // Recht & Compliance

runScout(INDUSTRY_ID, [
  // ── Höchstgerichte ──────────────────────────────────────────────────────
  {
    name: "BAG — Entscheidungen",
    url: "https://www.bundesarbeitsgericht.de/feed/entscheidung/neueste",
    trust_level: "official",
  },
  {
    name: "BAG — Pressemitteilungen",
    url: "https://www.bundesarbeitsgericht.de/feed/presse/neueste",
    trust_level: "official",
  },
  // ── EU-Gesetzgebung & Institutionen ─────────────────────────────────────
  {
    name: "EU-Kommission — Pressemitteilungen",
    url: "https://ec.europa.eu/commission/presscorner/api/rss",
    trust_level: "official",
  },
  {
    name: "Europäisches Parlament — Pressemitteilungen DE",
    url: "https://www.europarl.europa.eu/rss/doc/press-releases/de.xml",
    trust_level: "official",
  },
  // ── Fachmedien ────────────────────────────────────────────────────────────
  {
    name: "JUVE Rechtsmarkt",
    url: "https://www.juve.de/feed/",
    trust_level: "media",
  },
  {
    name: "Datenschutz-Notizen",
    url: "https://www.dsn-group.de/datenschutz-notizen/blog.recent.xml",
    trust_level: "media",
  },
], "Recht & Compliance").catch((err) => {
  console.error("[Scout:Recht] Fatal:", err);
  process.exit(1);
});
