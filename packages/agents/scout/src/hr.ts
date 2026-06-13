import { runScoutFromDB } from "./runner.js";

/**
 * HR & Arbeitsmarkt — Scout
 *
 * Zielgruppe: HR-Direktoren, Personalleiter, Arbeitsrechts-Anwälte,
 *   Betriebsräte, Tarifrechts-Experten, CFOs (Personalkosten),
 *   Recruiting-Verantwortliche, Verbandsjuristen
 *
 * Relevanzkriterien:
 *   ✔ Arbeitsrecht: BAG-Grundsatzurteile, neue Gesetze (Arbeitszeitgesetz, BetrVG)
 *   ✔ Tarifpolitik: Tarifabschlüsse Pilotbranchen (Metall, ÖD, Chemie), Streiks
 *   ✔ Arbeitsmarktdaten: Bundesagentur Monatsbericht, Kurzarbeiter-Zahlen, Fachkräftemangel
 *   ✔ Mindestlohn: Kommissionsempfehlungen, Anhebungen, Dokumentationspflichten
 *   ✔ Regulatorik: Entgelttransparenzgesetz, LkSG (Sorgfaltspflichten Personal), NIS2 HR
 *   ✗ Allgemeine HR-Trends, Employer-Branding-Ratgeber, Recruitment-Marketing
 */

const INDUSTRY_ID = 11; // HR & Arbeitsmarkt

runScoutFromDB(INDUSTRY_ID, "HR & Arbeitsmarkt").catch((err) => {
  console.error("[Scout:HR] Fatal:", err);
  process.exit(1);
});
