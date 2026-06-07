-- Users table extends Supabase auth.users
create type plan_type              as enum ('free', 'starter', 'pro', 'enterprise');
create type newsletter_frequency   as enum ('daily', 'weekly', 'realtime');

create table users (
  id                      uuid primary key references auth.users(id) on delete cascade,
  email                   text not null unique,
  name                    text,
  plan                    plan_type not null default 'free',
  industry_subscriptions  integer[] not null default '{}',  -- FK to industries.id
  newsletter_frequency    newsletter_frequency not null default 'weekly',
  newsletter_time         time not null default '07:00:00',
  stripe_customer_id      text unique,
  stripe_subscription_id  text unique,
  newsletter_opt_in       boolean not null default false,   -- Double-Opt-In (§7 UWG)
  newsletter_opt_in_at    timestamptz,
  deletion_requested_at   timestamptz,                      -- DSGVO right to erasure
  created_at              timestamptz not null default now(),
  updated_at              timestamptz not null default now()
);

-- Trigger: auto-update updated_at
create or replace function update_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger users_updated_at
  before update on users
  for each row execute function update_updated_at();

-- RLS: users can only see/edit their own row
alter table users enable row level security;

create policy "Users can read own profile"
  on users for select
  to authenticated
  using (auth.uid() = id);

create policy "Users can update own profile"
  on users for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

create policy "Service role manages users"
  on users for all
  using (auth.role() = 'service_role');

-- Auto-create user profile on signup
create or replace function handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.users (id, email, name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1))
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();
