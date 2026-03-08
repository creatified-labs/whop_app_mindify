import { NextResponse, type NextRequest } from 'next/server';
import { headers } from 'next/headers';
import { getAuthUser, extractCompanyId } from '@/lib/auth/getAuthUser';
import { getActivityStats } from '@/lib/database/activityService';
import { getAllProgramProgress } from '@/lib/database/programService';
import { getFavoriteCount } from '@/lib/database/favoritesService';

/**
 * GET /api/user/stats
 * Get aggregated user statistics
 */
export async function GET(request: NextRequest) {
  try {
    const companyId = extractCompanyId(request);
    // Get authenticated user
    const userId = await getAuthUser(await headers());

    // Get activity stats
    const { data: activityStats, error: activityError } = await getActivityStats(companyId, userId);

    if (activityError) {
      console.error('[API] Error fetching activity stats:', activityError);
    }

    // Get program stats
    const { data: programProgress, error: programError } = await getAllProgramProgress(companyId, userId);

    if (programError) {
      console.error('[API] Error fetching program progress:', programError);
    }

    // Get favorites count
    const { count: favoritesCount, error: favoritesError } = await getFavoriteCount(companyId, userId);

    if (favoritesError) {
      console.error('[API] Error fetching favorites count:', favoritesError);
    }

    // Calculate program stats
    const programStats = {
      totalProgramsEnrolled: programProgress?.length || 0,
      activeProgramsCount: programProgress?.filter((p) => !p.completedAt).length || 0,
      completedProgramsCount: programProgress?.filter((p) => p.completedAt).length || 0,
      totalProgramDaysCompleted:
        programProgress?.reduce((sum, p) => sum + p.completedDays.length, 0) || 0,
      longestProgramStreak:
        programProgress?.reduce((max, p) => Math.max(max, p.streak), 0) || 0,
    };

    // Compile all stats
    const stats = {
      // Activity stats
      activity: activityStats || {
        totalMinutesMeditated: 0,
        totalSessions: 0,
        meditationCount: 0,
        hypnosisCount: 0,
        resetCount: 0,
        programDayCount: 0,
        streakDays: 0,
        lastActivityDate: null,
      },

      // Program stats
      programs: programStats,

      // Favorites
      favoritesCount: favoritesCount || 0,

      // Calculated fields
      totalContentCompleted:
        (activityStats?.meditationCount || 0) +
        (activityStats?.hypnosisCount || 0) +
        (activityStats?.resetCount || 0),
    };

    return NextResponse.json({ stats });
  } catch (error) {
    console.error('[API] Error in GET /api/user/stats:', error);

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
