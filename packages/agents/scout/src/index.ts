import { runScoutFromDB } from "./runner.js";

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

runScoutFromDB(INDUSTRY_ID, "Energie").catch((err) => {
  console.error("[Scout:Energie] Fatal:", err);
  process.exit(1);
});
