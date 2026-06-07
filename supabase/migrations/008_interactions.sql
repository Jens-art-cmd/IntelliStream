-- User interaction events — feeds the personalization loop
create type interaction_event as enum (
  'open', 'click', 'read', 'skip', 'thumbs_up', 'thumbs_down', 'bookmark', 'share'
);

create table interactions (
  id                    uuid primary key default gen_random_uuid(),
  user_id               uuid not null references users(id) on delete cascade,
  article_id            uuid not null references articles(id) on delete cascade,
  event_type            interaction_event not null,
  read_duration_seconds integer,
  scroll_depth          float check (scroll_depth >= 0 and scroll_depth <= 1),
  occurred_at           timestamptz not null default now()
);

create index interactions_user_idx      on interactions(user_id);
create index interactions_article_idx   on interactions(article_id);
create index interactions_occurred_idx  on interactions(occurred_at desc);
create index interactions_user_time_idx on interactions(user_id, occurred_at desc);

alter table interactions enable row level security;

create policy "Users can insert own interactions"
  on interactions for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Users can read own interactions"
  on interactions for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Service role manages interactions"
  on interactions for all
  using (auth.role() = 'service_role');
