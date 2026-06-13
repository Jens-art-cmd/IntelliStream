import { runScoutFromDB } from "./runner.js";

/**
 * Logistik & Transport — Scout
 *
 * Zielgruppe: Supply-Chain-Manager, Logistikleiter, Einkaufsleiter,
 *   Spediteure, Hafenbetreiber, Fuhrparkmanager, 3PL-Dienstleister,
 *   Investoren (Logistikimmobilien), Compliance-Beauftragte (LkSG)
 *
 * Relevanzkriterien:
 *   ✔ Regulatorik: LkSG-Vollzug, ADR-Änderungen, neue Mautklassen, CO2-LKW-Steuer
 *   ✔ Marktdaten: Frachtpreisindizes, Kraftstoffpreise, Kapazitätsauslastung
 *   ✔ Infrastruktur: Streckenausfälle, Hafenstreiks, Kanalvorfälle (Suez, Kiel)
 *   ✔ Regulatorik EU: Road Charging Directive, Smart TEN-T, Paketlieferdienste-VO
 *   ✔ Nachhaltigkeit: CO2-Flottengrenzwerte LKW, alternative Antriebe, HVO-Kraftstoffe
 *   ✗ Einzelne Unternehmensmeldungen ohne Marktrelevanz, Messepreviews
 */

const INDUSTRY_ID = 13; // Logistik & Transport

runScoutFromDB(INDUSTRY_ID, "Logistik & Transport").catch((err) => {
  console.error("[Scout:Logistik] Fatal:", err);
  process.exit(1);
});
