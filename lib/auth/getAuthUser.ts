/**
 * Authentication Utility
 *
 * Extracts and verifies the Whop user ID from request headers
 * This replaces all instances of the fallback "demo-user" throughout the app
 */

import { whopsdk } from '@/lib/whop-sdk';

/**
 * Get authenticated user ID from request headers
 *
 * @param headers - Request headers (from Next.js headers() or request.headers)
 * @returns Whop user ID
 * @throws Error if authentication fails
 *
 * Usage in API Routes:
 * ```ts
 * import { headers } from 'next/headers';
 * import { getAuthUser } from '@/lib/auth/getAuthUser';
 *
 * export async function GET(request: NextRequest) {
 *   const userId = await getAuthUser(await headers());
 *   // ... use userId
 * }
 * ```
 *
 * Usage in Server Components:
 * ```ts
 * import { headers } from 'next/headers';
 * import { getAuthUser } from '@/lib/auth/getAuthUser';
 *
 * export default async function Page() {
 *   const userId = await getAuthUser(await headers());
 *   // ... use userId
 * }
 * ```
 */
export async function getAuthUser(headers: Headers): Promise<string> {
  try {
    const { userId } = await whopsdk.verifyUserToken(headers);

    if (!userId) {
      throw new Error('User ID not found in token');
    }

    return userId;
  } catch (error) {
    console.error('[Auth] Failed to verify user token:', error);
    throw new Error('Unauthorized: Invalid or missing authentication token');
  }
}

/**
 * Get authenticated user ID with fallback for development
 * Use this ONLY in development/testing when you need a fallback user
 *
 * @param headers - Request headers
 * @param fallbackUserId - Fallback user ID for development (optional)
 * @returns Whop user ID or fallback
 */
export async function getAuthUserWithFallback(
  headers: Headers,
  fallbackUserId: string = 'dev-user'
): Promise<string> {
  try {
    return await getAuthUser(headers);
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.warn(
        `[Auth] Using fallback user ID in development: ${fallbackUserId}`
      );
      return fallbackUserId;
    }
    throw error;
  }
}

/**
 * Check if user is authenticated (returns boolean instead of throwing)
 *
 * @param headers - Request headers
 * @returns true if user is authenticated, false otherwise
 */
export async function isAuthenticated(headers: Headers): Promise<boolean> {
  try {
    await getAuthUser(headers);
    return true;
  } catch {
    return false;
  }
}

/**
 * Get auth user or return null (no throwing)
 *
 * @param headers - Request headers
 * @returns Whop user ID or null
 */
export async function getAuthUserOrNull(
  headers: Headers
): Promise<string | null> {
  try {
    return await getAuthUser(headers);
  } catch {
    return null;
  }
}
