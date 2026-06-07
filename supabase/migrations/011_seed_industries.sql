-- Seed data: all 20 IntelliStream industry modules
-- Each row includes: id, name, slug, description, sources (JSONB), tags_taxonomy (JSONB)

insert into industries (id, name, slug, description, sources, tags_taxonomy, crawl_interval_minutes) values

(1, 'Energie & Erneuerbare', 'energie-erneuerbare',
 'EEG, GEG, EPEX-Strompreise, Förderung, Energiewende',
 '[
   {"name":"BNetzA","url":"https://www.bundesnetzagentur.de/SiteGlobals/Forms/Suche/Entscheidungssuche_Formular.html","type":"crawler","trust_level":"official"},
   {"name":"BMWK RSS","url":"https://www.bmwk.de/SiteGlobals/BMWI/RSSFeeds/rss.xml","type":"rss","trust_level":"official"},
   {"name":"EPEX SPOT","url":"https://www.epexspot.com/en/news","type":"crawler","trust_level":"official"},
   {"name":"Bundesnetzagentur Monitoringbericht","url":"https://www.bundesnetzagentur.de/DE/Sachgebiete/ElektrizitaetundGas/Unternehmen_Institutionen/Versorgungssicherheit/Monitoring/monitoring-node.html","type":"crawler","trust_level":"official"},
   {"name":"PV Magazine","url":"https://www.pv-magazine.de/feed/","type":"rss","trust_level":"media"},
   {"name":"Energiezukunft","url":"https://energiezukunft.eu/feed/","type":"rss","trust_level":"media"}
 ]',
 '{"regulation":["EEG","GEG","EnWG","KWKG"],"market":["EPEX","Strompreise","Gaspreise","Merit-Order"],"technology":["Photovoltaik","Windenergie","Wärmepumpe","Speicher","Wasserstoff"],"funding":["BAFA","KfW","Bundesförderung"],"policy":["Energiewende","Klimaschutz","CO2-Preis"]}',
 60),

(2, 'ESG & Nachhaltigkeit', 'esg-nachhaltigkeit',
 'CSRD, EU-Taxonomie, CO2-Markt, Nachhaltigkeitsberichterstattung',
 '[
   {"name":"EUR-Lex","url":"https://eur-lex.europa.eu/rss/rss.xml","type":"rss","trust_level":"official"},
   {"name":"ESMA","url":"https://www.esma.europa.eu/press-news/esma-news","type":"crawler","trust_level":"official"},
   {"name":"EFRAG","url":"https://www.efrag.org/News","type":"crawler","trust_level":"official"},
   {"name":"Bundesanzeiger","url":"https://www.bundesanzeiger.de","type":"crawler","trust_level":"official"},
   {"name":"ESG Today","url":"https://www.esgtoday.com/feed/","type":"rss","trust_level":"media"},
   {"name":"Responsible Investor","url":"https://www.responsible-investor.com/rss","type":"rss","trust_level":"media"}
 ]',
 '{"regulation":["CSRD","EU-Taxonomie","SFDR","ESRS"],"market":["CO2-Zertifikate","ETS","Emissionshandel"],"reporting":["Nachhaltigkeitsbericht","ESG-Reporting","GRI","TCFD"],"standards":["ISO14001","SBTi","Science-Based-Targets"],"rating":["MSCI-ESG","Sustainalytics","ISS"]}',
 60),

