/**
 * Content Service - Database operations for admin-managed content
 *
 * Handles CRUD for meditations, hypnosis sessions, programs, quick resets, and knowledge articles
 */

import { supabaseAdmin } from '@/lib/supabase/admin';
import type {
  Meditation,
  HypnosisSession,
  Program,
  ProgramDay,
  QuickReset,
} from '@/lib/types';
import type { KnowledgeArticle } from '@/lib/mockData/articles';

// =============================================================================
// MEDITATIONS
// =============================================================================

export async function getMeditations(): Promise<{ data: Meditation[]; error: Error | null }> {
  try {
    const { data, error } = await supabaseAdmin
      .from('meditations')
      .select('*')
      .order('sort_order', { ascending: true });

    if (error) {
      console.error('[ContentService] Error fetching meditations:', error);
      return { data: [], error: new Error(error.message) };
    }

    const meditations: Meditation[] = (data || []).map((row) => ({
      id: row.id,
      title: row.title,
      description: row.description,
      duration: row.duration,
      category: row.category,
      audioUrl: row.audio_url,
      imageUrl: row.image_url,
      mood: row.mood || [],
      isNew: row.is_new,
      isPremium: row.is_premium,
      tags: row.tags || [],
    }));

    return { data: meditations, error: null };
  } catch (err) {
    console.error('[ContentService] Error in getMeditations:', err);
    return { data: [], error: err as Error };
  }
}

export async function getMeditationById(id: string): Promise<{ data: Meditation | null; error: Error | null }> {
  try {
    const { data, error } = await supabaseAdmin
      .from('meditations')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return { data: null, error: null };
      return { data: null, error: new Error(error.message) };
    }

    return {
      data: {
        id: data.id,
        title: data.title,
        description: data.description,
        duration: data.duration,
        category: data.category,
        audioUrl: data.audio_url,
        imageUrl: data.image_url,
        mood: data.mood || [],
        isNew: data.is_new,
        isPremium: data.is_premium,
        tags: data.tags || [],
      },
      error: null,
    };
  } catch (err) {
    return { data: null, error: err as Error };
  }
}

export async function createMeditation(meditation: Omit<Meditation, 'id'> & { id?: string }): Promise<{ data: Meditation | null; error: Error | null }> {
  try {
    const id = meditation.id || meditation.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const { data, error } = await supabaseAdmin
      .from('meditations')
      .insert({
        id,
        title: meditation.title,
        description: meditation.description,
        duration: meditation.duration,
        category: meditation.category,
        audio_url: meditation.audioUrl,
        image_url: meditation.imageUrl,
        mood: meditation.mood,
        is_new: meditation.isNew ?? false,
        is_premium: meditation.isPremium ?? false,
        tags: meditation.tags ?? [],
      })
      .select()
      .single();

    if (error) return { data: null, error: new Error(error.message) };

    return {
      data: {
        id: data.id, title: data.title, description: data.description,
        duration: data.duration, category: data.category, audioUrl: data.audio_url,
        imageUrl: data.image_url, mood: data.mood || [], isNew: data.is_new,
        isPremium: data.is_premium, tags: data.tags || [],
      },
      error: null,
    };
  } catch (err) {
    return { data: null, error: err as Error };
  }
}

export async function updateMeditation(id: string, updates: Partial<Meditation>): Promise<{ data: Meditation | null; error: Error | null }> {
  try {
    const dbUpdates: Record<string, unknown> = {};
    if (updates.title !== undefined) dbUpdates.title = updates.title;
    if (updates.description !== undefined) dbUpdates.description = updates.description;
    if (updates.duration !== undefined) dbUpdates.duration = updates.duration;
    if (updates.category !== undefined) dbUpdates.category = updates.category;
    if (updates.audioUrl !== undefined) dbUpdates.audio_url = updates.audioUrl;
    if (updates.imageUrl !== undefined) dbUpdates.image_url = updates.imageUrl;
    if (updates.mood !== undefined) dbUpdates.mood = updates.mood;
    if (updates.isNew !== undefined) dbUpdates.is_new = updates.isNew;
    if (updates.isPremium !== undefined) dbUpdates.is_premium = updates.isPremium;
    if (updates.tags !== undefined) dbUpdates.tags = updates.tags;

    const { data, error } = await supabaseAdmin
      .from('meditations')
      .update(dbUpdates)
      .eq('id', id)
      .select()
      .single();

    if (error) return { data: null, error: new Error(error.message) };

    return {
      data: {
        id: data.id, title: data.title, description: data.description,
        duration: data.duration, category: data.category, audioUrl: data.audio_url,
        imageUrl: data.image_url, mood: data.mood || [], isNew: data.is_new,
        isPremium: data.is_premium, tags: data.tags || [],
      },
      error: null,
    };
  } catch (err) {
    return { data: null, error: err as Error };
  }
}

