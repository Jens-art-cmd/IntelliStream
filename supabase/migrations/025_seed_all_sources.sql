-- Migration 025: Seed ALL sources for all 15 scout industries
-- Uses ON CONFLICT (url) DO NOTHING to be idempotent.
-- Industries 1,3,4,6,8 already have some sources from migration 012/015.

INSERT INTO sources (industry_id, name, url, type, trust_level) VALUES

-- ── Industry 1: Energie & Erneuerbare ────────────────────────────────────
(1, 'BNetzA — Aktuelles', 'https://www.bundesnetzagentur.de/SiteGlobals/Functions/RSSFeed/DE/RSSNewsfeed/RSSNewsfeed_Aktuelles_neu.xml', 'rss', 'official'),
(1, 'EU-Kommission — Pressemitteilungen', 'https://ec.europa.eu/commission/presscorner/api/rss', 'rss', 'official'),
(1, 'Europäisches Parlament — Pressemitteilungen DE', 'https://www.europarl.europa.eu/rss/doc/press-releases/de.xml', 'rss', 'official'),

-- ── Industry 2: ESG & Nachhaltigkeit ─────────────────────────────────────
(2, 'ESMA — ESG & Sustainable Finance', 'https://www.esma.europa.eu/rss.xml', 'rss', 'official'),
(2, 'EU-Kommission — Pressemitteilungen', 'https://ec.europa.eu/commission/presscorner/api/rss', 'rss', 'official'),
(2, 'Europäisches Parlament — Pressemitteilungen DE', 'https://www.europarl.europa.eu/rss/doc/press-releases/de.xml', 'rss', 'official'),
(2, 'ESG Today', 'https://www.esgtoday.com/feed/', 'rss', 'media'),
(2, 'Responsible Investor', 'https://www.responsible-investor.com/feed/', 'rss', 'media'),

-- ── Industry 3: Recht & Compliance ───────────────────────────────────────
(3, 'BAG — Entscheidungen', 'https://www.bundesarbeitsgericht.de/feed/entscheidung/neueste', 'rss', 'official'),
(3, 'BAG — Pressemitteilungen', 'https://www.bundesarbeitsgericht.de/feed/presse/neueste', 'rss', 'official'),
(3, 'EU-Kommission — Pressemitteilungen', 'https://ec.europa.eu/commission/presscorner/api/rss', 'rss', 'official'),
(3, 'Europäisches Parlament — Pressemitteilungen DE', 'https://www.europarl.europa.eu/rss/doc/press-releases/de.xml', 'rss', 'official'),
(3, 'JUVE Rechtsmarkt', 'https://www.juve.de/feed/', 'rss', 'media'),
(3, 'Datenschutz-Notizen', 'https://www.dsn-group.de/datenschutz-notizen/blog.recent.xml', 'rss', 'media'),

-- ── Industry 4: IT & Cybersecurity ───────────────────────────────────────
(4, 'BSI — Cybersicherheitswarnungen', 'https://www.bsi.bund.de/SiteGlobals/Functions/RSSFeed/RSSNewsfeed/RSS_Cybersicherheitswarnungen.xml', 'rss', 'official'),
(4, 'BSI — Pressemitteilungen', 'https://www.bsi.bund.de/SiteGlobals/Functions/RSSFeed/RSSNewsfeed/RSS_Pressemitteilungen.xml', 'rss', 'official'),
(4, 'Security Insider', 'https://www.security-insider.de/feed/', 'rss', 'media'),
(4, 'CIO.de', 'https://www.cio.de/feed/news/', 'rss', 'media'),
(4, 'Computerwoche', 'https://www.computerwoche.de/feed/news/', 'rss', 'media'),
(4, 'Bleeping Computer', 'https://www.bleepingcomputer.com/feed/', 'rss', 'media'),

-- ── Industry 5: Pharma & Life Science ────────────────────────────────────
(5, 'EMA — Pressemitteilungen', 'https://www.ema.europa.eu/en/rss-feeds/ema-news-rss-feed.xml', 'rss', 'official'),
(5, 'BfArM — Meldungen', 'https://www.bfarm.de/SiteGlobals/Functions/RSSFeed/RSSNewsfeed/RSSNewsfeed.xml', 'rss', 'official'),
(5, 'G-BA — Beschlüsse', 'https://www.g-ba.de/service/rss/', 'rss', 'official'),
(5, 'IQWiG — Nutzenbewertungen', 'https://www.iqwig.de/rss/', 'rss', 'official'),
(5, 'Pharmazeutische Zeitung', 'https://www.pharmazeutische-zeitung.de/feed/', 'rss', 'media'),
(5, 'FiercePharma', 'https://www.fiercepharma.com/rss/xml', 'rss', 'media'),
(5, 'Ärzteblatt — Arzneimittel', 'https://www.aerzteblatt.de/rss/nachrichten.xml', 'rss', 'media'),

