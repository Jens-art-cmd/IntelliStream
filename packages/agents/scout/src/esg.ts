import { runScout } from "./runner.js";

/**
 * ESG & Nachhaltigkeit — Scout
 *
 * Zielgruppe: Nachhaltigkeitsbeauftragte, CSR-Manager, IR-Teams, Wirtschaftsprüfer,
 *   CFOs (CSRD-Pflicht), Compliance-Beauftragte, Asset Manager (ESG-Fonds),
 *   Investoren (Taxonomie-konforme Kapitalanlage)
 *
 * Relevanzkriterien:
 *   ✔ Regulatorik: CSRD, EU-Taxonomie, SFDR, ESRS — neue Delegierte Verordnungen
 *   ✔ Berichtspflichten: ESRS-Standards, GRI-Updates, TCFD-Anforderungen
 *   ✔ CO₂-Markt: EU-ETS-Preise, CBAM-Umsetzung, Cap-Anpassungen
 *   ✔ Kapitalmarkt: ESMA-Leitlinien zu ESG-Ratings, MiFID-ESG-Präferenzen, SFDR-RTS
 *   ✔ Science-Based Targets: SBTi-Validierungen, Net-Zero-Commitments großer Konzerne
 *   ✗ Allgemeine Klimanachrichten ohne Regulierungs-/Unternehmensbezug
 *   ✗ Konsumenten-Ratgeber (grüner Einkaufen etc.)
 */

const INDUSTRY_ID = 2; // ESG & Nachhaltigkeit

runScout(INDUSTRY_ID, [
  // ── Regulatorik EU ───────────────────────────────────────────────────────
  {
    name: "ESMA — ESG & Sustainable Finance",
    url: "https://www.esma.europa.eu/rss.xml",
    trust_level: "official",
  },
  {
    name: "EFRAG — Nachhaltigkeitsberichterstattung",
    url: "https://www.efrag.org/News/rss",
    trust_level: "official",
  },
  {
    name: "EU-Kommission — Sustainable Finance",
    url: "https://ec.europa.eu/newsroom/just/rss-news-items.cfm?newsletter_service_id=281",
    trust_level: "official",
  },
  {
    name: "EUR-Lex — ESG-Regulatorik",
    url: "https://eur-lex.europa.eu/rss/rss.xml",
    trust_level: "official",
  },
  {
    name: "Umweltbundesamt — Pressemitteilungen",
    url: "https://www.umweltbundesamt.de/service/presse/pressemitteilungen/rss.xml",
    trust_level: "official",
  },
  // ── Fachmedien ────────────────────────────────────────────────────────────
  {
    name: "ESG Today",
    url: "https://www.esgtoday.com/feed/",
    trust_level: "media",
  },
  {
    name: "Responsible Investor",
    url: "https://www.responsible-investor.com/feed/",
    trust_level: "media",
  },
  {
    name: "Handelsblatt — Nachhaltigkeit",
    url: "https://www.handelsblatt.com/contentexport/feed/nachhaltigkeit",
    trust_level: "media",
  },
], "ESG").catch((err) => {
  console.error("[Scout:ESG] Fatal:", err);
  process.exit(1);
});
