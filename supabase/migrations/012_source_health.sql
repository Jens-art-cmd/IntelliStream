-- Migration 012: Source health tracking + seed all known sources
-- Adds health columns to sources table and seeds all currently hardcoded sources.

-- Ensure unique constraint on url so ON CONFLICT (url) works for seeding.
ALTER TABLE sources
  ADD CONSTRAINT sources_url_unique UNIQUE (url);

ALTER TABLE sources
  ADD COLUMN IF NOT EXISTS consecutive_failures integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS health_status text NOT NULL DEFAULT 'unknown',
  ADD COLUMN IF NOT EXISTS last_health_check timestamptz,
  ADD COLUMN IF NOT EXISTS last_error text;

-- health_status values: 'healthy' | 'degraded' | 'broken' | 'unknown'
COMMENT ON COLUMN sources.health_status IS 'Values: healthy, degraded, broken, unknown';
COMMENT ON COLUMN sources.consecutive_failures IS 'Number of consecutive failed health checks';
COMMENT ON COLUMN sources.last_health_check IS 'Timestamp of the most recent health check run';
COMMENT ON COLUMN sources.last_error IS 'Last error message or replacement note';

-- -------------------------------------------------------------------------
-- Seed Industry 1 — Energie & Erneuerbare
-- -------------------------------------------------------------------------
INSERT INTO sources (industry_id, name, url, type, trust_level)
VALUES
  (1, 'PV Magazine',       'https://www.pv-magazine.de/feed/',         'rss', 'media'),
  (1, 'Solarserver',       'https://www.solarserver.de/feed/',         'rss', 'media'),
  (1, 'Clean Energy Wire', 'https://www.cleanenergywire.org/rss.xml',  'rss', 'media')
ON CONFLICT (url) DO NOTHING;

-- -------------------------------------------------------------------------
-- Seed Industry 3 — Recht & Compliance
-- -------------------------------------------------------------------------
INSERT INTO sources (industry_id, name, url, type, trust_level)
VALUES
  (3, 'DSGVO-Gesetz.de',             'https://dsgvo-gesetz.de/feed/',                       'rss', 'media'),
  (3, 'Datenschutz-Notizen',          'https://www.datenschutz-notizen.de/feed/',             'rss', 'media'),
  (3, 'Datenschutzbeauftragter Info', 'https://www.datenschutzbeauftragter-info.de/feed/',    'rss', 'media'),
  (3, 'JUVE Rechtsmarkt',             'https://www.juve.de/feed',                            'rss', 'media'),
  (3, 'Datenschutz-Praxis',           'https://www.datenschutz-praxis.de/feed/',             'rss', 'media')
ON CONFLICT (url) DO NOTHING;

-- -------------------------------------------------------------------------
-- Seed Industry 4 — IT & Cybersecurity
-- -------------------------------------------------------------------------
INSERT INTO sources (industry_id, name, url, type, trust_level)
VALUES
  (4, 'Heise Security',    'https://heise.de/security/rss/news-atom.xml',        'rss', 'media'),
  (4, 'Heise Online',      'https://www.heise.de/rss/heise-atom.xml',            'rss', 'media'),
  (4, 'The Hacker News',   'https://feeds.feedburner.com/TheHackersNews',        'rss', 'media'),
  (4, 'Golem.de',          'https://rss.golem.de/rss.php?feed=RSS2.0',           'rss', 'media'),
  (4, 'Infopoint Security','https://www.infopoint-security.de/rss/',             'rss', 'media')
ON CONFLICT (url) DO NOTHING;

-- -------------------------------------------------------------------------
-- Seed Industry 6 — Finanzen & Kapitalmarkt
-- -------------------------------------------------------------------------
INSERT INTO sources (industry_id, name, url, type, trust_level)
VALUES
  (6, 'Handelsblatt Finanzen',   'https://www.handelsblatt.com/contentexport/feed/finanzen', 'rss', 'media'),
  (6, 'FAZ Finanzen',            'https://www.faz.net/rss/aktuell/finanzen/',                'rss', 'media'),
  (6, 'FAZ Wirtschaft',          'https://www.faz.net/rss/aktuell/wirtschaft/',              'rss', 'media'),
  (6, 'EZB Pressemitteilungen',  'https://www.ecb.europa.eu/rss/press.html',                'rss', 'official')
ON CONFLICT (url) DO NOTHING;

-- -------------------------------------------------------------------------
-- Seed Industry 8 — Automotive & Mobilität
-- -------------------------------------------------------------------------
INSERT INTO sources (industry_id, name, url, type, trust_level)
VALUES
  (8, 'ACEA (European Automobile Manufacturers)', 'https://www.acea.auto/rss/',                   'rss', 'official'),
  (8, 'Automobilwoche',                           'https://feeds.feedburner.com/automobilwoche',  'rss', 'media'),
  (8, 'electrive.net',                            'https://www.electrive.net/feed/',              'rss', 'media')
ON CONFLICT (url) DO NOTHING;
