import { runScout } from "./runner.js";

/**
 * Automotive & Mobilität — Scout
 *
 * Zielgruppe: Strategie- & Produktmanager bei OEMs und Tier-1-Zulieferern,
 *   Fleet-Manager, Mobilitätsdienstleister, Regulatory-Affairs-Verantwortliche,
 *   M&A in Automotive, Einkaufsleiter (Halbleiter, Rohstoffe)
 *
 * Relevanzkriterien:
 *   ✔ EU-Flottenregulierung: CO2-Grenzwerte 2025/2030/2035, Euro-7-Typgenehmigung
 *   ✔ KBA-Zulassungsstatistiken, Rückrufe >100.000 Fahrzeuge
 *   ✔ Elektromobilität: Ladenetz-Ausbau, Batterietechnologie, Förderrichtlinien
 *   ✔ Lieferketten: Halbleiterversorgung, Rohstoffpreise, Produktionsstopps
 *   ✔ OEM-Gewinnwarnungen, M&A, Restrukturierungen
 *   ✗ Neue Modellvorstellungen (Consumer-Perspektive), Fahrberichte, Tuning
 */

const INDUSTRY_ID = 8; // Automotive & Mobilität

runScout(INDUSTRY_ID, [
  {
    name: "ACEA (European Automobile Manufacturers)",
    url: "https://www.acea.auto/rss/",
    trust_level: "official",
  },
  {
    name: "Automobilwoche",
    url: "https://feeds.feedburner.com/automobilwoche",
    trust_level: "media",
  },
  {
    name: "electrive.net",
    url: "https://www.electrive.net/feed/",
    trust_level: "media",
  },
  {
    name: "VDA — Pressemitteilungen",
    url: "https://www.vda.de/de/presse/Pressemitteilungen.rss",
    trust_level: "official",
  },
  {
    name: "KBA — Pressemitteilungen",
    url: "https://www.kba.de/SharedDocs/RSS/DE/presse_news.xml",
    trust_level: "official",
  },
  {
    name: "Transport & Environment",
    url: "https://www.transportenvironment.org/feed/",
    trust_level: "media",
  },
], "Automotive").catch((err) => {
  console.error("[Scout:Automotive] Fatal:", err);
  process.exit(1);
});
