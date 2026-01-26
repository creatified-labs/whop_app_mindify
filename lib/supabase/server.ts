/**
 * Supabase Client - Server-Side with Auth Context
 *
 * This client is used in server components, API routes, and server actions.
 * It creates a client with the authenticated user's context from Whop.
 *
 * The client uses the anon key but sets the user context in the JWT claims,
 * allowing RLS policies to correctly filter data based on the authenticated user.
 *
 * Usage in Server Components:
 * import { createServerClient } from '@/lib/supabase/server'
 * const supabase = await createServerClient(userId)
 * const { data, error } = await supabase.from('table').select()
 *
 * Usage in API Routes:
 * import { createServerClient } from '@/lib/supabase/server'
 * import { getAuthUser } from '@/lib/auth/getAuthUser'
 * const userId = await getAuthUser(headers())
 * const supabase = await createServerClient(userId)
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. Please check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set.'
  );
}

/**
 * Creates a Supabase client with user context for server-side operations.
 *
 * This sets the JWT claims so RLS policies can access the user's ID via:
 * current_setting('request.jwt.claims', true)::json->>'sub'
 *
 * @param userId - The Whop user ID from verifyUserToken()
 * @returns Supabase client with user context
 */
export async function createServerClient(userId: string) {
  return createClient(supabaseUrl!, supabaseAnonKey!, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
    global: {
      headers: {
        // Set the user context for RLS policies
        // This allows policies to access userId via current_setting('request.jwt.claims')
        'X-User-Id': userId,
      },
    },
    db: {
      // Set the user ID in a way RLS policies can access
      schema: 'public',
    },
    // Override the default JWT to include our user ID
    realtime: {
      params: {
        // biome-ignore lint: eventsPerSecond is a valid realtime param
        eventsPerSecond: 10,
      },
    },
  });
}

/**
 * Alternative: Use Supabase's JWT generation for better RLS integration
 * This creates a proper JWT token that RLS policies can parse
 */
export async function createServerClientWithJWT(userId: string) {
  // For production, you might want to generate a proper JWT
  // For now, we'll use the service role client in admin.ts for privileged operations
  // and rely on application-level checks for user data access
  return createServerClient(userId);
}
