import { runScoutFromDB } from "./runner.js";

/**
 * EU-Regulatorik & Gesetzgebung — Scout
 *
 * Zielgruppe: Public-Affairs-Manager, General Counsel, Regulatory-Affairs-Teams,
 *   Compliance-Beauftragte aller Branchen, Lobbyisten, Unternehmensberater,
 *   Wirtschaftsprüfer, Investoren (regulatorisches Risiko), Verbandsjuristen
 *
 * Relevanzkriterien:
 *   ✔ Neue Verordnungen & Richtlinien im Amtsblatt (L-Serie)
 *   ✔ Trilog-Einigungen: AI Act, Data Act, DMA, DSA, DORA, CSRD, Supply Chain
 *   ✔ EU-Kommission Legislativvorschläge + Impact Assessments
 *   ✔ EU-Parlament Ausschussbeschlüsse mit Mehrheitsverhältnissen
 *   ✔ EU-Rat allgemeine Ausrichtungen + Mandate
 *   ✔ EuGH-Urteile mit Grundsatzwirkung (alle Rechtsbereiche)
 *   ✔ Konsultationsfristen die ablaufen (Stakeholder-Beteiligung)
 *   ✗ Nationale Umsetzungsgesetze (→ Recht & Compliance-Branche)
 *   ✗ Reine EU-Innenpolitik ohne Unternehmensrelevanz
 */

const INDUSTRY_ID = 21; // EU-Regulatorik & Gesetzgebung

runScoutFromDB(INDUSTRY_ID, "EU-Regulatorik & Gesetzgebung").catch((err) => {
  console.error("[Scout:EU] Fatal:", err);
  process.exit(1);
});
