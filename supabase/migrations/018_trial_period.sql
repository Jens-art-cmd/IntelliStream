-- Add trial columns
ALTER TABLE users
  ADD COLUMN IF NOT EXISTS trial_started_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS trial_ends_at   TIMESTAMPTZ;

-- Backfill existing users
UPDATE users
SET
  trial_started_at = created_at,
  trial_ends_at    = created_at + INTERVAL '30 days'
WHERE trial_started_at IS NULL;

-- Update signup trigger to set trial on new accounts
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO public.users (id, email, name, trial_started_at, trial_ends_at)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    NOW(),
    NOW() + INTERVAL '30 days'
  );
  RETURN NEW;
END;
$$;
