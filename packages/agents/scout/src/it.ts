import { runScout } from "./runner.js";

const INDUSTRY_ID = 4; // IT & Cybersecurity

runScout(INDUSTRY_ID, [
  {
    name: "Heise Security",
    url: "https://heise.de/security/rss/news-atom.xml",
    trust_level: "media",
  },
  {
    name: "Heise Online",
    url: "https://www.heise.de/rss/heise-atom.xml",
    trust_level: "media",
  },
  {
    name: "The Hacker News",
    url: "https://feeds.feedburner.com/TheHackersNews",
    trust_level: "media",
  },
  {
    name: "Golem.de",
    url: "https://rss.golem.de/rss.php?feed=RSS2.0",
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
], "IT & Cybersecurity").catch((err) => {
  console.error("[Scout:IT] Fatal:", err);
  process.exit(1);
});
