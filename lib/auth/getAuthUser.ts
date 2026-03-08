/**
 * Authentication Utility
 *
 * Extracts and verifies the Whop user ID from request headers.
 * Provides company-scoped auth context for multi-tenancy.
 */

import { whopsdk } from '@/lib/whop-sdk';

/**
 * Auth context with both user and company information
 */
export interface AuthContext {
  userId: string;
  companyId: string;
}

/**
 * Get authenticated user ID from request headers
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
 * Get full auth context including company ID.
 * Use this for all multi-tenant operations.
 *
 * @param headers - Request headers
 * @param companyId - Company ID from route params, query params, or request header
 */
export async function getAuthContext(
  headers: Headers,
  companyId: string
): Promise<AuthContext> {
  const userId = await getAuthUser(headers);

  if (!companyId || companyId === 'undefined') {
    throw new Error('Company ID is required');
  }

  return { userId, companyId };
}

/**
 * Extract company ID from a request.
 * Checks x-company-id header, then ?company_id query param.
 */
export function extractCompanyId(request: Request): string {
  // Check custom header first
  const headerCompanyId = request.headers.get('x-company-id');
  if (headerCompanyId) return headerCompanyId;

  // Check query param
  const { searchParams } = new URL(request.url);
  const paramCompanyId = searchParams.get('company_id');
  if (paramCompanyId) return paramCompanyId;

  throw new Error('Company ID is required (x-company-id header or company_id query param)');
}

/**
 * Get authenticated user ID with fallback for development
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