-- ── Industry 6: Finanzen & Kapitalmarkt ──────────────────────────────────
(6, 'BaFin — Aktuelles', 'https://www.bafin.de/SiteGlobals/Functions/RSSFeed/DE/RSSNewsfeed_Aktuelles.xml', 'rss', 'official'),
(6, 'Deutsche Bundesbank — Pressemitteilungen', 'https://www.bundesbank.de/dynamic/action/de/rss/presse/798808/rss.xml', 'rss', 'official'),
(6, 'Finanz-Szene.de', 'https://finanz-szene.de/feed/', 'rss', 'media'),

-- ── Industry 7: Bau & Immobilien ─────────────────────────────────────────
(7, 'Destatis — Bau & Immobilien', 'https://www.destatis.de/DE/Presse/Pressemitteilungen/RSS/_rss_bau.xml', 'rss', 'official'),
(7, 'BMWSB — Bauen & Wohnen', 'https://www.bmwsb.bund.de/SiteGlobals/BMWSB/RSSFeeds/rss.xml', 'rss', 'official'),
(7, 'KfW — Pressemitteilungen', 'https://www.kfw.de/KfW-Konzern/Newsroom/Presse/Pressemitteilungen/rss.xml', 'rss', 'official'),
(7, 'ZIA — Zentraler Immobilien Ausschuss', 'https://zia-deutschland.de/feed/', 'rss', 'official'),
(7, 'GdW — Wohnungswirtschaft', 'https://www.gdw.de/rss/presse/', 'rss', 'official'),
(7, 'Immobilien Zeitung', 'https://www.iz.de/rss/', 'rss', 'media'),
(7, 'BauNetz', 'https://www.baunetz.de/rss/baunetz_news.xml', 'rss', 'media'),
(7, 'Haufe Immobilien', 'https://www.haufe.de/immobilien/rss/news.xml', 'rss', 'media'),

-- ── Industry 8: Automotive & Mobilität ───────────────────────────────────
(8, 'VDA — Pressemitteilungen', 'https://www.vda.de/de/presse/Pressemitteilungen.rss', 'rss', 'official'),
(8, 'KBA — Pressemitteilungen', 'https://www.kba.de/SharedDocs/RSS/DE/presse_news.xml', 'rss', 'official'),
(8, 'Transport & Environment', 'https://www.transportenvironment.org/feed/', 'rss', 'media'),

-- ── Industry 9: Gesundheit & MedTech ─────────────────────────────────────
(9, 'G-BA — Beschlüsse & Meldungen', 'https://www.g-ba.de/service/rss/', 'rss', 'official'),
(9, 'BMG — Pressemitteilungen', 'https://www.bundesgesundheitsministerium.de/service/rss-feed.html', 'rss', 'official'),
(9, 'BfArM — Medizinprodukte & Arzneimittel', 'https://www.bfarm.de/SiteGlobals/Functions/RSSFeed/RSSNewsfeed/RSSNewsfeed.xml', 'rss', 'official'),
(9, 'RKI — Pressemitteilungen', 'https://www.rki.de/SiteGlobals/Functions/RSSFeed/RSSNewsfeed/RSSNewsfeed.xml', 'rss', 'official'),
(9, 'GKV-Spitzenverband', 'https://www.gkv-spitzenverband.de/presse/presse_rss/presse_rss.rss', 'rss', 'official'),
(9, 'BVMed — Medizinprodukte-Verband', 'https://www.bvmed.de/rss/presse.rss', 'rss', 'official'),
(9, 'Ärzteblatt — Gesundheitspolitik', 'https://www.aerzteblatt.de/rss/nachrichten.xml', 'rss', 'media'),
(9, 'KMA Online', 'https://www.kma-online.de/rss/', 'rss', 'media'),

-- ── Industry 10: Maschinenbau & Industrie 4.0 ────────────────────────────
(10, 'VDMA — Pressemitteilungen', 'https://www.vdma.org/rss', 'rss', 'official'),
(10, 'Destatis — Produzierendes Gewerbe', 'https://www.destatis.de/DE/Presse/Pressemitteilungen/RSS/_rss_produzierendes-gewerbe.xml', 'rss', 'official'),
(10, 'BMBF — Forschung & Innovation', 'https://www.bmbf.de/SiteGlobals/BMBF/RSSFeeds/RSS_Meldungen/RSS_Meldungen.xml', 'rss', 'official'),
(10, 'Plattform Industrie 4.0', 'https://www.plattform-i40.de/IP/Navigation/DE/Aktuelles/Presse/RSS/rss.xml', 'rss', 'official'),
(10, 'Maschinenmarkt', 'https://www.maschinenmarkt.vogel.de/rss/news.xml', 'rss', 'media'),
(10, 'Produktion', 'https://www.produktion.de/feed/', 'rss', 'media'),
(10, 'Automationspraxis', 'https://automationspraxis.industrie.de/feed/', 'rss', 'media'),

