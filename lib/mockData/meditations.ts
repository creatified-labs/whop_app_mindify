import type { Meditation } from "@/lib/types";

export const MEDITATION_LIBRARY: Meditation[] = [
	{
		id: "focus-activation",
		title: "Focus Activation: Neural Pathway Priming",
		description:
			"Breath-synced prompts and soft synth pulses to ignite executive function in under 12 minutes.",
		duration: 12,
		category: "focus",
		audioUrl: "/audio/focus-activation.mp3",
		imageUrl: "/images/meditations/focus-activation.jpg",
		mood: ["unfocused"],
		isPremium: false,
		isNew: true,
	},
	{
		id: "morning-mind-priming",
		title: "Morning Mind Priming: Set Your Day's Intention",
		description:
			"Somatic check-ins plus visualization layered with gentle percussion to script your day.",
		duration: 8,
		category: "morning",
		audioUrl: "/audio/morning-priming.mp3",
		imageUrl: "/images/meditations/morning-priming.jpg",
		mood: ["tired"],
		isPremium: false,
	},
	{
		id: "evening-decompression",
		title: "Evening Decompression: Release the Day",
		description: "Guided unwinding ritual blending cello drones with diaphragmatic breath cues.",
		duration: 15,
		category: "evening",
		audioUrl: "/audio/evening-decompression.mp3",
		imageUrl: "/images/meditations/evening-decompression.jpg",
		mood: ["stressed", "overwhelmed"],
		isPremium: false,
	},
	{
		id: "deep-sleep-reset",
		title: "Deep Sleep Reset: Delta Wave Induction",
		description: "Slow-wave entrainment and ASMR textures to drop you into restorative sleep.",
		duration: 20,
		category: "sleep",
		audioUrl: "/audio/deep-sleep-reset.mp3",
		imageUrl: "/images/meditations/deep-sleep.jpg",
		mood: ["tired", "overwhelmed"],
		isPremium: true,
	},
	{
		id: "stress-release-field",
		title: "Stress Release Field",
		description:
			"Polyvagal humming plus percussion swells that defuse cortisol spikes in five minutes.",
		duration: 5,
		category: "stress",
		audioUrl: "/audio/stress-release.mp3",
		imageUrl: "/images/meditations/stress-release.jpg",
		mood: ["stressed"],
		isPremium: false,
	},
	{
		id: "overwhelm-pattern-reset",
		title: "Overwhelm Pattern Reset",
		description: "Guided tapping sequence paired with immersive soundscapes to reopen capacity.",
		duration: 11,
		category: "overwhelm",
		audioUrl: "/audio/overwhelm-reset.mp3",
		imageUrl: "/images/meditations/overwhelm-reset.jpg",
		mood: ["overwhelmed"],
		isPremium: true,
	},
	{
		id: "productivity-loop",
		title: "Productivity Flow Loop",
		description:
			"Lo-fi pulses with timed focus cues to power through deep work sprints and reset posture.",
		duration: 18,
		category: "productivity",
		audioUrl: "/audio/productivity-loop.mp3",
		imageUrl: "/images/meditations/productivity-loop.jpg",
		mood: ["unfocused"],
		isPremium: false,
	},
	{
		id: "emotional-processing",
		title: "Emotional Processing Ritual",
		description:
			"Compassion-based meditation with journaling prompts to metabolize high-signal emotions.",
		duration: 14,
		category: "emotional",
		audioUrl: "/audio/emotional-processing.mp3",
		imageUrl: "/images/meditations/emotional-processing.jpg",
		mood: ["stressed", "overwhelmed"],
		isPremium: true,
	},
	{
		id: "evening-breath-lullaby",
		title: "Evening Breath Lullaby",
		description: "Layered toning exercises and lullaby strings for calm transitions.",
		duration: 10,
		category: "evening",
		audioUrl: "/audio/evening-breath.mp3",
		imageUrl: "/images/meditations/evening-breath.jpg",
		mood: ["tired"],
		isPremium: false,
	},
];

export function filterMeditations({
	mood,
	duration,
	category,
}: {
	mood?: string;
	duration?: string;
	category?: string;
}) {
	return MEDITATION_LIBRARY.filter((meditation) => {
		const matchesMood =
			!mood || mood === "all" || meditation.mood.includes(mood as (typeof meditation.mood)[number]);

		const matchesCategory = !category || category === "all" || meditation.category === category;

		const matchesDuration = (() => {
			if (!duration || duration === "all") return true;
			const mins = meditation.duration;
			if (duration === "1-5") return mins >= 1 && mins <= 5;
			if (duration === "6-10") return mins >= 6 && mins <= 10;
			if (duration === "11-20") return mins >= 11 && mins <= 20;
			if (duration === "20+") return mins >= 21;
			return true;
		})();

		return matchesMood && matchesCategory && matchesDuration;
	});
}
