import { runScout } from "./runner.js";

const INDUSTRY_ID = 6; // Finanzen & Kapitalmarkt

runScout(INDUSTRY_ID, [
  {
    name: "Handelsblatt Finanzen",
    url: "https://www.handelsblatt.com/contentexport/feed/finanzen",
    trust_level: "media",
  },
  {
    name: "FAZ Finanzen",
    url: "https://www.faz.net/rss/aktuell/finanzen/",
    trust_level: "media",
  },
  {
    name: "FAZ Wirtschaft",
    url: "https://www.faz.net/rss/aktuell/wirtschaft/",
    trust_level: "media",
  },
  {
    name: "EZB Pressemitteilungen",
    url: "https://www.ecb.europa.eu/rss/press.html",
    trust_level: "official",
  },
  {
    name: "BaFin — Aktuelles",
    url: "https://www.bafin.de/SiteGlobals/Functions/RSSFeed/DE/RSSNewsfeed_Aktuelles.xml",
    trust_level: "official",
  },
  {
    name: "Deutsche Bundesbank — Pressemitteilungen",
    url: "https://www.bundesbank.de/dynamic/action/de/rss/presse/798808/rss.xml",
    trust_level: "official",
  },
], "Finanzen").catch((err) => {
  console.error("[Scout:Finanzen] Fatal:", err);
  process.exit(1);
});
