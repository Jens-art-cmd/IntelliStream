import { runScoutFromDB } from "./runner.js";

/**
 * Gesundheit & MedTech — Scout
 *
 * Zielgruppe: Krankenhausgeschäftsführer, Medizinprodukte-Hersteller,
 *   DiGA-Entwickler, Kassenärztliche Vereinigungen, GKV-Vertreter,
 *   Klinikverbünde, Investoren (HealthTech/MedTech), Pflegeeinrichtungen
 *
 * Relevanzkriterien:
 *   ✔ Regulatorik: MDR/IVDR-Fristen, DiGA-Richtlinie, SGB V-Änderungen
 *   ✔ Krankenhausreform: KHVVG-Umsetzung, Fallpauschalen, DRG-Katalog
 *   ✔ G-BA-Beschlüsse: DiGA-Listungen, Nutzenbewertungen, Richtlinienänderungen
 *   ✔ GKV-Finanzen: Zusatzbeiträge, Honorarverhandlungen, Budgetrahmen
 *   ✔ Verbände: GKV-Spitzenverband, BVMed — Positionspapiere, Erstattungsverhandlungen
 *   ✔ Digitalisierung: Telematikinfrastruktur, ePA, eRezept, Telemedizin
 *   ✔ MedTech: CE-Zulassungen, Rückrufe, Produktneuheiten mit Erstattungsbezug
 *   ✗ Allgemeine Gesundheitstipps, Lifestyle-Medizin, Ernährungsthemen
 */

const INDUSTRY_ID = 9; // Gesundheit & MedTech

runScoutFromDB(INDUSTRY_ID, "Gesundheit").catch((err) => {
  console.error("[Scout:Gesundheit] Fatal:", err);
  process.exit(1);
});
