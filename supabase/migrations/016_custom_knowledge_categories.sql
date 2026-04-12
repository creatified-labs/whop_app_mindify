-- Remove the hardcoded category CHECK constraint so admins can use any category
ALTER TABLE knowledge_articles DROP CONSTRAINT IF EXISTS knowledge_articles_category_check;
