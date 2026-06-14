-- Migration 027: Fehlende Hochwertige Quellen ergänzen
-- Behebt identifizierte Lücken in der Quellenabdeckung je Branche

INSERT INTO sources (industry_id, name, url, type, trust_level) VALUES

-- ── IT & Cybersecurity (4): CVE-Feeds für Security-Officer ───────────────────
-- NIST NVD: kritischste Schwachstellen-Datenbank weltweit
(4, 'NIST NVD — Kritische CVEs (CVSS ≥ 9.0)', 'https://nvd.nist.gov/feeds/xml/cve/misc/nvd-rss-analyzed.xml', 'rss', 'official'),
-- CISA: US-Behörde für kritische Infrastruktur-Warnungen (international relevant)
(4, 'CISA — Known Exploited Vulnerabilities', 'https://www.cisa.gov/cybersecurity-advisories/all.xml', 'rss', 'official'),
-- The Hacker News: schnellste CVE-Berichterstattung
(4, 'The Hacker News', 'https://feeds.feedburner.com/TheHackersNews', 'rss', 'media'),
-- Krebs on Security: investigativer Sicherheitsjournalismus
(4, 'Krebs on Security', 'https://krebsonsecurity.com/feed/', 'rss', 'media'),

-- ── Finanzen & Kapitalmarkt (6): Praxis-Quellen ergänzen ─────────────────────
-- ESMA: EU-Wertpapieraufsicht — für Compliance unverzichtbar
(6, 'ESMA — Pressemitteilungen', 'https://www.esma.europa.eu/rss.xml', 'rss', 'official'),
-- EZB: Geldpolitik direkt von der Quelle
(6, 'EZB — Pressemitteilungen', 'https://www.ecb.europa.eu/rss/press.html', 'rss', 'official'),
-- Finanz-Szene: FinTech & Banking-Praxis Deutschland
(6, 'Börsen-Zeitung', 'https://www.boersen-zeitung.de/feed/nachrichten', 'rss', 'media'),
(6, 'Finance Magazin', 'https://www.finance-magazin.de/feed/', 'rss', 'media'),

-- ── Energie & Erneuerbare (1): Preisdaten & Netzbetreiber ────────────────────
-- Agora Energiewende: führender Think Tank, praxisrelevante Analysen
(1, 'Agora Energiewende — Publikationen', 'https://www.agora-energiewende.de/feed/', 'rss', 'official'),
-- Fraunhofer ISE: Forschung & Marktdaten Solar/Energie
(1, 'Fraunhofer ISE — Neuigkeiten', 'https://www.ise.fraunhofer.de/de/presse-und-medien/rss.xml', 'rss', 'official'),
-- PV Magazine: Photovoltaik & Energiewende
(1, 'PV Magazine Deutschland', 'https://www.pv-magazine.de/feed/', 'rss', 'media'),
-- Energy Monitor: EU-Energiepolitik auf Englisch
(1, 'Energy Monitor', 'https://www.energymonitor.ai/feed/', 'rss', 'media'),

-- ── Recht & Compliance (3): Gerichts-Feeds präzisieren ───────────────────────
-- BVerfG: Verfassungsgerichtsentscheidungen
(3, 'BVerfG — Pressemitteilungen', 'https://www.bundesverfassungsgericht.de/RSS/Pressemitteilungen/rss.xml', 'rss', 'official'),
-- BGH: Bundesgerichtshof Entscheidungen
(3, 'BGH — Pressemitteilungen', 'https://www.bundesgerichtshof.de/SharedDocs/RSS/DE/presse.xml', 'rss', 'official'),
-- Compliance Manager: Praxis-Fachmedium
(3, 'Compliance Manager Magazin', 'https://www.compliance-manager.net/feed/', 'rss', 'media'),

-- ── Automotive & Mobilität (8): VDA-Direktquelle ─────────────────────────────
-- electrive.net: führendes Medium für E-Mobilität/Ladeinfrastruktur
(8, 'electrive.net', 'https://www.electrive.net/feed/', 'rss', 'media'),
-- Automobil Produktion: B2B Automotive-Produktion
(8, 'Automobil Produktion', 'https://www.automobil-produktion.de/feed/', 'rss', 'media'),
-- ADAC Motorsport/Technik: Rückruf-Berichte, Fahrzeugsicherheit
(8, 'ACEA — Pressemitteilungen', 'https://www.acea.auto/feed/', 'rss', 'official')

ON CONFLICT (url) DO NOTHING;
