-- Mindify Database Schema
-- Migration 004: Content Tables - Row Level Security
-- Created: 2026-02-28
-- Description: Public SELECT for content tables; admin writes via service role (bypasses RLS)

-- =============================================================================
-- ENABLE ROW LEVEL SECURITY
-- =============================================================================
ALTER TABLE meditations ENABLE ROW LEVEL SECURITY;
ALTER TABLE hypnosis_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE quick_resets ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_articles ENABLE ROW LEVEL SECURITY;

-- =============================================================================
-- RLS POLICIES: meditations
-- Anyone can read; writes handled via supabaseAdmin (service role bypasses RLS)
-- =============================================================================
CREATE POLICY "Anyone can view meditations"
    ON meditations FOR SELECT
    USING (true);

-- =============================================================================
-- RLS POLICIES: hypnosis_sessions
-- =============================================================================
CREATE POLICY "Anyone can view hypnosis sessions"
    ON hypnosis_sessions FOR SELECT
    USING (true);

-- =============================================================================
-- RLS POLICIES: programs
-- =============================================================================
CREATE POLICY "Anyone can view programs"
    ON programs FOR SELECT
    USING (true);

-- =============================================================================
-- RLS POLICIES: quick_resets
-- =============================================================================
CREATE POLICY "Anyone can view quick resets"
    ON quick_resets FOR SELECT
    USING (true);

-- =============================================================================
-- RLS POLICIES: knowledge_articles
-- =============================================================================
CREATE POLICY "Anyone can view knowledge articles"
    ON knowledge_articles FOR SELECT
    USING (true);
