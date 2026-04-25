import type { Program } from "@/lib/types";

type DayInput = {
	title: string;
	audioSession?: string;
	tasks: string[];
	journal: string;
	quote?: string;
};

const createDays = (items: DayInput[]) =>
	items.map((item, index) => ({
		dayNumber: index + 1,
		title: item.title,
		audioSession: item.audioSession,
		tasks: item.tasks,
		journalPrompts: [item.journal],
		quote: item.quote,
	}));

const focusResetDays: DayInput[] = [
	{
		title: "Understanding Your Attention",
		audioSession: "focus-activation",
		tasks: [
			"Complete the Focus Baseline questionnaire",
			"Identify the top 2 distractions pulling you off task",
			"Schedule a 15-minute observation block",
		],
		journal: "When do you feel most focused? What environmental cues help?",
		quote: "Attention flows where intention goes.",
	},
	{
		title: "Eliminating Digital Noise",
		audioSession: "morning-mind-priming",
		tasks: [
			"Audit all notifications and disable 50% of them",
			"Create a 'deep work' home screen",
			"Install website limiter for key distractions",
		],
		journal: "What noise sources are easiest to remove today?",
	},
	{
		title: "Deep Work Foundations",
		audioSession: "productivity-loop",
		tasks: [
			"Define your highest-leverage task for tomorrow",
			"Block 90 minutes on your calendar",
			"Prepare your workspace with analog backup",
		],
		journal: "Describe your ideal deep work ritual in detail.",
	},
	{
		title: "Flow State Entry",
		audioSession: "overwhelm-pattern-reset",
		tasks: [
			"Practice the 4-7-8 breath cycle for 3 rounds",
			"Use a 5-minute movement primer before work",
			"Select your soundtrack or ambient noise",
		],
		journal: "What triggers help you drop into flow quickest?",
	},
	{
		title: "Sustained Concentration",
		audioSession: "stress-release-field",
		tasks: [
			"Implement the 52/17 work cadence",
			"Track when your energy dips throughout the day",
			"Identify one teammate to run accountability",
		],
		journal: "Where did your concentration break today? Why?",
	},
	{
		title: "Attention Recovery",
		audioSession: "evening-decompression",
		tasks: [
			"Schedule three micro-breaks with nervous system resets",
			"Complete a full-body scan before bed",
			"Prepare tomorrow's first task with clarity",
		],
		journal: "How does your body signal the need for recovery?",
	},
	{
		title: "Focus Integration",
		audioSession: "focus-activation",
		tasks: [
			"Write a commitment contract for post-program weeks",
			"Share your wins with an accountability partner",
			"Set reminders for weekly focus audits",
		],
		journal: "What focus identity are you stepping into now?",
	},
];

const productivityWeekThemes = [
	"Reclaiming Your Operating System",
	"Deep Work Implementation",
	"Integration & Momentum",
];

const productivityDays: DayInput[] = Array.from({ length: 21 }, (_, day) => {
	const week = Math.floor(day / 7);
	const dayWithinWeek = (day % 7) + 1;
	const theme = productivityWeekThemes[week];
	return {
		title: `${theme} – Day ${dayWithinWeek}`,
		audioSession: day % 2 === 0 ? "productivity-loop" : "focus-activation",
		tasks: [
			"Complete today's guided visualization",
			dayWithinWeek <= 2
				? "Document one limiting belief about productivity"
				: dayWithinWeek <= 4
					? "Ship one deliverable using the new workflow"
					: "Debrief lessons learned with a teammate",
			dayWithinWeek === 7
				? "Conduct weekly integration reflection"
				: "Update your streak tracker",
		],
		journal:
			week === 0
				? "What identity shifts are necessary for your next level?"
				: week === 1
					? "Where did execution feel smooth or sticky today?"
					: "How are you reinforcing new habits post-session?",
		quote:
			week === 0
				? "Repetition becomes ritual; ritual becomes identity."
				: week === 1
					? "Implementation beats inspiration."
					: "Integration locks the gains.",
	};
});

