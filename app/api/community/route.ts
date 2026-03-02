import { NextResponse, type NextRequest } from 'next/server';
import { headers } from 'next/headers';
import { getAuthUser } from '@/lib/auth/getAuthUser';
import { getCommunityPosts, createCommunityPost } from '@/lib/database/communityService';
import { getOrCreateUser } from '@/lib/database/userService';

/**
 * GET /api/community
 * List community posts, optionally filtered by post_type
 */
export async function GET(request: NextRequest) {
  try {
    const userId = await getAuthUser(await headers());

    const { searchParams } = new URL(request.url);
    const postType = searchParams.get('post_type') as 'check-in' | 'weekly-win' | 'reflection' | null;

    const { data: posts, error } = await getCommunityPosts({
      postType: postType || undefined,
      limit: 50,
    });

    if (error) {
      return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
    }

    // Mark which posts belong to the current user
    const postsWithOwnership = posts.map((post) => ({
      ...post,
      isOwn: post.user_id === userId,
    }));

    return NextResponse.json({ posts: postsWithOwnership });
  } catch (error) {
    console.error('[API] Error in GET /api/community:', error);
    if (error instanceof Error && error.message.includes('Unauthorized')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * POST /api/community
 * Create a new community post
 */
export async function POST(request: NextRequest) {
  try {
    const userId = await getAuthUser(await headers());

    // Ensure user exists in DB
    await getOrCreateUser(userId);

    const body = await request.json();

    if (!body.content || !body.postType) {
      return NextResponse.json(
        { error: 'content and postType are required' },
        { status: 400 }
      );
    }

    const validTypes = ['check-in', 'weekly-win', 'reflection'];
    if (!validTypes.includes(body.postType)) {
      return NextResponse.json(
        { error: 'Invalid postType. Must be: check-in, weekly-win, or reflection' },
        { status: 400 }
      );
    }

    const { data: post, error } = await createCommunityPost(userId, {
      content: body.content,
      postType: body.postType,
      programId: body.programId,
      visibility: body.visibility || 'members_only',
    });

    if (error || !post) {
      return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
    }

    return NextResponse.json({ post: { ...post, isOwn: true } }, { status: 201 });
  } catch (error) {
    console.error('[API] Error in POST /api/community:', error);
    if (error instanceof Error && error.message.includes('Unauthorized')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
