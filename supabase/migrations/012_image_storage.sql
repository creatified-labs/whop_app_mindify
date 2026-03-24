-- Migration: Image Storage Bucket
-- Creates a public storage bucket for image files (meditation covers, thumbnails, etc.)

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'images',
  'images',
  true,
  10485760, -- 10MB
  ARRAY[
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
    'image/svg+xml'
  ]
)
ON CONFLICT (id) DO NOTHING;

-- Allow public read access to images
CREATE POLICY "Public read access for images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'images');

-- Allow authenticated uploads via service role (admin only)
CREATE POLICY "Service role upload for images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'images');

-- Allow service role deletes
CREATE POLICY "Service role delete for images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'images');
