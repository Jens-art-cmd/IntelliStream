import { runScoutFromDB } from "./runner.js";

/**
 * Bau & Immobilien — Scout
 *
 * Zielgruppe: Projektentwickler, Bauherren, Architekten, Facility-Manager,
 *   Immobilienfonds-Manager, Kommunen/Stadtplaner, Wohnungsbaugesellschaften,
 *   Vergabestellen, Generalunternehmer, Baurechts-Anwälte
 *
 * Relevanzkriterien:
 *   ✔ Vergabe & Ausschreibungen: EU-weite TED-Bekanntmachungen, DTVP
 *   ✔ Regulatorik: GEG (Gebäudeenergiegesetz), VOB/A+B+C, HOAI-Urteile, BauGB-Novellen
 *   ✔ Marktdaten: Destatis Baupreisindizes, Baugenehmigungen, Fertigstellungen
 *   ✔ Immobilienmarkt: Preisindizes, Leerstandsquoten, Transaktionsvolumen
 *   ✔ Förderung: KfW-Programme, BEG (Bundesförderung effiziente Gebäude)
 *   ✔ Verbände: ZIA, GdW — Positionspapiere, Marktberichte, politische Forderungen
 *   ✔ Technologie: BIM, serielles Sanieren, Holzbau, Modulbau
 *   ✗ Lifestyle-Wohnen, Interior-Design, private Kaufberatung
 */

const INDUSTRY_ID = 7; // Bau & Immobilien

runScoutFromDB(INDUSTRY_ID, "Bau").catch((err) => {
  console.error("[Scout:Bau] Fatal:", err);
  process.exit(1);
});
