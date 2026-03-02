-- Migration: Audio Storage Bucket
-- Creates a public storage bucket for audio files with MIME type restrictions

-- Create the audio storage bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'audio',
  'audio',
  true,
  104857600, -- 100MB
  ARRAY[
    'audio/mpeg',
    'audio/mp3',
    'audio/wav',
    'audio/x-wav',
    'audio/m4a',
    'audio/x-m4a',
    'audio/mp4',
    'audio/ogg',
    'audio/webm',
    'audio/aac'
  ]
)
ON CONFLICT (id) DO NOTHING;

-- Allow public read access to audio files
CREATE POLICY "Public read access for audio"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'audio');

-- Allow authenticated uploads via service role (admin only)
-- The service role key bypasses RLS, so this policy is for completeness
CREATE POLICY "Service role upload for audio"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'audio');

-- Allow service role deletes
CREATE POLICY "Service role delete for audio"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'audio');
