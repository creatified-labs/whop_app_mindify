"use client";

import { create } from "zustand";
import type { Meditation } from "@/lib/types";

type PlayerState = {
	activeMeditation: Meditation | null;
	isOpen: boolean;
	isPlaying: boolean;
	progressSeconds: number;
	durationSeconds: number;
	playbackRate: number;
	volume: number;
	favorites: Set<string>;
	completed: Set<string>;
	listeningStart: number | null;
};

interface MeditationStore extends PlayerState {
	openMeditation: (meditation: Meditation) => void;
	hidePlayer: () => void;
	showPlayer: () => void;
	stopSession: () => void;
	togglePlay: () => void;
	setProgress: (seconds: number) => void;
	setDuration: (seconds: number) => void;
	setPlaybackRate: (rate: number) => void;
	setVolume: (volume: number) => void;
	toggleFavorite: (id: string) => void;
	markCompleted: (id: string) => void;
	resetPlayer: () => void;
}

const defaultState: PlayerState = {
	activeMeditation: null,
	isOpen: false,
	isPlaying: false,
	progressSeconds: 0,
	durationSeconds: 0,
	playbackRate: 1,
	volume: 0.8,
	favorites: new Set(),
	completed: new Set(),
	listeningStart: null,
};

export const useMeditationStore = create<MeditationStore>((set, get) => ({
	...defaultState,
	openMeditation: (meditation) =>
		set({
			activeMeditation: meditation,
			isOpen: true,
			isPlaying: true,
			progressSeconds: 0,
			durationSeconds: meditation.duration * 60,
			listeningStart: Date.now(),
		}),
		hidePlayer: () =>
		set({
			isOpen: false,
		}),
	showPlayer: () =>
		set({
			isOpen: true,
		}),
	stopSession: () => {
		const { activeMeditation, listeningStart } = get();
		if (activeMeditation && listeningStart) {
			const elapsedMinutes = (Date.now() - listeningStart) / 60000;
			console.log("[Mindify] Listening time tracked", {
				meditationId: activeMeditation.id,
				elapsedMinutes,
			});
		}
		set({
			isOpen: false,
			isPlaying: false,
			activeMeditation: null,
			progressSeconds: 0,
			durationSeconds: 0,
			playbackRate: 1,
			volume: 0.8,
			listeningStart: null,
		});
	},
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
	toggleFavorite: (id) =>
		set((state) => {
			const favorites = new Set(state.favorites);
			if (favorites.has(id)) {
				favorites.delete(id);
			} else {
				favorites.add(id);
			}
			return { favorites };
		}),
	markCompleted: (id) =>
		set((state) => {
			const completed = new Set(state.completed);
			completed.add(id);
			return { completed };
		}),
	resetPlayer: () => set(defaultState),
}));
