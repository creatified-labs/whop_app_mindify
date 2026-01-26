export type ChromaticTone =
	| "dusk"
	| "twilight"
	| "deep"
	| "lagoon"
	| "mist"
	| "rose";

export interface MeditationSession {
	id: string;
	title: string;
	duration: number; // minutes
	focus: string;
	neuroscientist: string;
	audioUrl: string;
	tone: ChromaticTone;
	description: string;
}

export interface HypnosisJourney {
	id: string;
	title: string;
	goal: string;
	duration: number; // minutes
	scriptAuthor: string;
	imageryCue: string;
	tone: ChromaticTone;
}

export interface MindProgram {
	id: string;
	title: string;
	description: string;
	cadence: "Daily" | "Weekly" | "As Needed";
	startDate: string;
	modules: string[];
	tone: ChromaticTone;
}

export interface ProgressMetric {
	label: string;
	change: string;
	trend: "up" | "steady" | "down";
}
