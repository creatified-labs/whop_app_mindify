import type {
	HypnosisJourney,
	MeditationSession,
	MindProgram,
	ProgressMetric,
} from "./types";

export const HERO_COPY = {
	title: "Mindify",
	tagline: "Neuroscience-based meditation for modern teams",
	description:
		"Mindify blends medical-grade brainwave training with sensory storytelling so your members regulate stress, sharpen focus, and recover faster.",
};

export const FEATURE_PILLARS = [
	"Biofeedback-informed journeys",
	"Executive nervous system resets",
	"Async team rituals & retros",
	"Clinical-grade audio engineering",
] as const;

export const MEDITATION_SESSIONS: MeditationSession[] = [
	{
		id: "alpha-entrain",
		title: "Alpha Wave Entrainment",
		duration: 14,
		focus: "Cognitive reset",
		neuroscientist: "Dr. Eva Roman",
		audioUrl: "/audio/alpha-entrain.mp3",
		tone: "dusk",
		description:
			"Guided breath pacing layered with binaural sweeps to downshift anxious loops.",
	},
	{
		id: "limbic-release",
		title: "Limbic Release",
		duration: 18,
		focus: "Emotional clarity",
		neuroscientist: "Dr. Kenji Patel",
		audioUrl: "/audio/limbic-release.mp3",
		tone: "lagoon",
		description:
			"Somatic scanning meets cello harmonics to ease stored tension in under 20 minutes.",
	},
	{
		id: "chronos-soften",
		title: "Chronos Soften",
		duration: 9,
		focus: "Micro recovery",
		neuroscientist: "Dr. Mara Lefevre",
		audioUrl: "/audio/chronos-soften.mp3",
		tone: "mist",
		description:
			"Time-bending visualization for fast context switching days and night rituals.",
	},
];

export const HYPNOSIS_JOURNEYS: HypnosisJourney[] = [
	{
		id: "soma-glow",
		title: "Soma Glow",
		goal: "Somatic release",
		duration: 22,
		scriptAuthor: "Ivy Cano",
		imageryCue: "Bioluminescent shoreline",
		tone: "rose",
	},
	{
		id: "aurora-briefing",
		title: "Aurora Briefing",
		goal: "Executive calm",
		duration: 16,
		scriptAuthor: "Jules Morin",
		imageryCue: "Polar dawn horizon",
		tone: "twilight",
	},
	{
		id: "oceanic-sync",
		title: "Oceanic Sync",
		goal: "Deep sleep priming",
		duration: 28,
		scriptAuthor: "Rae Fletcher",
		imageryCue: "Midnight tide pools",
		tone: "deep",
	},
];

export const MIND_PROGRAMS: MindProgram[] = [
	{
		id: "neuro-leadership",
		title: "NeuroLeadership Reset",
		description:
			"A 4-week cadence for founders and exec teams to practice emotional range, scenario planning, and metabolizing stress signatures.",
		cadence: "Weekly",
		startDate: "2025-01-12",
		modules: ["Polyvagal mapping", "Compassion drills", "Dynamic rehearsals"],
		tone: "dusk",
	},
	{
		id: "team-atrium",
		title: "Team Atrium Ritual",
		description:
			"Async rituals for distributed teams to close loops, celebrate micro-wins, and seed psychological safety.",
		cadence: "Daily",
		startDate: "2025-02-01",
		modules: ["Check-in breath", "Collective sound bath", "Story weaving"],
		tone: "lagoon",
	},
	{
		id: "rest-lab",
		title: "Rest Lab Residency",
		description:
			"A modular program pairing guided hypnosis with HRV journaling to unlock restorative sleep and creative surges.",
		cadence: "As Needed",
		startDate: "2025-03-09",
		modules: ["Sleep priming", "Dream recall", "Integration salon"],
		tone: "mist",
	},
];

export const PROGRESS_METRICS: ProgressMetric[] = [
	{ label: "Stress recovery window", change: "+18 mins", trend: "up" },
	{ label: "Focus streak", change: "x3 longer", trend: "up" },
	{ label: "Sleep depth", change: "+12%", trend: "up" },
	{ label: "Team rituals completed", change: "42 this month", trend: "steady" },
];
