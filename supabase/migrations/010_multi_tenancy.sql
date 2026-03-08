-- Mindify Database Schema
-- Migration 010: Multi-Tenancy Support
-- Created: 2026-03-08
-- Description: Adds company_id to all tables so each Whop company gets isolated data

-- =============================================================================
-- CONTENT TABLES: Add company_id
-- =============================================================================

-- meditations
ALTER TABLE meditations ADD COLUMN company_id TEXT;
UPDATE meditations SET company_id = 'default' WHERE company_id IS NULL;
ALTER TABLE meditations ALTER COLUMN company_id SET NOT NULL;
ALTER TABLE meditations DROP CONSTRAINT meditations_pkey;
ALTER TABLE meditations ADD PRIMARY KEY (company_id, id);
CREATE INDEX idx_meditations_company_id ON meditations(company_id);

-- hypnosis_sessions
ALTER TABLE hypnosis_sessions ADD COLUMN company_id TEXT;
UPDATE hypnosis_sessions SET company_id = 'default' WHERE company_id IS NULL;
ALTER TABLE hypnosis_sessions ALTER COLUMN company_id SET NOT NULL;
ALTER TABLE hypnosis_sessions DROP CONSTRAINT hypnosis_sessions_pkey;
ALTER TABLE hypnosis_sessions ADD PRIMARY KEY (company_id, id);
CREATE INDEX idx_hypnosis_company_id ON hypnosis_sessions(company_id);

-- programs
ALTER TABLE programs ADD COLUMN company_id TEXT;
UPDATE programs SET company_id = 'default' WHERE company_id IS NULL;
ALTER TABLE programs ALTER COLUMN company_id SET NOT NULL;
ALTER TABLE programs DROP CONSTRAINT programs_pkey;
ALTER TABLE programs ADD PRIMARY KEY (company_id, id);
CREATE INDEX idx_programs_company_id ON programs(company_id);

-- quick_resets
ALTER TABLE quick_resets ADD COLUMN company_id TEXT;
UPDATE quick_resets SET company_id = 'default' WHERE company_id IS NULL;
ALTER TABLE quick_resets ALTER COLUMN company_id SET NOT NULL;
ALTER TABLE quick_resets DROP CONSTRAINT quick_resets_pkey;
ALTER TABLE quick_resets ADD PRIMARY KEY (company_id, id);
CREATE INDEX idx_quick_resets_company_id ON quick_resets(company_id);

-- knowledge_articles
ALTER TABLE knowledge_articles ADD COLUMN company_id TEXT;
UPDATE knowledge_articles SET company_id = 'default' WHERE company_id IS NULL;
ALTER TABLE knowledge_articles ALTER COLUMN company_id SET NOT NULL;
ALTER TABLE knowledge_articles DROP CONSTRAINT knowledge_articles_pkey;
ALTER TABLE knowledge_articles ADD PRIMARY KEY (company_id, slug);
CREATE INDEX idx_articles_company_id ON knowledge_articles(company_id);

-- media_library
ALTER TABLE media_library ADD COLUMN company_id TEXT;
UPDATE media_library SET company_id = 'default' WHERE company_id IS NULL;
ALTER TABLE media_library ALTER COLUMN company_id SET NOT NULL;
CREATE INDEX idx_media_library_company_id ON media_library(company_id);

-- =============================================================================
-- APP SETTINGS: Add company_id (one row per company instead of singleton)
-- =============================================================================
ALTER TABLE app_settings ADD COLUMN company_id TEXT;
UPDATE app_settings SET company_id = 'default' WHERE company_id IS NULL;
ALTER TABLE app_settings ALTER COLUMN company_id SET NOT NULL;
ALTER TABLE app_settings ADD CONSTRAINT app_settings_company_id_unique UNIQUE (company_id);
CREATE INDEX idx_app_settings_company_id ON app_settings(company_id);

-- =============================================================================
-- USER TABLES: Add company_id
-- =============================================================================

-- users_metadata: a user can exist in multiple companies
ALTER TABLE users_metadata ADD COLUMN company_id TEXT;
UPDATE users_metadata SET company_id = 'default' WHERE company_id IS NULL;
ALTER TABLE users_metadata ALTER COLUMN company_id SET NOT NULL;
ALTER TABLE users_metadata DROP CONSTRAINT users_metadata_whop_user_id_key;
ALTER TABLE users_metadata ADD CONSTRAINT users_metadata_company_user_unique UNIQUE (company_id, whop_user_id);
CREATE INDEX idx_users_metadata_company_id ON users_metadata(company_id);

-- user_activity
ALTER TABLE user_activity ADD COLUMN company_id TEXT;
UPDATE user_activity SET company_id = 'default' WHERE company_id IS NULL;
ALTER TABLE user_activity ALTER COLUMN company_id SET NOT NULL;
CREATE INDEX idx_activity_company_id ON user_activity(company_id);

-- user_favorites: update unique constraint to include company_id
ALTER TABLE user_favorites ADD COLUMN company_id TEXT;
UPDATE user_favorites SET company_id = 'default' WHERE company_id IS NULL;
ALTER TABLE user_favorites ALTER COLUMN company_id SET NOT NULL;
ALTER TABLE user_favorites DROP CONSTRAINT user_favorites_user_id_content_type_content_id_key;
ALTER TABLE user_favorites ADD CONSTRAINT user_favorites_company_user_content_unique UNIQUE (company_id, user_id, content_type, content_id);
CREATE INDEX idx_favorites_company_id ON user_favorites(company_id);

-- program_progress: update unique constraint
ALTER TABLE program_progress ADD COLUMN company_id TEXT;
UPDATE program_progress SET company_id = 'default' WHERE company_id IS NULL;
ALTER TABLE program_progress ALTER COLUMN company_id SET NOT NULL;
ALTER TABLE program_progress DROP CONSTRAINT program_progress_user_id_program_id_key;
ALTER TABLE program_progress ADD CONSTRAINT program_progress_company_user_program_unique UNIQUE (company_id, user_id, program_id);
CREATE INDEX idx_program_progress_company_id ON program_progress(company_id);

-- program_journal_entries: update unique constraint
ALTER TABLE program_journal_entries ADD COLUMN company_id TEXT;
UPDATE program_journal_entries SET company_id = 'default' WHERE company_id IS NULL;
ALTER TABLE program_journal_entries ALTER COLUMN company_id SET NOT NULL;
ALTER TABLE program_journal_entries DROP CONSTRAINT program_journal_entries_user_id_program_id_day_number_key;
ALTER TABLE program_journal_entries ADD CONSTRAINT journal_company_user_program_day_unique UNIQUE (company_id, user_id, program_id, day_number);
CREATE INDEX idx_journal_company_id ON program_journal_entries(company_id);

-- community_posts
ALTER TABLE community_posts ADD COLUMN company_id TEXT;
UPDATE community_posts SET company_id = 'default' WHERE company_id IS NULL;
ALTER TABLE community_posts ALTER COLUMN company_id SET NOT NULL;
CREATE INDEX idx_posts_company_id ON community_posts(company_id);