export async function deleteMeditation(id: string): Promise<{ success: boolean; error: Error | null }> {
  try {
    const { error } = await supabaseAdmin.from('meditations').delete().eq('id', id);
    if (error) return { success: false, error: new Error(error.message) };
    return { success: true, error: null };
  } catch (err) {
    return { success: false, error: err as Error };
  }
}

// =============================================================================
// HYPNOSIS SESSIONS
// =============================================================================

function rowToHypnosis(row: Record<string, unknown>): HypnosisSession {
  return {
    id: row.id as string,
    title: row.title as string,
    description: row.description as string,
    duration: row.duration as number,
    theme: row.theme as HypnosisSession['theme'],
    audioUrl: row.audio_url as string,
    hasBinaural: row.has_binaural as boolean,
    daytimeVersion: row.daytime_version as string | undefined,
    nighttimeVersion: row.nighttime_version as string | undefined,
    isPremium: row.is_premium as boolean | undefined,
  };
}

export async function getHypnosisSessions(): Promise<{ data: HypnosisSession[]; error: Error | null }> {
  try {
    const { data, error } = await supabaseAdmin
      .from('hypnosis_sessions')
      .select('*')
      .order('sort_order', { ascending: true });

    if (error) return { data: [], error: new Error(error.message) };
    return { data: (data || []).map(rowToHypnosis), error: null };
  } catch (err) {
    return { data: [], error: err as Error };
  }
}

export async function getHypnosisSessionById(id: string): Promise<{ data: HypnosisSession | null; error: Error | null }> {
  try {
    const { data, error } = await supabaseAdmin
      .from('hypnosis_sessions')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return { data: null, error: null };
      return { data: null, error: new Error(error.message) };
    }
    return { data: rowToHypnosis(data), error: null };
  } catch (err) {
    return { data: null, error: err as Error };
  }
}

export async function createHypnosisSession(session: Omit<HypnosisSession, 'id'> & { id?: string }): Promise<{ data: HypnosisSession | null; error: Error | null }> {
  try {
    const id = session.id || session.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const { data, error } = await supabaseAdmin
      .from('hypnosis_sessions')
      .insert({
        id,
        title: session.title,
        description: session.description,
        duration: session.duration,
        theme: session.theme,
        audio_url: session.audioUrl,
        has_binaural: session.hasBinaural,
        daytime_version: session.daytimeVersion,
        nighttime_version: session.nighttimeVersion,
        is_premium: session.isPremium ?? false,
      })
      .select()
      .single();

    if (error) return { data: null, error: new Error(error.message) };
    return { data: rowToHypnosis(data), error: null };
  } catch (err) {
    return { data: null, error: err as Error };
  }
}

export async function updateHypnosisSession(id: string, updates: Partial<HypnosisSession>): Promise<{ data: HypnosisSession | null; error: Error | null }> {
  try {
    const dbUpdates: Record<string, unknown> = {};
    if (updates.title !== undefined) dbUpdates.title = updates.title;
    if (updates.description !== undefined) dbUpdates.description = updates.description;
    if (updates.duration !== undefined) dbUpdates.duration = updates.duration;
    if (updates.theme !== undefined) dbUpdates.theme = updates.theme;
    if (updates.audioUrl !== undefined) dbUpdates.audio_url = updates.audioUrl;
    if (updates.hasBinaural !== undefined) dbUpdates.has_binaural = updates.hasBinaural;
    if (updates.daytimeVersion !== undefined) dbUpdates.daytime_version = updates.daytimeVersion;
    if (updates.nighttimeVersion !== undefined) dbUpdates.nighttime_version = updates.nighttimeVersion;
    if (updates.isPremium !== undefined) dbUpdates.is_premium = updates.isPremium;

    const { data, error } = await supabaseAdmin
      .from('hypnosis_sessions')
      .update(dbUpdates)
      .eq('id', id)
      .select()
      .single();

    if (error) return { data: null, error: new Error(error.message) };
    return { data: rowToHypnosis(data), error: null };
  } catch (err) {
    return { data: null, error: err as Error };
  }
}

