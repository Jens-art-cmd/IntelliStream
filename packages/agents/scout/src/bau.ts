import { runScout } from "./runner.js";

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

runScout(INDUSTRY_ID, [
  // ── Offiziell / Statistik ────────────────────────────────────────────────
  {
    name: "Destatis — Bau & Immobilien",
    url: "https://www.destatis.de/DE/Presse/Pressemitteilungen/RSS/_rss_bau.xml",
    trust_level: "official",
  },
  {
    name: "BMWSB — Bauen & Wohnen",
    url: "https://www.bmwsb.bund.de/SiteGlobals/BMWSB/RSSFeeds/rss.xml",
    trust_level: "official",
  },
  {
    name: "KfW — Pressemitteilungen",
    url: "https://www.kfw.de/KfW-Konzern/Newsroom/Presse/Pressemitteilungen/rss.xml",
    trust_level: "official",
  },
  // ── Verbände ─────────────────────────────────────────────────────────────
  {
    name: "ZIA — Zentraler Immobilien Ausschuss",
    url: "https://zia-deutschland.de/feed/",
    trust_level: "official",
  },
  {
    name: "GdW — Wohnungswirtschaft",
    url: "https://www.gdw.de/rss/presse/",
    trust_level: "official",
  },
  // ── Fachmedien ────────────────────────────────────────────────────────────
  {
    name: "Immobilien Zeitung",
    url: "https://www.iz.de/rss/",
    trust_level: "media",
  },
  {
    name: "BauNetz",
    url: "https://www.baunetz.de/rss/baunetz_news.xml",
    trust_level: "media",
  },
  {
    name: "Haufe Immobilien",
    url: "https://www.haufe.de/immobilien/rss/news.xml",
    trust_level: "media",
  },
], "Bau").catch((err) => {
  console.error("[Scout:Bau] Fatal:", err);
  process.exit(1);
});
