-- =============================================================================
-- MIGRATION 011: Add attachments JSONB column to knowledge_articles
-- Description: Allows articles to reference uploaded media (audio, video, links)
-- =============================================================================

ALTER TABLE knowledge_articles
  ADD COLUMN IF NOT EXISTS attachments JSONB DEFAULT '[]';

COMMENT ON COLUMN knowledge_articles.attachments IS 'Array of {url, title, type} objects linking to media library items';
