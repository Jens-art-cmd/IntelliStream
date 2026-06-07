-- Sources table — one row per crawlable source per industry
create type source_type   as enum ('rss', 'api', 'crawler', 'email');
create type trust_level   as enum ('official', 'media', 'blog');

create table sources (
  id                   uuid primary key default gen_random_uuid(),
  industry_id          integer not null references industries(id) on delete cascade,
  name                 text not null,
  url                  text not null,
  type                 source_type not null,
  trust_level          trust_level not null default 'media',
  is_active            boolean not null default true,
  last_crawled         timestamptz,
  articles_per_day_avg float,
  config               jsonb not null default '{}',  -- source-specific crawler settings
  created_at           timestamptz not null default now()
);

create index sources_industry_idx on sources(industry_id);

alter table sources enable row level security;
create policy "Sources are public"
  on sources for select
  using (true);

-- Service-role can manage sources
create policy "Service role manages sources"
  on sources for all
  using (auth.role() = 'service_role');
