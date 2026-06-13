import { runScoutFromDB } from "./runner.js";

/**
 * Versicherung & Risiko — Scout
 *
 * Zielgruppe: Versicherungsvorstände, Aktuare, Underwriter,
 *   Risk-Manager, Compliance-Beauftragte (DORA, IDD, Solvency II),
 *   Investoren (Versicherungsaktien), Makler & Berater
 *
 * Relevanzkriterien:
 *   ✔ Regulatorik: Solvency-II-Review, DORA-Umsetzungsfrist, IDD-Änderungen
 *   ✔ BaFin-Aufsicht: Rundschreiben, Allgemeinverfügungen, Maßnahmen gegen Versicherer
 *   ✔ EIOPA: Konsultationen, Stresstest-Ergebnisse, Leitlinien
 *   ✔ Naturkatastrophen: Schadensschätzungen (>500 Mio. €), Rückversicherungsmarkt
 *   ✔ Cyber-Versicherung: Marktentwicklung, neue Bedingungen, Schadensfälle
 *   ✗ Einzelprodukt-Werbung, Verbraucher-Ratgeber, Versicherungsvergleiche
 */

const INDUSTRY_ID = 14; // Versicherung & Risiko

runScoutFromDB(INDUSTRY_ID, "Versicherung & Risiko").catch((err) => {
  console.error("[Scout:Versicherung] Fatal:", err);
  process.exit(1);
});
