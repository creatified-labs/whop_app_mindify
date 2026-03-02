import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { getAuthUser } from '@/lib/auth/getAuthUser';
import { getOrCreateUser } from '@/lib/database/userService';
import { whopsdk } from '@/lib/whop-sdk';

/**
 * GET /api/user/me
 * Returns current user's display info for client-side use
 */
export async function GET() {
  try {
    const userId = await getAuthUser(await headers());

    // Get DB metadata (ensures user row exists)
    const { data: userMeta } = await getOrCreateUser(userId);

    let displayName = userMeta?.display_name || null;

    // Fall back to Whop SDK for display name
    if (!displayName) {
      try {
        const whopUser = await whopsdk.users.retrieve(userId);
        displayName = whopUser.name || `@${whopUser.username ?? 'member'}`;

        // Persist for next time
        if (userMeta && !userMeta.display_name && displayName) {
          const { supabaseAdmin } = await import('@/lib/supabase/admin');
          await supabaseAdmin
            .from('users_metadata')
            .update({ display_name: displayName })
            .eq('whop_user_id', userId);
        }
      } catch {
        displayName = 'Member';
      }
    }

    const initial = displayName.trim().charAt(0).toUpperCase();

    return NextResponse.json({ userId, displayName, initial });
  } catch (error) {
    console.error('[API] Error in GET /api/user/me:', error);
    if (error instanceof Error && error.message.includes('Unauthorized')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
