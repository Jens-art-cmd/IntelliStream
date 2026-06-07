import { runScout } from "./runner.js";

const INDUSTRY_ID = 3; // Recht & Compliance

runScout(INDUSTRY_ID, [
  {
    name: "Bundesrat RSS",
    url: "https://www.bundesrat.de/SiteGlobals/Forms/RSS/rss.html",
    trust_level: "official",
  },
  {
    name: "EuGH Pressemitteilungen",
    url: "https://curia.europa.eu/rss/rss.xml",
    trust_level: "official",
  },
  {
    name: "Beck aktuell (NJW)",
    url: "https://rsw.beck.de/rss/rss.aspx?feed=NJW",
    trust_level: "media",
  },
  {
    name: "Legal Tribune Online",
    url: "https://www.lto.de/rss/",
    trust_level: "media",
  },
], "Recht").catch((err) => {
  console.error("[Scout:Recht] Fatal:", err);
  process.exit(1);
});
