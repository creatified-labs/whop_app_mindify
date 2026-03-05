import { supabaseAdmin } from '@/lib/supabase/admin';
import { deleteAudio } from '@/lib/storage/audioStorage';
import type { MediaLibraryItem } from '@/lib/types';

function rowToMediaItem(row: Record<string, unknown>): MediaLibraryItem {
  return {
    id: row.id as string,
    name: row.name as string,
    mediaType: row.media_type as 'audio' | 'link',
    url: row.url as string,
    storagePath: row.storage_path as string | null,
    mimeType: row.mime_type as string | null,
    fileSizeBytes: row.file_size_bytes as number | null,
    tags: (row.tags as string[]) || [],
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  };
}

export async function getMediaItems(
  filter?: 'audio' | 'link'
): Promise<{ data: MediaLibraryItem[]; error: Error | null }> {
  try {
    let query = supabaseAdmin
      .from('media_library')
      .select('*')
      .order('created_at', { ascending: false });

    if (filter) {
      query = query.eq('media_type', filter);
    }

    const { data, error } = await query;

    if (error) return { data: [], error: new Error(error.message) };
    return { data: (data || []).map(rowToMediaItem), error: null };
  } catch (err) {
    return { data: [], error: err as Error };
  }
}

export async function createMediaItem(
  item: Omit<MediaLibraryItem, 'createdAt' | 'updatedAt'>
): Promise<{ data: MediaLibraryItem | null; error: Error | null }> {
  try {
    const { data, error } = await supabaseAdmin
      .from('media_library')
      .insert({
        id: item.id,
        name: item.name,
        media_type: item.mediaType,
        url: item.url,
        storage_path: item.storagePath || null,
        mime_type: item.mimeType || null,
        file_size_bytes: item.fileSizeBytes || null,
        tags: item.tags || [],
      })
      .select()
      .single();

    if (error) return { data: null, error: new Error(error.message) };
    return { data: rowToMediaItem(data), error: null };
  } catch (err) {
    return { data: null, error: err as Error };
  }
}

export async function createMediaItems(
  items: Omit<MediaLibraryItem, 'createdAt' | 'updatedAt'>[]
): Promise<{ data: MediaLibraryItem[]; error: Error | null }> {
  try {
    const rows = items.map((item) => ({
      id: item.id,
      name: item.name,
      media_type: item.mediaType,
      url: item.url,
      storage_path: item.storagePath || null,
      mime_type: item.mimeType || null,
      file_size_bytes: item.fileSizeBytes || null,
      tags: item.tags || [],
    }));

    const { data, error } = await supabaseAdmin
      .from('media_library')
      .insert(rows)
      .select();

    if (error) return { data: [], error: new Error(error.message) };
    return { data: (data || []).map(rowToMediaItem), error: null };
  } catch (err) {
    return { data: [], error: err as Error };
  }
}

export async function deleteMediaItem(
  id: string
): Promise<{ success: boolean; error: Error | null }> {
  try {
    // First get the item to check for storage_path
    const { data: item, error: fetchError } = await supabaseAdmin
      .from('media_library')
      .select('storage_path')
      .eq('id', id)
      .single();

    if (fetchError) return { success: false, error: new Error(fetchError.message) };

    // Delete from storage if it's an uploaded file
    if (item?.storage_path) {
      await deleteAudio(item.storage_path);
    }

    const { error } = await supabaseAdmin
      .from('media_library')
      .delete()
      .eq('id', id);

    if (error) return { success: false, error: new Error(error.message) };
    return { success: true, error: null };
  } catch (err) {
    return { success: false, error: err as Error };
  }
}

export async function updateMediaItemTags(
  id: string,
  tags: string[]
): Promise<{ data: MediaLibraryItem | null; error: Error | null }> {
  try {
    const { data, error } = await supabaseAdmin
      .from('media_library')
      .update({ tags })
      .eq('id', id)
      .select()
      .single();

    if (error) return { data: null, error: new Error(error.message) };
    return { data: rowToMediaItem(data), error: null };
  } catch (err) {
    return { data: null, error: err as Error };
  }
}