(3, 'Recht & Compliance', 'recht-compliance',
 'BGH/BFH-Urteile, Gesetzgebung, EU-Recht, Datenschutz',
 '[
   {"name":"Bundesanzeiger","url":"https://www.bundesanzeiger.de","type":"crawler","trust_level":"official"},
   {"name":"BGH","url":"https://www.bundesgerichtshof.de/cgi-bin/rechtsprechung/list.cgi?Gericht=bgh&Art=en&Datum=Aktuell","type":"crawler","trust_level":"official"},
   {"name":"BFH","url":"https://www.bundesfinanzhof.de/de/entscheidungen/entscheidungen-online/","type":"crawler","trust_level":"official"},
   {"name":"EuGH","url":"https://curia.europa.eu/rss/rss.xml","type":"rss","trust_level":"official"},
   {"name":"Bundesrat","url":"https://www.bundesrat.de/SiteGlobals/Forms/RSS/rss.html","type":"rss","trust_level":"official"},
   {"name":"Beck aktuell","url":"https://rsw.beck.de/rss/rss.aspx?feed=NJW","type":"rss","trust_level":"media"},
   {"name":"LTO","url":"https://www.lto.de/rss/","type":"rss","trust_level":"media"}
 ]',
 '{"areas":["Arbeitsrecht","Steuerrecht","Datenschutz","Vertragsrecht","Gesellschaftsrecht","EU-Recht"],"sources":["BGH","BFH","BVerwG","EuGH","BAG","BSG"],"legislation":["DSGVO","TTDSG","GWB","HGB","BGB"],"compliance":["Geldwäschegesetz","LkSG","Hinweisgeberschutzgesetz"]}',
 30),

(4, 'IT & Cybersecurity', 'it-cybersecurity',
 'CVE-Schwachstellen, NIS2, KI-Releases, Cloud-Sicherheit',
 '[
   {"name":"BSI","url":"https://www.bsi.bund.de/SiteGlobals/Functions/RSSFeed/RSSNewsfeed/RSSNewsfeed.xml","type":"rss","trust_level":"official"},
   {"name":"NIST CVE","url":"https://services.nvd.nist.gov/rest/json/cves/2.0","type":"api","trust_level":"official"},
   {"name":"BayLDA","url":"https://www.lda.bayern.de/de/datenschutzaufsicht/nachrichten.html","type":"crawler","trust_level":"official"},
   {"name":"Heise Online","url":"https://www.heise.de/rss/heise-atom.xml","type":"rss","trust_level":"media"},
   {"name":"The Hacker News","url":"https://feeds.feedburner.com/TheHackersNews","type":"rss","trust_level":"media"},
   {"name":"Golem.de","url":"https://rss.golem.de/rss.php?feed=RSS2.0","type":"rss","trust_level":"media"}
 ]',
 '{"security":["CVE","CVSS","Malware","Ransomware","Phishing","Zero-Day"],"regulation":["NIS2","DSGVO","CRA","AI-Act","DORA"],"technology":["Cloud","AI","KI","Kubernetes","Zero-Trust","SIEM"],"vendors":["Microsoft","AWS","Google","SAP"]}',
 30),

(5, 'Pharma & Life Science', 'pharma-life-science',
 'EMA/FDA-Zulassungen, AMNOG, klinische Studien, Arzneimittelrecht',
 '[
   {"name":"EMA","url":"https://www.ema.europa.eu/en/rss-feeds","type":"rss","trust_level":"official"},
   {"name":"FDA","url":"https://www.fda.gov/about-fda/contact-fda/stay-informed/rss-feeds","type":"rss","trust_level":"official"},
   {"name":"BfArM","url":"https://www.bfarm.de/SiteGlobals/Functions/RSSFeed/RSSNewsfeed/RSSNewsfeed.xml","type":"rss","trust_level":"official"},
   {"name":"PubMed","url":"https://pubmed.ncbi.nlm.nih.gov/rss/search/","type":"rss","trust_level":"official"},
   {"name":"PharmaJournal","url":"https://www.pharmazeutische-zeitung.de/feed/","type":"rss","trust_level":"media"},
   {"name":"FiercePharma","url":"https://www.fiercepharma.com/rss","type":"rss","trust_level":"media"}
 ]',
 '{"regulatory":["AMNOG","EMA-Zulassung","FDA-Approval","GMP","GCP","AMG"],"research":["Klinische Studie","Phase-III","Wirksamkeitsnachweis","Real-World-Evidence"],"market":["IQVIA","IMS","Erstattung","GKV","Nutzenbewertung"],"therapy":["Onkologie","Immunologie","Seltene-Erkrankungen","Biosimilars"]}',
 60),

