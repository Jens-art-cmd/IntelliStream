-- Migration 017: RSS-Description in articles speichern
-- Der Scout liest die <description> / <summary> aus dem RSS-Feed.
-- Der Processor nutzt diese als primäre Inhaltsquelle statt Jina-Volltext.
-- Spart ~70% API-Kosten (weniger Input-Tokens, kein Jina-Overhead).

ALTER TABLE articles
  ADD COLUMN IF NOT EXISTS rss_description TEXT;

COMMENT ON COLUMN articles.rss_description IS
  'Originaltext aus dem RSS-Feed (<description> / <summary>). '
  'Wird vom Processor als primäre Inhaltsquelle verwendet. '
  'Jina-Volltext-Fetch nur als Fallback wenn NULL oder zu kurz (<150 Zeichen).';
