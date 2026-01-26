import { NextResponse, type NextRequest } from 'next/server';
import { headers } from 'next/headers';
import { getAuthUser } from '@/lib/auth/getAuthUser';
import { saveJournalEntry } from '@/lib/database/journalService';

type JournalPayload = {
  programId: string;
  dayNumber: number;
  entry: string;
};

/**
 * POST /api/programs/journal
 * Save or update a journal entry
 */
export async function POST(request: NextRequest) {
  try {
    // Get authenticated user
    const userId = await getAuthUser(await headers());

    // Parse request body
    const body = (await request.json()) as JournalPayload;

    // Validate payload
    if (!body?.programId || typeof body.dayNumber !== 'number' || !body.entry) {
      return NextResponse.json(
        { error: 'programId, dayNumber, and entry are required' },
        { status: 400 }
      );
    }

    // Save journal entry to database
    const { data: entry, error } = await saveJournalEntry(
      userId,
      body.programId,
      body.dayNumber,
      body.entry
    );

    if (error || !entry) {
      return NextResponse.json(
        { error: 'Failed to save journal entry' },
        { status: 500 }
      );
    }

    return NextResponse.json(entry);
  } catch (error) {
    console.error('[API] Error in POST /api/programs/journal:', error);

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
