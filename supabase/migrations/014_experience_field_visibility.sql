-- Per-field visibility for the experience view copy.
--
-- experience_fields stores booleans keyed by ExperienceCopy key (e.g.
-- {"heroEyebrow": false, "favoritesSubtitle": false}). Missing keys default
-- to visible (true). This is independent of experience_sections, which hides
-- entire sections; experience_fields hides individual labels/headings/bodies
-- within a section.

ALTER TABLE app_settings
  ADD COLUMN IF NOT EXISTS experience_fields JSONB NOT NULL DEFAULT '{}'::jsonb;
