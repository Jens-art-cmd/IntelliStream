-- ── 028: Saved Searches / Gespeicherte Suchen ─────────────────────────────────
CREATE TABLE IF NOT EXISTS saved_searches (
  id               uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id          uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name             text        NOT NULL,
  query            text        NOT NULL DEFAULT '',
  impact_filter    text        CHECK (impact_filter IN ('high', 'medium', 'low')),
  industry_ids     int[]       DEFAULT '{}',
  created_at       timestamptz DEFAULT now() NOT NULL,
  UNIQUE (user_id, name)
);

CREATE INDEX IF NOT EXISTS saved_searches_user_id_idx ON saved_searches(user_id, created_at DESC);

ALTER TABLE saved_searches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own saved searches"
  ON saved_searches FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own saved searches"
  ON saved_searches FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own saved searches"
  ON saved_searches FOR DELETE
  USING (auth.uid() = user_id);
