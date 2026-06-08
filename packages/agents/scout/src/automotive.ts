import { runScout } from "./runner.js";

const INDUSTRY_ID = 8; // Automotive & Mobilität

runScout(INDUSTRY_ID, [
  {
    name: "ACEA (European Automobile Manufacturers)",
    url: "https://www.acea.auto/rss/",
    trust_level: "official",
  },
  {
    name: "Automobilwoche",
    url: "https://feeds.feedburner.com/automobilwoche",
    trust_level: "media",
  },
  {
    name: "electrive.net",
    url: "https://www.electrive.net/feed/",
    trust_level: "media",
  },
  {
    name: "VDA — Pressemitteilungen",
    url: "https://www.vda.de/de/presse/Pressemitteilungen.rss",
    trust_level: "official",
  },
  {
    name: "KBA — Pressemitteilungen",
    url: "https://www.kba.de/SharedDocs/RSS/DE/presse_news.xml",
    trust_level: "official",
  },
], "Automotive").catch((err) => {
  console.error("[Scout:Automotive] Fatal:", err);
  process.exit(1);
});
