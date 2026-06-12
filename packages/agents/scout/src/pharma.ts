import { runScout } from "./runner.js";

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

runScout(INDUSTRY_ID, [
  {
    name: "EMA — Pressemitteilungen",
    url: "https://www.ema.europa.eu/en/rss-feeds/ema-news-rss-feed.xml",
    trust_level: "official",
  },
  {
    name: "BfArM — Meldungen",
    url: "https://www.bfarm.de/SiteGlobals/Functions/RSSFeed/RSSNewsfeed/RSSNewsfeed.xml",
    trust_level: "official",
  },
  {
    name: "G-BA — Beschlüsse",
    url: "https://www.g-ba.de/service/rss/",
    trust_level: "official",
  },
  {
    name: "IQWiG — Nutzenbewertungen",
    url: "https://www.iqwig.de/rss/",
    trust_level: "official",
  },
  {
    name: "Pharmazeutische Zeitung",
    url: "https://www.pharmazeutische-zeitung.de/feed/",
    trust_level: "media",
  },
  {
    name: "FiercePharma",
    url: "https://www.fiercepharma.com/rss/xml",
    trust_level: "media",
  },
  {
    name: "Ärzteblatt — Arzneimittel",
    url: "https://www.aerzteblatt.de/rss/nachrichten.xml",
    trust_level: "media",
  },
], "Pharma").catch((err) => {
  console.error("[Scout:Pharma] Fatal:", err);
  process.exit(1);
});
