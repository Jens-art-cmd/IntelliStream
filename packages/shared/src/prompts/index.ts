// All Claude API prompts as typed constants.
// Centralised here so every agent uses identical, versioned prompts.
//
// COST POLICY: max. 1 Claude API call per article.
// Summarising + scoring + tagging are combined in a single prompt (COMBINED_PROMPT).
// The old separate SUMMARIZER_* and PROCESSOR_* prompts are kept for reference only.

// ─── COMBINED prompt: Summary + Score + Tags in einem einzigen API-Call ────────
// Spart ~50% API-Kosten gegenüber zwei separaten Calls.

export const COMBINED_SYSTEM_PROMPT = `Du bist ein präziser Fachjournalist und Klassifikations-Experte für professionelle Brancheninformationen.
Du fasst Artikel zusammen UND bewertest ihre Relevanz in einem einzigen Schritt.

Regeln Zusammenfassung:
- Sachlich, präzise, keine Übertreibungen
- Fachbegriffe beibehalten (EEG, DSGVO, MDR etc.)
- Kein generisches Füllwort ("In diesem Artikel...", "Es ist wichtig...")
- Deutsch, professioneller Ton

Regeln Scoring:
- Bewerte streng aus Sicht eines Entscheiders / Compliance-Verantwortlichen der jeweiligen Branche
- Relevanz-Score 0–100: 90–100 = unmittelbar handlungsrelevant · 70–89 = wichtig · 50–69 = interessant · 30–49 = Hintergrund · 0–29 = kaum relevant`;

export const COMBINED_USER_PROMPT = (
  title: string,
  content: string,
  industry: string,
  impactCriteria: string,
  tagsTaxonomy: Record<string, string[]>,
) => `Verarbeite diesen Artikel aus dem Bereich "${industry}" in einem Schritt:

TITEL: ${title}

INHALT:
${content.slice(0, 5000)}

${impactCriteria}

VERFÜGBARE TAGS (nur aus dieser Liste wählen):
${JSON.stringify(tagsTaxonomy, null, 2)}

Antworte NUR mit diesem JSON-Format (kein Markdown):
{
  "summary_short":  "Ein präziser Satz (max. 120 Zeichen) für Push-Benachrichtigungen",
  "summary_medium": "Drei Sätze (max. 400 Zeichen) — Was, Warum relevant, Was tun",
  "summary_long":   "Vollständige Zusammenfassung (max. 800 Zeichen) mit Kontext, Auswirkungen und Handlungsempfehlung",
  "relevance_score": <Zahl 0–100>,
  "impact_level":   "<high|medium|low>",
  "impact_reason":  "<Ein Satz warum dieser Impact-Level, max. 150 Zeichen>",
  "tags":           ["<tag1>", "<tag2>", "<tag3>"],
  "is_breaking":    <true|false>
}`;

// ─── Legacy: separate Summarizer-Prompt (nicht mehr verwendet) ─────────────────

export const SUMMARIZER_SYSTEM_PROMPT = `Du bist ein präziser Fachjournalist für professionelle Brancheninformationen.
Deine Aufgabe ist es, Artikel für Entscheider und Fachleute zusammenzufassen.

Regeln:
- Sachlich, präzise, keine Übertreibungen
- Fachbegriffe beibehalten (EEG, DSGVO, MDR etc.)
- Datum und Quelle relevant einbeziehen wenn vorhanden
- Kein generisches Füllwort ("In diesem Artikel...", "Es ist wichtig...")
- Deutsch, professioneller Ton`;

export const SUMMARIZER_USER_PROMPT = (
  title: string,
  content: string,
  industry: string,
) => `Erstelle drei Zusammenfassungen für diesen Artikel aus dem Bereich "${industry}":

TITEL: ${title}

INHALT:
${content.slice(0, 6000)}

Antworte NUR mit diesem JSON-Format (kein Markdown drumherum):
{
  "summary_short": "Ein präziser Satz (max. 120 Zeichen) für Push-Benachrichtigungen",
  "summary_medium": "Drei Sätze (max. 400 Zeichen) für das Dashboard — Was, Warum relevant, Was tun",
  "summary_long": "Vollständige Zusammenfassung (max. 800 Zeichen) mit Kontext, Auswirkungen und Handlungsempfehlung"
}`;

