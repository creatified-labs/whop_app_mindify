import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { getAuthUser } from '@/lib/auth/getAuthUser';
import { deleteCommunityPost } from '@/lib/database/communityService';

/**
 * DELETE /api/community/[postId]
 * Delete a community post (own posts only)
 */
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ postId: string }> }
) {
  try {
    const userId = await getAuthUser(await headers());
    const { postId } = await params;

    if (!postId) {
      return NextResponse.json({ error: 'postId is required' }, { status: 400 });
    }

    const { success, error } = await deleteCommunityPost(userId, postId);

    if (error) {
      return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 });
    }

    if (!success) {
      return NextResponse.json({ error: 'Post not found or not owned by you' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[API] Error in DELETE /api/community/[postId]:', error);
    if (error instanceof Error && error.message.includes('Unauthorized')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
