import { runScoutFromDB } from "./runner.js";

/**
 * Finanzen & Kapitalmarkt — Scout
 *
 * Zielgruppe: CFOs, Finanzvorstände, Treasury-Manager, Investment-Manager,
 *   Portfolio-Manager, Compliance-Beauftragte in Banken/Versicherungen,
 *   M&A-Berater, Corporate-Finance-Teams, Wirtschaftsprüfer
 *
 * Relevanzkriterien:
 *   ✔ Geldpolitik: EZB-Entscheide, Zinspfad, Quantitative Tightening
 *   ✔ Regulatorik: MiFID II, Basel III/IV, DORA, EMIR — Fristen & Rundschreiben
 *   ✔ Aufsichtsbehörden: BaFin-Allgemeinverfügungen, ESMA-Leitlinien
 *   ✔ M&A-Transaktionen >500 Mio. €, Kapitalmaßnahmen DAX/MDAX
 *   ✔ Ratingänderungen systemrelevanter Institute/Staaten
 *   ✗ Allgemeine Wirtschaftstipps, Konsumentenfinanzierung, Krypto-Hypes
 */

const INDUSTRY_ID = 6; // Finanzen & Kapitalmarkt

runScoutFromDB(INDUSTRY_ID, "Finanzen").catch((err) => {
  console.error("[Scout:Finanzen] Fatal:", err);
  process.exit(1);
});