-- ── Industry 11: HR & Arbeitsmarkt ───────────────────────────────────────
(11, 'BAG — Entscheidungen HR', 'https://www.bundesarbeitsgericht.de/feed/entscheidung/neueste', 'rss', 'official'),
(11, 'Bundesagentur für Arbeit — Presse', 'https://www.arbeitsagentur.de/presse/rss/pressemitteilungen.xml', 'rss', 'official'),
(11, 'BMAS — Pressemitteilungen', 'https://www.bmas.de/SiteGlobals/Functions/RSSFeed/DE/RSSNewsfeed_Presse/RSSNewsfeed_Presse.xml', 'rss', 'official'),
(11, 'ver.di — Pressemitteilungen', 'https://www.verdi.de/presse/pressemitteilungen/rss', 'rss', 'official'),
(11, 'BDA — Arbeitgeberverbände', 'https://arbeitgeber.de/presse/rss/', 'rss', 'official'),
(11, 'Personalwirtschaft', 'https://www.personalwirtschaft.de/rss/', 'rss', 'media'),
(11, 'Haufe Personal', 'https://www.haufe.de/personal/rss/news.xml', 'rss', 'media'),

-- ── Industry 13: Logistik & Transport ────────────────────────────────────
(13, 'BMDV — Pressemitteilungen', 'https://bmdv.bund.de/SiteGlobals/Functions/RSSFeed/DE/Presse/RSSNewsfeed_Presse.xml', 'rss', 'official'),
(13, 'Destatis — Verkehr & Transport', 'https://www.destatis.de/DE/Presse/Pressemitteilungen/RSS/_rss_verkehr.xml', 'rss', 'official'),
(13, 'BGL — Bundesverband Güterkraftverkehr', 'https://www.bgl-ev.de/web/presse/rss.htm', 'rss', 'official'),
(13, 'DSLV — Spedition & Logistik', 'https://www.dslv.org/presse/pressemitteilungen/rss/', 'rss', 'official'),
(13, 'DVZ — Deutsche Verkehrs-Zeitung', 'https://www.dvz.de/rss/news.xml', 'rss', 'media'),
(13, 'Verkehrsrundschau', 'https://www.verkehrsrundschau.de/rss/news.xml', 'rss', 'media'),
(13, 'trans aktuell', 'https://www.trans-aktuell.de/rss/', 'rss', 'media'),

-- ── Industry 14: Versicherung & Risiko ───────────────────────────────────
(14, 'BaFin — Versicherungsaufsicht', 'https://www.bafin.de/SiteGlobals/Functions/RSSFeed/DE/RSSNewsfeed_Aktuelles.xml', 'rss', 'official'),
(14, 'EIOPA — Pressemitteilungen', 'https://www.eiopa.europa.eu/rss.xml', 'rss', 'official'),
(14, 'GDV — Gesamtverband der Versicherer', 'https://www.gdv.de/gdv/presse/pressemitteilungen/rss/', 'rss', 'official'),
(14, 'Versicherungswirtschaft heute', 'https://www.vwheute.de/rss/', 'rss', 'media'),
(14, 'Versicherungsjournal', 'https://www.versicherungsjournal.de/rss/versicherungsjournal.xml', 'rss', 'media'),
(14, 'Pfefferminzia', 'https://www.pfefferminzia.de/feed/', 'rss', 'media'),
(14, 'Handelsblatt — Versicherungen', 'https://www.handelsblatt.com/contentexport/feed/versicherungen', 'rss', 'media'),

-- ── Industry 15: Chemie & Materialien ────────────────────────────────────
(15, 'ECHA — Pressemitteilungen', 'https://www.echa.europa.eu/de/rss-feeds/-/rss/news', 'rss', 'official'),
(15, 'BfR — Pressemitteilungen', 'https://www.bfr.bund.de/de/presse/rss.xml', 'rss', 'official'),
(15, 'VCI — Chemische Industrie', 'https://www.vci.de/presse/pressemitteilungen/rss.jsp', 'rss', 'official'),
(15, 'CHEManager', 'https://www.chemanager-online.com/rss/news', 'rss', 'media'),
(15, 'Chemie Technik', 'https://www.chemietechnik.de/rss/', 'rss', 'media'),
(15, 'ICIS Chemical Business', 'https://www.icis.com/explore/resources/news/feed/', 'rss', 'media'),

-- ── Industry 21: EU-Regulatorik & Gesetzgebung ───────────────────────────
(21, 'EUR-Lex — Amtsblatt', 'https://eur-lex.europa.eu/oj/daily-view/L-series/rss.xml', 'rss', 'official'),
(21, 'Europäisches Parlament — Top Stories', 'https://www.europarl.europa.eu/rss/doc/top-stories/en.xml', 'rss', 'official'),
(21, 'EU-Rat — Pressemitteilungen', 'https://www.consilium.europa.eu/de/press/press-releases/rss', 'rss', 'official'),
(21, 'EU-Kommission — Pressemitteilungen', 'https://ec.europa.eu/commission/presscorner/api/rss', 'rss', 'official'),
(21, 'Euractiv', 'https://www.euractiv.com/feed/', 'rss', 'media'),
(21, 'Politico Europe', 'https://www.politico.eu/feed/', 'rss', 'media')

ON CONFLICT (url) DO NOTHING;
