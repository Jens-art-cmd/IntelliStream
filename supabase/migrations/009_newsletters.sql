-- Sent newsletter log
create table newsletters (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references users(id) on delete cascade,
  sent_at      timestamptz not null default now(),
  article_ids  uuid[] not null default '{}',
  subject_line text not null,
  html_content text not null,
  variant      text,          -- A/B test variant identifier
  open_rate    float,
  click_rate   float,
  bounced      boolean not null default false
);

create index newsletters_user_idx  on newsletters(user_id);
create index newsletters_sent_idx  on newsletters(sent_at desc);

alter table newsletters enable row level security;

create policy "Users can read own newsletters"
  on newsletters for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Service role manages newsletters"
  on newsletters for all
  using (auth.role() = 'service_role');

-- Double-Opt-In tokens (§7 UWG)
create table newsletter_opt_in_tokens (
  token       uuid primary key default gen_random_uuid(),
  user_id     uuid not null references users(id) on delete cascade,
  expires_at  timestamptz not null default (now() + interval '24 hours'),
  used_at     timestamptz
);

alter table newsletter_opt_in_tokens enable row level security;
create policy "Service role manages opt-in tokens"
  on newsletter_opt_in_tokens for all
  using (auth.role() = 'service_role');