(6, 'Finanzen & Kapitalmarkt', 'finanzen-kapitalmarkt',
 'EZB-Entscheidungen, Aktien, PE/VC-Deals, Regulierung',
 '[
   {"name":"EZB","url":"https://www.ecb.europa.eu/rss/press.html","type":"rss","trust_level":"official"},
   {"name":"Bundesbank","url":"https://www.bundesbank.de/de/presse/rss-feeds","type":"rss","trust_level":"official"},
   {"name":"BaFin","url":"https://www.bafin.de/SiteGlobals/Functions/RSSFeed/RSSMeldungen/RSSMeldungen.xml","type":"rss","trust_level":"official"},
   {"name":"SEC EDGAR","url":"https://www.sec.gov/cgi-bin/browse-edgar?action=getcurrent&type=8-K&dateb=&owner=include&count=40&output=atom","type":"rss","trust_level":"official"},
   {"name":"Handelsblatt Finanzen","url":"https://www.handelsblatt.com/rss/finanzen.xml","type":"rss","trust_level":"media"}
 ]',
 '{"monetary":["EZB","Zinsentscheid","Inflation","Geldpolitik"],"market":["DAX","MDAX","Aktien","Anleihen","ETF","Derivate"],"deals":["M&A","IPO","PE","VC","LBO"],"regulation":["MiFID","Basel-III","EMIR","ESMA","BaFin"],"macro":["GDP","BIP","Konjunktur","Rezession"]}',
 30),

(7, 'Bau & Immobilien', 'bau-immobilien',
 'VOB, GEG, Ausschreibungen, Immobilienpreise, Baurecht',
 '[
   {"name":"TED (EU-Ausschreibungen)","url":"https://ted.europa.eu/api/v3.0/notices/search","type":"api","trust_level":"official"},
   {"name":"DTVP","url":"https://www.dtvp.de","type":"crawler","trust_level":"official"},
   {"name":"Destatis Bau","url":"https://www.destatis.de/DE/Presse/Pressemitteilungen/RSS/_rss_bau.xml","type":"rss","trust_level":"official"},
   {"name":"Immobilien Zeitung","url":"https://www.iz.de/rss/","type":"rss","trust_level":"media"},
   {"name":"BauNetz","url":"https://www.baunetz.de/rss/","type":"rss","trust_level":"media"}
 ]',
 '{"regulation":["VOB","GEG","BauGB","LBO","HOAI","EnEV"],"market":["Wohnimmobilien","Gewerbeimmobilien","Baupreise","Mietpreise"],"projects":["Ausschreibung","Vergabe","PPP","ÖPNV"],"topics":["Nachhaltiges-Bauen","Holzbau","BIM","Sanierung"]}',
 120),

(8, 'Automotive & Mobilität', 'automotive-mobilitaet',
 'E-Mobilität, KBA-Statistiken, EU-Flottenregulierung, Autonomous Driving',
 '[
   {"name":"KBA","url":"https://www.kba.de/DE/Statistik/Fahrzeuge/Neuzulassungen/Monatliche_Neuzulassungen/2024/2024_node.html","type":"crawler","trust_level":"official"},
   {"name":"ACEA","url":"https://www.acea.auto/feed/","type":"rss","trust_level":"official"},
   {"name":"EU-Kommission Mobilität","url":"https://transport.ec.europa.eu/news_en","type":"crawler","trust_level":"official"},
   {"name":"Automobilwoche","url":"https://www.automobilwoche.de/rss","type":"rss","trust_level":"media"},
   {"name":"electrive.net","url":"https://www.electrive.net/feed/","type":"rss","trust_level":"media"}
 ]',
 '{"regulation":["Euro-7","CO2-Flottengrenzwert","Typgenehmigung","End-of-Life"],"market":["Zulassungen","E-Auto","BEV","PHEV","Ladeinfrastruktur"],"technology":["Autonomous-Driving","OTA","Software-Defined-Vehicle","Batterietechnologie"],"companies":["VW","BMW","Mercedes","Stellantis","Tesla"]}',
 60),

