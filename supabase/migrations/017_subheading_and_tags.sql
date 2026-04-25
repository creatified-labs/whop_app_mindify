-- Add editable subheading + tags to knowledge_articles, and tags to programs.

ALTER TABLE knowledge_articles
  ADD COLUMN IF NOT EXISTS subheading TEXT NOT NULL DEFAULT '';

ALTER TABLE knowledge_articles
  ADD COLUMN IF NOT EXISTS tags TEXT[] NOT NULL DEFAULT '{}';

ALTER TABLE programs
  ADD COLUMN IF NOT EXISTS tags TEXT[] NOT NULL DEFAULT '{}';
