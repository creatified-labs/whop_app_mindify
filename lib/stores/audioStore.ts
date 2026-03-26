"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AudioTrack } from "@/lib/types";
import { audioService } from "@/lib/audio/audioService";
import { useAppStore } from "@/lib/stores/appStore";

interface PlaybackHistoryItem {
	track: AudioTrack;
	listenedAt: string;
	durationSeconds: number;
}

export interface AudioStore {
	currentTrack: AudioTrack | null;
	isPlaying: boolean;
	progress: number;
	duration: number;
	volume: number;
	queue: AudioTrack[];
	history: PlaybackHistoryItem[];
	lastActiveAt: number | null;
	error?: string | null;
	restoreFromPersisted: () => void;

	playTrack: (track: AudioTrack, options?: { enqueue?: boolean }) => void;
	pauseTrack: () => void;
	resumeTrack: () => void;
	seekTo: (time: number) => void;
	setVolume: (vol: number) => void;
	addToQueue: (track: AudioTrack) => void;
	addManyToQueue: (tracks: AudioTrack[]) => void;
	clearQueue: () => void;
	playNext: () => void;
	playPrevious: () => void;
	removeFromHistory: (trackId: string) => void;
	logHistory: (track: AudioTrack, durationSeconds: number) => void;
}

const MAX_HISTORY = 10;

function updateUserProgressFromTrack(track: AudioTrack, durationSeconds: number) {
	const { userProgress, setUserProgress } = useAppStore.getState();
	if (!userProgress) return;
	const updated = { ...userProgress };

	if (track.trackType === "meditation" && !updated.completedMeditations.includes(track.id)) {
		updated.completedMeditations = [...updated.completedMeditations, track.id];
		updated.totalMinutesMeditated += Math.round(durationSeconds / 60);
	} else if (track.trackType === "hypnosis" && !updated.completedHypnosis.includes(track.id)) {
		updated.completedHypnosis = [...updated.completedHypnosis, track.id];
		updated.totalMinutesMeditated += Math.round(durationSeconds / 60);
	}

	setUserProgress(updated);
}

export const useAudioStore = create<AudioStore>()(
	persist(
		(set, get) => ({
			currentTrack: null,
			isPlaying: false,
			progress: 0,
			duration: 0,
			volume: 0.85,
			queue: [],
			history: [],
			lastActiveAt: null,
			error: null,
			restoreFromPersisted: () => {
				const state = get();
				if (!state.currentTrack) return;
				const FOUR_HOURS = 4 * 60 * 60 * 1000;
				if (state.lastActiveAt && Date.now() - state.lastActiveAt > FOUR_HOURS) {
					set({ currentTrack: null, isPlaying: false, progress: 0, duration: 0 });
					return;
				}
				audioService.registerCallbacks(
					{
						onProgress: (seconds) => set({ progress: seconds }),
						onDuration: (seconds) => set({ duration: seconds }),
						onEnded: () => {
							get().logHistory(state.currentTrack!, get().duration);
							get().playNext();
						},
						onError: (message) => set({ error: message }),
					},
					() => get().queue[0] ?? null,
				);
				audioService.play(state.currentTrack, { startAt: state.progress, volume: state.volume }).then(() => {
					if (!state.isPlaying) {
						audioService.pause();
					} else {
						set({ isPlaying: true });
					}
				});
			},
			playTrack: (track, options) => {
				const { currentTrack } = get();

				if (!options?.enqueue) {
					set({ queue: [] });
				}

				audioService.registerCallbacks(
					{
						onProgress: (seconds) => set({ progress: seconds }),
						onDuration: (seconds) => set({ duration: seconds }),
						onEnded: () => {
							get().logHistory(track, get().duration);
							get().playNext();
						},
						onError: (message) => set({ error: message }),
					},
					() => get().queue[0] ?? null,
				);

				audioService.play(track, { volume: get().volume }).then(() => {
					set({
						currentTrack: track,
						isPlaying: true,
						progress: 0,
						duration: 0,
						error: null,
						lastActiveAt: Date.now(),
					});
				});
			},
			pauseTrack: () => {
				audioService.pause();
				set({ isPlaying: false });
			},
			resumeTrack: () => {
				audioService.resume();
				set({ isPlaying: true, lastActiveAt: Date.now() });
			},
			seekTo: (time) => {
				audioService.seek(time);
				set({ progress: time });
			},
			setVolume: (vol) => {
				audioService.setVolume(vol);
				set({ volume: vol });
			},
			addToQueue: (track) =>
				set((state) => ({
					queue: [...state.queue, track],
				})),
			addManyToQueue: (tracks) =>
				set((state) => ({
					queue: [...state.queue, ...tracks],
				})),
			clearQueue: () => set({ queue: [] }),
			playNext: () => {
				const state = get();
				if (state.queue.length === 0) {
					set({ currentTrack: null, isPlaying: false, progress: 0, duration: 0 });
					return;
				}
				const [next, ...rest] = state.queue;
				set({ queue: rest });
				state.playTrack(next);
			},
			playPrevious: () => {
				const { history } = get();
				if (history.length === 0) return;
				const last = history[history.length - 1];
				get().playTrack(last.track);
				set({
					history: history.slice(0, -1),
				});
			},
			removeFromHistory: (trackId) =>
				set((state) => ({
					history: state.history.filter((item) => item.track.id !== trackId),
				})),
			logHistory: (track, durationSeconds) =>
				set((state) => {
					const updated = [
						...state.history,
						{
							track,
							listenedAt: new Date().toISOString(),
							durationSeconds,
						},
					].slice(-MAX_HISTORY);
					updateUserProgressFromTrack(track, durationSeconds);
					return { history: updated };
				}),
		}),
		{
			name: "mindify-audio-store",
			partialize: (state) => ({
				currentTrack: state.currentTrack,
				progress: state.progress,
				duration: state.duration,
				volume: state.volume,
				queue: state.queue,
				history: state.history,
				lastActiveAt: state.lastActiveAt,
			}),
		},
	),
);
