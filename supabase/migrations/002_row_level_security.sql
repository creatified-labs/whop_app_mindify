-- Mindify Database Schema
-- Migration 002: Row Level Security Policies
-- Created: 2026-01-26

-- =============================================================================
-- ENABLE ROW LEVEL SECURITY
-- =============================================================================
ALTER TABLE users_metadata ENABLE ROW LEVEL SECURITY;
ALTER TABLE program_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE program_journal_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_activity ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_posts ENABLE ROW LEVEL SECURITY;

-- =============================================================================
-- RLS POLICIES: users_metadata
-- Users can only read/update their own metadata
-- Service role can do everything (for webhook syncing)
-- =============================================================================
CREATE POLICY "Users can view their own metadata"
    ON users_metadata FOR SELECT
    USING (whop_user_id = current_setting('request.jwt.claims', true)::json->>'sub');

CREATE POLICY "Users can update their own metadata"
    ON users_metadata FOR UPDATE
    USING (whop_user_id = current_setting('request.jwt.claims', true)::json->>'sub');

CREATE POLICY "Service role can insert user metadata"
    ON users_metadata FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Service role can do everything on users_metadata"
    ON users_metadata FOR ALL
    USING (current_setting('role') = 'service_role');

-- =============================================================================
-- RLS POLICIES: program_progress
-- Users can only access their own program progress
-- =============================================================================
CREATE POLICY "Users can view their own program progress"
    ON program_progress FOR SELECT
    USING (user_id = current_setting('request.jwt.claims', true)::json->>'sub');

CREATE POLICY "Users can insert their own program progress"
    ON program_progress FOR INSERT
    WITH CHECK (user_id = current_setting('request.jwt.claims', true)::json->>'sub');

CREATE POLICY "Users can update their own program progress"
    ON program_progress FOR UPDATE
    USING (user_id = current_setting('request.jwt.claims', true)::json->>'sub');

CREATE POLICY "Users can delete their own program progress"
    ON program_progress FOR DELETE
    USING (user_id = current_setting('request.jwt.claims', true)::json->>'sub');

-- =============================================================================
-- RLS POLICIES: program_journal_entries
-- Users can only access their own journal entries
-- =============================================================================
CREATE POLICY "Users can view their own journal entries"
    ON program_journal_entries FOR SELECT
    USING (user_id = current_setting('request.jwt.claims', true)::json->>'sub');

CREATE POLICY "Users can insert their own journal entries"
    ON program_journal_entries FOR INSERT
    WITH CHECK (user_id = current_setting('request.jwt.claims', true)::json->>'sub');

CREATE POLICY "Users can update their own journal entries"
    ON program_journal_entries FOR UPDATE
    USING (user_id = current_setting('request.jwt.claims', true)::json->>'sub');

CREATE POLICY "Users can delete their own journal entries"
    ON program_journal_entries FOR DELETE
    USING (user_id = current_setting('request.jwt.claims', true)::json->>'sub');

-- =============================================================================
-- RLS POLICIES: user_activity
-- Users can only access their own activity
-- =============================================================================
CREATE POLICY "Users can view their own activity"
    ON user_activity FOR SELECT
    USING (user_id = current_setting('request.jwt.claims', true)::json->>'sub');

CREATE POLICY "Users can insert their own activity"
    ON user_activity FOR INSERT
    WITH CHECK (user_id = current_setting('request.jwt.claims', true)::json->>'sub');

CREATE POLICY "Users can update their own activity"
    ON user_activity FOR UPDATE
    USING (user_id = current_setting('request.jwt.claims', true)::json->>'sub');

CREATE POLICY "Users can delete their own activity"
    ON user_activity FOR DELETE
    USING (user_id = current_setting('request.jwt.claims', true)::json->>'sub');

-- =============================================================================
-- RLS POLICIES: user_favorites
-- Users can only access their own favorites
-- =============================================================================
CREATE POLICY "Users can view their own favorites"
    ON user_favorites FOR SELECT
    USING (user_id = current_setting('request.jwt.claims', true)::json->>'sub');

CREATE POLICY "Users can insert their own favorites"
    ON user_favorites FOR INSERT
    WITH CHECK (user_id = current_setting('request.jwt.claims', true)::json->>'sub');

CREATE POLICY "Users can update their own favorites"
    ON user_favorites FOR UPDATE
    USING (user_id = current_setting('request.jwt.claims', true)::json->>'sub');

CREATE POLICY "Users can delete their own favorites"
    ON user_favorites FOR DELETE
    USING (user_id = current_setting('request.jwt.claims', true)::json->>'sub');

-- =============================================================================
-- RLS POLICIES: community_posts
-- Users can read all members_only posts
-- Users can only create/update/delete their own posts
-- Public posts are readable by everyone
-- =============================================================================
CREATE POLICY "Anyone can view public posts"
    ON community_posts FOR SELECT
    USING (visibility = 'public');

CREATE POLICY "Users can view members_only posts"
    ON community_posts FOR SELECT
    USING (visibility = 'members_only');

CREATE POLICY "Users can insert their own posts"
    ON community_posts FOR INSERT
    WITH CHECK (user_id = current_setting('request.jwt.claims', true)::json->>'sub');

CREATE POLICY "Users can update their own posts"
    ON community_posts FOR UPDATE
    USING (user_id = current_setting('request.jwt.claims', true)::json->>'sub');

CREATE POLICY "Users can delete their own posts"
    ON community_posts FOR DELETE
    USING (user_id = current_setting('request.jwt.claims', true)::json->>'sub');
