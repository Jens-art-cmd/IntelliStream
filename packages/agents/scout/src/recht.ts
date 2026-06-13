import { runScoutFromDB } from "./runner.js";

/**
 * Recht & Compliance — Scout
 *
 * Zielgruppe: Rechtsanwälte, General Counsel, Syndikusanwälte,
 *   Compliance-Beauftragte, Datenschutzbeauftragte, Regulatory-Affairs-Manager,
 *   Legal-Tech-Verantwortliche, Wirtschaftsprüfer (Compliance-Aspekte)
 *
 * Relevanzkriterien:
 *   ✔ Höchstgerichtliche Urteile: BGH, BFH, EuGH, BAG, BVerfG — Praxiswirkung
 *   ✔ Neue EU-Rechtsakte & nationale Umsetzungsgesetze (EUR-Lex, Bundesrat)
 *   ✔ DSGVO-Bußgelder >100.000 € & Leitentscheidungen der Datenschutzbehörden
 *   ✔ Compliance-Fristen (LkSG, GwG, CSRD, DORA)
 *   ✔ Gesetzgebungsverfahren mit Auswirkung auf Unternehmenspraxis
 *   ✗ Strafrecht Consumer-Ebene, Familienrecht, lokale OLG-Urteile ohne Leitwirkung
 */

const INDUSTRY_ID = 3; // Recht & Compliance

runScoutFromDB(INDUSTRY_ID, "Recht & Compliance").catch((err) => {
  console.error("[Scout:Recht] Fatal:", err);
  process.exit(1);
});