// ─── Legacy: separater Relevance-Scorer (nicht mehr verwendet) ─────────────────

// Branchenspezifische Impact-Kriterien.
// WICHTIG: Beim Implementieren einer neuen Branche hier einen Eintrag hinzufügen.
// Der Schlüssel muss exakt dem `name`-Feld in der industries-Tabelle entsprechen.
export const INDUSTRY_IMPACT_CRITERIA: Record<string, { high: string; medium: string; low: string }> = {
  "Energie & Erneuerbare": {
    high: "Gesetzesänderung in Kraft (EEG/KWKG/EnWG/GEG), neue BNetzA-Entscheidung mit Sofortwirkung, EPEX-Preisextrem (>±30% in 24h), kurzfristige Friständerung bei BAFA/KfW-Förderung, EU-Notfallverordnung Energie, Netzabschaltungsrisiko",
    medium: "Bundestag/Bundesrat-Beschluss noch nicht in Kraft, BNetzA-Konsultation mit laufender Frist, EEG-Ausschreibungsergebnisse, neue Förderrichtlinie angekündigt, Strompreiswarnung Behörde, BMWK-Positionspapier",
    low: "Allgemeiner Energiemarktbericht, internationale Trends ohne direkte DE/EU-Relevanz, Branchenstatistiken, Technologie-Updates ohne Regulierungsbezug, Meinungsbeiträge",
  },
  "Finanzen & Kapitalmarkt": {
    high: "EZB-Zinsentscheid oder außerordentliche geldpolitische Maßnahme, BaFin-Rundschreiben/Allgemeinverfügung mit Umsetzungsfrist, neue MiFID/EMIR/DORA-Pflicht in Kraft, Handelsaussetzung oder Systemereignis, Sanktion gegen systemrelevantes Institut, Staatsanleihen-Downgrade Eurozone",
    medium: "EZB/Bundesbank-Monatsbericht mit Prognoseänderung, BaFin-Konsultation mit offener Frist, M&A-Transaktion >500 Mio. €, Ratingänderung systemrelevanter Institute, neue ESMA-Leitlinien zur Konsultation, Quartalsberichte DAX-Konzerne mit starker Abweichung",
    low: "Allgemeine Marktkommentare, Analysteneinschätzungen ohne Regulierungsbezug, IPO-Ankündigungen, internationale Wirtschaftsnews ohne direkte Kapitalmarktauswirkung, Unternehmensporträts",
  },
  "ESG & Nachhaltigkeit": {
    high: "CSRD/ESRS in Kraft oder Frist läuft ab, EU-Taxonomie-Delegierter Rechtsakt verabschiedet, SFDR-Änderung mit Meldepflicht, ETS-Preisschock >±20%, Greenwashing-Sanktion mit Signalwirkung",
    medium: "EFRAG-Konsultation zu neuem ESRS-Standard, EU-Kommission-Entwurf zu Taxonomie-Erweiterung, Corporate Sustainability Report eines DAX-Konzerns, CO2-Markt Quartalsbericht, neue SBTi-Methodik",
    low: "Allgemeine ESG-Ratings, internationale Nachhaltigkeitsinitiativen ohne EU-Bezug, Nachhaltigkeitsberichte ohne regulatorische Relevanz, Branchenstatistiken",
  },
  "Recht & Compliance": {
    high: "BGH/BFH/EuGH-Urteil mit unmittelbarer Praxiswirkung, neues Gesetz in Kraft (DSGVO, LkSG, GwG), Bußgeld-Leitentscheidung, Vollzugsschreiben Finanzbehörde, DSGVO-Bußgeld >1 Mio. €",
    medium: "Referentenentwurf in Ressortabstimmung, Bundesrat-Empfehlung, OLG/LAG-Urteil mit Pilotcharakter, BZSt-Schreiben, Datenschutzbehörde-Leitfaden neu",
    low: "Rechtsprechungsübersichten, Meinungsartikel, internationale Rechtsentwicklungen ohne DE-Bezug, Veranstaltungshinweise",
  },
  "IT & Cybersecurity": {
    high: "BSI-Kritische Schwachstelle CVSS ≥9.0 mit aktiver Ausnutzung, NIS2/DORA-Pflicht in Kraft, CERT-Bund-Warnung kritische Infrastruktur, Zero-Day in weit verbreiteter Software, Ransomware-Angriff auf kritische Infrastruktur",
    medium: "BSI-Sicherheitshinweis CVSS 7–8.9, CRA/AI-Act Konsultation mit Frist, Patch-Day kritische Hersteller (Microsoft, Cisco, SAP), Datenpanne >10.000 Betroffene, neue BSI-Grundschutz-Bausteine",
    low: "Allgemeine Security-Trends, Technologieberichte ohne Schwachstellenbezug, Marktforschung, internationale Cybersecurity-News ohne direkte DE-Relevanz",
  },
  "Pharma & Life Science": {
    high: "EMA/BfArM-Zulassung oder -Widerruf, AMNOG-Beschluss G-BA, FDA-Approval oder Complete-Response-Letter, Rückruf Arzneimittel Risikoklasse A, AMG-Änderung mit Sofortwirkung",
    medium: "EMA-Leitlinie in Konsultation, Phase-III-Ergebnis eines Blockbusters, IQVIA-Marktbericht, GKV-Erstattungsverhandlung abgeschlossen, neue GMP-Anforderungen angekündigt",
    low: "Vorklinische Studienergebnisse, Kongressberichte, internationale Marktdaten ohne EU-Bezug, Unternehmensporträts",
  },
  "Bau & Immobilien": {
    high: "GEG-Änderung in Kraft, VOB-Novelle verabschiedet, KfW-Förderstopp oder Programmänderung mit Sofortwirkung, Bundesverwaltungsgericht-Urteil Baurecht, EU-Gebäuderichtlinie EPBD in Kraft",
    medium: "Referentenentwurf GEG/BauGB, neue DIN-Normen verabschiedet, KfW-Konditionen-Anpassung, Destatis-Baukostenbericht mit starker Abweichung, Großausschreibung >50 Mio. €",
    low: "Allgemeine Immobilienmarktberichte, regionale Preisindizes, Branchenstatistiken, Architekturpreise",
  },
  "Automotive & Mobilität": {
    high: "EU-Flottengrenzwert in Kraft, Euro-7-Typgenehmigung geändert, KBA-Rückruf >100.000 Fahrzeuge, OEM-Insolvenz oder Produktionsstopp, CO2-Strafzahlung EU-Kommission verhängt",
    medium: "KBA-Monatszulassungen mit >10% Abweichung, ACEA-Positionspapier zu neuer Regulierung, OEM-Quartalsbericht mit Gewinnwarnung, neue Ladesäulen-Förderrichtlinie, EU-Konsultation Fahrzeugsicherheit",
    low: "Allgemeine Mobilitätstrends, neue Modellvorstellungen, internationale Zulassungsstatistiken, Technologiestudien",
  },
  "Gesundheit & MedTech": {
    high: "G-BA-Beschluss mit Erstattungsauswirkung, MDR/IVDR-Frist abgelaufen oder geändert, DiGA-Neuzulassung oder -Streichung, Krankenhausreformgesetz in Kraft, BSG-Grundsatzurteil SGB V",
    medium: "G-BA-Konsultationsverfahren mit Frist, neue DiGA-Anforderungen BfArM, GKV-Finanzberichte mit Defizit, Pflegereform-Entwurf Ressortabstimmung, RKI-Lagebericht mit neuer Handlungsempfehlung",
    low: "Allgemeine Gesundheitspolitik-Berichte, internationale MedTech-Trends, Kongressberichte, Unternehmensporträts",
  },
  "Maschinenbau & Industrie 4.0": {
    high: "VDMA-Auftragseingang >±15% (Monat), neue Maschinenverordnung EU in Kraft, Exportkontrolle/Embargo mit Sofortwirkung, kritischer Rohstoff-Lieferstopp, Cyber-Angriff auf Produktionsanlage KRITIS",
    medium: "VDMA-Quartalsbericht, neue OPC-UA-Spezifikation verabschiedet, BMBF-Förderprogramm Industrie 4.0 geöffnet, Destatis-Produktionsindex mit starker Abweichung, neue CE-Konformitätsanforderungen",
    low: "Technologiestudien, Messepreviews, internationale Industrieberichte ohne DE-Bezug, Unternehmensporträts",
  },
  "HR & Arbeitsmarkt": {
    high: "BAG-Grundsatzurteil mit unmittelbarer Praxiswirkung, Mindestlohn-Anpassung beschlossen, Arbeitszeitgesetz-Änderung, Tarifabschluss Pilotbranche, Kurzarbeiter-Regelung geändert",
    medium: "Bundesagentur-Monatsbericht Arbeitsmarkt, neuer Tarifvertrag in Verhandlung, Arbeitsgericht-Urteil mit Signalwirkung, BAG-Anhängiges Verfahren Terminankündigung, Entgelttransparenz-Bericht",
    low: "Allgemeine HR-Trends, Employer-Branding-Studien, internationale Arbeitsmarktberichte, Personalmanagement-Tipps",
  },
  "Agrar & Lebensmittel": {
    high: "GAP-Direktzahlung geändert, Novel-Food-Zulassung/Ablehnung, MATIF-Preisschock >±10% (Woche), Pestizid-Wirkstoff-Verbot EU, Ernteschätzung USDA/FAO mit extremer Abweichung",
    medium: "BMEL-Agrarbericht, neue Ökolandbau-Förderrichtlinie, LEH-Verhandlungsergebnis Lieferanten, EU-Konsultation Farm-to-Fork, Lebensmittelrückruf Klasse II",
    low: "Allgemeine Agrarmarktberichte, internationale Erntevorhersagen, Unternehmensporträts, Messepreviews",
  },
  "Logistik & Transport": {
    high: "LkSG-Bußgeld Leitfall, ADR-Änderung in Kraft, Mautgesetz-Änderung mit Sofortwirkung, Baltic-Dry-Index-Extremwert, Streik Hauptverkehrsträger (Bahn/Hafen)",
    medium: "BGL-Kostenstrukturerhebung, neue CO2-LKW-Mautklasse, EU-Verordnung Lieferkette in Konsultation, Frachtpreisindex quartalsweise, Zollvorschriftenänderung DE",
    low: "Allgemeine Logistikmarktberichte, internationale Handelsstatistiken, Technologiestudien Last-Mile, Messepreviews",
  },
  "Versicherung & Risiko": {
    high: "BaFin-Allgemeinverfügung Versicherung, Solvency-II-Änderung in Kraft, DORA-Umsetzungsfrist, Naturkatastrophe mit Schadensschätzung >1 Mrd. €, EIOPA-Krisenmaßnahme",
    medium: "BaFin-Rundschreiben Versicherungsaufsicht, GDV-Jahresbericht mit Prämienentwicklung, EIOPA-Konsultation Solvency II, neue Cyber-Versicherungsbedingungen Marktstandard, IDD-Auslegungshinweis",
    low: "Allgemeine Versicherungsmarktberichte, InsurTech-News ohne Regulierungsbezug, internationale Risikoberichte, Unternehmensporträts",
  },
  "Chemie & Materialien": {
    high: "REACH-Beschränkung in Kraft, PFAS-Regulierung verabschiedet, ECHA-Kandidatenliste erweitert, Chemieanlage-Störfall KRITIS, Rohstoff-Exportverbot (Seltene Erden)",
    medium: "ECHA-Konsultation mit Frist, VCI-Quartalsbericht, neue CLP-Einstufung verabschiedet, Rohstoffpreisextrem Naphtha/Ethylen, Biozid-Wirkstoff-Prüfung eingeleitet",
    low: "Allgemeine Chemie-Marktberichte, Technologiestudien, internationale Rohstoffprognosen, Unternehmensporträts",
  },
  "E-Commerce & Retail": {
    high: "DSA/DMA-Vollzugsentscheidung mit Bußgeld, Plattformpflicht Amazon/Zalando in Kraft, GPSR-Frist läuft ab, Verbraucherrechte-BGH-Urteil mit Massenwirkung, PAngV-Änderung sofort wirksam",
    medium: "EU-Kommission DSA-Konsultation, GS1-Produktdatenstandard Änderung, EHI-Marktreport, große Plattform-AGB-Änderung mit Auswirkung auf Händler, Retourenrecht-Urteil OLG",
    low: "Allgemeine E-Commerce-Trends, internationale Marktforschung, Technologiestudien, Unternehmensporträts",
  },
  "Smart City & Kommunen": {
    high: "OZG-Frist geändert, KfW-Smart-City-Förderprogramm geöffnet/geschlossen, Kommunalrecht-Änderung (Länderebene), Cybersicherheitsvorfall Kommunalverwaltung, ÖPNV-Gesetz Änderung",
    medium: "BMBF-Förderprogramm neue Runde, Smart-City-Charta Aktualisierung, BMI-Digitalisierungsbericht, kommunale Ausschreibung >10 Mio. €, OZG-Umsetzungsstand Bundesbericht",
    low: "Allgemeine Digitalisierungsberichte, internationale Smart-City-Studien, Pilotprojekte ohne Skalierungsrelevanz, Unternehmensporträts",
  },
  "Bildung & EdTech": {
    high: "BAföG-Änderung in Kraft, KMK-Beschluss mit bundesweiter Wirkung, DigitalPakt-Frist oder Mittelabruf, Datenschutzbeschluss Schulplattform (LDA), PISA-Ergebnis veröffentlicht",
    medium: "BMBF-Förderprogramm geöffnet, HRK-Positionspapier KI in der Hochschule, neue Hochschulzulassungsordnung (Bundesland), Bildungsstandards KMK in Konsultation, Micro-Credentials EU-Empfehlung",
    low: "Allgemeine EdTech-Trends, internationale Bildungsvergleiche, Unternehmensporträts, Kongressberichte",
  },
  "Maritime & Schifffahrt": {
    high: "IMO-Regulierung in Kraft (CII/EEXI), ETS-Schifffahrt Pflicht geändert, Hafensperrung Haupthandelsroute, Bunkerpreisextrem >±15% (Woche), Schwefelgrenzwert-Vollzugsentscheidung",
    medium: "IMO-Konsultation neue Umweltregulierung, HPA-Hafengebührenänderung, Baltic-Dry-Index Quartalsauswertung, LNG-Bunkerverfügbarkeit Nordsee, Klassifizierungsgesellschaft neue Anforderung",
    low: "Allgemeine Schifffahrtsmarktberichte, internationale Häfen-Rankings, Technologiestudien Green Shipping, Unternehmensporträts",
  },
  "Gaming & Entertainment": {
    high: "USK-Einstufungsänderung mit Marktrückruf, Jugendschutzgesetz-Änderung in Kraft, Plattform-Loot-Box-Verbot EU, Urheberrechts-EuGH-Urteil mit Plattformwirkung, game-Förderung Programmänderung",
    medium: "USK-Leitentscheidung neue Kategorie, EU-DSA-Vollzug gegen Gaming-Plattform, GEZ/ARD-Beitrag Änderung Streaming, neue IFPI-Lizenzierungsregeln, KJM-Beschluss",
    low: "Spielrelease-Berichte, eSports-Turniere, internationale Marktdaten, Unternehmensporträts, Branchenkonferenzen",
  },
  "EU-Regulatorik & Gesetzgebung": {
    high: "Neue EU-Verordnung im Amtsblatt (L-Serie) in Kraft getreten, Trilog-Einigung zu AI Act/Data Act/DMA/DSA oder ähnlichem mit unmittelbarer Unternehmenswirkung, EuGH-Grundsatzurteil mit Querschnittswirkung, EU-Kommission Vertragsverletzungsverfahren gegen DE mit Frist, Notfallverordnung EU-Rat",
    medium: "EU-Kommission Legislativvorschlag veröffentlicht, EP-Ausschuss nimmt Position an, EU-Rat allgemeine Ausrichtung beschlossen, Konsultationsfrist läuft ab (<4 Wochen), Delegierter Rechtsakt zur Konsultation freigegeben, EuGH-Schlussanträge zu wichtigem Verfahren",
    low: "Fortschrittsberichte laufender Gesetzgebungsverfahren, allgemeine EU-Politikberichte ohne unmittelbaren Gesetzgebungsbezug, Personaländerungen in EU-Institutionen, internationale Abkommen ohne DE-Sofortwirkung",
  },
};

