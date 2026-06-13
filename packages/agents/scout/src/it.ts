import { runScoutFromDB } from "./runner.js";

/**
 * IT & Cybersecurity — Scout
 *
 * Zielgruppe: CISOs, IT-Sicherheitsverantwortliche, SOC-Analysten, IT-Leiter,
 *   NIS2/DORA/ISO-27001-Compliance-Beauftragte, Security-Architekten,
 *   Datenschutzbeauftragte (technisch)
 *
 * Relevanzkriterien:
 *   ✔ Aktive Bedrohungslagen, CVEs, Zero-Days
 *   ✔ Behörden-Warnungen & -Handlungsempfehlungen (BSI, ENISA, CERT)
 *   ✔ Regulatorik: NIS2, DORA, DSGVO, CRA — Fristen & Umsetzungspflichten
 *   ✔ Sicherheitsvorfälle bei Unternehmen/Infrastruktur
 *   ✔ Technologie-Entscheidungen: SIEM, Zero Trust, Cloud-Security
 *   ✗ Consumer-Elektronik, Gaming, allgemeine Tech-Trends, TV-Deals
 */

const INDUSTRY_ID = 4; // IT & Cybersecurity

runScoutFromDB(INDUSTRY_ID, "IT & Cybersecurity").catch((err) => {
  console.error("[Scout:IT] Fatal:", err);
  process.exit(1);
});
