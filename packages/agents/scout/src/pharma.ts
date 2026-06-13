import { runScoutFromDB } from "./runner.js";

/**
 * Pharma & Life Science — Scout
 *
 * Zielgruppe: Regulatory-Affairs-Manager, Market-Access-Teams, Medizinische Direktoren,
 *   Business-Development, Klinische Studienleiter, Krankenkassen-Verhandler,
 *   Investoren (Biotech/Pharma), Apotheker und Klinikleiter
 *
 * Relevanzkriterien:
 *   ✔ Zulassungen: EMA CHMP-Meinungen, FDA Approvals, BfArM-Bescheide
 *   ✔ AMNOG: IQWiG-Nutzenbewertungen, G-BA-Beschlüsse, Erstattungsverhandlungen
 *   ✔ Klinische Studien: Phase-III-Ergebnisse, Studienabbrüche, Post-Market-Studien
 *   ✔ Regulatorik: AMG-Novellen, MDR/IVDR-Fristen, EU-HTA-Verordnung
 *   ✔ Marktrücknahmen, Rückrufe, Lieferengpässe (BfArM-Liste)
 *   ✗ Allgemeine Medizinnachrichten ohne Zulassungs-/Marktrelevanz
 *   ✗ Forschungsartikel ohne unmittelbaren Zulassungsbezug
 */

const INDUSTRY_ID = 5; // Pharma & Life Science

runScoutFromDB(INDUSTRY_ID, "Pharma").catch((err) => {
  console.error("[Scout:Pharma] Fatal:", err);
  process.exit(1);
});
