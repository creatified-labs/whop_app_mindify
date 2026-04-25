/**
 * Experience View customization helpers
 *
 * Pure TS (no React). Provides:
 *   - Types + defaults for admin-customizable copy and section visibility
 *   - Resolvers that merge persisted partial config over defaults
 *   - Template interpolation helpers for welcome/recommended headings
 *
 * Design notes:
 *   - Blank string (`""`) is treated as "unset" in resolveExperienceCopy because
 *     React form inputs produce "" when cleared — we want cleared fields to fall
 *     back to defaults rather than render an empty string.
 *   - pruneEmpty is called before writing to the DB so JSONB never stores "".
 */

// =============================================================================
// Section visibility
// =============================================================================

export type SectionKey =
	| "heroBanner"
	| "continueRitual"
	| "currentProgram"
	| "featuredMeditations"
	| "featuredHypnosis"
	| "featuredQuickResets"
	| "recentActivity"
	| "favoriteSoundscapes"
	| "dailyStreak";

export type ExperienceSections = Record<SectionKey, boolean>;

/** Ordered list used by the admin UI to render toggles. */
export const SECTION_KEYS: readonly SectionKey[] = [
	"heroBanner",
	"continueRitual",
	"currentProgram",
	"featuredMeditations",
	"featuredHypnosis",
	"featuredQuickResets",
	"recentActivity",
	"favoriteSoundscapes",
	"dailyStreak",
] as const;

/** Human-friendly labels for the admin toggle UI. */
export const SECTION_LABELS: Record<SectionKey, string> = {
	heroBanner: "Hero banner",
	continueRitual: "Continue Ritual",
	currentProgram: "Current Program / Featured Programs",
	featuredMeditations: "Featured Meditations",
	featuredHypnosis: "Featured Hypnosis",
	featuredQuickResets: "Featured Quick Resets",
	recentActivity: "Recent Activity",
	favoriteSoundscapes: "Favorite Soundscapes",
	dailyStreak: "Daily Streak",
};

export const DEFAULT_EXPERIENCE_SECTIONS: ExperienceSections = {
	heroBanner: true,
	continueRitual: true,
	currentProgram: true,
	featuredMeditations: true,
	featuredHypnosis: true,
	featuredQuickResets: true,
	recentActivity: true,
	favoriteSoundscapes: true,
	dailyStreak: true,
};

// =============================================================================
// Copy
// =============================================================================

export interface ExperienceCopy {
	// Hero banner (app/experiences/[experienceId]/page.tsx)
	heroEyebrow: string;
	heroTitle: string; // blank = fall back to experience.slug / experience.name at render time
	heroTagline: string;

	// Welcome block (DashboardView)
	welcomeEyebrowTemplate: string; // supports {timeOfDay} {tier}
	welcomeHeadingTemplate: string; // supports {name}
	welcomeBody: string;

	// Continue Ritual
	continueRitualLabel: string;

	// Current Program / Featured Programs
	currentProgramLabel: string;
	featuredProgramsLabel: string;
	featuredProgramsHeading: string;
	featuredProgramsCTA: string;

	// Recent Activity
	recentActivityLabel: string;

	// Favorite soundscapes
	favoritesEyebrow: string;
	favoritesHeading: string;
	favoritesSubtitle: string;

	// Daily Streak card
	dailyStreakEyebrow: string;
	dailyStreakBody: string;
	dailyStreakMinutesLabel: string;

	// Featured content strips
	featuredMeditationsLabel: string;
	featuredHypnosisLabel: string;
	featuredQuickResetsLabel: string;

	// Knowledge Hub section page
	knowledgeEyebrow: string;
	knowledgeHeading: string;
	knowledgeDescription: string;
	knowledgeSearchPlaceholder: string;
	knowledgeEmptyState: string;

	// Meditations section page
	meditationsEmptyTitle: string;
	meditationsEmptyDescription: string;
	meditationsPreviewDescription: string;

	// Hypnosis section page
	hypnosisEyebrow: string;
	hypnosisHeading: string;
	hypnosisDescription: string;
	hypnosisEmptyTitle: string;
	hypnosisEmptyDescription: string;

	// Quick Resets section page
	quickResetsEyebrow: string;
	quickResetsHeading: string;
	quickResetsInstruction: string;
	quickResetsEmptyState: string;

	// Programs section page
	programsEyebrow: string;
	programsHeading: string;
	programsDescription: string;
	programsEmptyState: string;

	// Sidebar / premium
	premiumCardHeading: string;
	premiumCardBody: string;
	premiumCardCTA: string;
}

/**
 * Per-field visibility map. Missing keys default to true (visible).
 * Independent of `ExperienceSections` (which controls whole sections).
 *
 * Use case: a creator wants to keep the Recommended section but hide its
 * "Auto-personalized by Mindify AI" footer, or wants the Hero banner shown
 * but with no eyebrow text above the title.
 */
export type ExperienceFields = Record<keyof ExperienceCopy, boolean>;

