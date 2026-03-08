-- Mindify Database Schema
-- Migration 009: Video Support
-- Created: 2026-03-08
-- Description: Adds video MIME types to storage bucket and video media type to media_library

-- =============================================================================
-- STORAGE: Add video MIME types to the audio bucket and increase size limit to 500MB
-- =============================================================================
UPDATE storage.buckets
SET allowed_mime_types = ARRAY[
  'audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/x-wav', 'audio/m4a', 'audio/x-m4a',
  'audio/mp4', 'audio/ogg', 'audio/webm', 'audio/aac',
  'video/mp4', 'video/webm', 'video/quicktime', 'video/x-m4v', 'video/mpeg', 'video/ogg'
],
file_size_limit = 524288000 -- 500MB
WHERE id = 'audio';

-- =============================================================================
-- TABLE: media_library - allow 'video' media type
-- =============================================================================
ALTER TABLE media_library DROP CONSTRAINT IF EXISTS media_library_media_type_check;
ALTER TABLE media_library ADD CONSTRAINT media_library_media_type_check
  CHECK (media_type IN ('audio', 'video', 'link'));
