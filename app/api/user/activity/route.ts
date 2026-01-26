import { NextResponse, type NextRequest } from 'next/server';
import { headers } from 'next/headers';
import { getAuthUser } from '@/lib/auth/getAuthUser';
import {
  recordActivity,
  getUserActivity,
  type ActivityRecord,
  type ActivityFilters,
} from '@/lib/database/activityService';

/**
 * GET /api/user/activity
 * Get user activity history with optional filters
 */
export async function GET(request: NextRequest) {
  try {
    // Get authenticated user
    const userId = await getAuthUser(await headers());

    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const filters: ActivityFilters = {};

    if (searchParams.get('activity_type')) {
      filters.activity_type = searchParams.get('activity_type')!;
    }

    if (searchParams.get('start_date')) {
      filters.start_date = searchParams.get('start_date')!;
    }

    if (searchParams.get('end_date')) {
      filters.end_date = searchParams.get('end_date')!;
    }

    if (searchParams.get('limit')) {
      filters.limit = Number.parseInt(searchParams.get('limit')!, 10);
    }

    // Get activity from database
    const { data: activities, error } = await getUserActivity(userId, filters);

    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch activity' },
        { status: 500 }
      );
    }

    return NextResponse.json({ activities });
  } catch (error) {
    console.error('[API] Error in GET /api/user/activity:', error);

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
 * POST /api/user/activity
 * Record a new activity (meditation, hypnosis, reset, program day)
 */
export async function POST(request: NextRequest) {
  try {
    // Get authenticated user
    const userId = await getAuthUser(await headers());

    // Parse request body
    const body = (await request.json()) as ActivityRecord;

    // Validate payload
    if (!body.activity_type || !body.content_id) {
      return NextResponse.json(
        { error: 'activity_type and content_id are required' },
        { status: 400 }
      );
    }

    // Validate activity_type
    const validTypes = ['meditation', 'hypnosis', 'reset', 'program_day'];
    if (!validTypes.includes(body.activity_type)) {
      return NextResponse.json(
        { error: 'Invalid activity_type. Must be: meditation, hypnosis, reset, or program_day' },
        { status: 400 }
      );
    }

    // Record activity in database
    const { success, error } = await recordActivity(userId, body);

    if (!success || error) {
      return NextResponse.json(
        { error: 'Failed to record activity' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, message: 'Activity recorded' });
  } catch (error) {
    console.error('[API] Error in POST /api/user/activity:', error);

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
