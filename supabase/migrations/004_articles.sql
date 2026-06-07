-- Articles table — core content store
create type impact_level as enum ('high', 'medium', 'low');

create table articles (
  id               uuid primary key default gen_random_uuid(),
  source_url       text not null unique,
  title            text not null,
  full_text        text,               -- only stored for open/RSS sources (DSGVO)
  summary_short    text,               -- 1-sentence push summary
  summary_medium   text,               -- 3-sentence dashboard summary
  summary_long     text,               -- full AI-generated summary
  industry_id      integer not null references industries(id),
  source_id        uuid references sources(id),
  tags             text[] not null default '{}',
  relevance_score  float check (relevance_score >= 0 and relevance_score <= 100),
  impact_level     impact_level,
  impact_reason    text,               -- explanation from Impact-Assessor
  trust_score      float check (trust_score >= 0 and trust_score <= 1),
  published_at     timestamptz,
  ingested_at      timestamptz not null default now(),
  processed_at     timestamptz,        -- when agent pipeline completed
  embedding        vector(1536),       -- text-embedding-3-small via pgvector
  language         text not null default 'de',
  is_breaking      boolean not null default false
);

-- Indexes for common query patterns
create index articles_industry_idx      on articles(industry_id);
create index articles_published_idx     on articles(published_at desc);
create index articles_relevance_idx     on articles(relevance_score desc);
create index articles_impact_idx        on articles(impact_level);
create index articles_tags_idx          on articles using gin(tags);
create index articles_ingested_idx      on articles(ingested_at desc);
-- Full-text search index
create index articles_title_fts_idx     on articles using gin(to_tsvector('german', title));
-- Vector similarity index (HNSW for fast ANN search)
create index articles_embedding_idx     on articles using hnsw (embedding vector_cosine_ops)
  with (m = 16, ef_construction = 64);

-- Articles are readable by authenticated users (RLS applied per subscription in API)
alter table articles enable row level security;

create policy "Authenticated users can read articles"
  on articles for select
  to authenticated
  using (true);

create policy "Anonymous users can read articles"
  on articles for select
  to anon
  using (true);

create policy "Service role manages articles"
  on articles for all
  using (auth.role() = 'service_role');
