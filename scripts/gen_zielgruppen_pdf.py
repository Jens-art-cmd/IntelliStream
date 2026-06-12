#!/usr/bin/env python3
"""
Generiert IntelliStream_Zielgruppen.pdf mit allen 20 Branchen,
Zielgruppen-Definitionen und Relevanzkriterien.
"""

import fitz  # PyMuPDF
import os

OUTPUT = os.path.expanduser("~/Desktop/IntelliStream_Zielgruppen.pdf")

# ── Daten ─────────────────────────────────────────────────────────────────────

INDUSTRIES = [
    {
        "nr": 1,
        "name": "Energie & Erneuerbare",
        "zielgruppe": (
            "Energiewirtschafts-Manager, Netzoperatoren, EEG-Compliance-Verantwortliche, "
            "Investoren in Solar / Wind / Speicher, Stadtwerke-Führungskräfte, "
            "Energieberater, Projektentwickler Erneuerbare"
        ),
        "relevant": [
            "Regulatorik: EEG, EnWG, GEG, EU-Beihilferecht, RED III",
            "BNetzA-Entscheidungen: Netzausbau, Ausschreibungsergebnisse, Netzentgelte",
            "Förderprogramme BAFA / KfW — Öffnungen, Änderungen, Stopps",
            "Strommarkt: EPEX-Extrempreise, Kapazitätsmärkte, Marktkopplung",
            "Technologie: Speicher, Wasserstoff, Offshore-Wind, Agri-PV",
        ],
        "irrelevant": "Allgemeine Wirtschaftsberichte, Konsumthemen, internationale News ohne DE/EU-Bezug",
    },
    {
        "nr": 2,
        "name": "Finanzen & Kapitalmarkt",
        "zielgruppe": (
            "CFOs, Finanzvorstände, Treasury-Manager, Investment- & Portfolio-Manager, "
            "Compliance-Beauftragte in Banken / Versicherungen, M&A-Berater, "
            "Corporate-Finance-Teams, Wirtschaftsprüfer"
        ),
        "relevant": [
            "Geldpolitik: EZB-Entscheide, Zinspfad, Quantitative Tightening",
            "Regulatorik: MiFID II, Basel III/IV, DORA, EMIR — Fristen & Rundschreiben",
            "Aufsichtsbehörden: BaFin-Allgemeinverfügungen, ESMA-Leitlinien",
            "M&A-Transaktionen >500 Mio. €, Kapitalmaßnahmen DAX/MDAX",
            "Ratingänderungen systemrelevanter Institute / Staaten",
        ],
        "irrelevant": "Allgemeine Wirtschaftstipps, Konsumentenfinanzierung, Krypto-Hypes",
    },
    {
        "nr": 3,
        "name": "Recht & Compliance",
        "zielgruppe": (
            "Rechtsanwälte, General Counsel, Syndikusanwälte, Compliance-Beauftragte, "
            "Datenschutzbeauftragte, Regulatory-Affairs-Manager, Legal-Tech-Verantwortliche, "
            "Wirtschaftsprüfer (Compliance-Aspekte)"
        ),
        "relevant": [
            "Höchstgerichtliche Urteile: BGH, BFH, EuGH, BVerfG — Praxiswirkung",
            "Neue EU-Rechtsakte & nationale Umsetzungsgesetze (EUR-Lex, Bundesrat)",
            "DSGVO-Bußgelder >100.000 € & Leitentscheidungen der Datenschutzbehörden",
            "Compliance-Fristen: LkSG, GwG, CSRD, DORA",
            "Gesetzgebungsverfahren mit Auswirkung auf Unternehmenspraxis",
        ],
        "irrelevant": "Strafrecht Consumer-Ebene, Familienrecht, lokale OLG-Urteile ohne Leitwirkung",
    },
    {
        "nr": 4,
        "name": "IT & Cybersecurity",
        "zielgruppe": (
            "CISOs, IT-Sicherheitsverantwortliche, SOC-Analysten, IT-Leiter, "
            "NIS2/DORA/ISO-27001-Compliance-Beauftragte, Security-Architekten, "
            "Datenschutzbeauftragte (technisch)"
        ),
        "relevant": [
            "Aktive Bedrohungslagen, CVEs, Zero-Days",
            "Behörden-Warnungen & Handlungsempfehlungen (BSI, ENISA, CERT)",
            "Regulatorik: NIS2, DORA, DSGVO, CRA — Fristen & Umsetzungspflichten",
            "Sicherheitsvorfälle bei Unternehmen / kritischer Infrastruktur",
            "Technologie-Entscheidungen: SIEM, Zero Trust, Cloud-Security",
        ],
        "irrelevant": "Consumer-Elektronik, Gaming, allgemeine Tech-Trends, TV-Deals",
    },
    {
        "nr": 5,
        "name": "ESG & Nachhaltigkeit",
        "zielgruppe": (
            "CSO / Nachhaltigkeitsbeauftragte, ESG-Reporting-Verantwortliche, "
            "Investor-Relations-Manager, Fondsmanager mit ESG-Mandaten, "
            "Aufsichtsratsmitglieder, Sustainability-Consultants"
        ),
        "relevant": [
            "CSRD / ESRS-Fristen und Umsetzungspflichten",
            "EU-Taxonomie-Delegierte Rechtsakte",
            "SFDR-Änderungen mit Offenlegungspflichten",
            "CO₂-Markt (ETS): Preisschocks >±20 %",
            "Greenwashing-Sanktionen mit Signalwirkung",
        ],
        "irrelevant": "Allgemeine CSR-Berichte, internationale Initiativen ohne EU-Bezug",
    },
    {
        "nr": 6,
        "name": "Pharma & Life Science",
        "zielgruppe": (
            "Regulatory-Affairs-Manager, Zulassungsverantwortliche, Market-Access-Teams, "
            "Medical Affairs, Pharmaunternehmen-GF, Krankenhausapotheker (Großkliniken)"
        ),
        "relevant": [
            "EMA / BfArM-Zulassungen & Widerrufe",
            "AMNOG-Beschlüsse G-BA",
            "FDA-Approvals und Complete-Response-Letters",
            "Rückrufe Arzneimittel Risikoklasse A",
            "AMG-Änderungen, GMP-Anforderungen",
        ],
        "irrelevant": "Vorklinische Studienergebnisse, Kongressberichte, internationale Marktdaten ohne EU-Bezug",
    },
    {
        "nr": 7,
        "name": "Bau & Immobilien",
        "zielgruppe": (
            "Projektentwickler, Bauträger, Asset-Manager, Facility-Manager, "
            "Architekten (Planungsrecht), Bauleiter Großprojekte, Wohnungsunternehmen-Führungskräfte"
        ),
        "relevant": [
            "GEG-Änderungen und Umsetzungsfristen",
            "VOB-Novellen",
            "KfW-Förderstopps / -Programmänderungen mit Sofortwirkung",
            "EU-Gebäuderichtlinie EPBD",
            "BauGB-Novellen, BVerwG-Urteile Baurecht",
        ],
        "irrelevant": "Allgemeine Immobilienmarktberichte, regionale Preisindizes, Architekturpreise",
    },
    {
        "nr": 8,
        "name": "Automotive & Mobilität",
        "zielgruppe": (
            "Strategie- & Produktmanager bei OEMs und Tier-1-Zulieferern, Fleet-Manager, "
            "Mobilitätsdienstleister, Regulatory-Affairs-Verantwortliche, "
            "Einkaufsleiter (Halbleiter, Rohstoffe)"
        ),
        "relevant": [
            "EU-Flottenregulierung: CO₂-Grenzwerte 2025 / 2030 / 2035, Euro-7-Typgenehmigung",
            "KBA-Zulassungsstatistiken, Rückrufe >100.000 Fahrzeuge",
            "Elektromobilität: Ladenetz-Ausbau, Batterietechnologie, Förderrichtlinien",
            "Lieferketten: Halbleiterversorgung, Rohstoffpreise, Produktionsstopps",
            "OEM-Gewinnwarnungen, M&A, Restrukturierungen",
        ],
        "irrelevant": "Neue Modellvorstellungen (Consumer), Fahrberichte, Tuning",
    },
    {
        "nr": 9,
        "name": "Gesundheit & MedTech",
        "zielgruppe": (
            "Krankenhausgeschäftsführer, Medical-Device-Manager, DiGA-Hersteller, "
            "GKV-Vertragsexperten, Pflegedirektoren, Health-IT-Entscheider"
        ),
        "relevant": [
            "G-BA-Beschlüsse mit Erstattungswirkung",
            "MDR / IVDR-Fristen und Änderungen",
            "DiGA-Zulassungen und -Streichungen (BfArM)",
            "Krankenhausreformgesetz",
            "BSG-Grundsatzurteile SGB V",
        ],
        "irrelevant": "Allgemeine Gesundheitspolitik ohne Erstattungsrelevanz, internationale MedTech-Trends",
    },
    {
        "nr": 10,
        "name": "Maschinenbau & Industrie 4.0",
        "zielgruppe": (
            "Maschinenbau-Geschäftsführer, Produktionsleiter, OT-Security-Verantwortliche, "
            "Export- & Vertriebsleiter, Digitalisierungsbeauftragte (Industrie 4.0)"
        ),
        "relevant": [
            "VDMA-Auftragseingang >±15 % (Monat)",
            "Neue EU-Maschinenverordnung in Kraft",
            "Exportkontrolle / Embargos mit Sofortwirkung",
            "Kritische Rohstoff-Lieferstopps",
            "Cyber-Angriffe auf Produktionsanlagen (KRITIS)",
        ],
        "irrelevant": "Technologiestudien ohne DE-Bezug, Messepreviews, Unternehmensporträts",
    },
    {
        "nr": 11,
        "name": "HR & Arbeitsmarkt",
        "zielgruppe": (
            "CHROs, Personalleiter, Arbeitsrechtsanwälte, Betriebsräte (Führungsebene), "
            "Recruiting-Manager, Vergütungsexperten in Großunternehmen"
        ),
        "relevant": [
            "BAG-Grundsatzurteile mit unmittelbarer Praxiswirkung",
            "Mindestlohn-Anpassungen (Mindestlohnkommission)",
            "Arbeitszeitgesetz-Änderungen",
            "Pilottarifabschlüsse (Metall, ÖD, Chemie)",
            "Kurzarbeitsregeln und Förderbedingungen",
        ],
        "irrelevant": "Employer-Branding-Studien, internationale Arbeitsmarktberichte, HR-Trends-Artikel",
    },
    {
        "nr": 12,
        "name": "Agrar & Lebensmittel",
        "zielgruppe": (
            "Agrarbetriebe (Großbetriebe), Lebensmittelproduzenten, LEH-Einkaufsleiter, "
            "Agrarhandels-Manager, Zertifizierungsverantwortliche (Bio, QS, GlobalG.A.P.)"
        ),
        "relevant": [
            "GAP-Direktzahlungsänderungen",
            "Novel-Food-Zulassungen und -Ablehnungen (EU-Kommission)",
            "MATIF-Preisschocks >±10 % (Wochenbasis)",
            "EU-Pestizid-Wirkstoffverbote",
            "Lebensmittelrückrufe Risikoklasse A / B",
        ],
        "irrelevant": "Allgemeine Agrarmarktberichte, internationale Erntevorhersagen, Unternehmensporträts",
    },
    {
        "nr": 13,
        "name": "Logistik & Transport",
        "zielgruppe": (
            "Logistikleiter, Supply-Chain-Manager, Speditionsgeschäftsführer, "
            "Fleet-Manager (LKW / Schiene), Zoll- & Exportkontrollverantwortliche"
        ),
        "relevant": [
            "LkSG-Bußgelder (Leitfälle mit Signalwirkung)",
            "ADR-Änderungen (Gefahrguttransport)",
            "Mautgesetz-Änderungen mit Sofortwirkung",
            "Baltic-Dry-Index-Extremwerte",
            "Streiks bei Bahn / Häfen, Zollvorschriftenänderungen DE",
        ],
        "irrelevant": "Allgemeine Logistikmarktberichte, internationale Handelsstatistiken, Last-Mile-Studien",
    },
    {
        "nr": 14,
        "name": "Versicherung & Risiko",
        "zielgruppe": (
            "Versicherungsvorstände, Aktuare, Underwriting-Manager, "
            "Compliance-Beauftragte (Solvency II), Risk-Manager Industrieunternehmen, "
            "InsurTech-Führungskräfte"
        ),
        "relevant": [
            "BaFin-Allgemeinverfügungen Versicherungsaufsicht",
            "Solvency-II / DORA-Änderungen in Kraft",
            "EIOPA-Krisenmaßnahmen",
            "Naturkatastrophen-Schadensereignisse >1 Mrd. €",
            "Neue Cyber-Versicherungsbedingungen als Marktstandard",
        ],
        "irrelevant": "Allgemeine Versicherungsmarktberichte, InsurTech-Hypes ohne Regulierungsbezug",
    },
    {
        "nr": 15,
        "name": "Chemie & Materialien",
        "zielgruppe": (
            "Regulatory-Affairs-Manager Chemie, Produktsicherheitsverantwortliche, "
            "Einkaufsleiter Rohstoffe, HSE-Manager, Chemiepark-Betreiber"
        ),
        "relevant": [
            "REACH-Beschränkungen in Kraft",
            "PFAS-Regulierung (EU-Beschränkungsvorschlag / Beschluss)",
            "ECHA-Kandidatenliste erweitert",
            "CLP-Einstufungsänderungen",
            "Exportverbote Seltene Erden / kritische Rohstoffe",
        ],
        "irrelevant": "Allgemeine Chemie-Marktberichte, Technologiestudien, internationale Rohstoffprognosen",
    },
    {
        "nr": 16,
        "name": "E-Commerce & Retail",
        "zielgruppe": (
            "E-Commerce-Geschäftsführer, Marketplace-Manager (Amazon, Zalando), "
            "Rechtsabteilungen Online-Handel, Category-Manager Retail, "
            "Plattformbeauftragte (DSA / DMA)"
        ),
        "relevant": [
            "DSA / DMA-Vollzugsentscheidungen mit Bußgeld",
            "GPSR-Produktsicherheitsfristen",
            "PAngV-Änderungen",
            "Plattform-AGB-Änderungen mit Auswirkung auf Händler",
            "BGH-Verbraucherrechtsurteile mit Massenwirkung",
        ],
        "irrelevant": "Allgemeine E-Commerce-Trends, internationale Marktforschung, Unternehmensporträts",
    },
    {
        "nr": 17,
        "name": "Smart City & Kommunen",
        "zielgruppe": (
            "Digitalbeauftragte Kommunen / Länder, CIOs öffentliche Verwaltung, "
            "Stadtwerke-Entscheider, ÖPNV-Manager, OZG-Projektverantwortliche"
        ),
        "relevant": [
            "OZG-Friständerungen und Umsetzungsstatus",
            "KfW-Smart-City-Förderprogramme (Öffnung / Schließung)",
            "Kommunalrecht-Änderungen (Länderebene)",
            "Cyberangriffe auf Kommunalverwaltungen",
            "ÖPNV-Gesetzgebung, kommunale Ausschreibungen >10 Mio. €",
        ],
        "irrelevant": "Allgemeine Digitalisierungsberichte, internationale Smart-City-Studien, Pilotprojekte ohne Skalierungsrelevanz",
    },
    {
        "nr": 18,
        "name": "Bildung & EdTech",
        "zielgruppe": (
            "Hochschulleitungen, Schulbehörden-Entscheider, EdTech-Geschäftsführer, "
            "Bildungsministerien, Datenschutzbeauftragte Schulen / Hochschulen"
        ),
        "relevant": [
            "BAföG-Änderungen in Kraft",
            "KMK-Beschlüsse mit bundesweiter Wirkung",
            "DigitalPakt-Mittelabruf / -Fristen",
            "Datenschutz-Beschlüsse zu Schulplattformen (LDA)",
            "PISA-Ergebnisse, Hochschulzulassungsordnungen",
        ],
        "irrelevant": "Allgemeine EdTech-Trends, internationale Bildungsvergleiche, Unternehmensporträts",
    },
    {
        "nr": 19,
        "name": "Maritime & Schifffahrt",
        "zielgruppe": (
            "Reederei-Manager, Hafenlogistik-Entscheider, Ship-Finance-Manager, "
            "Maritime-Compliance-Beauftragte, Schiffsmakler, Klassifizierungsgesellschaften"
        ),
        "relevant": [
            "IMO-CII / EEXI-Regulierung",
            "EU-ETS Schifffahrt (Erweiterung / Vollzug)",
            "Hafensperrungen auf Haupthandelsrouten",
            "Bunkerpreisextreme >±15 % (Wochenbasis)",
            "Schwefelgrenzwert-Vollzugsentscheidungen",
        ],
        "irrelevant": "Allgemeine Schifffahrtsmarktberichte, internationale Häfen-Rankings, Unternehmensporträts",
    },
    {
        "nr": 20,
        "name": "Gaming & Entertainment",
        "zielgruppe": (
            "Publisher-Geschäftsführer, Studio-Leads (Mid / Large), Compliance-Beauftragte "
            "(USK, KJM), Lizenzmanager, Plattformbeauftragte (Steam, PlayStation, App Stores)"
        ),
        "relevant": [
            "USK / KJM-Leitentscheidungen und neue Kategorien",
            "Jugendschutzgesetz-Änderungen in Kraft",
            "EU-DSA-Vollzug gegen Gaming-Plattformen",
            "Loot-Box-Regulierung (EU-Mitgliedstaaten)",
            "Urheberrechts-EuGH-Urteile mit Plattformwirkung",
        ],
        "irrelevant": "Spielrelease-Berichte, eSports-Turniere, internationale Marktdaten, Branchenkonferenzen",
    },
]

