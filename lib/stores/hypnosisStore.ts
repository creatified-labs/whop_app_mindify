"use client";

import { create } from "zustand";
import type { HypnosisSession, HypnosisTheme } from "@/lib/types";

type HypnosisPlayerState = {
	activeSession: HypnosisSession | null;
	isOpen: boolean;
	isPlaying: boolean;
	progressSeconds: number;
	durationSeconds: number;
	playbackRate: number;
	volume: number;
	binauralEnabled: boolean;
	versionPreference: Record<string, "day" | "night">;
	selectedVersion: "day" | "night";
	preflightChecklist: {
		quietSpace: boolean;
		headphones: boolean;
		intention: boolean;
		ready: boolean;
	};
	completedSessions: Set<string>;
};

interface HypnosisStore extends HypnosisPlayerState {
	openSession: (session: HypnosisSession) => void;
	closeSession: () => void;
	togglePlay: () => void;
	setProgress: (seconds: number) => void;
	setDuration: (seconds: number) => void;
	setPlaybackRate: (rate: number) => void;
	setVolume: (volume: number) => void;
	setVersion: (version: "day" | "night") => void;
	toggleBinaural: () => void;
	updateChecklist: (key: keyof HypnosisPlayerState["preflightChecklist"], value: boolean) => void;
	markCompleted: (id: string) => void;
	savePreference: (id: string, version: "day" | "night") => void;
}

const defaultChecklist = {
	quietSpace: false,
	headphones: false,
	intention: false,
	ready: false,
};

const defaultState: HypnosisPlayerState = {
	activeSession: null,
	isOpen: false,
	isPlaying: false,
	progressSeconds: 0,
	durationSeconds: 0,
	playbackRate: 1,
	volume: 0.8,
	binauralEnabled: true,
	versionPreference: {},
	selectedVersion: "day",
	preflightChecklist: defaultChecklist,
	completedSessions: new Set(),
};

export const useHypnosisStore = create<HypnosisStore>((set, get) => ({
	...defaultState,
	openSession: (session) =>
		set((state) => ({
			activeSession: session,
			isOpen: true,
			isPlaying: true,
			progressSeconds: 0,
			durationSeconds: session.duration * 60,
			selectedVersion: state.versionPreference[session.id] ?? "day",
			preflightChecklist: defaultChecklist,
		})),
	closeSession: () =>
		set({
			activeSession: null,
			isOpen: false,
			isPlaying: false,
			progressSeconds: 0,
			durationSeconds: 0,
			preflightChecklist: defaultChecklist,
		}),
	togglePlay: () =>
		set((state) => ({
			isPlaying: !state.isPlaying,
		})),
	setProgress: (seconds) =>
		set({
			progressSeconds: seconds,
		}),
	setDuration: (seconds) =>
		set({
			durationSeconds: seconds,
		}),
	setPlaybackRate: (rate) =>
		set({
			playbackRate: rate,
		}),
	setVolume: (volume) =>
		set({
			volume,
		}),
	setVersion: (version) =>
		set((state) => ({
			selectedVersion: version,
			versionPreference: state.activeSession
				? { ...state.versionPreference, [state.activeSession.id]: version }
				: state.versionPreference,
		})),
	savePreference: (id, version) =>
		set((state) => ({
			versionPreference: { ...state.versionPreference, [id]: version },
		})),
	toggleBinaural: () =>
		set((state) => ({
			binauralEnabled: !state.binauralEnabled,
		})),
	updateChecklist: (key, value) =>
		set((state) => ({
			preflightChecklist: { ...state.preflightChecklist, [key]: value },
		})),
	markCompleted: (id) =>
		set((state) => {
			const completedSessions = new Set(state.completedSessions);
			completedSessions.add(id);
			return { completedSessions };
		}),
}));
