-- K-1: Tracking welche Trial-Reminder bereits gesendet wurden
alter table users
  add column if not exists trial_reminder_7d_sent_at  timestamptz,
  add column if not exists trial_reminder_1d_sent_at  timestamptz,
  add column if not exists trial_expired_sent_at      timestamptz;