# ── HTML ───────────────────────────────────────────────────────────────────────

CSS = """
body {
    font-family: Helvetica, Arial, sans-serif;
    font-size: 9.5pt;
    color: #1a1a2e;
    margin: 0;
    padding: 0;
}

/* ── Cover ── */
.cover {
    background-color: #1a1a2e;
    padding: 60px 50px 50px 50px;
    margin-bottom: 30px;
}
.cover-logo {
    font-size: 11pt;
    font-weight: bold;
    color: #f59e0b;
    letter-spacing: 2px;
    text-transform: uppercase;
    margin-bottom: 30px;
}
.cover-title {
    font-size: 22pt;
    font-weight: bold;
    color: #ffffff;
    line-height: 1.3;
    margin-bottom: 10px;
}
.cover-subtitle {
    font-size: 10pt;
    color: #9ca3af;
    margin-bottom: 40px;
}
.cover-meta {
    font-size: 8pt;
    color: #6b7280;
    border-top: 1px solid #374151;
    padding-top: 12px;
}

/* ── Section cards ── */
.card {
    border-left: 3.5px solid #f59e0b;
    background-color: #f8fafc;
    padding: 14px 16px 14px 16px;
    margin-bottom: 16px;
    border-radius: 0 4px 4px 0;
}
.card-header {
    display: flex;
    align-items: baseline;
    margin-bottom: 8px;
}
.badge {
    font-size: 7.5pt;
    font-weight: bold;
    color: #f59e0b;
    background-color: #1a1a2e;
    padding: 2px 7px;
    border-radius: 10px;
    margin-right: 8px;
    white-space: nowrap;
}
.industry-name {
    font-size: 12pt;
    font-weight: bold;
    color: #1a1a2e;
}

.section-label {
    font-size: 7pt;
    font-weight: bold;
    color: #6b7280;
    text-transform: uppercase;
    letter-spacing: 0.8px;
    margin-top: 9px;
    margin-bottom: 3px;
}
.zielgruppe-text {
    font-size: 8.5pt;
    color: #374151;
    line-height: 1.5;
}

.criteria-list {
    margin: 0;
    padding-left: 16px;
}
.criteria-item {
    font-size: 8.5pt;
    color: #374151;
    line-height: 1.6;
    margin-bottom: 1px;
}
.not-relevant {
    font-size: 7.5pt;
    color: #9ca3af;
    font-style: italic;
    margin-top: 5px;
    line-height: 1.4;
}

.divider {
    border: none;
    border-top: 1px solid #e5e7eb;
    margin: 6px 0 14px 0;
}

/* ── Page break hint ── */
.page-break { page-break-before: always; }
"""


