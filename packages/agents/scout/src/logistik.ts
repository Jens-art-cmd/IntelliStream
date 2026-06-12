import { runScout } from "./runner.js";

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

runScout(INDUSTRY_ID, [
  // ── Offiziell / Behörden ─────────────────────────────────────────────────
  {
    name: "BMVI / BMDV — Pressemitteilungen",
    url: "https://bmdv.bund.de/SiteGlobals/Functions/RSSFeed/DE/Presse/RSSNewsfeed_Presse.xml",
    trust_level: "official",
  },
  {
    name: "Destatis — Verkehr & Transport",
    url: "https://www.destatis.de/DE/Presse/Pressemitteilungen/RSS/_rss_verkehr.xml",
    trust_level: "official",
  },
  // ── Verbände ─────────────────────────────────────────────────────────────
  {
    name: "BGL — Bundesverband Güterkraftverkehr",
    url: "https://www.bgl-ev.de/web/presse/rss.htm",
    trust_level: "official",
  },
  {
    name: "DSLV — Spedition & Logistik",
    url: "https://www.dslv.org/presse/pressemitteilungen/rss/",
    trust_level: "official",
  },
  // ── Fachmedien ────────────────────────────────────────────────────────────
  {
    name: "DVZ — Deutsche Verkehrs-Zeitung",
    url: "https://www.dvz.de/rss/news.xml",
    trust_level: "media",
  },
  {
    name: "Verkehrsrundschau",
    url: "https://www.verkehrsrundschau.de/rss/news.xml",
    trust_level: "media",
  },
  {
    name: "trans aktuell",
    url: "https://www.trans-aktuell.de/rss/",
    trust_level: "media",
  },
], "Logistik & Transport").catch((err) => {
  console.error("[Scout:Logistik] Fatal:", err);
  process.exit(1);
});