const sleepDays: DayInput[] = [
	"Evening Nervous System Reset",
	"Digital Sunset Ritual",
	"Temperature & Light Mastery",
	"Dream Priming Practices",
	"Nighttime Breath Sequences",
	"Deep Sleep Recovery Stack",
	"Weekend Sleep Consistency",
	"Emotional Debrief Before Bed",
	"Body Clock Calibration",
	"Restorative Reflection",
].map((title, index) => ({
	title,
	audioSession: index % 2 === 0 ? "evening-decompression" : "deep-sleep-reset",
	tasks: [
		"Complete the evening hypnosis or meditation",
		index === 1 ? "Log screen-free hours before bed" : "Track sleep latency",
		index >= 5 ? "Monitor HRV or resting heart rate trends" : "Prepare bedroom environment",
	],
	journal:
		index % 2 === 0
			? "How did your pre-sleep ritual feel tonight?"
			: "What emotional residue surfaced before rest?",
}));

const neuroDays: DayInput[] = Array.from({ length: 14 }, (_, day) => ({
	title:
		day < 4
			? ["Mapping Belief Systems", "Interrupting Auto-Thoughts", "Somatic Confidence", "Future Self Imaging"][day]
			: day < 9
				? [
						"Installing Empowering Scripts",
						"Expanding Window of Tolerance",
						"Stacking Micro-Wins",
						"Anchoring Elevated States",
						"Identity Rehearsal",
					][day - 4]
				: [
						"Rewriting Self Narrative",
						"Decision Velocity",
						"Emotional Range Expansion",
						"Integration Ceremony",
						"Legacy Statement",
					][day - 9],
	audioSession: day % 3 === 0 ? "deep-confidence" : "focus-activation",
	tasks: [
		day < 4 ? "List 3 recurring limiting phrases" : "Record today's reframe in audio form",
		"Complete today's hypnosis guidance",
		"Share one insight with an accountability channel",
	],
	journal:
		day < 4
			? "Which belief surprised you most today?"
			: day < 9
				? "How did your nervous system respond to today's upgrade?"
				: "What new evidence proves your upgraded identity?",
}));

const clarityDays: DayInput[] = [
	"Assess the Overwhelm",
	"Somatic Safety Reset",
	"Decision Making Flywheel",
	"Priority Mapping",
	"Energy-Matched Scheduling",
	"Nervous System Boundaries",
	"Creative White Space",
	"Delegation & Automation",
	"Clarity Rituals",
	"Integration & Celebrations",
].map((title, index) => ({
	title,
	audioSession: index % 2 === 0 ? "stress-release-field" : "overwhelm-pattern-reset",
	tasks: [
		index === 0 ? "Complete the Overwhelm diagnostic" : "Review your clarity compass",
		"Run a 5-minute nervous system practice",
		"Identify one decision to make with ease today",
	],
	journal:
		index === 0
			? "What does overwhelm feel like in your body?"
			: "How did you create clarity today?",
}));

