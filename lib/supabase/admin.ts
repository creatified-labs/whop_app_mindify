/**
 * Supabase Admin Client - Service Role
 *
 * This client uses the service role key which BYPASSES Row Level Security (RLS).
 * Use this ONLY for:
 * - Webhook handlers (syncing user tier from Whop)
 * - Admin operations that need to access all data
 * - Background jobs and system operations
 *
 * ⚠️ NEVER expose this client to the browser or use it with user input directly.
 * ⚠️ Always validate and sanitize data before using this client.
 *
 * Usage (in webhooks or server-only contexts):
 * import { supabaseAdmin } from '@/lib/supabase/admin'
 * const { data, error } = await supabaseAdmin
 *   .from('users_metadata')
 *   .update({ membership_tier: 'premium' })
 *   .eq('whop_user_id', userId)
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  throw new Error(
    'Missing Supabase admin environment variables. Please check SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set.'
  );
}

/**
 * Admin client with service role key.
 * Bypasses RLS - use with extreme caution!
 */
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
  global: {
    fetch: (url, options) => fetch(url, { ...options, cache: 'no-store' }),
  },
});

/**
 * Helper function to check if admin client is properly configured
 */
export function isAdminConfigured(): boolean {
  return !!(supabaseUrl && supabaseServiceRoleKey);
}
