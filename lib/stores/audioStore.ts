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
	/** True once the current track has been recorded to the DB this session (prevents double-logging). */
	currentTrackLogged: boolean;
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

/** Minimum listen time before a partial play is recorded. */
const PARTIAL_LOG_THRESHOLD_SECONDS = 30;

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

/**
 * POST the activity to /api/user/activity so it shows up in Recent Activity and
 * the user's stats. Silently no-ops if companyId isn't set yet (e.g. on marketing
 * page) or if the track type isn't a tracked activity.
 */
async function persistActivityToDb(track: AudioTrack, durationSeconds: number) {
	const companyId = useAppStore.getState().companyId;
	if (!companyId) return;

	const typeMap: Record<AudioTrack["trackType"], "meditation" | "hypnosis" | "reset" | "program_day" | null> = {
		meditation: "meditation",
		hypnosis: "hypnosis",
		reset: "reset",
		program: "program_day",
	};
	const activityType = typeMap[track.trackType];
	if (!activityType) return;

	try {
		await fetch(`/api/user/activity?company_id=${encodeURIComponent(companyId)}`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				activity_type: activityType,
				content_id: track.id,
				duration_minutes: Math.max(1, Math.round(durationSeconds / 60)),
			}),
		});
	} catch (err) {
		console.error("[audioStore] Failed to record activity:", err);
	}
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
			currentTrackLogged: false,
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
				const prev = get();

				// If switching away from a track that hasn't been logged yet but was
				// listened to long enough, persist it before it's replaced.
				if (
					prev.currentTrack &&
					prev.currentTrack.id !== track.id &&
					!prev.currentTrackLogged &&
					prev.progress >= PARTIAL_LOG_THRESHOLD_SECONDS
				) {
					persistActivityToDb(prev.currentTrack, prev.progress);
				}

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
						// Seed duration from the track metadata so the timeline
						// is accurate immediately; the audio element will
						// overwrite this once it reports a finite duration.
						duration: track.duration ?? 0,
						error: null,
						lastActiveAt: Date.now(),
						currentTrackLogged: false,
					});
				});
			},
			pauseTrack: () => {
				audioService.pause();
				const state = get();
				// Record partial plays on pause so users see activity without
				// having to listen to completion.
				if (
					state.currentTrack &&
					!state.currentTrackLogged &&
					state.progress >= PARTIAL_LOG_THRESHOLD_SECONDS
				) {
					persistActivityToDb(state.currentTrack, state.progress);
					set({ currentTrackLogged: true });
				}
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
					// Persist to DB on completion (guarded by currentTrackLogged to
					// avoid double-logging if the user already crossed the partial
					// threshold and was recorded mid-play).
					if (!state.currentTrackLogged) {
						persistActivityToDb(track, durationSeconds);
					}
					return { history: updated, currentTrackLogged: true };
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