export async function deleteHypnosisSession(id: string): Promise<{ success: boolean; error: Error | null }> {
  try {
    const { error } = await supabaseAdmin.from('hypnosis_sessions').delete().eq('id', id);
    if (error) return { success: false, error: new Error(error.message) };
    return { success: true, error: null };
  } catch (err) {
    return { success: false, error: err as Error };
  }
}

// =============================================================================
// PROGRAMS
// =============================================================================

function rowToProgram(row: Record<string, unknown>): Program {
  const includeSummary = row.include_summary as { meditations: number; tasks: number; journalPrompts: number } | null;
  return {
    id: row.id as string,
    title: row.title as string,
    tagline: row.tagline as string,
    description: row.description as string,
    duration: row.duration as number,
    category: row.category as Program['category'],
    difficulty: row.difficulty as Program['difficulty'],
    coverImage: row.cover_image as string,
    includeSummary: includeSummary ?? { meditations: 0, tasks: 0, journalPrompts: 0 },
    requirements: (row.requirements as string[]) || [],
    benefits: (row.benefits as string[]) || [],
    timeCommitment: row.time_commitment as string,
    recommendedFor: (row.recommended_for as string[]) || [],
    days: (row.days as ProgramDay[]) || [],
    isPremium: row.is_premium as boolean | undefined,
  };
}

export async function getPrograms(): Promise<{ data: Program[]; error: Error | null }> {
  try {
    const { data, error } = await supabaseAdmin
      .from('programs')
      .select('*')
      .order('sort_order', { ascending: true });

    if (error) return { data: [], error: new Error(error.message) };
    return { data: (data || []).map(rowToProgram), error: null };
  } catch (err) {
    return { data: [], error: err as Error };
  }
}

export async function getProgramById(id: string): Promise<{ data: Program | null; error: Error | null }> {
  try {
    const { data, error } = await supabaseAdmin
      .from('programs')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return { data: null, error: null };
      return { data: null, error: new Error(error.message) };
    }
    return { data: rowToProgram(data), error: null };
  } catch (err) {
    return { data: null, error: err as Error };
  }
}

export async function createProgram(program: Omit<Program, 'id'> & { id?: string }): Promise<{ data: Program | null; error: Error | null }> {
  try {
    const id = program.id || program.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const { data, error } = await supabaseAdmin
      .from('programs')
      .insert({
        id,
        title: program.title,
        tagline: program.tagline,
        description: program.description,
        duration: program.duration,
        category: program.category,
        difficulty: program.difficulty,
        cover_image: program.coverImage,
        include_summary: program.includeSummary,
        requirements: program.requirements,
        benefits: program.benefits,
        time_commitment: program.timeCommitment,
        recommended_for: program.recommendedFor,
        days: program.days as unknown as Record<string, unknown>[],
        is_premium: program.isPremium ?? false,
      })
      .select()
      .single();

    if (error) return { data: null, error: new Error(error.message) };
    return { data: rowToProgram(data), error: null };
  } catch (err) {
    return { data: null, error: err as Error };
  }
}

export async function updateProgram(id: string, updates: Partial<Program>): Promise<{ data: Program | null; error: Error | null }> {
  try {
    const dbUpdates: Record<string, unknown> = {};
    if (updates.title !== undefined) dbUpdates.title = updates.title;
    if (updates.tagline !== undefined) dbUpdates.tagline = updates.tagline;
    if (updates.description !== undefined) dbUpdates.description = updates.description;
    if (updates.duration !== undefined) dbUpdates.duration = updates.duration;
    if (updates.category !== undefined) dbUpdates.category = updates.category;
    if (updates.difficulty !== undefined) dbUpdates.difficulty = updates.difficulty;
    if (updates.coverImage !== undefined) dbUpdates.cover_image = updates.coverImage;
    if (updates.includeSummary !== undefined) dbUpdates.include_summary = updates.includeSummary;
    if (updates.requirements !== undefined) dbUpdates.requirements = updates.requirements;
    if (updates.benefits !== undefined) dbUpdates.benefits = updates.benefits;
    if (updates.timeCommitment !== undefined) dbUpdates.time_commitment = updates.timeCommitment;
    if (updates.recommendedFor !== undefined) dbUpdates.recommended_for = updates.recommendedFor;
    if (updates.days !== undefined) dbUpdates.days = updates.days;
    if (updates.isPremium !== undefined) dbUpdates.is_premium = updates.isPremium;

    const { data, error } = await supabaseAdmin
      .from('programs')
      .update(dbUpdates)
      .eq('id', id)
      .select()
      .single();

    if (error) return { data: null, error: new Error(error.message) };
    return { data: rowToProgram(data), error: null };
  } catch (err) {
    return { data: null, error: err as Error };
  }
}

