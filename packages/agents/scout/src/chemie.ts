import { runScout } from "./runner.js";

/**
 * Chemie & Materialien — Scout
 *
 * Zielgruppe: Chemiewerks-Manager, Einkaufsleiter (Rohstoffe),
 *   HSE-Manager (REACH/CLP-Compliance), Produktmanager Spezialchemie,
 *   Investoren (Chemieaktien), Nachhaltigkeitsbeauftragte (PFAS, Kreislaufwirtschaft)
 *
 * Relevanzkriterien:
 *   ✔ Regulatorik: REACH-Beschränkungen, PFAS-Regulierung, neue ECHA-Kandidatenliste
 *   ✔ Rohstoffmarkt: Naphtha/Ethylen-Preise, Seltene-Erden-Versorgung, Energie-Intensität
 *   ✔ Zulassungen: Biozid-Wirkstoffe, Pflanzenschutzmittel EU, GHS-Einstufungen
 *   ✔ Nachhaltigkeit: Chemikalienrecht-Reform EU, REACH-Revision, Green Deal Chemie
 *   ✔ Markt: VCI-Produktionsindizes, Quartalsberichte BASF/Evonik/Covestro
 *   ✗ Allgemeine Chemie-Forschung ohne Marktzulassungsbezug, Konsumgüterchemie
 */

const INDUSTRY_ID = 15; // Chemie & Materialien

runScout(INDUSTRY_ID, [
  // ── Offiziell / Behörden ─────────────────────────────────────────────────
  {
    name: "ECHA — Pressemitteilungen",
    url: "https://www.echa.europa.eu/de/rss-feeds/-/rss/news",
    trust_level: "official",
  },
  {
    name: "BfR — Pressemitteilungen",
    url: "https://www.bfr.bund.de/de/presse/rss.xml",
    trust_level: "official",
  },
  {
    name: "Umweltbundesamt — Chemikalien",
    url: "https://www.umweltbundesamt.de/service/presse/pressemitteilungen/rss.xml",
    trust_level: "official",
  },
  // ── Verbände ─────────────────────────────────────────────────────────────
  {
    name: "VCI — Verband der Chemischen Industrie",
    url: "https://www.vci.de/presse/pressemitteilungen/rss.jsp",
    trust_level: "official",
  },
  // ── Fachmedien ────────────────────────────────────────────────────────────
  {
    name: "CHEManager",
    url: "https://www.chemanager-online.com/rss/news",
    trust_level: "media",
  },
  {
    name: "Chemie Technik",
    url: "https://www.chemietechnik.de/rss/",
    trust_level: "media",
  },
  {
    name: "ICIS Chemical Business",
    url: "https://www.icis.com/explore/resources/news/feed/",
    trust_level: "media",
  },
], "Chemie & Materialien").catch((err) => {
  console.error("[Scout:Chemie] Fatal:", err);
  process.exit(1);
});