function getImpactCriteria(industry: string): string {
  const criteria = INDUSTRY_IMPACT_CRITERIA[industry];
  if (criteria) {
    return `Impact-Level (branchenspezifisch für "${industry}"):
- high: ${criteria.high}
- medium: ${criteria.medium}
- low: ${criteria.low}`;
  }
  // Fallback für noch nicht konfigurierte Branchen
  return `Impact-Level:
- high: Sofortige Reaktion notwendig (neue Pflichten, Fristen, Bußgelder, Sofortmaßnahmen)
- medium: Sollte innerhalb der Woche beachtet werden (laufende Konsultationen, Ankündigungen)
- low: Für Überblick relevant, kein sofortiger Handlungsbedarf`;
}

export const PROCESSOR_SYSTEM_PROMPT = `Du bist ein Klassifikations-Experte für professionelle Fachinformationen.
Du bewertest Artikel nach Relevanz, weist Tags zu und bestimmst den Handlungsbedarf.

Relevanz-Score (0-100):
- 90-100: Unmittelbar handlungsrelevant (neues Gesetz, Breaking-Urteil, Marktereignis mit Sofortfolgen)
- 70-89: Wichtige Entwicklung, zeitnah lesen
- 50-69: Interessant, aber nicht dringend
- 30-49: Hintergrundinformation
- 0-29: Kaum relevant für Branchenprofis

Bewerte streng aus Sicht eines Entscheiders/Compliance-Verantwortlichen der jeweiligen Branche.`;

