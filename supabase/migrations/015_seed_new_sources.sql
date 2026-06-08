-- Migration 015: Neue Behörden- und Qualitätsquellen seeden
-- (entspricht den Ergänzungen in packages/agents/scout/src/*.ts)

-- Energie & Erneuerbare
INSERT INTO sources (industry_id, name, url, type, trust_level)
VALUES
  (1, 'BNetzA — Pressemitteilungen', 'https://www.bundesnetzagentur.de/SiteGlobals/Functions/RSSFeed/DE/Presse/RSSNewsfeed_Presse.xml', 'rss', 'official'),
  (1, 'BMWK — Pressemitteilungen',   'https://www.bmwk.de/SiteGlobals/Functions/RSSFeed/DE/Presse/RSSNewsfeed_Presse.xml',             'rss', 'official')
ON CONFLICT (url) DO NOTHING;

-- IT & Cybersecurity
INSERT INTO sources (industry_id, name, url, type, trust_level)
VALUES
  (4, 'BSI — Cybersicherheitswarnungen', 'https://www.bsi.bund.de/SiteGlobals/Functions/RSSFeed/RSSNewsfeed/RSS_Cybersicherheitswarnungen.xml', 'rss', 'official'),
  (4, 'BSI — Pressemitteilungen',        'https://www.bsi.bund.de/SiteGlobals/Functions/RSSFeed/RSSNewsfeed/RSS_Pressemitteilungen.xml',        'rss', 'official')
ON CONFLICT (url) DO NOTHING;

-- Finanzen & Kapitalmarkt
INSERT INTO sources (industry_id, name, url, type, trust_level)
VALUES
  (6, 'BaFin — Aktuelles',                  'https://www.bafin.de/SiteGlobals/Functions/RSSFeed/DE/RSSNewsfeed_Aktuelles.xml',  'rss', 'official'),
  (6, 'Deutsche Bundesbank — Pressemitt.',   'https://www.bundesbank.de/dynamic/action/de/rss/presse/798808/rss.xml',            'rss', 'official')
ON CONFLICT (url) DO NOTHING;

-- Automotive & Mobilität
INSERT INTO sources (industry_id, name, url, type, trust_level)
VALUES
  (8, 'VDA — Pressemitteilungen', 'https://www.vda.de/de/presse/Pressemitteilungen.rss', 'rss', 'official'),
  (8, 'KBA — Pressemitteilungen', 'https://www.kba.de/SharedDocs/RSS/DE/presse_news.xml', 'rss', 'official')
ON CONFLICT (url) DO NOTHING;

-- Recht & Compliance
INSERT INTO sources (industry_id, name, url, type, trust_level)
VALUES
  (3, 'LTO — Legal Tribune Online', 'https://www.lto.de/feed/',                         'rss', 'media'),
  (3, 'Compliance-Magazin',         'https://www.compliance-magazin.de/feed/',           'rss', 'media'),
  (3, 'Bundesrat — Aktuelles',      'https://www.bundesrat.de/DE/service/rss/aktuelles/aktuelles_node.xml', 'rss', 'official'),
  (3, 'EUR-Lex — Neue Rechtsakte',  'https://eur-lex.europa.eu/rss/news.xml',            'rss', 'official')
ON CONFLICT (url) DO NOTHING;
