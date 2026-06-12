import { runScout } from "./runner.js";

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

runScout(INDUSTRY_ID, [
  // ── Offiziell / Behörden ─────────────────────────────────────────────────
  {
    name: "BaFin — Versicherungsaufsicht",
    url: "https://www.bafin.de/SiteGlobals/Functions/RSSFeed/DE/RSSNewsfeed_Aktuelles.xml",
    trust_level: "official",
  },
  {
    name: "EIOPA — Pressemitteilungen",
    url: "https://www.eiopa.europa.eu/rss.xml",
    trust_level: "official",
  },
  // ── Verbände ─────────────────────────────────────────────────────────────
  {
    name: "GDV — Gesamtverband der Versicherer",
    url: "https://www.gdv.de/gdv/presse/pressemitteilungen/rss/",
    trust_level: "official",
  },
  // ── Fachmedien ────────────────────────────────────────────────────────────
  {
    name: "Versicherungswirtschaft heute",
    url: "https://www.vwheute.de/rss/",
    trust_level: "media",
  },
  {
    name: "Versicherungsjournal",
    url: "https://www.versicherungsjournal.de/rss/versicherungsjournal.xml",
    trust_level: "media",
  },
  {
    name: "Pfefferminzia",
    url: "https://www.pfefferminzia.de/feed/",
    trust_level: "media",
  },
  {
    name: "Handelsblatt — Versicherungen",
    url: "https://www.handelsblatt.com/contentexport/feed/versicherungen",
    trust_level: "media",
  },
], "Versicherung & Risiko").catch((err) => {
  console.error("[Scout:Versicherung] Fatal:", err);
  process.exit(1);
});
