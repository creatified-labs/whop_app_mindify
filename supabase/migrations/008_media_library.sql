-- Mindify Database Schema
-- Migration 008: Media Library
-- Created: 2026-03-05
-- Description: Centralized media library for audio files and external links

-- =============================================================================
-- TABLE: media_library
-- =============================================================================
CREATE TABLE media_library (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    media_type TEXT NOT NULL CHECK (media_type IN ('audio', 'link')),
    url TEXT NOT NULL,
    storage_path TEXT,
    mime_type TEXT,
    file_size_bytes BIGINT,
    tags TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-update updated_at
CREATE TRIGGER set_media_library_updated_at
    BEFORE UPDATE ON media_library
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =============================================================================
-- ROW LEVEL SECURITY
-- Anyone can read; writes handled via supabaseAdmin (service role bypasses RLS)
-- =============================================================================
ALTER TABLE media_library ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view media library"
    ON media_library FOR SELECT
    USING (true);
