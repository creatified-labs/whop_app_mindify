/**
 * Activity Service - Database operations for user activity tracking
 *
 * Handles tracking meditation, hypnosis, reset, and program completions
 */

import { supabaseAdmin } from '@/lib/supabase/admin';

export interface ActivityRecord {
  activity_type: 'meditation' | 'hypnosis' | 'reset' | 'program_day';
  content_id: string;
  duration_minutes?: number;
  metadata?: Record<string, any>;
  completed_at?: string;
}

export interface ActivityFilters {
  activity_type?: string;
  start_date?: string;
  end_date?: string;
  limit?: number;
}

export interface ActivityStats {
  totalMinutesMeditated: number;
  totalSessions: number;
  meditationCount: number;
  hypnosisCount: number;
  resetCount: number;
  programDayCount: number;
  streakDays: number;
  lastActivityDate: string | null;
}

/**
 * Record a user activity (meditation, hypnosis, reset, program day completion)
 */
export async function recordActivity(
  companyId: string,
  userId: string,
  activity: ActivityRecord
): Promise<{ success: boolean; error: Error | null }> {
  try {
    const { error } = await supabaseAdmin.from('user_activity').insert({
      company_id: companyId,
      user_id: userId,
      activity_type: activity.activity_type,
      content_id: activity.content_id,
      duration_minutes: activity.duration_minutes || null,
      completed_at: activity.completed_at || new Date().toISOString(),
      metadata: activity.metadata || null,
    });

    if (error) {
      console.error('[ActivityService] Error recording activity:', error);
      return { success: false, error: new Error(error.message) };
    }

    return { success: true, error: null };
  } catch (err) {
    console.error('[ActivityService] Error in recordActivity:', err);
    return { success: false, error: err as Error };
  }
}

/**
 * Get user activity history with optional filters
 */
export async function getUserActivity(
  companyId: string,
  userId: string,
  filters?: ActivityFilters
): Promise<{ data: any[]; error: Error | null }> {
  try {
    let query = supabaseAdmin
      .from('user_activity')
      .select('*')
      .eq('company_id', companyId)
      .eq('user_id', userId)
      .order('completed_at', { ascending: false });

    // Apply filters
    if (filters?.activity_type) {
      query = query.eq('activity_type', filters.activity_type);
    }

    if (filters?.start_date) {
      query = query.gte('completed_at', filters.start_date);
    }

    if (filters?.end_date) {
      query = query.lte('completed_at', filters.end_date);
    }

    if (filters?.limit) {
      query = query.limit(filters.limit);
    }

    const { data, error } = await query;

    if (error) {
      console.error('[ActivityService] Error fetching user activity:', error);
      return { data: [], error: new Error(error.message) };
    }

    return { data: data || [], error: null };
  } catch (err) {
    console.error('[ActivityService] Error in getUserActivity:', err);
    return { data: [], error: err as Error };
  }
}

/**
 * Get aggregated activity statistics for a user
 */
export async function getActivityStats(
  companyId: string,
  userId: string
): Promise<{ data: ActivityStats | null; error: Error | null }> {
  try {
    // Get all activity for the user
    const { data: activities, error: fetchError } = await supabaseAdmin
      .from('user_activity')
      .select('*')
      .eq('company_id', companyId)
      .eq('user_id', userId);

    if (fetchError) {
      console.error('[ActivityService] Error fetching activities for stats:', fetchError);
      return { data: null, error: new Error(fetchError.message) };
    }

    if (!activities || activities.length === 0) {
      return {
        data: {
          totalMinutesMeditated: 0,
          totalSessions: 0,
          meditationCount: 0,
          hypnosisCount: 0,
          resetCount: 0,
          programDayCount: 0,
          streakDays: 0,
          lastActivityDate: null,
        },
        error: null,
      };
    }

    // Calculate stats
    const totalMinutesMeditated = activities.reduce(
      (sum, activity) => sum + (activity.duration_minutes || 0),
      0
    );

    const meditationCount = activities.filter((a) => a.activity_type === 'meditation').length;
    const hypnosisCount = activities.filter((a) => a.activity_type === 'hypnosis').length;
    const resetCount = activities.filter((a) => a.activity_type === 'reset').length;
    const programDayCount = activities.filter((a) => a.activity_type === 'program_day').length;

    // Calculate streak (consecutive days with activity)
    const streakDays = calculateStreak(activities);

    // Get last activity date
    const lastActivityDate =
      activities.length > 0
        ? activities.sort(
            (a, b) =>
              new Date(b.completed_at).getTime() - new Date(a.completed_at).getTime()
          )[0].completed_at
        : null;

    const stats: ActivityStats = {
      totalMinutesMeditated,
      totalSessions: activities.length,
      meditationCount,
      hypnosisCount,
      resetCount,
      programDayCount,
      streakDays,
      lastActivityDate,
    };

    return { data: stats, error: null };
  } catch (err) {
    console.error('[ActivityService] Error in getActivityStats:', err);
    return { data: null, error: err as Error };
  }
}

/**
 * Calculate consecutive day streak
 */
function calculateStreak(activities: any[]): number {
  if (activities.length === 0) return 0;

  // Sort activities by date (newest first)
  const sorted = activities
    .map((a) => new Date(a.completed_at))
    .sort((a, b) => b.getTime() - a.getTime());

  // Get unique dates (ignore time)
  const uniqueDates = Array.from(
    new Set(sorted.map((date) => date.toISOString().split('T')[0]))
  )
    .map((dateStr) => new Date(dateStr))
    .sort((a, b) => b.getTime() - a.getTime());

  if (uniqueDates.length === 0) return 0;

  // Check if streak is current (activity within last 24 hours)
  const now = new Date();
  const lastActivity = uniqueDates[0];
  const hoursSinceLastActivity =
    (now.getTime() - lastActivity.getTime()) / (1000 * 60 * 60);

  // If more than 48 hours since last activity, streak is broken
  if (hoursSinceLastActivity > 48) return 0;

  // Count consecutive days
  let streak = 1;
  for (let i = 1; i < uniqueDates.length; i++) {
    const currentDate = uniqueDates[i];
    const previousDate = uniqueDates[i - 1];
    const dayDiff = Math.floor(
      (previousDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (dayDiff === 1) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}

/**
 * Get recent activity (last N items)
 */
export async function getRecentActivity(
  companyId: string,
  userId: string,
  limit: number = 10
): Promise<{ data: any[]; error: Error | null }> {
  return getUserActivity(companyId, userId, { limit });
}

/**
 * Delete all activity for a user (for testing/cleanup)
 */
export async function deleteAllUserActivity(
  companyId: string,
  userId: string
): Promise<{ success: boolean; error: Error | null }> {
  try {
    const { error } = await supabaseAdmin
      .from('user_activity')
      .delete()
      .eq('company_id', companyId)
      .eq('user_id', userId);

    if (error) {
      console.error('[ActivityService] Error deleting user activity:', error);
      return { success: false, error: new Error(error.message) };
    }

    return { success: true, error: null };
  } catch (err) {
    console.error('[ActivityService] Error in deleteAllUserActivity:', err);
    return { success: false, error: err as Error };
  }
}