export const DEFAULT_EXPERIENCE_COPY: ExperienceCopy = {
	heroEyebrow: "Mindify Studio",
	heroTitle: "",
	heroTagline:
		"Personalized nervous system rituals guided by Nicola Smith's methodology.",

	welcomeEyebrowTemplate: "{timeOfDay} ritual • {tier} tier",
	welcomeHeadingTemplate: "Welcome back, {name}",
	welcomeBody:
		"We're holding space for your nervous system reset. Continue your ritual or explore curated recommendations below.",

	continueRitualLabel: "Continue Ritual",

	currentProgramLabel: "Current Program",
	featuredProgramsLabel: "Featured Programs",
	featuredProgramsHeading: "Start a new protocol",
	featuredProgramsCTA: "Start",

	recentActivityLabel: "Recent Activity",

	favoritesEyebrow: "Quick access",
	favoritesHeading: "Favorite soundscapes",
	favoritesSubtitle: "Tap a tile to jump right in.",

	dailyStreakEyebrow: "Daily streak",
	dailyStreakBody:
		"Keep the chain going to unlock deeper labs and real-time biofeedback rituals.",
	dailyStreakMinutesLabel: "Total minutes",

	featuredMeditationsLabel: "Featured Meditations",
	featuredHypnosisLabel: "Featured Hypnosis",
	featuredQuickResetsLabel: "Featured Quick Resets",

	knowledgeEyebrow: "Knowledge Hub",
	knowledgeHeading: "Guides and resources",
	knowledgeDescription: "Browse articles, guides, and resources curated for you.",
	knowledgeSearchPlaceholder: "Search articles",
	knowledgeEmptyState: "No articles available yet.",

	meditationsEmptyTitle: "No meditations yet",
	meditationsEmptyDescription: "Check back soon for new meditation sessions.",
	meditationsPreviewDescription: "Choose a session to preview its audio and begin your practice.",

	hypnosisEyebrow: "Hypnosis",
	hypnosisHeading: "Guided journeys",
	hypnosisDescription: "Deep guided sessions designed to support lasting change.",
	hypnosisEmptyTitle: "No hypnosis sessions yet",
	hypnosisEmptyDescription: "Check back soon for new hypnosis sessions.",

	quickResetsEyebrow: "Quick Resets",
	quickResetsHeading: "Rapid Tools",
	quickResetsInstruction: "Tap a session to play instantly.",
	quickResetsEmptyState: "No quick resets available yet.",

	programsEyebrow: "Programs",
	programsHeading: "Choose your program",
	programsDescription: "Multi-day journeys blending meditations, tasks, and journaling.",
	programsEmptyState: "No programs available yet.",

	premiumCardHeading: "Premium",
	premiumCardBody: "Unlock all content and features.",
	premiumCardCTA: "Upgrade Now",
};

// =============================================================================
// Resolvers
// =============================================================================

/**
 * Merge persisted partial overrides over defaults. Empty strings in the partial
 * are treated as "unset" — cleared form inputs fall back to defaults.
 */
export function resolveExperienceCopy(
	partial?: Partial<ExperienceCopy> | null,
): ExperienceCopy {
	if (!partial) return { ...DEFAULT_EXPERIENCE_COPY };
	const result = { ...DEFAULT_EXPERIENCE_COPY };
	for (const key of Object.keys(DEFAULT_EXPERIENCE_COPY) as Array<
		keyof ExperienceCopy
	>) {
		const value = partial[key];
		if (typeof value === "string" && value.length > 0) {
			result[key] = value;
		}
	}
	return result;
}

/**
 * Merge persisted partial toggles over defaults. Missing keys default to `true`.
 */
export function resolveExperienceSections(
	partial?: Partial<ExperienceSections> | null,
): ExperienceSections {
	if (!partial) return { ...DEFAULT_EXPERIENCE_SECTIONS };
	const result = { ...DEFAULT_EXPERIENCE_SECTIONS };
	for (const key of SECTION_KEYS) {
		const value = partial[key];
		if (typeof value === "boolean") {
			result[key] = value;
		}
	}
	return result;
}

export function isSectionVisible(
	sections: ExperienceSections,
	key: SectionKey,
): boolean {
	return sections[key] !== false;
}

/**
 * Build the field visibility map. All keys default to `true`; persisted
 * `false` values override.
 */
export function resolveExperienceFields(
	partial?: Partial<ExperienceFields> | null,
): ExperienceFields {
	const result = {} as ExperienceFields;
	for (const key of Object.keys(DEFAULT_EXPERIENCE_COPY) as Array<
		keyof ExperienceCopy
	>) {
		const value = partial?.[key];
		result[key] = value === false ? false : true;
	}
	return result;
}

export function isFieldVisible(
	fields: ExperienceFields | undefined | null,
	key: keyof ExperienceCopy,
): boolean {
	if (!fields) return true;
	return fields[key] !== false;
}

// =============================================================================
// Template helpers
// =============================================================================

/**
 * Replace {foo} placeholders in a template with values from vars.
 * Unknown placeholders are replaced with an empty string.
 */
export function interpolate(
	template: string,
	vars: Record<string, string | number | undefined>,
): string {
	return template.replace(/\{(\w+)\}/g, (_, key: string) => {
		const value = vars[key];
		return value === undefined || value === null ? "" : String(value);
	});
}

/**
 * Split a template string on a single {varName} marker, returning the text
 * before and after the marker. Used when the variable portion needs its own
 * JSX wrapper (e.g. the name span in the welcome heading).
 *
 * If the marker isn't present, returns [template, ""].
 */
export function splitOnVariable(
	template: string,
	varName: string,
): [string, string] {
	const marker = `{${varName}}`;
	const idx = template.indexOf(marker);
	if (idx === -1) return [template, ""];
	return [template.slice(0, idx), template.slice(idx + marker.length)];
}

// =============================================================================
// Persistence helpers
// =============================================================================

/**
 * Strip keys whose value is an empty string. Used before writing copy to the DB
 * so re-clearing a field actually reverts to the default rather than storing "".
 */
export function pruneEmpty<T extends Record<string, unknown>>(obj: T): Partial<T> {
	const result: Partial<T> = {};
	for (const key of Object.keys(obj) as Array<keyof T>) {
		const value = obj[key];
		if (typeof value === "string" && value.length === 0) continue;
		if (value === undefined || value === null) continue;
		result[key] = value;
	}
	return result;
}
