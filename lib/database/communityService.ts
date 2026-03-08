/**
 * Community Service - Database operations for community posts
 *
 * Handles creating, fetching, and deleting community posts (check-ins, weekly wins, reflections)
 */

import { supabaseAdmin } from '@/lib/supabase/admin';

// DB uses underscores (check_in, weekly_win), UI uses hyphens (check-in, weekly-win)
type DbPostType = 'check_in' | 'weekly_win' | 'reflection';
type UiPostType = 'check-in' | 'weekly-win' | 'reflection';

function uiToDbPostType(uiType: UiPostType): DbPostType {
  const map: Record<UiPostType, DbPostType> = {
    'check-in': 'check_in',
    'weekly-win': 'weekly_win',
    reflection: 'reflection',
  };
  return map[uiType];
}

function dbToUiPostType(dbType: DbPostType): UiPostType {
  const map: Record<DbPostType, UiPostType> = {
    check_in: 'check-in',
    weekly_win: 'weekly-win',
    reflection: 'reflection',
  };
  return map[dbType];
}

export interface CommunityPostRow {
  id: string;
  user_id: string;
  post_type: UiPostType;
  content: string;
  program_id: string | null;
  visibility: 'public' | 'members_only';
  created_at: string;
  updated_at: string;
  user_name: string | null;
}

/**
 * Get community posts with optional filters
 */
export async function getCommunityPosts(companyId: string, filters?: {
  postType?: UiPostType;
  limit?: number;
}): Promise<{ data: CommunityPostRow[]; error: Error | null }> {
  try {
    let query = supabaseAdmin
      .from('community_posts')
      .select('*, users_metadata(display_name)')
      .eq('company_id', companyId)
      .order('created_at', { ascending: false });

    if (filters?.postType) {
      query = query.eq('post_type', uiToDbPostType(filters.postType));
    }

    if (filters?.limit) {
      query = query.limit(filters.limit);
    }

    const { data, error } = await query;

    if (error) {
      console.error('[CommunityService] Error fetching posts:', error);
      return { data: [], error: new Error(error.message) };
    }

    const posts: CommunityPostRow[] = (data || []).map((row: any) => ({
      id: row.id,
      user_id: row.user_id,
      post_type: dbToUiPostType(row.post_type as DbPostType),
      content: row.content,
      program_id: row.program_id,
      visibility: row.visibility,
      created_at: row.created_at,
      updated_at: row.updated_at,
      user_name: row.users_metadata?.display_name || null,
    }));

    return { data: posts, error: null };
  } catch (err) {
    console.error('[CommunityService] Error in getCommunityPosts:', err);
    return { data: [], error: err as Error };
  }
}

/**
 * Create a community post
 */
export async function createCommunityPost(
  companyId: string,
  userId: string,
  input: {
    content: string;
    postType: UiPostType;
    programId?: string;
    visibility?: 'public' | 'members_only';
  }
): Promise<{ data: CommunityPostRow | null; error: Error | null }> {
  try {
    const { data, error } = await supabaseAdmin
      .from('community_posts')
      .insert({
        company_id: companyId,
        user_id: userId,
        post_type: uiToDbPostType(input.postType),
        content: input.content,
        program_id: input.programId || null,
        visibility: input.visibility || 'members_only',
      })
      .select('*, users_metadata(display_name)')
      .single();

    if (error) {
      console.error('[CommunityService] Error creating post:', error);
      return { data: null, error: new Error(error.message) };
    }

    const post: CommunityPostRow = {
      id: data.id,
      user_id: data.user_id,
      post_type: dbToUiPostType(data.post_type as DbPostType),
      content: data.content,
      program_id: data.program_id,
      visibility: data.visibility,
      created_at: data.created_at,
      updated_at: data.updated_at,
      user_name: (data as any).users_metadata?.display_name || null,
    };

    return { data: post, error: null };
  } catch (err) {
    console.error('[CommunityService] Error in createCommunityPost:', err);
    return { data: null, error: err as Error };
  }
}

/**
 * Delete a community post (only if owned by user)
 */
export async function deleteCommunityPost(
  companyId: string,
  userId: string,
  postId: string
): Promise<{ success: boolean; error: Error | null }> {
  try {
    const { error } = await supabaseAdmin
      .from('community_posts')
      .delete()
      .eq('company_id', companyId)
      .eq('id', postId)
      .eq('user_id', userId);

    if (error) {
      console.error('[CommunityService] Error deleting post:', error);
      return { success: false, error: new Error(error.message) };
    }

    return { success: true, error: null };
  } catch (err) {
    console.error('[CommunityService] Error in deleteCommunityPost:', err);
    return { success: false, error: err as Error };
  }
}
