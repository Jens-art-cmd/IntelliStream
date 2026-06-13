import { runScout } from "./runner.js";

/**
 * Energie & Erneuerbare — Scout
 *
 * Zielgruppe: Energiewirtschafts-Manager, Netzoperatoren, EEG-Compliance-Verantwortliche,
 *   Investoren in Solar/Wind/Speicher, Stadtwerke-Führungskräfte, Energieberater,
 *   Projektentwickler Erneuerbare
 *
 * Relevanzkriterien:
 *   ✔ Regulatorik: EEG, EnWG, GEG, EU-Beihilferecht, RED III
 *   ✔ BNetzA-Entscheidungen: Netzausbau, Ausschreibungsergebnisse, Netzentgelte
 *   ✔ Förderprogramme BAFA/KfW — Öffnungen, Änderungen, Stopps
 *   ✔ Strommarkt: EPEX-Extrempreise, Kapazitätsmärkte, Marktkopplung
 *   ✔ Technologie: Speicher, Wasserstoff, Offshore-Wind, Agri-PV
 *   ✗ Allgemeine Wirtschaftsberichte, Konsumthemen, internationale News ohne DE/EU-Bezug
 */

const INDUSTRY_ID = 1; // Energie & Erneuerbare

runScout(INDUSTRY_ID, [
  // ── Offiziell / Regulatorik ──────────────────────────────────────────────
  {
    name: "BNetzA — Aktuelles",
    url: "https://www.bundesnetzagentur.de/SiteGlobals/Functions/RSSFeed/DE/RSSNewsfeed/RSSNewsfeed_Aktuelles_neu.xml",
    trust_level: "official",
  },
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
    name: "PV Magazine",
    url: "https://www.pv-magazine.de/feed/",
    trust_level: "media",
  },
  {
    name: "Clean Energy Wire",
    url: "https://www.cleanenergywire.org/rss.xml",
    trust_level: "media",
  },
  {
    name: "Solarserver",
    url: "https://www.solarserver.de/feed/",
    trust_level: "media",
  },
], "Energie").catch((err) => {
  console.error("[Scout] Fatal:", err);
  process.exit(1);
});
