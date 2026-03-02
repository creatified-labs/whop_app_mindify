-- App Settings: single-row table for admin-configurable settings
CREATE TABLE IF NOT EXISTS app_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  app_name TEXT NOT NULL DEFAULT 'Mindify',
  app_tagline TEXT NOT NULL DEFAULT 'Transform your mind, one session at a time',
  welcome_message TEXT NOT NULL DEFAULT 'Welcome to your mindfulness journey',
  support_email TEXT NOT NULL DEFAULT '',
  monthly_price NUMERIC(10,2) NOT NULL DEFAULT 14.99,
  annual_price NUMERIC(10,2) NOT NULL DEFAULT 149.99,
  free_meditation_limit INTEGER NOT NULL DEFAULT 5,
  free_hypnosis_limit INTEGER NOT NULL DEFAULT 2,
  free_program_limit INTEGER NOT NULL DEFAULT 1,
  email_notifications BOOLEAN NOT NULL DEFAULT true,
  streak_reminders BOOLEAN NOT NULL DEFAULT true,
  weekly_digest BOOLEAN NOT NULL DEFAULT false,
  new_content_alerts BOOLEAN NOT NULL DEFAULT true,
  maintenance_mode BOOLEAN NOT NULL DEFAULT false,
  analytics_tracking BOOLEAN NOT NULL DEFAULT true,
  debug_mode BOOLEAN NOT NULL DEFAULT false,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Seed a single default row
INSERT INTO app_settings (id) VALUES (gen_random_uuid());
