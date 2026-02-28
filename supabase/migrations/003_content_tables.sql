-- Mindify Database Schema
-- Migration 003: Content Tables
-- Created: 2026-02-28
-- Description: Tables for admin-managed content (meditations, hypnosis, programs, quick resets, knowledge articles)

-- =============================================================================
-- TABLE: meditations
-- Description: Meditation sessions managed by admin
-- =============================================================================
CREATE TABLE IF NOT EXISTS meditations (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    duration INTEGER NOT NULL CHECK (duration > 0),
    category TEXT NOT NULL CHECK (category IN ('focus', 'morning', 'evening', 'sleep', 'stress', 'overwhelm', 'productivity', 'emotional')),
    audio_url TEXT NOT NULL,
    image_url TEXT NOT NULL DEFAULT '',
    mood TEXT[] DEFAULT '{}',
    is_new BOOLEAN DEFAULT false,
    is_premium BOOLEAN DEFAULT false,
    tags TEXT[] DEFAULT '{}',
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_meditations_category ON meditations(category);
CREATE INDEX idx_meditations_sort_order ON meditations(sort_order);

-- =============================================================================
-- TABLE: hypnosis_sessions
-- Description: Hypnosis sessions managed by admin
-- =============================================================================
CREATE TABLE IF NOT EXISTS hypnosis_sessions (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    duration INTEGER NOT NULL CHECK (duration > 0),
    theme TEXT NOT NULL CHECK (theme IN ('procrastination', 'overthinking', 'confidence', 'productivity', 'smoking', 'nervous-system', 'performance')),
    audio_url TEXT NOT NULL,
    has_binaural BOOLEAN DEFAULT false,
    daytime_version TEXT,
    nighttime_version TEXT,
    is_premium BOOLEAN DEFAULT false,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_hypnosis_theme ON hypnosis_sessions(theme);
CREATE INDEX idx_hypnosis_sort_order ON hypnosis_sessions(sort_order);

-- =============================================================================
-- TABLE: programs
-- Description: Multi-day transformation programs managed by admin
-- =============================================================================
CREATE TABLE IF NOT EXISTS programs (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    tagline TEXT NOT NULL DEFAULT '',
    description TEXT NOT NULL,
    duration INTEGER NOT NULL CHECK (duration > 0),
    category TEXT NOT NULL CHECK (category IN ('focus', 'productivity', 'sleep', 'mindset', 'clarity')),
    difficulty TEXT NOT NULL CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
    cover_image TEXT NOT NULL DEFAULT '',
    include_summary JSONB NOT NULL DEFAULT '{"meditations": 0, "tasks": 0, "journalPrompts": 0}',
    requirements TEXT[] DEFAULT '{}',
    benefits TEXT[] DEFAULT '{}',
    time_commitment TEXT NOT NULL DEFAULT '',
    recommended_for TEXT[] DEFAULT '{}',
    days JSONB NOT NULL DEFAULT '[]',
    is_premium BOOLEAN DEFAULT false,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_programs_category ON programs(category);
CREATE INDEX idx_programs_difficulty ON programs(difficulty);
CREATE INDEX idx_programs_sort_order ON programs(sort_order);

-- =============================================================================
-- TABLE: quick_resets
-- Description: Quick nervous system reset exercises managed by admin
-- =============================================================================
CREATE TABLE IF NOT EXISTS quick_resets (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    duration INTEGER NOT NULL CHECK (duration > 0),
    type TEXT NOT NULL CHECK (type IN ('breath', 'anxiety', 'focus', 'calm', 'pattern-interrupt')),
    audio_url TEXT NOT NULL,
    instructions TEXT NOT NULL DEFAULT '',
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_quick_resets_type ON quick_resets(type);
CREATE INDEX idx_quick_resets_sort_order ON quick_resets(sort_order);

-- =============================================================================
-- TABLE: knowledge_articles
-- Description: Knowledge hub articles managed by admin
-- =============================================================================
CREATE TABLE IF NOT EXISTS knowledge_articles (
    slug TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('neuroscience', 'psychology', 'breathwork', 'sleep', 'focus', 'productivity')),
    author TEXT NOT NULL DEFAULT '',
    read_time_minutes INTEGER NOT NULL DEFAULT 5,
    thumbnail TEXT NOT NULL DEFAULT '',
    content TEXT NOT NULL DEFAULT '',
    key_takeaways TEXT[] DEFAULT '{}',
    action_steps TEXT[] DEFAULT '{}',
    recommended_sessions JSONB DEFAULT '[]',
    references TEXT[] DEFAULT '{}',
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_articles_category ON knowledge_articles(category);
CREATE INDEX idx_articles_sort_order ON knowledge_articles(sort_order);

-- =============================================================================
-- TRIGGERS: Auto-update timestamps (reuses function from 001)
-- =============================================================================
CREATE TRIGGER update_meditations_updated_at
    BEFORE UPDATE ON meditations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_hypnosis_sessions_updated_at
    BEFORE UPDATE ON hypnosis_sessions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_programs_updated_at
    BEFORE UPDATE ON programs
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_quick_resets_updated_at
    BEFORE UPDATE ON quick_resets
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_knowledge_articles_updated_at
    BEFORE UPDATE ON knowledge_articles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =============================================================================
-- COMMENTS
-- =============================================================================
COMMENT ON TABLE meditations IS 'Admin-managed meditation sessions';
COMMENT ON TABLE hypnosis_sessions IS 'Admin-managed hypnosis sessions';
COMMENT ON TABLE programs IS 'Admin-managed multi-day transformation programs';
COMMENT ON TABLE quick_resets IS 'Admin-managed quick nervous system resets';
COMMENT ON TABLE knowledge_articles IS 'Admin-managed knowledge hub articles';
