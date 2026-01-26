import type { QuickReset } from "@/lib/types";

export const QUICK_RESETS: QuickReset[] = [
	{
		id: "grounding-breath-1",
		title: "1-Minute Grounding Breath",
		duration: 1,
		type: "breath",
		audioUrl: "/audio/quick-resets/grounding-breath.mp3",
		instructions: "Follow the 4-2-6 tactical breathing cadence with nasal inhale, brief hold, extended exhale.",
	},
	{
		id: "anxiety-switch-2",
		title: "2-Minute Anxiety Switch-Off",
		duration: 2,
		type: "anxiety",
		audioUrl: "/audio/quick-resets/anxiety-switch.mp3",
		instructions: "Layer bilateral tapping with whispered cues to downshift adrenaline spikes.",
	},
	{
		id: "focus-primer-3",
		title: "3-Minute Focus Primer",
		duration: 3,
		type: "focus",
		audioUrl: "/audio/quick-resets/focus-primer.mp3",
		instructions: "Use rhythmic breath holds to prime prefrontal activation before deep work.",
	},
	{
		id: "calm-downshift",
		title: "Instant Calm Downshift",
		duration: 2,
		type: "calm",
		audioUrl: "/audio/quick-resets/calm-downshift.mp3",
		instructions: "Pulse vagal toning hums with shoulder drops for immediate tension release.",
	},
	{
		id: "pattern-interrupt",
		title: "Pattern Interrupt Audio",
		duration: 2,
		type: "pattern-interrupt",
		audioUrl: "/audio/quick-resets/pattern-interrupt.mp3",
		instructions: "Layer sharp sonic cues with guided visualization to shock looping thoughts.",
	},
];
