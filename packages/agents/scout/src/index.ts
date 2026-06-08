import { runScout } from "./runner.js";

const INDUSTRY_ID = 1; // Energie & Erneuerbare

runScout(INDUSTRY_ID, [
  { name: "PV Magazine",       url: "https://www.pv-magazine.de/feed/",            trust_level: "media" },
  { name: "Solarserver",       url: "https://www.solarserver.de/feed/",            trust_level: "media" },
  { name: "Clean Energy Wire", url: "https://www.cleanenergywire.org/rss.xml",    trust_level: "media" },
  {
    name: "BNetzA — Pressemitteilungen",
    url: "https://www.bundesnetzagentur.de/SiteGlobals/Functions/RSSFeed/DE/Presse/RSSNewsfeed_Presse.xml",
    trust_level: "official",
  },
  {
    name: "BMWK — Pressemitteilungen",
    url: "https://www.bmwk.de/SiteGlobals/Functions/RSSFeed/DE/Presse/RSSNewsfeed_Presse.xml",
    trust_level: "official",
  },
], "Energie").catch((err) => {
  console.error("[Scout] Fatal:", err);
  process.exit(1);
});
