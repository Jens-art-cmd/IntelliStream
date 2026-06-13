-- N-3: Newsletter Öffnungsraten-Tracking
-- Verknüpft Resend-Webhook-Events mit newsletters-Tabellenzeilen

alter table newsletters
  add column if not exists resend_email_id text,
  add column if not exists opened_at       timestamptz,
  add column if not exists clicked_at      timestamptz;

-- Index für schnelle Webhook-Lookups via Resend-ID
create index if not exists newsletters_resend_id_idx
  on newsletters(resend_email_id)
  where resend_email_id is not null;
