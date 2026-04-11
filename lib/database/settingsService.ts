/**
 * Settings Service - Database operations for admin app settings
 *
 * Per-company settings: each company has its own row.
 */

import { supabaseAdmin } from '@/lib/supabase/admin';
import {
  pruneEmpty,
  type ExperienceCopy,
  type ExperienceFields,
  type ExperienceSections,
} from '@/lib/ui/experienceCopy';

export interface AppSettings {
  id: string;
  appName: string;
  appTagline: string;
  welcomeMessage: string;
  supportEmail: string;
  monthlyPrice: number;
  annualPrice: number;
  freeMeditationLimit: number;
  freeHypnosisLimit: number;
  freeProgramLimit: number;
  emailNotifications: boolean;
  streakReminders: boolean;
  weeklyDigest: boolean;
  newContentAlerts: boolean;
  maintenanceMode: boolean;
  analyticsTracking: boolean;
  debugMode: boolean;
  experienceCopy: Partial<ExperienceCopy>;
  experienceSections: Partial<ExperienceSections>;
  experienceFields: Partial<ExperienceFields>;
  updatedAt: string;
}

/**
 * Returned from getSettings when no row exists yet for a company. Mirrors the
 * column defaults in supabase/migrations/007_app_settings.sql so callers can
 * read fields directly without null-checks. A real row is created on first
 * save via updateSettings.
 */
function buildDefaultSettings(): AppSettings {
  return {
    id: "",
    appName: "Mindify",
    appTagline: "Transform your mind, one session at a time",
    welcomeMessage: "Welcome to your mindfulness journey",
    supportEmail: "",
    monthlyPrice: 14.99,
    annualPrice: 149.99,
    freeMeditationLimit: 5,
    freeHypnosisLimit: 2,
    freeProgramLimit: 1,
    emailNotifications: true,
    streakReminders: true,
    weeklyDigest: false,
    newContentAlerts: true,
    maintenanceMode: false,
    analyticsTracking: true,
    debugMode: false,
    experienceCopy: {},
    experienceSections: {},
    experienceFields: {},
    updatedAt: new Date().toISOString(),
  };
}

function rowToSettings(row: Record<string, unknown>): AppSettings {
  return {
    id: row.id as string,
    appName: row.app_name as string,
    appTagline: row.app_tagline as string,
    welcomeMessage: row.welcome_message as string,
    supportEmail: row.support_email as string,
    monthlyPrice: Number(row.monthly_price),
    annualPrice: Number(row.annual_price),
    freeMeditationLimit: row.free_meditation_limit as number,
    freeHypnosisLimit: row.free_hypnosis_limit as number,
    freeProgramLimit: row.free_program_limit as number,
    emailNotifications: row.email_notifications as boolean,
    streakReminders: row.streak_reminders as boolean,
    weeklyDigest: row.weekly_digest as boolean,
    newContentAlerts: row.new_content_alerts as boolean,
    maintenanceMode: row.maintenance_mode as boolean,
    analyticsTracking: row.analytics_tracking as boolean,
    debugMode: row.debug_mode as boolean,
    experienceCopy: (row.experience_copy as Partial<ExperienceCopy> | null) ?? {},
    experienceSections: (row.experience_sections as Partial<ExperienceSections> | null) ?? {},
    experienceFields: (row.experience_fields as Partial<ExperienceFields> | null) ?? {},
    updatedAt: row.updated_at as string,
  };
}

export async function getSettings(companyId: string): Promise<{ data: AppSettings | null; error: Error | null }> {
  try {
    const { data, error } = await supabaseAdmin
      .from('app_settings')
      .select('*')
      .eq('company_id', companyId)
      .single();

    if (error) {
      // PGRST116 = no row yet for this company — not an error, return defaults
      if (error.code === 'PGRST116') return { data: buildDefaultSettings(), error: null };
      console.error('[SettingsService] Error fetching settings:', error);
      return { data: null, error: new Error(error.message) };
    }

    return { data: rowToSettings(data), error: null };
  } catch (err) {
    console.error('[SettingsService] Error in getSettings:', err);
    return { data: null, error: err as Error };
  }
}

export async function updateSettings(
  companyId: string,
  updates: Partial<Omit<AppSettings, 'id' | 'updatedAt'>>
): Promise<{ data: AppSettings | null; error: Error | null }> {
  try {
    const dbUpdates: Record<string, unknown> = { updated_at: new Date().toISOString() };
    if (updates.appName !== undefined) dbUpdates.app_name = updates.appName;
    if (updates.appTagline !== undefined) dbUpdates.app_tagline = updates.appTagline;
    if (updates.welcomeMessage !== undefined) dbUpdates.welcome_message = updates.welcomeMessage;
    if (updates.supportEmail !== undefined) dbUpdates.support_email = updates.supportEmail;
    if (updates.monthlyPrice !== undefined) dbUpdates.monthly_price = updates.monthlyPrice;
    if (updates.annualPrice !== undefined) dbUpdates.annual_price = updates.annualPrice;
    if (updates.freeMeditationLimit !== undefined) dbUpdates.free_meditation_limit = updates.freeMeditationLimit;
    if (updates.freeHypnosisLimit !== undefined) dbUpdates.free_hypnosis_limit = updates.freeHypnosisLimit;
    if (updates.freeProgramLimit !== undefined) dbUpdates.free_program_limit = updates.freeProgramLimit;
    if (updates.emailNotifications !== undefined) dbUpdates.email_notifications = updates.emailNotifications;
    if (updates.streakReminders !== undefined) dbUpdates.streak_reminders = updates.streakReminders;
    if (updates.weeklyDigest !== undefined) dbUpdates.weekly_digest = updates.weeklyDigest;
    if (updates.newContentAlerts !== undefined) dbUpdates.new_content_alerts = updates.newContentAlerts;
    if (updates.maintenanceMode !== undefined) dbUpdates.maintenance_mode = updates.maintenanceMode;
    if (updates.analyticsTracking !== undefined) dbUpdates.analytics_tracking = updates.analyticsTracking;
    if (updates.debugMode !== undefined) dbUpdates.debug_mode = updates.debugMode;
    if (updates.experienceCopy !== undefined) {
      dbUpdates.experience_copy = pruneEmpty(updates.experienceCopy as Record<string, unknown>);
    }
    if (updates.experienceSections !== undefined) {
      dbUpdates.experience_sections = updates.experienceSections;
    }
    if (updates.experienceFields !== undefined) {
      dbUpdates.experience_fields = updates.experienceFields;
    }

    // Try to find existing settings row for this company
    const { data: existingRow } = await supabaseAdmin
      .from('app_settings')
      .select('id')
      .eq('company_id', companyId)
      .single();

    if (!existingRow) {
      // No settings row for this company yet - upsert with defaults
      const { data, error } = await supabaseAdmin
        .from('app_settings')
        .upsert({
          company_id: companyId,
          ...dbUpdates,
        })
        .select()
        .single();

      if (error) return { data: null, error: new Error(error.message) };
      return { data: rowToSettings(data), error: null };
    }

    const { data, error } = await supabaseAdmin
      .from('app_settings')
      .update(dbUpdates)
      .eq('company_id', companyId)
      .eq('id', existingRow.id)
      .select()
      .single();

    if (error) return { data: null, error: new Error(error.message) };
    return { data: rowToSettings(data), error: null };
  } catch (err) {
    console.error('[SettingsService] Error in updateSettings:', err);
    return { data: null, error: err as Error };
  }
}
