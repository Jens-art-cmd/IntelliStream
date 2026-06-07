import { runScout } from "./runner.js";

const INDUSTRY_ID = 8; // Automotive & Mobilität

runScout(INDUSTRY_ID, [
  {
    name: "ACEA (European Automobile Manufacturers)",
    url: "https://www.acea.auto/feed/",
    trust_level: "official",
  },
  {
    name: "Automobilwoche",
    url: "https://www.automobilwoche.de/rss",
    trust_level: "media",
  },
  {
    name: "electrive.net",
    url: "https://www.electrive.net/feed/",
    trust_level: "media",
  },
], "Automotive").catch((err) => {
  console.error("[Scout:Automotive] Fatal:", err);
  process.exit(1);
});
