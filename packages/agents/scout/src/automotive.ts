import { runScoutFromDB } from "./runner.js";

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

runScoutFromDB(INDUSTRY_ID, "Automotive").catch((err) => {
  console.error("[Scout:Automotive] Fatal:", err);
  process.exit(1);
});