(9, 'Gesundheit & MedTech', 'gesundheit-medtech',
 'MDR, G-BA-Beschlüsse, DiGA, Krankenhausreform',
 '[
   {"name":"G-BA","url":"https://www.g-ba.de/service/rss/","type":"rss","trust_level":"official"},
   {"name":"BfArM","url":"https://www.bfarm.de/SiteGlobals/Functions/RSSFeed/RSSNewsfeed/RSSNewsfeed.xml","type":"rss","trust_level":"official"},
   {"name":"RKI","url":"https://www.rki.de/SiteGlobals/Functions/RSSFeed/RSSNewsfeed/RSSNewsfeed.xml","type":"rss","trust_level":"official"},
   {"name":"Ärzteblatt","url":"https://www.aerzteblatt.de/rss/nachrichten.xml","type":"rss","trust_level":"media"},
   {"name":"KMA Online","url":"https://www.kma-online.de/rss/","type":"rss","trust_level":"media"}
 ]',
 '{"regulation":["MDR","IVDR","DiGA","SGB-V","Krankenhausreformgesetz"],"reimbursement":["G-BA","Nutzenbewertung","AMNOG","DRG","Fallpauschale"],"technology":["MedTech","Digitale-Gesundheitsanwendung","KI-Diagnostik","Telemedizin"],"policy":["Krankenhausreform","Pflegereform","GKV-Finanzen"]}',
 60),

(10, 'Maschinenbau & Industrie 4.0', 'maschinenbau-industrie40',
 'VDMA-Daten, Rohstoffe, Automatisierung, Industrie 4.0',
 '[
   {"name":"VDMA","url":"https://www.vdma.org/rss","type":"rss","trust_level":"official"},
   {"name":"Destatis Industrie","url":"https://www.destatis.de/DE/Presse/Pressemitteilungen/RSS/_rss_produzierendes-gewerbe.xml","type":"rss","trust_level":"official"},
   {"name":"BMBF Forschung","url":"https://www.bmbf.de/SiteGlobals/BMBF/RSSFeeds/RSS_Meldungen/RSS_Meldungen.xml","type":"rss","trust_level":"official"},
   {"name":"Maschinenmarkt","url":"https://www.maschinenmarkt.vogel.de/rss/news.xml","type":"rss","trust_level":"media"}
 ]',
 '{"market":["Auftragseingänge","Produktionsindex","Exportquote","Investitionsgüter"],"technology":["Robotik","Cobots","Additive-Fertigung","OPC-UA","TSN","AI-in-Manufacturing"],"materials":["Stahl","Aluminium","Seltene-Erden","Lieferkette"],"topics":["Nachhaltigkeit","Energieeffizienz","Kreislaufwirtschaft"]}',
 120),

(11, 'HR & Arbeitsmarkt', 'hr-arbeitsmarkt',
 'BAG-Urteile, Tarifverträge, Arbeitsmarktdaten, New Work',
 '[
   {"name":"BAG","url":"https://www.bundesarbeitsgericht.de/presse/pressemitteilungen/","type":"crawler","trust_level":"official"},
   {"name":"Bundesagentur für Arbeit","url":"https://statistik.arbeitsagentur.de/DE/Navigation/Statistiken/Fachstatistiken/Fachstatistiken-Nav.html","type":"crawler","trust_level":"official"},
   {"name":"IAB","url":"https://www.iab.de/de/informationsservice/presse/presseinformationen.aspx","type":"crawler","trust_level":"official"},
   {"name":"Personalwirtschaft","url":"https://www.personalwirtschaft.de/rss","type":"rss","trust_level":"media"},
   {"name":"HR-Journal","url":"https://www.hr-journal.de/feed/","type":"rss","trust_level":"media"}
 ]',
 '{"law":["Arbeitsrecht","Tarifvertrag","Betriebsverfassung","Kündigungsschutz","BAG"],"market":["Arbeitslosenquote","Fachkräftemangel","Stellenangebote","Kurzarbeit"],"topics":["Remote-Work","New-Work","Diversity","Benefits","Employer-Branding"],"regulation":["Mindestlohn","Arbeitszeitgesetz","Entgelttransparenz"]}',
 120),

