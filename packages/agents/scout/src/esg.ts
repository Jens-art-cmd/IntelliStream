import { runScoutFromDB } from "./runner.js";

/**
 * ESG & Nachhaltigkeit — Scout
 *
 * Zielgruppe: Nachhaltigkeitsbeauftragte, CSR-Manager, IR-Teams, Wirtschaftsprüfer,
 *   CFOs (CSRD-Pflicht), Compliance-Beauftragte, Asset Manager (ESG-Fonds),
 *   Investoren (Taxonomie-konforme Kapitalanlage)
 *
 * Relevanzkriterien:
 *   ✔ Regulatorik: CSRD, EU-Taxonomie, SFDR, ESRS — neue Delegierte Verordnungen
 *   ✔ Berichtspflichten: ESRS-Standards, GRI-Updates, TCFD-Anforderungen
 *   ✔ CO₂-Markt: EU-ETS-Preise, CBAM-Umsetzung, Cap-Anpassungen
 *   ✔ Kapitalmarkt: ESMA-Leitlinien zu ESG-Ratings, MiFID-ESG-Präferenzen, SFDR-RTS
 *   ✔ Science-Based Targets: SBTi-Validierungen, Net-Zero-Commitments großer Konzerne
 *   ✗ Allgemeine Klimanachrichten ohne Regulierungs-/Unternehmensbezug
 *   ✗ Konsumenten-Ratgeber (grüner Einkaufen etc.)
 */

const INDUSTRY_ID = 2; // ESG & Nachhaltigkeit

runScoutFromDB(INDUSTRY_ID, "ESG").catch((err) => {
  console.error("[Scout:ESG] Fatal:", err);
  process.exit(1);
});
