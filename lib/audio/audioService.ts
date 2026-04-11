"use client";

import type { AudioTrack } from "@/lib/types";

type AudioServiceCallbacks = {
	onProgress: (seconds: number) => void;
	onDuration: (seconds: number) => void;
	onEnded: () => void;
	onError: (message: string) => void;
};

class AudioService {
	private audio: HTMLAudioElement | null = null;
	private callbacks: AudioServiceCallbacks | null = null;
	private getNextTrack: (() => AudioTrack | null) | null = null;
	private fadeDuration = 250;
	private shouldResumeAfterVisibility = false;
	private listeningStart: number | null = null;
	/** Monotonic counter — each play() call captures its value and bails if superseded. */
	private playToken = 0;

	constructor() {
		if (typeof window !== "undefined") {
			this.audio = new Audio();
			this.audio.preload = "auto";
			this.audio.crossOrigin = "anonymous";
			this.audio.addEventListener("timeupdate", this.handleTimeUpdate);
			this.audio.addEventListener("loadedmetadata", this.handleLoadedMetadata);
			this.audio.addEventListener("durationchange", this.handleLoadedMetadata);
			this.audio.addEventListener("ended", this.handleEnded);
			this.audio.addEventListener("error", this.handleError);
			document.addEventListener("visibilitychange", this.handleVisibilityChange);
		}
	}

	public registerCallbacks(callbacks: AudioServiceCallbacks, getNextTrack: () => AudioTrack | null) {
		this.callbacks = callbacks;
		this.getNextTrack = getNextTrack;
	}

	public async play(track: AudioTrack, options?: { startAt?: number; volume?: number }) {
		if (!this.audio) return;
		const token = ++this.playToken;
		try {
			await this.crossfadeOut();
			if (token !== this.playToken || !this.audio) return; // superseded
			// Pause and clear the current track before swapping src so the
			// previous play() promise resolves cleanly and we don't race a
			// new load against an in-flight play request (AbortError).
			if (!this.audio.paused) this.audio.pause();
			this.audio.src = track.audioUrl;
			this.audio.currentTime = options?.startAt ?? 0;
			await this.audio.play();
			if (token !== this.playToken) return; // superseded during load
			await this.crossfadeIn(options?.volume);
			this.listeningStart = Date.now();
		} catch (error) {
			// AbortError fires when a newer play() superseded this one — not a real failure.
			if (error instanceof DOMException && error.name === "AbortError") return;
			if (token !== this.playToken) return;
			console.error("[Mindify] Audio play error", error);
			this.callbacks?.onError("Unable to start playback");
		}
	}

	public pause(manual = true) {
		if (!this.audio) return;
		if (!this.audio.paused) {
			this.audio.pause();
			if (!manual) {
				this.shouldResumeAfterVisibility = true;
			}
		}
	}

	public async resume() {
		if (!this.audio) return;
		try {
			await this.audio.play();
			this.shouldResumeAfterVisibility = false;
		} catch (error) {
			console.error("[Mindify] Resume error", error);
		}
	}

	public seek(seconds: number) {
		if (!this.audio) return;
		this.audio.currentTime = seconds;
		this.callbacks?.onProgress(this.audio.currentTime);
	}

	public setVolume(volume: number) {
		if (!this.audio) return;
		this.audio.volume = volume;
	}

	public preloadNext() {
		if (!this.getNextTrack) return;
		const nextTrack = this.getNextTrack();
		if (!nextTrack) return;
		const ghost = new Audio();
		ghost.src = nextTrack.audioUrl;
		ghost.preload = "auto";
		ghost.load();
	}

	private crossfadeOut() {
		if (!this.audio) return Promise.resolve();
		return new Promise<void>((resolve) => {
			const startVolume = this.audio?.volume ?? 1;
			if (startVolume === 0) {
				resolve();
				return;
			}
			const steps = 10;
			const stepDuration = this.fadeDuration / steps;
			let currentStep = 0;
			const interval = window.setInterval(() => {
				currentStep += 1;
				const newVolume = Math.max(0, startVolume - (currentStep / steps) * startVolume);
				this.audio!.volume = newVolume;
				if (currentStep >= steps) {
					window.clearInterval(interval);
					resolve();
				}
			}, stepDuration);
		});
	}

	private crossfadeIn(targetVolume = 1) {
		if (!this.audio) return Promise.resolve();
		return new Promise<void>((resolve) => {
			this.audio!.volume = 0;
			const steps = 10;
			const stepDuration = this.fadeDuration / steps;
			let currentStep = 0;
			const interval = window.setInterval(() => {
				currentStep += 1;
				const newVolume = Math.min(targetVolume, (currentStep / steps) * targetVolume);
				this.audio!.volume = newVolume;
				if (currentStep >= steps) {
					window.clearInterval(interval);
					resolve();
				}
			}, stepDuration);
		});
	}

	private handleTimeUpdate = () => {
		if (!this.audio) return;
		this.callbacks?.onProgress(this.audio.currentTime);
	};

	private handleLoadedMetadata = () => {
		if (!this.audio) return;
		const d = this.audio.duration;
		// Browsers return Infinity/NaN for some streaming MP3s and VBR files
		// until the stream has been fully buffered. Ignore those readings so
		// the UI keeps the duration we seeded from the track metadata.
		if (!Number.isFinite(d) || d <= 0) return;
		this.callbacks?.onDuration(d);
	};

	private handleEnded = () => {
		this.callbacks?.onEnded();
		this.preloadNext();
		this.listeningStart = null;
	};

	private handleError = () => {
		this.callbacks?.onError("Audio playback failed");
	};

	private handleVisibilityChange = () => {
		if (!this.audio) return;
		if (document.hidden) {
			if (!this.audio.paused) {
				this.pause(false);
			}
		} else if (this.shouldResumeAfterVisibility) {
			this.resume();
		}
	};
}

export const audioService = new AudioService();
