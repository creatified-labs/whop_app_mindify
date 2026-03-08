import { NextResponse, type NextRequest } from 'next/server';
import { headers } from 'next/headers';
import { getAuthUser, extractCompanyId } from '@/lib/auth/getAuthUser';
import { getJournalEntry } from '@/lib/database/journalService';

/**
 * GET /api/programs/journal/[programId]/[dayNumber]
 * Get a specific journal entry
 */
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ programId: string; dayNumber: string }> }
) {
  try {
    const companyId = extractCompanyId(request);
    // Get authenticated user
    const userId = await getAuthUser(await headers());
    const { programId, dayNumber } = await context.params;

    // Validate params
    if (!programId || !dayNumber) {
      return NextResponse.json(
        { error: 'programId and dayNumber are required' },
        { status: 400 }
      );
    }

    const day = Number(dayNumber);
    if (Number.isNaN(day)) {
      return NextResponse.json(
        { error: 'dayNumber must be numeric' },
        { status: 400 }
      );
    }

    // Get journal entry from database
    const { data: entry, error } = await getJournalEntry(companyId, userId, programId, day);

    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch journal entry' },
        { status: 500 }
      );
    }

    if (!entry) {
      return NextResponse.json(
        { message: 'No journal entry yet' },
        { status: 404 }
      );
    }

    return NextResponse.json(entry);
  } catch (error) {
    console.error('[API] Error in GET /api/programs/journal/[programId]/[dayNumber]:', error);

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
