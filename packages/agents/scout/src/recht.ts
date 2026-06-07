import { runScout } from "./runner.js";

const INDUSTRY_ID = 3; // Recht & Compliance

runScout(INDUSTRY_ID, [
  {
    name: "DSGVO-Gesetz.de",
    url: "https://dsgvo-gesetz.de/feed/",
    trust_level: "official",
  },
  {
    name: "Datenschutz-Notizen",
    url: "https://www.datenschutz-notizen.de/feed/",
    trust_level: "media",
  },
  {
    name: "Datenschutzbeauftragter Info",
    url: "https://www.datenschutzbeauftragter-info.de/feed/",
    trust_level: "media",
  },
  {
    name: "JUVE Rechtsmarkt",
    url: "https://www.juve.de/feed",
    trust_level: "media",
  },
  {
    name: "Datenschutz-Praxis",
    url: "https://www.datenschutz-praxis.de/feed/",
    trust_level: "media",
  },
], "Recht & Compliance").catch((err) => {
  console.error("[Scout:Recht] Fatal:", err);
  process.exit(1);
});
