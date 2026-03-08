import { NextResponse, type NextRequest } from 'next/server';
import { headers } from 'next/headers';
import { getAuthUser, extractCompanyId } from '@/lib/auth/getAuthUser';
import {
  getProgramProgress,
  updateProgramProgress,
  enrollInProgram,
  completeProgramDay,
} from '@/lib/database/programService';
import type { ProgramProgress } from '@/lib/types';

type ProgressPayload = {
  programId: string;
  dayNumber: number;
  totalDays?: number;
  completed?: boolean;
};

/**
 * POST /api/programs/progress
 * Save or update program progress
 */
export async function POST(request: NextRequest) {
  try {
    const companyId = extractCompanyId(request);
    // Get authenticated user
    const userId = await getAuthUser(await headers());

    // Parse request body
    const body = (await request.json()) as ProgressPayload;

    // Validate payload
    if (!body?.programId || typeof body.dayNumber !== 'number') {
      return NextResponse.json(
        { error: 'programId and dayNumber are required' },
        { status: 400 }
      );
    }

    // Get existing progress or enroll if new
    let existing = await getProgramProgress(companyId, userId, body.programId);

    if (!existing.data) {
      // User not enrolled yet, enroll them
      const enrolled = await enrollInProgram(companyId, userId, body.programId);
      if (enrolled.error) {
        return NextResponse.json(
          { error: 'Failed to enroll in program' },
          { status: 500 }
        );
      }
      existing.data = enrolled.data;
    }

    const isCompleted = body.completed ?? true;

    if (isCompleted) {
      // Mark day as completed
      const result = await completeProgramDay(companyId, userId, body.programId, body.dayNumber);

      if (result.error) {
        return NextResponse.json(
          { error: 'Failed to update progress' },
          { status: 500 }
        );
      }

      // Check if program is complete
      if (body.totalDays && result.data!.completedDays.length >= body.totalDays) {
        result.data!.completedAt = new Date().toISOString();
        result.data!.currentDay = body.totalDays;

        await updateProgramProgress(companyId, userId, result.data!);
      }

      return NextResponse.json(result.data);
    }

    // Just update current day without completing
    const updated: ProgramProgress = {
      ...existing.data!,
      currentDay: body.dayNumber,
      lastUpdated: new Date().toISOString(),
    };

    const result = await updateProgramProgress(companyId, userId, updated);

    if (result.error) {
      return NextResponse.json(
        { error: 'Failed to update progress' },
        { status: 500 }
      );
    }

    return NextResponse.json(result.data);
  } catch (error) {
    console.error('[API] Error in POST /api/programs/progress:', error);

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
