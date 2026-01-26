/**
 * Supabase Client - Browser/Client-Side
 *
 * This client is used in client components and browser contexts.
 * It uses the anon key which respects Row Level Security (RLS) policies.
 *
 * Usage:
 * import { supabase } from '@/lib/supabase/client'
 * const { data, error } = await supabase.from('table').select()
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. Please check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false, // We use Whop for auth, not Supabase Auth
    autoRefreshToken: false,
  },
});
