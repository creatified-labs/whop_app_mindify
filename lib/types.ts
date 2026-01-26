export type MeditationCategory =
	| "focus"
	| "morning"
	| "evening"
	| "sleep"
	| "stress"
	| "overwhelm"
	| "productivity"
	| "emotional";

export type Mood =
	| "stressed"
	| "tired"
	| "overwhelmed"
	| "unfocused";

export interface Meditation {
	id: string;
	title: string;
	description: string;
	duration: number; // in minutes
	category: MeditationCategory;
	audioUrl: string;
	imageUrl: string;
	mood: Mood[];
	isNew?: boolean;
	isPremium?: boolean;
	tags?: string[];
}

export type HypnosisTheme =
	| "procrastination"
	| "overthinking"
	| "confidence"
	| "productivity"
	| "smoking"
	| "nervous-system"
	| "performance";

export interface HypnosisSession {
	id: string;
	title: string;
	description: string;
	duration: number;
	theme: HypnosisTheme;
	audioUrl: string;
	hasBinaural: boolean;
	daytimeVersion?: string; // URL for daytime audio
	nighttimeVersion?: string; // URL for nighttime audio
	isPremium?: boolean;
}

export type ProgramCategory =
	| "focus"
	| "productivity"
	| "sleep"
	| "mindset"
	| "clarity";

export type ProgramDifficulty = "beginner" | "intermediate" | "advanced";

export interface ProgramDay {
	dayNumber: number;
	title: string;
	audioSession?: string; // meditation or hypnosis ID
	videoUrl?: string;
	tasks: string[];
	journalPrompts: string[];
	quote?: string;
	microWins?: string[];
	completed?: boolean;
}

export interface Program {
	id: string;
	title: string;
	tagline: string;
	description: string;
	duration: number; // total days
	category: ProgramCategory;
	difficulty: ProgramDifficulty;
	coverImage: string;
	includeSummary: {
		meditations: number;
		tasks: number;
		journalPrompts: number;
	};
	requirements: string[];
	benefits: string[];
	timeCommitment: string;
	recommendedFor: string[];
	days: ProgramDay[];
	isPremium?: boolean;
}

export interface ProgramProgress {
	programId: string;
	currentDay: number;
	completedDays: number[];
	completedAt?: string;
	enrolledAt: string;
	streak: number;
	lastUpdated: string;
}

export interface ProgramJournalEntry {
	programId: string;
	dayNumber: number;
	entry: string;
	createdAt: string;
	updatedAt: string;
}

export type QuickResetType =
	| "breath"
	| "anxiety"
	| "focus"
	| "calm"
	| "pattern-interrupt";

export interface QuickReset {
	id: string;
	title: string;
	duration: number; // in minutes
	type: QuickResetType;
	audioUrl: string;
	instructions: string;
}

export type AudioTrackContext = "meditation" | "hypnosis" | "reset" | "program";

export interface AudioTrack {
	id: string;
	title: string;
	audioUrl: string;
	duration?: number;
	trackType: AudioTrackContext;
	thumbnail?: string;
	subtitle?: string;
	metadata?: Record<string, unknown>;
}

export interface UserProgress {
	userId: string;
	completedMeditations: string[];
	completedHypnosis: string[];
	currentPrograms: {
		programId: string;
		currentDay: number;
		startDate: string;
		completedDays: number[];
	}[];
	totalMinutesMeditated: number;
	streakDays: number;
	lastActivityDate: string;
}

export type MoodFilter = "all" | Mood;
export type DurationFilter = "all" | "1-5" | "6-10" | "11-20" | "20+";

export interface FilterState {
	mood: MoodFilter;
	duration: DurationFilter;
	category?: MeditationCategory | ProgramCategory | "all";
}
