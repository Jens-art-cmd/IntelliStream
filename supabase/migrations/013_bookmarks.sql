-- ── 013: Bookmarks / Lesezeichen ──────────────────────────────────
CREATE TABLE IF NOT EXISTS bookmarks (
  id          uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  article_id  uuid        NOT NULL REFERENCES articles(id)  ON DELETE CASCADE,
  created_at  timestamptz DEFAULT now() NOT NULL,
  UNIQUE (user_id, article_id)
);

-- Indizes für schnelle Abfragen
CREATE INDEX IF NOT EXISTS bookmarks_user_id_idx    ON bookmarks(user_id);
CREATE INDEX IF NOT EXISTS bookmarks_article_id_idx ON bookmarks(article_id);
CREATE INDEX IF NOT EXISTS bookmarks_created_at_idx ON bookmarks(user_id, created_at DESC);

-- Row Level Security
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own bookmarks"
  ON bookmarks FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own bookmarks"
  ON bookmarks FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own bookmarks"
  ON bookmarks FOR DELETE
  USING (auth.uid() = user_id);
