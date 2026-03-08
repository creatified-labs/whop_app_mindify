import { NextResponse, type NextRequest } from 'next/server';
import { headers } from 'next/headers';
import { getAuthUser, extractCompanyId } from '@/lib/auth/getAuthUser';
import {
  getFavorites,
  addFavorite,
  removeFavorite,
  toggleFavorite,
  type ContentType,
} from '@/lib/database/favoritesService';

/**
 * GET /api/user/favorites
 * Get all user favorites, optionally filtered by content type
 */
export async function GET(request: NextRequest) {
  try {
    const companyId = extractCompanyId(request);
    // Get authenticated user
    const userId = await getAuthUser(await headers());

    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const contentType = searchParams.get('content_type') as ContentType | null;

    // Get favorites from database
    const { data: favorites, error } = await getFavorites(
      companyId,
      userId,
      contentType || undefined
    );

    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch favorites' },
        { status: 500 }
      );
    }

    return NextResponse.json({ favorites });
  } catch (error) {
    console.error('[API] Error in GET /api/user/favorites:', error);

    // Check if it's an auth error
    if (error instanceof Error && error.message.includes('Unauthorized')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/user/favorites
 * Add a favorite or toggle favorite status
 */
export async function POST(request: NextRequest) {
  try {
    const companyId = extractCompanyId(request);
    // Get authenticated user
    const userId = await getAuthUser(await headers());

    // Parse request body
    const body = await request.json();

    // Validate payload
    if (!body.content_type || !body.content_id) {
      return NextResponse.json(
        { error: 'content_type and content_id are required' },
        { status: 400 }
      );
    }

    // Validate content_type
    const validTypes = ['meditation', 'hypnosis', 'program', 'reset', 'article'];
    if (!validTypes.includes(body.content_type)) {
      return NextResponse.json(
        { error: 'Invalid content_type. Must be: meditation, hypnosis, program, reset, or article' },
        { status: 400 }
      );
    }

    // Check if this is a toggle request
    if (body.toggle === true) {
      const { isFavorited, error } = await toggleFavorite(
        companyId,
        userId,
        body.content_type,
        body.content_id
      );

      if (error) {
        return NextResponse.json(
          { error: 'Failed to toggle favorite' },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        isFavorited,
        message: isFavorited ? 'Added to favorites' : 'Removed from favorites',
      });
    }

    // Add favorite
    const { data, error } = await addFavorite(
      companyId,
      userId,
      body.content_type,
      body.content_id
    );

    if (error || !data) {
      return NextResponse.json(
        { error: 'Failed to add favorite' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      favorite: data,
      message: 'Added to favorites',
    });
  } catch (error) {
    console.error('[API] Error in POST /api/user/favorites:', error);

    // Check if it's an auth error
    if (error instanceof Error && error.message.includes('Unauthorized')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/user/favorites
 * Remove a favorite
 */
export async function DELETE(request: NextRequest) {
  try {
    const companyId = extractCompanyId(request);
    // Get authenticated user
    const userId = await getAuthUser(await headers());

    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const contentType = searchParams.get('content_type') as ContentType;
    const contentId = searchParams.get('content_id');

    // Validate parameters
    if (!contentType || !contentId) {
      return NextResponse.json(
        { error: 'content_type and content_id are required' },
        { status: 400 }
      );
    }

    // Remove favorite from database
    const { success, error } = await removeFavorite(companyId, userId, contentType, contentId);

    if (!success || error) {
      return NextResponse.json(
        { error: 'Failed to remove favorite' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Removed from favorites',
    });
  } catch (error) {
    console.error('[API] Error in DELETE /api/user/favorites:', error);

    // Check if it's an auth error
    if (error instanceof Error && error.message.includes('Unauthorized')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
