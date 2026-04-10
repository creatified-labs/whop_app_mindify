-- Experience view customization: per-company copy overrides and section visibility toggles
--
-- Both columns are JSONB so we can evolve the set of customizable keys without
-- further migrations. Empty object = no overrides, fall back to hardcoded defaults
-- in lib/ui/experienceCopy.ts.

ALTER TABLE app_settings
  ADD COLUMN IF NOT EXISTS experience_copy     JSONB NOT NULL DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS experience_sections JSONB NOT NULL DEFAULT '{}'::jsonb;
