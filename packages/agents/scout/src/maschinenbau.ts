import { runScout } from "./runner.js";

/**
 * Maschinenbau & Industrie 4.0 — Scout
 *
 * Zielgruppe: Maschinenbau-CEOs und Produktionsleiter, Automatisierungsingenieure,
 *   Einkaufsleiter (Rohstoffe/Komponenten), Investoren (Industrieaktien),
 *   Verbandsmitglieder VDMA, Betriebsräte Industrieunternehmen
 *
 * Relevanzkriterien:
 *   ✔ VDMA-Konjunkturdaten: Auftragseingänge, Produktionsindex, Exportquoten
 *   ✔ Automatisierung & Robotik: neue Cobots, AMR, Automatisierungsinvestitionen
 *   ✔ Industrie 4.0: IIoT, OPC-UA, digitaler Zwilling, KI in der Fertigung
 *   ✔ Rohstoffe & Lieferkette: Stahl-/Aluminiumpreise, Seltene-Erden-Verfügbarkeit
 *   ✔ Regulatorik: EU-Maschinenverordnung, CE-Kennzeichnung, Produkthaftung
 *   ✔ Energie & Effizienz: Industriestrompreise, Dekarbonisierungsprogramme
 *   ✗ Allgemeine Technologienachrichten ohne Fertigungsbezug
 *   ✗ Konsumentengüter, Handwerk
 */

const INDUSTRY_ID = 10; // Maschinenbau & Industrie 4.0

runScout(INDUSTRY_ID, [
  {
    name: "VDMA — Pressemitteilungen",
    url: "https://www.vdma.org/rss",
    trust_level: "official",
  },
  {
    name: "Destatis — Produzierendes Gewerbe",
    url: "https://www.destatis.de/DE/Presse/Pressemitteilungen/RSS/_rss_produzierendes-gewerbe.xml",
    trust_level: "official",
  },
  {
    name: "BMBF — Forschung & Innovation",
    url: "https://www.bmbf.de/SiteGlobals/BMBF/RSSFeeds/RSS_Meldungen/RSS_Meldungen.xml",
    trust_level: "official",
  },
  {
    name: "Plattform Industrie 4.0",
    url: "https://www.plattform-i40.de/IP/Navigation/DE/Aktuelles/Presse/RSS/rss.xml",
    trust_level: "official",
  },
  {
    name: "Maschinenmarkt",
    url: "https://www.maschinenmarkt.vogel.de/rss/news.xml",
    trust_level: "media",
  },
  {
    name: "Produktion — Fertigung & Industrie",
    url: "https://www.produktion.de/feed/",
    trust_level: "media",
  },
  {
    name: "Automationspraxis",
    url: "https://automationspraxis.industrie.de/feed/",
    trust_level: "media",
  },
], "Maschinenbau").catch((err) => {
  console.error("[Scout:Maschinenbau] Fatal:", err);
  process.exit(1);
});