def build_html() -> str:
    from datetime import date
    today = date.today().strftime("%d.%m.%Y")

    cards_html = ""
    for idx, ind in enumerate(INDUSTRIES):
        relevant_items = "".join(
            f'<li class="criteria-item">✔ {item}</li>' for item in ind["relevant"]
        )

        cards_html += f"""
        <div class="card">
            <div class="card-header">
                <span class="badge">{ind['nr']:02d}</span>
                <span class="industry-name">{ind['name']}</span>
            </div>
            <div class="section-label">Zielgruppe</div>
            <div class="zielgruppe-text">{ind['zielgruppe']}</div>
            <div class="section-label">Relevanzkriterien</div>
            <ul class="criteria-list">{relevant_items}</ul>
            <div class="not-relevant">✗ Nicht relevant: {ind['irrelevant']}</div>
        </div>
        """

    return f"""<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><style>{CSS}</style></head>
<body>

<div class="cover">
    <div class="cover-logo">IntelliStream</div>
    <div class="cover-title">Branchen &amp; Zielgruppen<br>Übersicht</div>
    <div class="cover-subtitle">
        Zielgruppendefinitionen und Relevanzkriterien für alle 20 Branchen der Plattform
    </div>
    <div class="cover-meta">Stand: {today} · Alle 20 Branchen · Interne Dokumentation</div>
</div>

{cards_html}

</body>
</html>"""


# ── Render ─────────────────────────────────────────────────────────────────────

def main():
    html = build_html()

    # A4 Seitenmaße in Points (72 dpi): 595 × 842
    PAGE_W, PAGE_H = 595, 842
    MARGIN = 40

    writer = fitz.DocumentWriter(OUTPUT)
    story  = fitz.Story(html=html, user_css=None)

    mediabox = fitz.Rect(0, 0, PAGE_W, PAGE_H)
    where    = mediabox + (MARGIN, MARGIN, -MARGIN, -MARGIN)  # Textbereich

    more = True
    while more:
        device = writer.begin_page(mediabox)
        more, _ = story.place(where)
        story.draw(device)
        writer.end_page()

    writer.close()
    print(f"✅  PDF gespeichert: {OUTPUT}")


if __name__ == "__main__":
    main()