(12, 'Agrar & Lebensmittel', 'agrar-lebensmittel',
 'MATIF-Agrarpreise, GAP-Reform, Lebensmittelzulassungen',
 '[
   {"name":"BLE","url":"https://www.ble.de/SharedDocs/Meldungen/DE/Nachrichten.html","type":"crawler","trust_level":"official"},
   {"name":"BMEL","url":"https://www.bmel.de/SiteGlobals/BMEL/RSSFeeds/rss.xml","type":"rss","trust_level":"official"},
   {"name":"AMI","url":"https://www.ami-informiert.de/ami-maerkte/ami-markt-news.html","type":"crawler","trust_level":"official"},
   {"name":"Destatis Agrar","url":"https://www.destatis.de/DE/Presse/Pressemitteilungen/RSS/_rss_land-forstwirtschaft.xml","type":"rss","trust_level":"official"},
   {"name":"agrarheute","url":"https://www.agrarheute.com/rss","type":"rss","trust_level":"media"},
   {"name":"top agrar","url":"https://www.topagrar.com/rss.xml","type":"rss","trust_level":"media"}
 ]',
 '{"policy":["GAP","Direktzahlungen","Agrarpolitik","Farm-to-Fork"],"prices":["MATIF","Getreidepreise","Ölsaaten","Milch","Fleisch"],"regulation":["Novel-Food","Pestizidzulassung","Gentechnik","Ökolandbau"],"market":["Erntemengen","Export","LEH","Food-Tech"]}',
 120),

(13, 'Logistik & Transport', 'logistik-transport',
 'Baltic Dry Index, Zoll, KEP-Markt, Lieferkettengesetz',
 '[
   {"name":"BGL","url":"https://www.bgl-ev.de/presse/pressemitteilungen.html","type":"crawler","trust_level":"official"},
   {"name":"DSLV","url":"https://www.dslv.org/dslv/web.nsf/id/li_de_aktuell.html","type":"crawler","trust_level":"official"},
   {"name":"Eurostat Transport","url":"https://ec.europa.eu/eurostat/news/themes/transport","type":"crawler","trust_level":"official"},
   {"name":"DVZ","url":"https://www.dvz.de/rss/news.xml","type":"rss","trust_level":"media"},
   {"name":"Verkehrsrundschau","url":"https://www.verkehrsrundschau.de/rss/nachrichten.xml","type":"rss","trust_level":"media"}
 ]',
 '{"market":["Baltic-Dry-Index","Frachtpreise","KEP-Markt","Last-Mile"],"regulation":["LkSG","ADR","CMR","Mautgesetz","CO2-LKW"],"technology":["Autonomous-Trucks","Drohnen","Hyperloop","Elektro-LKW"],"supply-chain":["Lieferkette","Nearshoring","Reshoring","Single-Source"]}',
 60),

(14, 'Versicherung & Risiko', 'versicherung-risiko',
 'BaFin-Regulierung, Solvency II, InsurTech, Naturkatastrophen',
 '[
   {"name":"BaFin Versicherung","url":"https://www.bafin.de/SiteGlobals/Functions/RSSFeed/RSSMeldungen/RSSMeldungen.xml","type":"rss","trust_level":"official"},
   {"name":"EIOPA","url":"https://www.eiopa.europa.eu/media-and-publications/news_en","type":"crawler","trust_level":"official"},
   {"name":"GDV","url":"https://www.gdv.de/gdv/presse/pressemitteilungen","type":"crawler","trust_level":"official"},
   {"name":"Versicherungsmagazin","url":"https://www.versicherungsmagazin.de/rss","type":"rss","trust_level":"media"},
   {"name":"AssCompact","url":"https://www.asscompact.de/rss.xml","type":"rss","trust_level":"media"}
 ]',
 '{"regulation":["Solvency-II","DORA","IDD","VVG","BaFin"],"market":["Prämien","Schaden-Kosten-Quote","InsurTech","Embedded-Insurance"],"risk":["Naturkatastrophen","Cyber-Risiko","Klimarisiken","Pandemierisiko"],"products":["Lebensversicherung","Krankenversicherung","Haftpflicht","Cyber-Versicherung"]}',
 60),

