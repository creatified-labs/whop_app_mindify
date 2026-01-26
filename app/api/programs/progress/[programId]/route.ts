import { NextResponse, type NextRequest } from 'next/server';
import { headers } from 'next/headers';
import { getAuthUser } from '@/lib/auth/getAuthUser';
import {
  getProgramProgress,
  resetProgramProgress,
} from '@/lib/database/programService';

/**
 * GET /api/programs/progress/[programId]
 * Get program progress for a specific program
 */
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ programId: string }> }
) {
  try {
    // Get authenticated user
    const userId = await getAuthUser(await headers());
    const { programId } = await context.params;

    // Validate programId
    if (!programId) {
      return NextResponse.json(
        { error: 'programId is required' },
        { status: 400 }
      );
    }

    // Get progress from database
    const { data: progress, error } = await getProgramProgress(userId, programId);

    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch progress' },
        { status: 500 }
      );
    }

    if (!progress) {
      return NextResponse.json(
        { message: 'No progress yet' },
        { status: 404 }
      );
    }

    return NextResponse.json(progress);
  } catch (error) {
    console.error('[API] Error in GET /api/programs/progress/[programId]:', error);

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
 * PUT /api/programs/progress/[programId]
 * Reset program progress
 */
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ programId: string }> }
) {
  try {
    // Get authenticated user
    const userId = await getAuthUser(await headers());
    const { programId } = await context.params;

    // Validate programId
    if (!programId) {
      return NextResponse.json(
        { error: 'programId is required' },
        { status: 400 }
      );
    }

    // Reset progress in database
    const { success, error } = await resetProgramProgress(userId, programId);

    if (!success || error) {
      return NextResponse.json(
        { error: 'Failed to reset progress' },
        { status: 500 }
      );
    }

    return NextResponse.json({ status: 'reset', programId });
  } catch (error) {
    console.error('[API] Error in PUT /api/programs/progress/[programId]:', error);

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
