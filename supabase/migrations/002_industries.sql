-- Industries table (no RLS needed — public reference data)
create table industries (
  id                     integer primary key,
  name                   text not null,
  slug                   text not null unique,
  description            text,
  sources                jsonb not null default '[]',   -- array of source config objects
  tags_taxonomy          jsonb not null default '{}',   -- topic ontology per industry
  crawl_interval_minutes integer not null default 60,
  is_active              boolean not null default true,
  created_at             timestamptz not null default now()
);

comment on table industries is 'The 20 verticals that IntelliStream covers. Reference data, publicly readable.';

-- Publicly readable — no RLS required
alter table industries enable row level security;
create policy "Industries are public"
  on industries for select
  using (true);
