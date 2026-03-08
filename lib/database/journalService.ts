/**
 * Journal Service - Database operations for program journal entries
 *
 * Handles reading, writing, and updating journal entries
 */

import { supabaseAdmin } from '@/lib/supabase/admin';
import type { ProgramJournalEntry } from '@/lib/types';

/**
 * Get a specific journal entry
 */
export async function getJournalEntry(
  companyId: string,
  userId: string,
  programId: string,
  dayNumber: number
): Promise<{ data: ProgramJournalEntry | null; error: Error | null }> {
  try {
    const { data, error } = await supabaseAdmin
      .from('program_journal_entries')
      .select('*')
      .eq('company_id', companyId)
      .eq('user_id', userId)
      .eq('program_id', programId)
      .eq('day_number', dayNumber)
      .single();

    if (error) {
      // Return null if not found
      if (error.code === 'PGRST116') {
        return { data: null, error: null };
      }
      console.error('[JournalService] Error fetching journal entry:', error);
      return { data: null, error: new Error(error.message) };
    }

    const entry: ProgramJournalEntry = {
      programId: data.program_id,
      dayNumber: data.day_number,
      entry: data.entry,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };

    return { data: entry, error: null };
  } catch (err) {
    console.error('[JournalService] Error in getJournalEntry:', err);
    return { data: null, error: err as Error };
  }
}

/**
 * Get all journal entries for a program
 */
export async function getAllJournalEntries(
  companyId: string,
  userId: string,
  programId: string
): Promise<{ data: ProgramJournalEntry[]; error: Error | null }> {
  try {
    const { data, error } = await supabaseAdmin
      .from('program_journal_entries')
      .select('*')
      .eq('company_id', companyId)
      .eq('user_id', userId)
      .eq('program_id', programId)
      .order('day_number', { ascending: true });

    if (error) {
      console.error('[JournalService] Error fetching all journal entries:', error);
      return { data: [], error: new Error(error.message) };
    }

    const entries: ProgramJournalEntry[] = (data || []).map((row) => ({
      programId: row.program_id,
      dayNumber: row.day_number,
      entry: row.entry,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }));

    return { data: entries, error: null };
  } catch (err) {
    console.error('[JournalService] Error in getAllJournalEntries:', err);
    return { data: [], error: err as Error };
  }
}

/**
 * Save or update a journal entry
 */
export async function saveJournalEntry(
  companyId: string,
  userId: string,
  programId: string,
  dayNumber: number,
  entry: string
): Promise<{ data: ProgramJournalEntry | null; error: Error | null }> {
  try {
    const now = new Date().toISOString();

    // Upsert (insert or update)
    const { data, error } = await supabaseAdmin
      .from('program_journal_entries')
      .upsert(
        {
          company_id: companyId,
          user_id: userId,
          program_id: programId,
          day_number: dayNumber,
          entry,
          created_at: now,
          updated_at: now,
        },
        {
          onConflict: 'user_id,program_id,day_number',
        }
      )
      .select()
      .single();

    if (error) {
      console.error('[JournalService] Error saving journal entry:', error);
      return { data: null, error: new Error(error.message) };
    }

    const savedEntry: ProgramJournalEntry = {
      programId: data.program_id,
      dayNumber: data.day_number,
      entry: data.entry,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };

    return { data: savedEntry, error: null };
  } catch (err) {
    console.error('[JournalService] Error in saveJournalEntry:', err);
    return { data: null, error: err as Error };
  }
}

/**
 * Delete a journal entry
 */
export async function deleteJournalEntry(
  companyId: string,
  userId: string,
  programId: string,
  dayNumber: number
): Promise<{ success: boolean; error: Error | null }> {
  try {
    const { error } = await supabaseAdmin
      .from('program_journal_entries')
      .delete()
      .eq('company_id', companyId)
      .eq('user_id', userId)
      .eq('program_id', programId)
      .eq('day_number', dayNumber);

    if (error) {
      console.error('[JournalService] Error deleting journal entry:', error);
      return { success: false, error: new Error(error.message) };
    }

    return { success: true, error: null };
  } catch (err) {
    console.error('[JournalService] Error in deleteJournalEntry:', err);
    return { success: false, error: err as Error };
  }
}

/**
 * Get count of journal entries for a program
 */
export async function getJournalEntryCount(
  companyId: string,
  userId: string,
  programId: string
): Promise<{ count: number; error: Error | null }> {
  try {
    const { count, error } = await supabaseAdmin
      .from('program_journal_entries')
      .select('*', { count: 'exact', head: true })
      .eq('company_id', companyId)
      .eq('user_id', userId)
      .eq('program_id', programId);

    if (error) {
      console.error('[JournalService] Error counting journal entries:', error);
      return { count: 0, error: new Error(error.message) };
    }

    return { count: count || 0, error: null };
  } catch (err) {
    console.error('[JournalService] Error in getJournalEntryCount:', err);
    return { count: 0, error: err as Error };
  }
}
