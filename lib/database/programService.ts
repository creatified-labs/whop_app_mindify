/**
 * Program Service - Database operations for program progress
 *
 * Handles program enrollment, progress tracking, and completion
 */

import { supabaseAdmin } from '@/lib/supabase/admin';
import type { ProgramProgress } from '@/lib/types';

/**
 * Get program progress for a specific user and program
 */
export async function getProgramProgress(
  companyId: string,
  userId: string,
  programId: string
): Promise<{ data: ProgramProgress | null; error: Error | null }> {
  try {
    const { data, error } = await supabaseAdmin
      .from('program_progress')
      .select('*')
      .eq('company_id', companyId)
      .eq('user_id', userId)
      .eq('program_id', programId)
      .single();

    if (error) {
      // Return null if not found (user hasn't enrolled)
      if (error.code === 'PGRST116') {
        return { data: null, error: null };
      }
      console.error('[ProgramService] Error fetching program progress:', error);
      return { data: null, error: new Error(error.message) };
    }

    // Transform database format to app format
    const progress: ProgramProgress = {
      programId: data.program_id,
      currentDay: data.current_day,
      completedDays: data.completed_days,
      enrolledAt: data.enrolled_at,
      streak: data.streak,
      lastUpdated: data.last_updated,
      completedAt: data.completed_at,
    };

    return { data: progress, error: null };
  } catch (err) {
    console.error('[ProgramService] Error in getProgramProgress:', err);
    return { data: null, error: err as Error };
  }
}

/**
 * Get all program progress for a user
 */
export async function getAllProgramProgress(
  companyId: string,
  userId: string
): Promise<{ data: ProgramProgress[]; error: Error | null }> {
  try {
    const { data, error } = await supabaseAdmin
      .from('program_progress')
      .select('*')
      .eq('company_id', companyId)
      .eq('user_id', userId);

    if (error) {
      console.error('[ProgramService] Error fetching all program progress:', error);
      return { data: [], error: new Error(error.message) };
    }

    // Transform to app format
    const progress: ProgramProgress[] = (data || []).map((row) => ({
      programId: row.program_id,
      currentDay: row.current_day,
      completedDays: row.completed_days,
      enrolledAt: row.enrolled_at,
      streak: row.streak,
      lastUpdated: row.last_updated,
      completedAt: row.completed_at,
    }));

    return { data: progress, error: null };
  } catch (err) {
    console.error('[ProgramService] Error in getAllProgramProgress:', err);
    return { data: [], error: err as Error };
  }
}

/**
 * Enroll a user in a program
 */
export async function enrollInProgram(
  companyId: string,
  userId: string,
  programId: string
): Promise<{ data: ProgramProgress | null; error: Error | null }> {
  try {
    const now = new Date().toISOString();

    const { data, error } = await supabaseAdmin
      .from('program_progress')
      .insert({
        company_id: companyId,
        user_id: userId,
        program_id: programId,
        current_day: 1,
        completed_days: [],
        enrolled_at: now,
        last_updated: now,
        streak: 0,
      })
      .select()
      .single();

    if (error) {
      console.error('[ProgramService] Error enrolling in program:', error);
      return { data: null, error: new Error(error.message) };
    }

    const progress: ProgramProgress = {
      programId: data.program_id,
      currentDay: data.current_day,
      completedDays: data.completed_days,
      enrolledAt: data.enrolled_at,
      streak: data.streak,
      lastUpdated: data.last_updated,
      completedAt: data.completed_at,
    };

    return { data: progress, error: null };
  } catch (err) {
    console.error('[ProgramService] Error in enrollInProgram:', err);
    return { data: null, error: err as Error };
  }
}

/**
 * Update program progress
 */
export async function updateProgramProgress(
  companyId: string,
  userId: string,
  progress: ProgramProgress
): Promise<{ data: ProgramProgress | null; error: Error | null }> {
  try {
    const { data, error } = await supabaseAdmin
      .from('program_progress')
      .update({
        current_day: progress.currentDay,
        completed_days: progress.completedDays,
        last_updated: new Date().toISOString(),
        streak: progress.streak,
        completed_at: progress.completedAt,
      })
      .eq('company_id', companyId)
      .eq('user_id', userId)
      .eq('program_id', progress.programId)
      .select()
      .single();

    if (error) {
      console.error('[ProgramService] Error updating program progress:', error);
      return { data: null, error: new Error(error.message) };
    }

    const updated: ProgramProgress = {
      programId: data.program_id,
      currentDay: data.current_day,
      completedDays: data.completed_days,
      enrolledAt: data.enrolled_at,
      streak: data.streak,
      lastUpdated: data.last_updated,
      completedAt: data.completed_at,
    };

    return { data: updated, error: null };
  } catch (err) {
    console.error('[ProgramService] Error in updateProgramProgress:', err);
    return { data: null, error: err as Error };
  }
}

/**
 * Complete a program day
 */
export async function completeProgramDay(
  companyId: string,
  userId: string,
  programId: string,
  dayNumber: number
): Promise<{ data: ProgramProgress | null; error: Error | null }> {
  try {
    // Get current progress
    const { data: currentProgress, error: fetchError } = await getProgramProgress(
      companyId,
      userId,
      programId
    );

    if (fetchError || !currentProgress) {
      return { data: null, error: fetchError || new Error('Program progress not found') };
    }

    // Add day to completed days if not already there
    const completedDays = currentProgress.completedDays.includes(dayNumber)
      ? currentProgress.completedDays
      : [...currentProgress.completedDays, dayNumber];

    // Update progress
    const updated: ProgramProgress = {
      ...currentProgress,
      completedDays,
      currentDay: dayNumber + 1,
      lastUpdated: new Date().toISOString(),
      streak: currentProgress.streak + 1,
    };

    return updateProgramProgress(companyId, userId, updated);
  } catch (err) {
    console.error('[ProgramService] Error in completeProgramDay:', err);
    return { data: null, error: err as Error };
  }
}

/**
 * Reset program progress
 */
export async function resetProgramProgress(
  companyId: string,
  userId: string,
  programId: string
): Promise<{ success: boolean; error: Error | null }> {
  try {
    const { error } = await supabaseAdmin
      .from('program_progress')
      .update({
        current_day: 1,
        completed_days: [],
        streak: 0,
        last_updated: new Date().toISOString(),
        completed_at: null,
      })
      .eq('company_id', companyId)
      .eq('user_id', userId)
      .eq('program_id', programId);

    if (error) {
      console.error('[ProgramService] Error resetting program progress:', error);
      return { success: false, error: new Error(error.message) };
    }

    return { success: true, error: null };
  } catch (err) {
    console.error('[ProgramService] Error in resetProgramProgress:', err);
    return { success: false, error: err as Error };
  }
}
