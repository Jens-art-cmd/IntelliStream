-- 1. Unique-Index auf normalisierte source_url (Query-Parameter abschneiden)
--    Verhindert Heise-Duplikate (?wt_mc=... vs. ohne)
CREATE UNIQUE INDEX IF NOT EXISTS articles_source_url_normalized_idx
  ON articles (split_part(source_url, '?', 1));

-- 2. Unique-Index auf (title, industry_id) als zweites Sicherheitsnetz
--    Verhindert FAZ/Handelsblatt-Duplikate mit unterschiedlichen URL-Slugs
CREATE UNIQUE INDEX IF NOT EXISTS articles_title_industry_idx
  ON articles (title, industry_id);
