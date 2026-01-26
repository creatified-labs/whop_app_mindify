import type {
	DurationFilter,
	FilterState,
	MeditationCategory,
	Mood,
	MoodFilter,
	ProgramCategory,
	QuickResetType,
} from "./types";

export const NAV_ITEMS = [
	{ label: "Dashboard", href: "/dashboard" },
	{ label: "Meditations", href: "/meditation" },
	{ label: "Hypnosis", href: "/hypnosis" },
	{ label: "Programs", href: "/programs" },
	{ label: "Quick Resets", href: "/quick-reset" },
	{ label: "Knowledge Hub", href: "/knowledge" },
	{ label: "Community", href: "/community" },
] as const;

export const MEDITATION_CATEGORY_DEFINITIONS: Record<
	MeditationCategory,
	{ title: string; description: string }
> = {
	focus: {
		title: "Focus",
		description: "Sharpens cognitive clarity before deep work blocks.",
	},
	morning: {
		title: "Morning",
		description: "Gentle activations and nervous-system priming routines.",
	},
	evening: {
		title: "Evening",
		description: "Wind-down journeys that flush the day from your system.",
	},
	sleep: {
		title: "Sleep",
		description: "Soundscapes engineered for Delta and Theta entrainment.",
	},
	stress: {
		title: "Stress",
		description: "Pattern interrupts to cool spikes and emotional charge.",
	},
	overwhelm: {
		title: "Overwhelm",
		description: "Grounding guidance when context switching gets loud.",
	},
	productivity: {
		title: "Productivity",
		description: "Structured rituals to unlock consistent throughput.",
	},
	emotional: {
		title: "Emotional",
		description: "Compassion meditations for processing heavier seasons.",
	},
};

export const PROGRAM_CATEGORY_DEFINITIONS: Record<
	ProgramCategory,
	{ title: string; description: string }
> = {
	focus: {
		title: "Focus Protocols",
		description: "Week-by-week intensives for sustained concentration.",
	},
	productivity: {
		title: "Productivity Studios",
		description: "Operational rituals blending rest, sprints, and recovery.",
	},
	sleep: {
		title: "Sleep Labs",
		description: "Reset circadian rhythms with hypnosis + journaling.",
	},
	mindset: {
		title: "Mindset Clinics",
		description: "Rewire narratives through daily neural rehearsal.",
	},
	clarity: {
		title: "Clarity Tracks",
		description: "Decision-making labs pairing breathwork with prompts.",
	},
};

export const QUICK_RESET_TYPES: Record<
	QuickResetType,
	{ label: string; description: string }
> = {
	breath: {
		label: "Breath Ritual",
		description: "3-minute cadence shifts for instant balance.",
	},
	anxiety: {
		label: "Anxiety Pattern",
		description: "Interrupt spirals with somatic cues and entrainment.",
	},
	focus: {
		label: "Focus Snap",
		description: "Re-center attention with audio anchors.",
	},
	calm: {
		label: "Calm Field",
		description: "Tone down adrenaline and re-open curiosity.",
	},
	"pattern-interrupt": {
		label: "Pattern Interrupt",
		description: "Shock the nervous system back into presence.",
	},
};

export const DEFAULT_FILTER_STATE: FilterState = {
	mood: "all",
	duration: "all",
};

export const DURATION_FILTERS: DurationFilter[] = ["all", "1-5", "6-10", "11-20", "20+"];

export const MOOD_FILTERS: MoodFilter[] = ["all", "stressed", "tired", "overwhelmed", "unfocused"];

export const MOOD_COLORS: Record<
	Mood,
	{ background: string; foreground: string; accent: string }
> = {
	stressed: {
		background: "from-[#351B53] to-[#7B3FE4]",
		foreground: "#F9E8FF",
		accent: "#EAC3FF",
	},
	tired: {
		background: "from-[#0F1F3D] to-[#264F78]",
		foreground: "#DFF2FF",
		accent: "#8BD4FF",
	},
	overwhelmed: {
		background: "from-[#300F16] to-[#81203E]",
		foreground: "#FFE7EE",
		accent: "#FF99B8",
	},
	unfocused: {
		background: "from-[#0B2A28] to-[#1B605A]",
		foreground: "#DAFFFB",
		accent: "#7CE1D9",
	},
};

export const CATEGORY_COLOR_SCHEMES: Record<
	MeditationCategory | ProgramCategory | QuickResetType,
	{ primary: string; secondary: string }
> = {
	focus: { primary: "#6E5ECF", secondary: "#B8A4FF" },
	morning: { primary: "#F2A65A", secondary: "#FFD89C" },
	evening: { primary: "#4151A3", secondary: "#B7C4FF" },
	sleep: { primary: "#23345A", secondary: "#96B7FF" },
	stress: { primary: "#DD5F76", secondary: "#FFB3C5" },
	overwhelm: { primary: "#5F4EE1", secondary: "#C5BCFF" },
	productivity: { primary: "#2FB9C7", secondary: "#93E8F2" },
	emotional: { primary: "#F3C7E4", secondary: "#FFDFF3" },
	mindset: { primary: "#7A5AF8", secondary: "#BCA9FF" },
	clarity: { primary: "#58D6B3", secondary: "#B8F4E4" },
	breath: { primary: "#309BBB", secondary: "#8BD9F0" },
	anxiety: { primary: "#F082AC", secondary: "#FFD2E5" },
	calm: { primary: "#4AB3A0", secondary: "#A6EADD" },
	"pattern-interrupt": { primary: "#FF9F68", secondary: "#FFD4B4" },
};
