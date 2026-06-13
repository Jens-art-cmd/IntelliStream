alter table users
  add column if not exists onboarding_email_sent_at timestamptz;
