/**
 * Favorites Service - Database operations for user favorites
 *
 * Handles saving, retrieving, and removing favorite content
 */

import { supabaseAdmin } from '@/lib/supabase/admin';

export type ContentType = 'meditation' | 'hypnosis' | 'program' | 'reset' | 'article';

export interface Favorite {
  id: string;
  user_id: string;
  content_type: ContentType;
  content_id: string;
  created_at: string;
}

/**
 * Get all favorites for a user
 */
export async function getFavorites(
  userId: string,
  contentType?: ContentType
): Promise<{ data: Favorite[]; error: Error | null }> {
  try {
    let query = supabaseAdmin
      .from('user_favorites')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    // Optionally filter by content type
    if (contentType) {
      query = query.eq('content_type', contentType);
    }

    const { data, error } = await query;

    if (error) {
      console.error('[FavoritesService] Error fetching favorites:', error);
      return { data: [], error: new Error(error.message) };
    }

    return { data: data || [], error: null };
  } catch (err) {
    console.error('[FavoritesService] Error in getFavorites:', err);
    return { data: [], error: err as Error };
  }
}

/**
 * Check if content is favorited by user
 */
export async function isFavorited(
  userId: string,
  contentType: ContentType,
  contentId: string
): Promise<{ isFavorited: boolean; error: Error | null }> {
  try {
    const { data, error } = await supabaseAdmin
      .from('user_favorites')
      .select('id')
      .eq('user_id', userId)
      .eq('content_type', contentType)
      .eq('content_id', contentId)
      .single();

    if (error) {
      // Not found means not favorited
      if (error.code === 'PGRST116') {
        return { isFavorited: false, error: null };
      }
      console.error('[FavoritesService] Error checking if favorited:', error);
      return { isFavorited: false, error: new Error(error.message) };
    }

    return { isFavorited: !!data, error: null };
  } catch (err) {
    console.error('[FavoritesService] Error in isFavorited:', err);
    return { isFavorited: false, error: err as Error };
  }
}

/**
 * Add a favorite
 */
export async function addFavorite(
  userId: string,
  contentType: ContentType,
  contentId: string
): Promise<{ data: Favorite | null; error: Error | null }> {
  try {
    // Check if already favorited
    const { isFavorited: alreadyFavorited } = await isFavorited(userId, contentType, contentId);

    if (alreadyFavorited) {
      // Already favorited, just return success
      const { data } = await supabaseAdmin
        .from('user_favorites')
        .select('*')
        .eq('user_id', userId)
        .eq('content_type', contentType)
        .eq('content_id', contentId)
        .single();

      return { data: data || null, error: null };
    }

    // Insert new favorite
    const { data, error } = await supabaseAdmin
      .from('user_favorites')
      .insert({
        user_id: userId,
        content_type: contentType,
        content_id: contentId,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error('[FavoritesService] Error adding favorite:', error);
      return { data: null, error: new Error(error.message) };
    }

    return { data, error: null };
  } catch (err) {
    console.error('[FavoritesService] Error in addFavorite:', err);
    return { data: null, error: err as Error };
  }
}

/**
 * Remove a favorite
 */
export async function removeFavorite(
  userId: string,
  contentType: ContentType,
  contentId: string
): Promise<{ success: boolean; error: Error | null }> {
  try {
    const { error } = await supabaseAdmin
      .from('user_favorites')
      .delete()
      .eq('user_id', userId)
      .eq('content_type', contentType)
      .eq('content_id', contentId);

    if (error) {
      console.error('[FavoritesService] Error removing favorite:', error);
      return { success: false, error: new Error(error.message) };
    }

    return { success: true, error: null };
  } catch (err) {
    console.error('[FavoritesService] Error in removeFavorite:', err);
    return { success: false, error: err as Error };
  }
}

/**
 * Toggle favorite (add if not favorited, remove if favorited)
 */
export async function toggleFavorite(
  userId: string,
  contentType: ContentType,
  contentId: string
): Promise<{ isFavorited: boolean; error: Error | null }> {
  try {
    const { isFavorited: alreadyFavorited } = await isFavorited(userId, contentType, contentId);

    if (alreadyFavorited) {
      const { error } = await removeFavorite(userId, contentType, contentId);
      if (error) {
        return { isFavorited: true, error };
      }
      return { isFavorited: false, error: null };
    }

    const { error } = await addFavorite(userId, contentType, contentId);
    if (error) {
      return { isFavorited: false, error };
    }
    return { isFavorited: true, error: null };
  } catch (err) {
    console.error('[FavoritesService] Error in toggleFavorite:', err);
    return { isFavorited: false, error: err as Error };
  }
}

/**
 * Get favorite count for a user
 */
export async function getFavoriteCount(
  userId: string,
  contentType?: ContentType
): Promise<{ count: number; error: Error | null }> {
  try {
    let query = supabaseAdmin
      .from('user_favorites')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);

    if (contentType) {
      query = query.eq('content_type', contentType);
    }

    const { count, error } = await query;

    if (error) {
      console.error('[FavoritesService] Error counting favorites:', error);
      return { count: 0, error: new Error(error.message) };
    }

    return { count: count || 0, error: null };
  } catch (err) {
    console.error('[FavoritesService] Error in getFavoriteCount:', err);
    return { count: 0, error: err as Error };
  }
}

/**
 * Get favorite IDs for quick lookup
 * Returns array of content IDs for a specific content type
 */
export async function getFavoriteIds(
  userId: string,
  contentType: ContentType
): Promise<{ ids: string[]; error: Error | null }> {
  try {
    const { data, error } = await supabaseAdmin
      .from('user_favorites')
      .select('content_id')
      .eq('user_id', userId)
      .eq('content_type', contentType);

    if (error) {
      console.error('[FavoritesService] Error fetching favorite IDs:', error);
      return { ids: [], error: new Error(error.message) };
    }

    const ids = (data || []).map((row) => row.content_id);
    return { ids, error: null };
  } catch (err) {
    console.error('[FavoritesService] Error in getFavoriteIds:', err);
    return { ids: [], error: err as Error };
  }
}
