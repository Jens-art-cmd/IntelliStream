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
  // ── Höchstgerichte (Primärquellen) ──────────────────────────────────────
  {
    name: "BGH — Entscheidungen",
    url: "https://www.bundesgerichtshof.de/cgi-bin/rechtsprechung/list.cgi?Gericht=bgh&Art=en&Datum=Aktuell&format=rss",
    trust_level: "official",
  },
  {
    name: "BAG — Entscheidungen",
    url: "https://www.bundesarbeitsgericht.de/entscheidungen/entscheidungen-rss/",
    trust_level: "official",
  },
  {
    name: "BFH — Entscheidungen",
    url: "https://www.bundesfinanzhof.de/rss/entscheidungen/",
    trust_level: "official",
  },
  {
    name: "EuGH — Urteile & Schlussanträge",
    url: "https://curia.europa.eu/jcms/upload/docs/application/rss/2011-06/juris.rss",
    trust_level: "official",
  },
  // ── EU-Gesetzgebung & nationale Verfahren ────────────────────────────────
  {
    name: "EUR-Lex — Neue Rechtsakte",
    url: "https://eur-lex.europa.eu/rss/news.xml",
    trust_level: "official",
  },
  {
    name: "Bundesrat — Aktuelles",
    url: "https://www.bundesrat.de/DE/service/rss/aktuelles/aktuelles_node.xml",
    trust_level: "official",
  },
  // ── Fachmedien ────────────────────────────────────────────────────────────
  {
    name: "Beck-aktuell",
    url: "https://rsw.beck.de/rss/rss.aspx?feed=NJW",
    trust_level: "media",
  },
  {
    name: "LTO — Legal Tribune Online",
    url: "https://www.lto.de/feed/",
    trust_level: "media",
  },
  {
    name: "Compliance-Magazin",
    url: "https://www.compliance-magazin.de/feed/",
    trust_level: "media",
  },
  {
    name: "JUVE Rechtsmarkt",
    url: "https://www.juve.de/feed",
    trust_level: "media",
  },
], "Recht & Compliance").catch((err) => {
  console.error("[Scout:Recht] Fatal:", err);
  process.exit(1);
});
