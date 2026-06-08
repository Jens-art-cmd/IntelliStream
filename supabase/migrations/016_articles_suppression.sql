-- Migration 016: Relevanz-Untergrenze — unterdrückte Artikel ausblenden
-- Artikel mit relevance_score < 45 werden vom Processor als is_suppressed = true markiert.
-- Diese Artikel werden im Feed nicht angezeigt, bleiben aber in der DB für Analyse.

ALTER TABLE articles
  ADD COLUMN IF NOT EXISTS is_suppressed BOOLEAN NOT NULL DEFAULT false;

-- Index für schnelle Feed-Abfragen (häufigster Query-Filter)
CREATE INDEX IF NOT EXISTS articles_not_suppressed_idx
  ON articles (industry_id, published_at DESC)
  WHERE is_suppressed = false;

COMMENT ON COLUMN articles.is_suppressed IS
  'Wird vom Processor gesetzt wenn relevance_score < MIN_PUBLISH_SCORE (45). '
  'Artikel mit is_suppressed=true erscheinen nicht im Feed, bleiben aber für Analyse erhalten.';
