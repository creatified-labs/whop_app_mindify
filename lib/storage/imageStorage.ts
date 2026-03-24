/**
 * Image Storage Service - Supabase Storage operations for image files
 *
 * Handles upload URL generation, deletion, listing, and validation for images.
 * Uses supabaseAdmin (service role) to bypass RLS.
 */

import { supabaseAdmin } from '@/lib/supabase/admin';

const BUCKET_NAME = 'images';
const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB

const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/svg+xml',
];

const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg'];

export type ImageContentType = 'meditations' | 'hypnosis' | 'programs' | 'articles' | 'general';

/**
 * Validate an image file before upload
 */
export function validateImageFile(
  fileName: string,
  contentType: string,
  fileSize?: number
): { valid: boolean; error?: string } {
  const ext = fileName.substring(fileName.lastIndexOf('.')).toLowerCase();
  if (!ALLOWED_EXTENSIONS.includes(ext)) {
    return { valid: false, error: `Invalid file extension: ${ext}. Allowed: ${ALLOWED_EXTENSIONS.join(', ')}` };
  }

  if (!ALLOWED_MIME_TYPES.includes(contentType)) {
    return { valid: false, error: `Invalid MIME type: ${contentType}. Allowed: ${ALLOWED_MIME_TYPES.join(', ')}` };
  }

  if (fileSize && fileSize > MAX_IMAGE_SIZE) {
    return { valid: false, error: `File too large: ${(fileSize / 1024 / 1024).toFixed(1)}MB. Maximum: 10MB` };
  }

  return { valid: true };
}

/**
 * Generate a unique storage path for an image file
 */
function generateStoragePath(folder: ImageContentType, fileName: string): string {
  const timestamp = Date.now();
  const sanitized = fileName.replace(/[^a-zA-Z0-9._-]/g, '_');
  return `${folder}/${timestamp}-${sanitized}`;
}

/**
 * Create a signed upload URL for direct browser upload to Supabase Storage.
 */
export async function createSignedImageUploadUrl(
  fileName: string,
  contentType: string,
  folder: ImageContentType = 'general'
): Promise<{ data: { signedUrl: string; token: string; path: string; publicUrl: string } | null; error: Error | null }> {
  try {
    const path = generateStoragePath(folder, fileName);

    const { data, error } = await supabaseAdmin.storage
      .from(BUCKET_NAME)
      .createSignedUploadUrl(path, {
        upsert: false,
      });

    if (error) {
      console.error('[ImageStorage] Error creating signed upload URL:', error);
      return { data: null, error: new Error(error.message) };
    }

    const publicUrl = getImagePublicUrl(path);

    return {
      data: {
        signedUrl: data.signedUrl,
        token: data.token,
        path,
        publicUrl,
      },
      error: null,
    };
  } catch (err) {
    console.error('[ImageStorage] Error in createSignedImageUploadUrl:', err);
    return { data: null, error: err as Error };
  }
}

/**
 * Delete an image from storage
 */
export async function deleteImage(storagePath: string): Promise<{ success: boolean; error: Error | null }> {
  try {
    const { error } = await supabaseAdmin.storage
      .from(BUCKET_NAME)
      .remove([storagePath]);

    if (error) {
      console.error('[ImageStorage] Error deleting file:', error);
      return { success: false, error: new Error(error.message) };
    }

    return { success: true, error: null };
  } catch (err) {
    console.error('[ImageStorage] Error in deleteImage:', err);
    return { success: false, error: err as Error };
  }
}

/**
 * Construct the public URL for a file in the images bucket
 */
export function getImagePublicUrl(path: string): string {
  const { data } = supabaseAdmin.storage
    .from(BUCKET_NAME)
    .getPublicUrl(path);

  return data.publicUrl;
}
