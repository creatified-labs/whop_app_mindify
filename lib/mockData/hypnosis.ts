import type { HypnosisSession, HypnosisTheme } from "@/lib/types";

export const HYPNOSIS_LIBRARY: HypnosisSession[] = [
	{
		id: "procrastination-rewire",
		title: "End Procrastination: Neural Pathway Rewiring",
		description:
			"Guided induction that reframes delayed gratification and installs decisive action loops.",
		duration: 24,
		theme: "procrastination",
		audioUrl: "/audio/hypnosis-procrastination.mp3",
		hasBinaural: true,
		daytimeVersion: "/audio/hypnosis-procrastination-day.mp3",
		nighttimeVersion: "/audio/hypnosis-procrastination-night.mp3",
	},
	{
		id: "overthinking-reset",
		title: "Stop Overthinking: Subconscious Pattern Reset",
		description:
			"Somatic scanning plus subconscious reparenting to dissolve repetitive cognitive loops.",
		duration: 28,
		theme: "overthinking",
		audioUrl: "/audio/hypnosis-overthinking.mp3",
		hasBinaural: true,
		daytimeVersion: "/audio/hypnosis-overthinking-day.mp3",
		nighttimeVersion: "/audio/hypnosis-overthinking-night.mp3",
	},
	{
		id: "deep-confidence",
		title: "Deep Confidence: Inner Belief Installation",
		description: "Future pacing and embodied visualization to anchor unwavering confidence.",
		duration: 22,
		theme: "confidence",
		audioUrl: "/audio/hypnosis-confidence.mp3",
		hasBinaural: true,
		daytimeVersion: "/audio/hypnosis-confidence-day.mp3",
		nighttimeVersion: "/audio/hypnosis-confidence-night.mp3",
	},
	{
		id: "productivity-conditioning",
		title: "Productivity Conditioning: Peak Performance State",
		description: "Anchor flow triggers and neural priming to sustain peak output windows.",
		duration: 26,
		theme: "productivity",
		audioUrl: "/audio/hypnosis-productivity.mp3",
		hasBinaural: false,
		daytimeVersion: "/audio/hypnosis-productivity-day.mp3",
		nighttimeVersion: "/audio/hypnosis-productivity-night.mp3",
	},
	{
		id: "quit-smoking",
		title: "Quit Smoking: Addiction Pattern Disruption",
		description:
			"Rewire reward pathways and create aversion responses to nicotine cravings. Premium access required.",
		duration: 30,
		theme: "smoking",
		audioUrl: "/audio/hypnosis-smoking.mp3",
		hasBinaural: true,
		isPremium: true,
		daytimeVersion: "/audio/hypnosis-smoking-day.mp3",
		nighttimeVersion: "/audio/hypnosis-smoking-night.mp3",
	},
	{
		id: "calm-nervous-system",
		title: "Calm Nervous System: Vagal Tone Activation",
		description:
			"Polyvagal-informed induction to regulate heart rate variability and widen your window of tolerance.",
		duration: 18,
		theme: "nervous-system",
		audioUrl: "/audio/hypnosis-vagal.mp3",
		hasBinaural: true,
		daytimeVersion: "/audio/hypnosis-vagal-day.mp3",
		nighttimeVersion: "/audio/hypnosis-vagal-night.mp3",
	},
	{
		id: "high-performance-mindset",
		title: "High Performance Mindset: Winner's Psychology",
		description:
			"Stack embodied affirmations with mental rehearsal to cultivate an elite, calm intensity.",
		duration: 25,
		theme: "performance",
		audioUrl: "/audio/hypnosis-performance.mp3",
		hasBinaural: false,
		daytimeVersion: "/audio/hypnosis-performance-day.mp3",
		nighttimeVersion: "/audio/hypnosis-performance-night.mp3",
	},
];

export function filterHypnosisSessions(theme?: HypnosisTheme | "all") {
	if (!theme || theme === "all") {
		return HYPNOSIS_LIBRARY;
	}
	return HYPNOSIS_LIBRARY.filter((session) => session.theme === theme);
}