export const PROCESSOR_USER_PROMPT = (
  title: string,
  summary: string,
  industry: string,
  tagsTaxonomy: Record<string, string[]>,
) => `Bewerte diesen Artikel für Branchenprofis aus dem Bereich "${industry}":

TITEL: ${title}
ZUSAMMENFASSUNG: ${summary}

${getImpactCriteria(industry)}

VERFÜGBARE TAGS (nutze nur Tags aus dieser Liste):
${JSON.stringify(tagsTaxonomy, null, 2)}

Antworte NUR mit diesem JSON-Format:
{
  "relevance_score": <Zahl 0-100>,
  "impact_level": "<high|medium|low>",
  "impact_reason": "<Ein Satz warum dieser Impact-Level, max. 150 Zeichen>",
  "tags": ["<tag1>", "<tag2>", "<tag3>"],
  "is_breaking": <true|false>
}`;

// ─── Newsletter composer ───────────────────────────────────────────────────────

export const NEWSLETTER_SYSTEM_PROMPT = `Du bist ein erfahrener Newsletter-Redakteur für professionelle Brancheninformationen.
Erstelle prägnante, gut strukturierte Newsletter die Fachleuten echten Mehrwert bieten.

Format-Regeln:
- Klare Hierarchie: Wichtigstes zuerst
- Jeder Artikel: Titel + 1-Satz-Summary + Impact-Label + Link
- Kein Spam, keine leeren Phrasen
- Professionell aber lesbar`;

