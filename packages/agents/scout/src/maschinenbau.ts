import { runScoutFromDB } from "./runner.js";

/**
 * Maschinenbau & Industrie 4.0 — Scout
 *
 * Zielgruppe: Maschinenbau-CEOs und Produktionsleiter, Automatisierungsingenieure,
 *   Einkaufsleiter (Rohstoffe/Komponenten), Investoren (Industrieaktien),
 *   Verbandsmitglieder VDMA, Betriebsräte Industrieunternehmen
 *
 * Relevanzkriterien:
 *   ✔ VDMA-Konjunkturdaten: Auftragseingänge, Produktionsindex, Exportquoten
 *   ✔ Automatisierung & Robotik: neue Cobots, AMR, Automatisierungsinvestitionen
 *   ✔ Industrie 4.0: IIoT, OPC-UA, digitaler Zwilling, KI in der Fertigung
 *   ✔ Rohstoffe & Lieferkette: Stahl-/Aluminiumpreise, Seltene-Erden-Verfügbarkeit
 *   ✔ Regulatorik: EU-Maschinenverordnung, CE-Kennzeichnung, Produkthaftung
 *   ✔ Energie & Effizienz: Industriestrompreise, Dekarbonisierungsprogramme
 *   ✗ Allgemeine Technologienachrichten ohne Fertigungsbezug
 *   ✗ Konsumentengüter, Handwerk
 */

const INDUSTRY_ID = 10; // Maschinenbau & Industrie 4.0

runScoutFromDB(INDUSTRY_ID, "Maschinenbau").catch((err) => {
  console.error("[Scout:Maschinenbau] Fatal:", err);
  process.exit(1);
});