(15, 'Chemie & Materialien', 'chemie-materialien',
 'REACH, VCI-Statistiken, Rohstoffpreise, Spezialchemie',
 '[
   {"name":"ECHA","url":"https://echa.europa.eu/rss/ECHA_Dossier_RSS.xml","type":"rss","trust_level":"official"},
   {"name":"VCI","url":"https://www.vci.de/presse/pressemitteilungen/pressemitteilungen.jsp","type":"crawler","trust_level":"official"},
   {"name":"Destatis Chemie","url":"https://www.destatis.de/DE/Presse/Pressemitteilungen/RSS/_rss_produzierendes-gewerbe.xml","type":"rss","trust_level":"official"},
   {"name":"CHEManager","url":"https://www.chemanager-online.com/rss","type":"rss","trust_level":"media"},
   {"name":"Chemie.de","url":"https://www.chemie.de/rss/nachrichten.xml","type":"rss","trust_level":"media"}
 ]',
 '{"regulation":["REACH","CLP","Biozidverordnung","PFAS","Chemikalienrecht"],"market":["Rohstoffpreise","Naphtha","Ethylen","Polypropylen","Spezialchemie"],"technology":["Grüne-Chemie","Biobased","Prozessoptimierung","Katalyse"],"companies":["BASF","Bayer","Evonik","Covestro","Lanxess"]}',
 120),

(16, 'E-Commerce & Retail', 'ecommerce-retail',
 'Amazon-Plattformänderungen, DSA, Versandkosten, D2C',
 '[
   {"name":"Statista","url":"https://www.statista.com/topics/871/online-shopping/","type":"crawler","trust_level":"media"},
   {"name":"EHI","url":"https://www.ehi.org/de/press/pressemitteilungen/","type":"crawler","trust_level":"official"},
   {"name":"IFH Köln","url":"https://www.ifhkoeln.de/presse/","type":"crawler","trust_level":"official"},
   {"name":"iBusiness","url":"https://www.ibusiness.de/rss/nachrichten.xml","type":"rss","trust_level":"media"},
   {"name":"W&V","url":"https://www.wuv.de/rss","type":"rss","trust_level":"media"}
 ]',
 '{"regulation":["DSA","DMA","PAngV","GPSR","Verbraucherrecht"],"market":["Marktanteile","Conversion-Rate","ARPU","Retourenquote"],"technology":["Headless-Commerce","D2C","Social-Commerce","Quick-Commerce"],"companies":["Amazon","Zalando","Otto","MediaMarkt"]}',
 120),

(17, 'Smart City & Kommunen', 'smart-city-kommunen',
 'OZG, Förderprogramme, ÖPNV, kommunale Digitalisierung',
 '[
   {"name":"BMBF Förderung","url":"https://www.bmbf.de/SiteGlobals/BMBF/RSSFeeds/RSS_Meldungen/RSS_Meldungen.xml","type":"rss","trust_level":"official"},
   {"name":"KfW","url":"https://www.kfw.de/newsroom/newsroom/Pressemitteilungen/","type":"crawler","trust_level":"official"},
   {"name":"BMI","url":"https://www.bmi.bund.de/SiteGlobals/Functions/RSSFeed/RSSNewsfeed/RSSNewsfeed.xml","type":"rss","trust_level":"official"},
   {"name":"eGovernment Computing","url":"https://www.egovernment-computing.de/rss/news.xml","type":"rss","trust_level":"media"}
 ]',
 '{"regulation":["OZG","GemeindeO","Kommunalrecht","ÖPNV-Gesetz"],"funding":["KfW","BMBF","Städtebauförderung","Smart-City-Charta"],"technology":["E-Government","IoT","Lora-WAN","Smart-Parking","Digital-Twin"],"topics":["Bürgerbeteiligung","Daseinsvorsorge","Verwaltungsdigitalisierung"]}',
 180),

