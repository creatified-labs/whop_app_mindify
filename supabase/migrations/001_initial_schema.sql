-- Mindify Database Schema
-- Migration 001: Initial Schema
-- Created: 2026-01-26

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================================================
-- TABLE: users_metadata
-- Description: Extends Whop user data with app-specific metadata
-- =============================================================================
CREATE TABLE IF NOT EXISTS users_metadata (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    whop_user_id TEXT UNIQUE NOT NULL,
    display_name TEXT,
    email TEXT,
    membership_tier TEXT DEFAULT 'free' CHECK (membership_tier IN ('free', 'premium')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_users_metadata_whop_user_id ON users_metadata(whop_user_id);
CREATE INDEX idx_users_metadata_membership_tier ON users_metadata(membership_tier);

-- =============================================================================
-- TABLE: program_progress
-- Description: Tracks user progress through transformation programs
-- =============================================================================
CREATE TABLE IF NOT EXISTS program_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT NOT NULL REFERENCES users_metadata(whop_user_id) ON DELETE CASCADE,
    program_id TEXT NOT NULL,
    current_day INTEGER DEFAULT 1 CHECK (current_day >= 1),
    completed_days INTEGER[] DEFAULT '{}',
    enrolled_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_updated TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    streak INTEGER DEFAULT 0 CHECK (streak >= 0),
    completed_at TIMESTAMPTZ,
    UNIQUE(user_id, program_id)
);

CREATE INDEX idx_program_progress_user_id ON program_progress(user_id);
CREATE INDEX idx_program_progress_program_id ON program_progress(program_id);
CREATE INDEX idx_program_progress_user_program ON program_progress(user_id, program_id);

-- =============================================================================
-- TABLE: program_journal_entries
-- Description: Stores user journal entries for program days
-- =============================================================================
CREATE TABLE IF NOT EXISTS program_journal_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT NOT NULL REFERENCES users_metadata(whop_user_id) ON DELETE CASCADE,
    program_id TEXT NOT NULL,
    day_number INTEGER NOT NULL CHECK (day_number >= 1),
    entry TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, program_id, day_number)
);

CREATE INDEX idx_journal_user_id ON program_journal_entries(user_id);
CREATE INDEX idx_journal_program_id ON program_journal_entries(program_id);
CREATE INDEX idx_journal_user_program_day ON program_journal_entries(user_id, program_id, day_number);

-- =============================================================================
-- TABLE: user_activity
-- Description: Tracks meditation, hypnosis, and reset completions
-- =============================================================================
CREATE TABLE IF NOT EXISTS user_activity (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT NOT NULL REFERENCES users_metadata(whop_user_id) ON DELETE CASCADE,
    activity_type TEXT NOT NULL CHECK (activity_type IN ('meditation', 'hypnosis', 'reset', 'program_day')),
    content_id TEXT NOT NULL,
    duration_minutes INTEGER CHECK (duration_minutes >= 0),
    completed_at TIMESTAMPTZ DEFAULT NOW(),
    metadata JSONB
);

CREATE INDEX idx_activity_user_id ON user_activity(user_id);
CREATE INDEX idx_activity_type ON user_activity(activity_type);
CREATE INDEX idx_activity_content_id ON user_activity(content_id);
CREATE INDEX idx_activity_completed_at ON user_activity(completed_at DESC);
CREATE INDEX idx_activity_user_completed ON user_activity(user_id, completed_at DESC);

-- =============================================================================
-- TABLE: user_favorites
-- Description: Stores user's favorite content (meditations, programs, etc.)
-- =============================================================================
CREATE TABLE IF NOT EXISTS user_favorites (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT NOT NULL REFERENCES users_metadata(whop_user_id) ON DELETE CASCADE,
    content_type TEXT NOT NULL CHECK (content_type IN ('meditation', 'hypnosis', 'program', 'reset', 'article')),
    content_id TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, content_type, content_id)
);

CREATE INDEX idx_favorites_user_id ON user_favorites(user_id);
CREATE INDEX idx_favorites_content_type ON user_favorites(content_type);
CREATE INDEX idx_favorites_user_content ON user_favorites(user_id, content_type);

-- =============================================================================
-- TABLE: community_posts
-- Description: Community posts (check-ins, weekly wins, reflections)
-- =============================================================================
CREATE TABLE IF NOT EXISTS community_posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT NOT NULL REFERENCES users_metadata(whop_user_id) ON DELETE CASCADE,
    post_type TEXT NOT NULL CHECK (post_type IN ('check_in', 'weekly_win', 'reflection')),
    content TEXT NOT NULL,
    program_id TEXT,
    visibility TEXT DEFAULT 'members_only' CHECK (visibility IN ('public', 'members_only')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_posts_user_id ON community_posts(user_id);
CREATE INDEX idx_posts_post_type ON community_posts(post_type);
CREATE INDEX idx_posts_created_at ON community_posts(created_at DESC);
CREATE INDEX idx_posts_program_id ON community_posts(program_id);

-- =============================================================================
-- FUNCTION: update_updated_at_column
-- Description: Automatically updates the updated_at timestamp
-- =============================================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =============================================================================
-- TRIGGERS: Auto-update timestamps
-- =============================================================================
CREATE TRIGGER update_users_metadata_updated_at
    BEFORE UPDATE ON users_metadata
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_program_progress_updated_at
    BEFORE UPDATE ON program_progress
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_journal_entries_updated_at
    BEFORE UPDATE ON program_journal_entries
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_community_posts_updated_at
    BEFORE UPDATE ON community_posts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =============================================================================
-- COMMENTS: Table documentation
-- =============================================================================
COMMENT ON TABLE users_metadata IS 'Extends Whop user data with app-specific metadata and membership tier';
COMMENT ON TABLE program_progress IS 'Tracks user progress through transformation programs';
COMMENT ON TABLE program_journal_entries IS 'Stores user journal entries for program days';
COMMENT ON TABLE user_activity IS 'Tracks meditation, hypnosis, and reset completions';
COMMENT ON TABLE user_favorites IS 'Stores user favorite content across all content types';
COMMENT ON TABLE community_posts IS 'Community posts including check-ins, weekly wins, and reflections';
