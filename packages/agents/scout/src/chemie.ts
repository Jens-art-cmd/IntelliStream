import { runScoutFromDB } from "./runner.js";

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

runScoutFromDB(INDUSTRY_ID, "Chemie & Materialien").catch((err) => {
  console.error("[Scout:Chemie] Fatal:", err);
  process.exit(1);
});
