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
  {
    name: "LTO — Legal Tribune Online",
    url: "https://www.lto.de/feed/",
    trust_level: "media",
  },
  {
    name: "Compliance-Magazin",
    url: "https://www.compliance-magazin.de/feed/",
    trust_level: "media",
  },
  {
    name: "Bundesrat — Aktuelles",
    url: "https://www.bundesrat.de/DE/service/rss/aktuelles/aktuelles_node.xml",
    trust_level: "official",
  },
  {
    name: "EUR-Lex — Neue Rechtsakte",
    url: "https://eur-lex.europa.eu/rss/news.xml",
    trust_level: "official",
  },
], "Recht & Compliance").catch((err) => {
  console.error("[Scout:Recht] Fatal:", err);
  process.exit(1);
});