(18, 'Bildung & EdTech', 'bildung-edtech',
 'Hochschulpolitik, KI in der Bildung, Förderung, EdTech-Markt',
 '[
   {"name":"BMBF Bildung","url":"https://www.bmbf.de/SiteGlobals/BMBF/RSSFeeds/RSS_Meldungen/RSS_Meldungen.xml","type":"rss","trust_level":"official"},
   {"name":"KMK","url":"https://www.kmk.org/presse-und-oeffentlichkeitsarbeit/pressemitteilungen-beschluesse.html","type":"crawler","trust_level":"official"},
   {"name":"HRK","url":"https://www.hrk.de/presse/pressemitteilungen/","type":"crawler","trust_level":"official"},
   {"name":"Bildungsklick","url":"https://bildungsklick.de/rss/","type":"rss","trust_level":"media"}
 ]',
 '{"policy":["Hochschulpakt","BAföG","Nationaler-Bildungsrat","PISA"],"technology":["EdTech","KI-im-Unterricht","E-Learning","LMS","VR-Bildung"],"funding":["BMBF","DigitalPakt","Aufholprogramm"],"trends":["Lebenslanges-Lernen","Micro-Credentials","Skill-Based-Learning"]}',
 180),

(19, 'Maritime & Schifffahrt', 'maritime-schifffahrt',
 'Baltic Dry Index, IMO-Regulierung, Hafenlogistik, Green Shipping',
 '[
   {"name":"IMO","url":"https://www.imo.org/en/MediaCentre/Pages/Newsroom.aspx","type":"crawler","trust_level":"official"},
   {"name":"ISL","url":"https://www.isl.org/de/nachrichten","type":"crawler","trust_level":"official"},
   {"name":"HPA Hamburg","url":"https://www.hamburg-port-authority.de/de/presse/pressemitteilungen","type":"crawler","trust_level":"official"},
   {"name":"Ship & Bunker","url":"https://shipandbunker.com/news/rss","type":"rss","trust_level":"media"},
   {"name":"DVZ Maritim","url":"https://www.dvz.de/rss/news.xml","type":"rss","trust_level":"media"}
 ]',
 '{"market":["Baltic-Dry-Index","Frachtpreise","Bunkerpreise","Containerindex"],"regulation":["IMO-2050","CII","EEXI","Schwefelgrenzwert","ETS-Schifffahrt"],"technology":["LNG-Schiffe","Methanol","Ammoniak-Antrieb","Autonome-Schiffe"],"ports":["Hamburg","Rotterdam","Antwerpen","Kiel-Canal"]}',
 120),

(20, 'Gaming & Entertainment', 'gaming-entertainment',
 'Spielereleases, Förderung, Urheberrecht, Streaming-Markt',
 '[
   {"name":"USK","url":"https://www.usk.de/presse/pressemitteilungen/","type":"crawler","trust_level":"official"},
   {"name":"game Verband","url":"https://www.game.de/presse/pressemitteilungen/","type":"crawler","trust_level":"official"},
   {"name":"IFPI","url":"https://www.ifpi.org/our-industry/latest-news/","type":"crawler","trust_level":"official"},
   {"name":"GamesWirtschaft","url":"https://www.gameswirtschaft.de/feed/","type":"rss","trust_level":"media"},
   {"name":"DWDL","url":"https://www.dwdl.de/rss/","type":"rss","trust_level":"media"}
 ]',
 '{"market":["Umsatzzahlen","Marktanteile","Streaming","Subscription","Mobile-Gaming"],"regulation":["Jugendschutz","Urheberrecht","Loot-Boxes","Datenschutz-Gaming"],"technology":["Cloud-Gaming","VR-AR","Metaverse","Game-Engine","Generative-AI"],"topics":["eSports","Serious-Games","Gamification","Indie-Games"]}',
 180);