export const PROGRAMS_LIBRARY: Program[] = [
	{
		id: "focus-reset-7",
		title: "7-Day Focus Reset",
		tagline: "Reclaim your attention and build rituals for deep work that stick.",
		description:
			"A concise nervous system tune-up that rewires your attention loops with somatic practices, tactical workflows, and accountability rituals.",
		duration: 7,
		category: "focus",
		difficulty: "beginner",
		coverImage: "/images/programs/focus-reset.jpg",
		includeSummary: { meditations: 7, tasks: 21, journalPrompts: 7 },
		requirements: ["Headphones for audio sessions", "15 minutes of quiet time daily", "Focus baseline worksheet"],
		benefits: [
			"Crystal-clear morning priorities",
			"Calm, interruption-proof work blocks",
			"Body awareness for early distraction cues",
		],
		timeCommitment: "25–35 minutes per day",
		tags: ["Founders", "Operators", "Creators with scattered focus"],
		days: createDays(focusResetDays),
	},
	{
		id: "productivity-mind-rewire-21",
		title: "21-Day Productivity & Mind Rewiring",
		tagline: "Release procrastination, install elite execution patterns, and keep them.",
		description:
			"A three-week immersive challenge moving you from mindset priming into ruthless implementation and long-tail integration. Includes hypnosis, meditations, and micro-behavior sprints.",
		duration: 21,
		category: "productivity",
		difficulty: "intermediate",
		coverImage: "/images/programs/productivity-rewire.jpg",
		includeSummary: { meditations: 18, tasks: 63, journalPrompts: 21 },
		requirements: ["Daily check-ins (10 min)", "Weekly reflection upload", "Ability to carve 60-minute sprints"],
		benefits: [
			"Consistent execution even on low-motivation days",
			"Upgraded relationship with pressure and deadlines",
			"A repeatable operating cadence for big milestones",
		],
		timeCommitment: "40–55 minutes per day",
		tags: ["Founders scaling teams", "Agency owners", "Creators launching products"],
		days: createDays(productivityDays),
		isPremium: true,
	},
	{
		id: "better-sleep-protocol-10",
		title: "10-Day Better Sleep Protocol",
		tagline: "Engineer restorative nights with science-backed rituals and dream priming.",
		description:
			"Pair sleep hygiene labs, gentle hypnosis, and journaling to build a predictable evening arc that actually sticks.",
		duration: 10,
		category: "sleep",
		difficulty: "beginner",
		coverImage: "/images/programs/sleep-protocol.jpg",
		includeSummary: { meditations: 10, tasks: 30, journalPrompts: 10 },
		requirements: ["Blue light reduction tools", "Journal near bedside", "Optional sleep tracker"],
		benefits: [
			"Easier transitions from work mode to rest",
			"Reduced night wakings and anxiety loops",
			"Morning clarity with dream recall rituals",
		],
		timeCommitment: "30 minutes in the evening",
		tags: ["Founders with late-night rumination", "Shifted sleep schedules", "Parents needing evening calm"],
		days: createDays(sleepDays),
	},
	{
		id: "neuroplasticity-upgrade-14",
		title: "14-Day Neuroplasticity Mindset Upgrade",
		tagline: "Install durable identity upgrades through hypnosis and evidence stacking.",
		description:
			"A guided neuroplasticity lab blending hypnosis, somatic anchoring, and micro-behavior experiments to lock in new beliefs.",
		duration: 14,
		category: "mindset",
		difficulty: "intermediate",
		coverImage: "/images/programs/neuroplasticity-upgrade.jpg",
		includeSummary: { meditations: 12, tasks: 42, journalPrompts: 14 },
		requirements: ["Headphones", "Mirror or camera for rehearsal", "Partner or community for reflections"],
		benefits: [
			"Rapid belief auditing and replacement",
			"Expanded nervous system range for bigger moves",
			"Embodied confidence anchored to daily cues",
		],
		timeCommitment: "35–45 minutes per day",
		tags: ["Leaders stepping into new roles", "Creators scaling personal brand", "Anyone rewiring self-talk"],
		days: createDays(neuroDays),
		isPremium: true,
	},
	{
		id: "overwhelm-to-clarity",
		title: "Overwhelm-to-Clarity System",
		tagline: "Diffuse stress signatures and build a decision-making sanctuary.",
		description:
			"A hybrid of nervous system resets, cognitive unloading, and operational clarity practices to move from chaos to calm execution.",
		duration: 10,
		category: "clarity",
		difficulty: "beginner",
		coverImage: "/images/programs/clarity-system.jpg",
		includeSummary: { meditations: 10, tasks: 30, journalPrompts: 10 },
		requirements: ["Quiet reflection block", "Printable clarity map", "Optionally a coach/accountability partner"],
		benefits: [
			"Reconnection to your calm baseline even on heavy days",
			"Repeatable process for priority sorting",
			"Language to set boundaries without guilt",
		],
		timeCommitment: "30 minutes per day",
		tags: ["High-output leaders", "Folks rebuilding routines", "Anyone post-burnout"],
		days: createDays(clarityDays),
	},
];

export function getProgramById(programId: string) {
	return PROGRAMS_LIBRARY.find((program) => program.id === programId);
}
