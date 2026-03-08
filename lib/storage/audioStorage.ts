/**
 * Media Storage Service - Supabase Storage operations for audio and video files
 *
 * Handles upload URL generation, deletion, listing, and validation for media files.
 * Uses supabaseAdmin (service role) to bypass RLS.
 */

import { supabaseAdmin } from '@/lib/supabase/admin';

const BUCKET_NAME = 'audio';
const MAX_AUDIO_SIZE = 100 * 1024 * 1024; // 100MB
const MAX_VIDEO_SIZE = 500 * 1024 * 1024; // 500MB

const ALLOWED_AUDIO_MIME_TYPES = [
  'audio/mpeg',
  'audio/mp3',
  'audio/wav',
  'audio/x-wav',
  'audio/m4a',
  'audio/x-m4a',
  'audio/mp4',
  'audio/ogg',
  'audio/webm',
  'audio/aac',
];

const ALLOWED_VIDEO_MIME_TYPES = [
  'video/mp4',
  'video/webm',
  'video/quicktime',
  'video/x-m4v',
  'video/mpeg',
  'video/ogg',
];

const ALLOWED_MIME_TYPES = [...ALLOWED_AUDIO_MIME_TYPES, ...ALLOWED_VIDEO_MIME_TYPES];

const ALLOWED_AUDIO_EXTENSIONS = ['.mp3', '.wav', '.m4a', '.ogg', '.webm', '.aac'];
const ALLOWED_VIDEO_EXTENSIONS = ['.mp4', '.webm', '.mov', '.m4v', '.mpeg', '.ogv'];
const ALLOWED_EXTENSIONS = [...ALLOWED_AUDIO_EXTENSIONS, ...ALLOWED_VIDEO_EXTENSIONS];

export type AudioContentType = 'meditations' | 'hypnosis' | 'programs' | 'quick-resets' | 'general';

/**
 * Determine if a MIME type is video
 */
export function isVideoMimeType(contentType: string): boolean {
  return ALLOWED_VIDEO_MIME_TYPES.includes(contentType);
}

/**
 * Validate a media file (audio or video) before upload
 */
export function validateMediaFile(
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

  const maxSize = isVideoMimeType(contentType) ? MAX_VIDEO_SIZE : MAX_AUDIO_SIZE;
  const maxLabel = isVideoMimeType(contentType) ? '500MB' : '100MB';

  if (fileSize && fileSize > maxSize) {
    return { valid: false, error: `File too large: ${(fileSize / 1024 / 1024).toFixed(1)}MB. Maximum: ${maxLabel}` };
  }

  return { valid: true };
}

/** @deprecated Use validateMediaFile instead */
export const validateAudioFile = validateMediaFile;

/**
 * Generate a unique storage path for a file
 */
function generateStoragePath(folder: AudioContentType, fileName: string): string {
  const timestamp = Date.now();
  const sanitized = fileName.replace(/[^a-zA-Z0-9._-]/g, '_');
  return `${folder}/${timestamp}-${sanitized}`;
}

/**
 * Create a signed upload URL for direct browser upload to Supabase Storage.
 * Returns the signed URL, token, storage path, and eventual public URL.
 */
export async function createSignedUploadUrl(
  fileName: string,
  contentType: string,
  folder: AudioContentType = 'general'
): Promise<{ data: { signedUrl: string; token: string; path: string; publicUrl: string } | null; error: Error | null }> {
  try {
    const path = generateStoragePath(folder, fileName);

    const { data, error } = await supabaseAdmin.storage
      .from(BUCKET_NAME)
      .createSignedUploadUrl(path, {
        upsert: false,
      });

    if (error) {
      console.error('[MediaStorage] Error creating signed upload URL:', error);
      return { data: null, error: new Error(error.message) };
    }

    const publicUrl = getPublicUrl(path);

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
    console.error('[MediaStorage] Error in createSignedUploadUrl:', err);
    return { data: null, error: err as Error };
  }
}

/**
 * Delete a file from storage
 */
export async function deleteAudio(storagePath: string): Promise<{ success: boolean; error: Error | null }> {
  try {
    const { error } = await supabaseAdmin.storage
      .from(BUCKET_NAME)
      .remove([storagePath]);

    if (error) {
      console.error('[MediaStorage] Error deleting file:', error);
      return { success: false, error: new Error(error.message) };
    }

    return { success: true, error: null };
  } catch (err) {
    console.error('[MediaStorage] Error in deleteAudio:', err);
    return { success: false, error: err as Error };
  }
}

/**
 * List files in a folder
 */
export async function listAudioFiles(
  folder: AudioContentType = 'general',
  limit: number = 100
): Promise<{ data: { name: string; path: string; publicUrl: string; createdAt: string }[]; error: Error | null }> {
  try {
    const { data, error } = await supabaseAdmin.storage
      .from(BUCKET_NAME)
      .list(folder, {
        limit,
        sortBy: { column: 'created_at', order: 'desc' },
      });

    if (error) {
      console.error('[MediaStorage] Error listing files:', error);
      return { data: [], error: new Error(error.message) };
    }

    const files = (data || [])
      .filter((file) => file.name !== '.emptyFolderPlaceholder')
      .map((file) => {
        const path = `${folder}/${file.name}`;
        return {
          name: file.name,
          path,
          publicUrl: getPublicUrl(path),
          createdAt: file.created_at,
        };
      });

    return { data: files, error: null };
  } catch (err) {
    console.error('[MediaStorage] Error in listAudioFiles:', err);
    return { data: [], error: err as Error };
  }
}

/**
 * Construct the public URL for a file in the media bucket
 */
export function getPublicUrl(path: string): string {
  const { data } = supabaseAdmin.storage
    .from(BUCKET_NAME)
    .getPublicUrl(path);

  return data.publicUrl;
}

/** @deprecated Use getPublicUrl instead */
export const getAudioPublicUrl = getPublicUrl;
