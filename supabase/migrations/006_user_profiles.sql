-- User profiles — personalization vectors and preferences
create type summary_length_pref as enum ('short', 'medium', 'long');

create table user_profiles (
  user_id                uuid primary key references users(id) on delete cascade,
  interest_vector        vector(1536),      -- pgvector embedding of user interests
  preferred_tags         text[] not null default '{}',
  excluded_tags          text[] not null default '{}',
  avg_read_depth         float not null default 0.5 check (avg_read_depth >= 0 and avg_read_depth <= 1),
  preferred_summary_length summary_length_pref not null default 'medium',
  updated_at             timestamptz not null default now()
);

create index user_profiles_vector_idx on user_profiles
  using hnsw (interest_vector vector_cosine_ops)
  with (m = 16, ef_construction = 64);

alter table user_profiles enable row level security;

create policy "Users can read own profile"
  on user_profiles for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Users can update own profile"
  on user_profiles for update
  to authenticated
  using (auth.uid() = user_id);

create policy "Service role manages user_profiles"
  on user_profiles for all
  using (auth.role() = 'service_role');

-- Auto-create empty profile on user creation
create or replace function handle_new_user_profile()
returns trigger language plpgsql security definer as $$
begin
  insert into public.user_profiles (user_id)
  values (new.id)
  on conflict (user_id) do nothing;
  return new;
end;
$$;

create trigger on_user_created_profile
  after insert on public.users
  for each row execute function handle_new_user_profile();
