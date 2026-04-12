-- Feature 1: Admin-configurable premium plan ID for in-app purchases
ALTER TABLE app_settings ADD COLUMN IF NOT EXISTS premium_plan_id TEXT DEFAULT '';

-- Feature 2: Optional external URL on all content types (e.g. link to Whop course)
ALTER TABLE meditations ADD COLUMN IF NOT EXISTS external_url TEXT DEFAULT '';
ALTER TABLE hypnosis_sessions ADD COLUMN IF NOT EXISTS external_url TEXT DEFAULT '';
ALTER TABLE programs ADD COLUMN IF NOT EXISTS external_url TEXT DEFAULT '';
ALTER TABLE quick_resets ADD COLUMN IF NOT EXISTS external_url TEXT DEFAULT '';
ALTER TABLE knowledge_articles ADD COLUMN IF NOT EXISTS external_url TEXT DEFAULT '';