export const NEWSLETTER_SUBJECT_PROMPT = (
  industry: string,
  date: string,
  topArticleTitle: string,
  frequency: "daily" | "weekly",
) => frequency === "daily"
  ? `Erstelle 2 verschiedene Subject-Lines für den täglichen Newsletter:
Branche: ${industry}
Datum: ${date}
Top-Artikel: ${topArticleTitle}

Format: {"variant_a": "<Subject A>", "variant_b": "<Subject B>"}
Jede max. 60 Zeichen. Klar, konkret, kein Clickbait.`
  : `Erstelle 2 Subject-Lines für den Wochenrückblick:
Branche: ${industry}
Datum: ${date}
Top-Artikel: ${topArticleTitle}

Format: {"variant_a": "<Subject A>", "variant_b": "<Subject B>"}
Jede max. 60 Zeichen.`;

// ─── Trend detector ────────────────────────────────────────────────────────────

export const TREND_DETECTOR_PROMPT = (
  industry: string,
  tagFrequencies: Array<{ tag: string; count: number; delta_percent: number }>,
) => `Analysiere die Themen-Trends für die Branche "${industry}" der letzten 30 Tage:

TAG-HÄUFIGKEITEN (Tag, Anzahl Artikel, Veränderung zu Vorperiode):
${tagFrequencies.map(t => `- ${t.tag}: ${t.count}x (${t.delta_percent > 0 ? "+" : ""}${t.delta_percent}%)`).join("\n")}

Identifiziere:
1. Emerging Topics (stark steigend, noch nicht dominant)
2. Dominante Dauerthemen
3. Rückläufige Themen

Antworte NUR mit JSON:
{
  "emerging": [{"tag": "...", "reason": "..."}],
  "dominant": ["tag1", "tag2"],
  "declining": ["tag3"]
}`;