export async function deleteProgram(id: string): Promise<{ success: boolean; error: Error | null }> {
  try {
    const { error } = await supabaseAdmin.from('programs').delete().eq('id', id);
    if (error) return { success: false, error: new Error(error.message) };
    return { success: true, error: null };
  } catch (err) {
    return { success: false, error: err as Error };
  }
}

// =============================================================================
// QUICK RESETS
// =============================================================================

function rowToQuickReset(row: Record<string, unknown>): QuickReset {
  return {
    id: row.id as string,
    title: row.title as string,
    duration: row.duration as number,
    type: row.type as QuickReset['type'],
    audioUrl: row.audio_url as string,
    instructions: row.instructions as string,
  };
}

export async function getQuickResets(): Promise<{ data: QuickReset[]; error: Error | null }> {
  try {
    const { data, error } = await supabaseAdmin
      .from('quick_resets')
      .select('*')
      .order('sort_order', { ascending: true });

    if (error) return { data: [], error: new Error(error.message) };
    return { data: (data || []).map(rowToQuickReset), error: null };
  } catch (err) {
    return { data: [], error: err as Error };
  }
}

export async function getQuickResetById(id: string): Promise<{ data: QuickReset | null; error: Error | null }> {
  try {
    const { data, error } = await supabaseAdmin
      .from('quick_resets')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return { data: null, error: null };
      return { data: null, error: new Error(error.message) };
    }
    return { data: rowToQuickReset(data), error: null };
  } catch (err) {
    return { data: null, error: err as Error };
  }
}

export async function createQuickReset(reset: Omit<QuickReset, 'id'> & { id?: string }): Promise<{ data: QuickReset | null; error: Error | null }> {
  try {
    const id = reset.id || reset.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const { data, error } = await supabaseAdmin
      .from('quick_resets')
      .insert({
        id,
        title: reset.title,
        duration: reset.duration,
        type: reset.type,
        audio_url: reset.audioUrl,
        instructions: reset.instructions,
      })
      .select()
      .single();

    if (error) return { data: null, error: new Error(error.message) };
    return { data: rowToQuickReset(data), error: null };
  } catch (err) {
    return { data: null, error: err as Error };
  }
}

export async function updateQuickReset(id: string, updates: Partial<QuickReset>): Promise<{ data: QuickReset | null; error: Error | null }> {
  try {
    const dbUpdates: Record<string, unknown> = {};
    if (updates.title !== undefined) dbUpdates.title = updates.title;
    if (updates.duration !== undefined) dbUpdates.duration = updates.duration;
    if (updates.type !== undefined) dbUpdates.type = updates.type;
    if (updates.audioUrl !== undefined) dbUpdates.audio_url = updates.audioUrl;
    if (updates.instructions !== undefined) dbUpdates.instructions = updates.instructions;

    const { data, error } = await supabaseAdmin
      .from('quick_resets')
      .update(dbUpdates)
      .eq('id', id)
      .select()
      .single();

    if (error) return { data: null, error: new Error(error.message) };
    return { data: rowToQuickReset(data), error: null };
  } catch (err) {
    return { data: null, error: err as Error };
  }
}

export async function deleteQuickReset(id: string): Promise<{ success: boolean; error: Error | null }> {
  try {
    const { error } = await supabaseAdmin.from('quick_resets').delete().eq('id', id);
    if (error) return { success: false, error: new Error(error.message) };
    return { success: true, error: null };
  } catch (err) {
    return { success: false, error: err as Error };
  }
}

// =============================================================================
// KNOWLEDGE ARTICLES
// =============================================================================

