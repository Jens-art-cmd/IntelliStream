-- User-defined keyword/topic alerts
create type alert_channel as enum ('email', 'push', 'both');

create table user_alerts (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references users(id) on delete cascade,
  name        text not null,
  keywords    text[] not null default '{}',
  companies   text[] not null default '{}',
  laws        text[] not null default '{}',
  min_impact  impact_level not null default 'medium',
  channel     alert_channel not null default 'both',
  is_active   boolean not null default true,
  created_at  timestamptz not null default now()
);

create index user_alerts_user_idx on user_alerts(user_id);

alter table user_alerts enable row level security;

create policy "Users manage own alerts"
  on user_alerts for all
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Service role manages alerts"
  on user_alerts for all
  using (auth.role() = 'service_role');
