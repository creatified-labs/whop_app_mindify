/**
 * User Service - Database operations for user metadata
 *
 * Handles user creation, updates, and tier synchronization
 */

import { supabaseAdmin } from '@/lib/supabase/admin';

export interface UserMetadata {
  whop_user_id: string;
  display_name?: string;
  email?: string;
  membership_tier: 'free' | 'premium';
  created_at?: string;
  updated_at?: string;
}

/**
 * Get or create a user in the database
 * This is called when a user first authenticates via Whop
 */
export async function getOrCreateUser(
  whopUserId: string,
  userData?: Partial<UserMetadata>
): Promise<{ data: UserMetadata | null; error: Error | null }> {
  try {
    // First, try to get the user
    const { data: existingUser, error: fetchError } = await supabaseAdmin
      .from('users_metadata')
      .select('*')
      .eq('whop_user_id', whopUserId)
      .single();

    if (existingUser) {
      return { data: existingUser, error: null };
    }

    // If user doesn't exist, create them
    const { data: newUser, error: insertError } = await supabaseAdmin
      .from('users_metadata')
      .insert({
        whop_user_id: whopUserId,
        display_name: userData?.display_name || null,
        email: userData?.email || null,
        membership_tier: userData?.membership_tier || 'free',
      })
      .select()
      .single();

    if (insertError) {
      console.error('[UserService] Error creating user:', insertError);
      return { data: null, error: new Error(insertError.message) };
    }

    return { data: newUser, error: null };
  } catch (err) {
    console.error('[UserService] Error in getOrCreateUser:', err);
    return { data: null, error: err as Error };
  }
}

/**
 * Update user metadata
 */
export async function updateUserMetadata(
  whopUserId: string,
  metadata: Partial<Omit<UserMetadata, 'whop_user_id' | 'created_at' | 'updated_at'>>
): Promise<{ data: UserMetadata | null; error: Error | null }> {
  try {
    const { data, error } = await supabaseAdmin
      .from('users_metadata')
      .update(metadata)
      .eq('whop_user_id', whopUserId)
      .select()
      .single();

    if (error) {
      console.error('[UserService] Error updating user metadata:', error);
      return { data: null, error: new Error(error.message) };
    }

    return { data, error: null };
  } catch (err) {
    console.error('[UserService] Error in updateUserMetadata:', err);
    return { data: null, error: err as Error };
  }
}

/**
 * Sync user tier from Whop webhook events
 * This is called when a user purchases or cancels a subscription
 */
export async function syncUserTier(
  whopUserId: string,
  tier: 'free' | 'premium'
): Promise<{ success: boolean; error: Error | null }> {
  try {
    // Ensure user exists first
    const { data: user } = await getOrCreateUser(whopUserId, { membership_tier: tier });

    if (!user) {
      return { success: false, error: new Error('Failed to get or create user') };
    }

    // Update the tier
    const { error } = await supabaseAdmin
      .from('users_metadata')
      .update({ membership_tier: tier })
      .eq('whop_user_id', whopUserId);

    if (error) {
      console.error('[UserService] Error syncing user tier:', error);
      return { success: false, error: new Error(error.message) };
    }

    console.log(`[UserService] Synced tier for user ${whopUserId}: ${tier}`);
    return { success: true, error: null };
  } catch (err) {
    console.error('[UserService] Error in syncUserTier:', err);
    return { success: false, error: err as Error };
  }
}

/**
 * Get user metadata by Whop user ID
 */
export async function getUserMetadata(
  whopUserId: string
): Promise<{ data: UserMetadata | null; error: Error | null }> {
  try {
    const { data, error } = await supabaseAdmin
      .from('users_metadata')
      .select('*')
      .eq('whop_user_id', whopUserId)
      .single();

    if (error) {
      console.error('[UserService] Error fetching user metadata:', error);
      return { data: null, error: new Error(error.message) };
    }

    return { data, error: null };
  } catch (err) {
    console.error('[UserService] Error in getUserMetadata:', err);
    return { data: null, error: err as Error };
  }
}

/**
 * Get user's membership tier
 * Returns 'free' by default if user not found
 */
export async function getUserTier(whopUserId: string): Promise<'free' | 'premium'> {
  try {
    const { data } = await getUserMetadata(whopUserId);
    return data?.membership_tier || 'free';
  } catch (err) {
    console.error('[UserService] Error getting user tier:', err);
    return 'free';
  }
}