function rowToArticle(row: Record<string, unknown>): KnowledgeArticle {
  return {
    slug: row.slug as string,
    title: row.title as string,
    category: row.category as KnowledgeArticle['category'],
    author: row.author as string,
    readTimeMinutes: row.read_time_minutes as number,
    thumbnail: row.thumbnail as string,
    updatedAt: (row.updated_at as string) || '',
    content: row.content as string,
    keyTakeaways: (row.key_takeaways as string[]) || [],
    actionSteps: (row.action_steps as string[]) || [],
    recommendedSessions: (row.recommended_sessions as KnowledgeArticle['recommendedSessions']) || [],
    references: (row.references as string[]) || [],
  };
}

export async function getArticles(): Promise<{ data: KnowledgeArticle[]; error: Error | null }> {
  try {
    const { data, error } = await supabaseAdmin
      .from('knowledge_articles')
      .select('*')
      .order('sort_order', { ascending: true });

    if (error) return { data: [], error: new Error(error.message) };
    return { data: (data || []).map(rowToArticle), error: null };
  } catch (err) {
    return { data: [], error: err as Error };
  }
}

export async function getArticleBySlug(slug: string): Promise<{ data: KnowledgeArticle | null; error: Error | null }> {
  try {
    const { data, error } = await supabaseAdmin
      .from('knowledge_articles')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return { data: null, error: null };
      return { data: null, error: new Error(error.message) };
    }
    return { data: rowToArticle(data), error: null };
  } catch (err) {
    return { data: null, error: err as Error };
  }
}

export async function createArticle(article: Omit<KnowledgeArticle, 'updatedAt'> & { slug?: string }): Promise<{ data: KnowledgeArticle | null; error: Error | null }> {
  try {
    const slug = article.slug || article.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const { data, error } = await supabaseAdmin
      .from('knowledge_articles')
      .insert({
        slug,
        title: article.title,
        category: article.category,
        author: article.author,
        read_time_minutes: article.readTimeMinutes,
        thumbnail: article.thumbnail,
        content: article.content,
        key_takeaways: article.keyTakeaways,
        action_steps: article.actionSteps,
        recommended_sessions: article.recommendedSessions as unknown as Record<string, unknown>[],
        references: article.references,
      })
      .select()
      .single();

    if (error) return { data: null, error: new Error(error.message) };
    return { data: rowToArticle(data), error: null };
  } catch (err) {
    return { data: null, error: err as Error };
  }
}

export async function updateArticle(slug: string, updates: Partial<KnowledgeArticle>): Promise<{ data: KnowledgeArticle | null; error: Error | null }> {
  try {
    const dbUpdates: Record<string, unknown> = {};
    if (updates.title !== undefined) dbUpdates.title = updates.title;
    if (updates.category !== undefined) dbUpdates.category = updates.category;
    if (updates.author !== undefined) dbUpdates.author = updates.author;
    if (updates.readTimeMinutes !== undefined) dbUpdates.read_time_minutes = updates.readTimeMinutes;
    if (updates.thumbnail !== undefined) dbUpdates.thumbnail = updates.thumbnail;
    if (updates.content !== undefined) dbUpdates.content = updates.content;
    if (updates.keyTakeaways !== undefined) dbUpdates.key_takeaways = updates.keyTakeaways;
    if (updates.actionSteps !== undefined) dbUpdates.action_steps = updates.actionSteps;
    if (updates.recommendedSessions !== undefined) dbUpdates.recommended_sessions = updates.recommendedSessions;
    if (updates.references !== undefined) dbUpdates.references = updates.references;

    const { data, error } = await supabaseAdmin
      .from('knowledge_articles')
      .update(dbUpdates)
      .eq('slug', slug)
      .select()
      .single();

    if (error) return { data: null, error: new Error(error.message) };
    return { data: rowToArticle(data), error: null };
  } catch (err) {
    return { data: null, error: err as Error };
  }
}

export async function deleteArticle(slug: string): Promise<{ success: boolean; error: Error | null }> {
  try {
    const { error } = await supabaseAdmin.from('knowledge_articles').delete().eq('slug', slug);
    if (error) return { success: false, error: new Error(error.message) };
    return { success: true, error: null };
  } catch (err) {
    return { success: false, error: err as Error };
  }
}
