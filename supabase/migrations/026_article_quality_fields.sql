-- Migration 026: Artikel-Qualitätsfelder für konkretere B2B-Aufbereitung
--
-- action_required  → "Was muss ich jetzt tun?" (1-2 Sätze, konkret)
-- affected_roles   → "Wer ist betroffen?" (z.B. "Compliance-Beauftragte, IT-Leiter")
-- deadline_hint    → "Bis wann?" (z.B. "17. Januar 2025" oder null wenn nicht relevant)
-- duplicate_group  → UUID: Artikel über dasselbe Ereignis bekommen dieselbe ID
--                    Nur der mit dem höchsten relevance_score bleibt sichtbar (is_suppressed = false)

ALTER TABLE articles
  ADD COLUMN IF NOT EXISTS action_required  TEXT,
  ADD COLUMN IF NOT EXISTS affected_roles   TEXT,
  ADD COLUMN IF NOT EXISTS deadline_hint    TEXT,
  ADD COLUMN IF NOT EXISTS duplicate_group  UUID;

-- Index für Duplikat-Abfragen
CREATE INDEX IF NOT EXISTS idx_articles_duplicate_group
  ON articles (duplicate_group)
  WHERE duplicate_group IS NOT NULL;

-- Index für Duplikat-Erkennung: Suche nach unverarbeiteten Artikeln je Branche
CREATE INDEX IF NOT EXISTS idx_articles_dedup_lookup
  ON articles (industry_id, ingested_at DESC)
  WHERE embedding IS NOT NULL AND processed_at IS NOT NULL;
