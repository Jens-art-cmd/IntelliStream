import { runScout } from "./runner.js";

/**
 * IT & Cybersecurity — Scout
 *
 * Zielgruppe: CISOs, IT-Sicherheitsverantwortliche, SOC-Analysten, IT-Leiter,
 *   NIS2/DORA/ISO-27001-Compliance-Beauftragte, Security-Architekten,
 *   Datenschutzbeauftragte (technisch)
 *
 * Relevanzkriterien:
 *   ✔ Aktive Bedrohungslagen, CVEs, Zero-Days
 *   ✔ Behörden-Warnungen & -Handlungsempfehlungen (BSI, ENISA, CERT)
 *   ✔ Regulatorik: NIS2, DORA, DSGVO, CRA — Fristen & Umsetzungspflichten
 *   ✔ Sicherheitsvorfälle bei Unternehmen/Infrastruktur
 *   ✔ Technologie-Entscheidungen: SIEM, Zero Trust, Cloud-Security
 *   ✗ Consumer-Elektronik, Gaming, allgemeine Tech-Trends, TV-Deals
 */

const INDUSTRY_ID = 4; // IT & Cybersecurity

runScout(INDUSTRY_ID, [
  {
    name: "Heise Security",
    url: "https://heise.de/security/rss/news-atom.xml",
    trust_level: "media",
  },
  {
    name: "The Hacker News",
    url: "https://feeds.feedburner.com/TheHackersNews",
    trust_level: "media",
  },
  {
    name: "Infopoint Security",
    url: "https://www.infopoint-security.de/rss/",
    trust_level: "media",
  },
  {
    name: "BSI — Cybersicherheitswarnungen",
    url: "https://www.bsi.bund.de/SiteGlobals/Functions/RSSFeed/RSSNewsfeed/RSS_Cybersicherheitswarnungen.xml",
    trust_level: "official",
  },
  {
    name: "BSI — Pressemitteilungen",
    url: "https://www.bsi.bund.de/SiteGlobals/Functions/RSSFeed/RSSNewsfeed/RSS_Pressemitteilungen.xml",
    trust_level: "official",
  },
  { name: "Security Insider",   url: "https://www.security-insider.de/feed/",         trust_level: "media" },
  { name: "CIO.de",             url: "https://www.cio.de/feed/news/",                  trust_level: "media" },
  { name: "Computerwoche",      url: "https://www.computerwoche.de/feed/news/",        trust_level: "media" },
  { name: "Bleeping Computer",  url: "https://www.bleepingcomputer.com/feed/",         trust_level: "media" },
], "IT & Cybersecurity").catch((err) => {
  console.error("[Scout:IT] Fatal:", err);
  process.exit(1);
});
