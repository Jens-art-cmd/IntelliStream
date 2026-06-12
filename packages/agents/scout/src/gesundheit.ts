import { runScout } from "./runner.js";

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

runScout(INDUSTRY_ID, [
  // ── Offiziell / Behörden ─────────────────────────────────────────────────
  {
    name: "G-BA — Beschlüsse & Meldungen",
    url: "https://www.g-ba.de/service/rss/",
    trust_level: "official",
  },
  {
    name: "BMG — Pressemitteilungen",
    url: "https://www.bundesgesundheitsministerium.de/service/rss-feed.html",
    trust_level: "official",
  },
  {
    name: "BfArM — Medizinprodukte & Arzneimittel",
    url: "https://www.bfarm.de/SiteGlobals/Functions/RSSFeed/RSSNewsfeed/RSSNewsfeed.xml",
    trust_level: "official",
  },
  {
    name: "RKI — Pressemitteilungen",
    url: "https://www.rki.de/SiteGlobals/Functions/RSSFeed/RSSNewsfeed/RSSNewsfeed.xml",
    trust_level: "official",
  },
  // ── Verbände ─────────────────────────────────────────────────────────────
  {
    name: "GKV-Spitzenverband",
    url: "https://www.gkv-spitzenverband.de/presse/presse_rss/presse_rss.rss",
    trust_level: "official",
  },
  {
    name: "BVMed — Medizinprodukte-Verband",
    url: "https://www.bvmed.de/rss/presse.rss",
    trust_level: "official",
  },
  // ── Fachmedien ────────────────────────────────────────────────────────────
  {
    name: "Ärzteblatt — Gesundheitspolitik",
    url: "https://www.aerzteblatt.de/rss/nachrichten.xml",
    trust_level: "media",
  },
  {
    name: "KMA Online",
    url: "https://www.kma-online.de/rss/",
    trust_level: "media",
  },
], "Gesundheit").catch((err) => {
  console.error("[Scout:Gesundheit] Fatal:", err);
  process.exit(1);
});
