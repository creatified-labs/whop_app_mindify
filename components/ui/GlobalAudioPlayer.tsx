"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import {
	PlayIcon,
	PauseIcon,
	SkipBackIcon,
	SkipForwardIcon,
	Volume2Icon,
	ListMusicIcon,
	Minimize2Icon,
	Maximize2Icon,
	XIcon,
} from "lucide-react";
import { useAudioStore } from "@/lib/stores/audioStore";
import type { AudioTrack } from "@/lib/types";

const formatTime = (seconds: number) => {
	if (!Number.isFinite(seconds)) return "0:00";
	const mins = Math.floor(seconds / 60);
	const secs = Math.floor(seconds % 60)
		.toString()
		.padStart(2, "0");
	return `${mins}:${secs}`;
};

export function GlobalAudioPlayer() {
	const [isExpanded, setIsExpanded] = useState(false);
	const [isVisible, setIsVisible] = useState(false);
	const {
		currentTrack,
		isPlaying,
		progress,
		duration,
		volume,
		queue,
		playTrack,
		pauseTrack,
		resumeTrack,
		playNext,
		playPrevious,
		seekTo,
		setVolume,
		restoreFromPersisted,
	} = useAudioStore((state) => ({
		currentTrack: state.currentTrack,
		isPlaying: state.isPlaying,
		progress: state.progress,
		duration: state.duration,
		volume: state.volume,
		queue: state.queue,
		playTrack: state.playTrack,
		pauseTrack: state.pauseTrack,
		resumeTrack: state.resumeTrack,
		playNext: state.playNext,
		playPrevious: state.playPrevious,
		seekTo: state.seekTo,
		setVolume: state.setVolume,
		restoreFromPersisted: state.restoreFromPersisted,
	}));

	useEffect(() => {
		restoreFromPersisted();
	}, [restoreFromPersisted]);

	useEffect(() => {
		if (currentTrack) {
			setIsVisible(true);
		}
	}, [currentTrack]);

	const togglePlay = () => {
		if (!currentTrack) return;
		if (isPlaying) {
			pauseTrack();
		} else {
			resumeTrack();
		}
	};

	const handleSeek = (event: React.ChangeEvent<HTMLInputElement>) => {
		seekTo(Number(event.target.value));
	};

	const handleVolume = (event: React.ChangeEvent<HTMLInputElement>) => {
		setVolume(Number(event.target.value));
	};

	const handleClose = () => {
		pauseTrack();
		setIsVisible(false);
	};

	if (!isVisible || !currentTrack) return null;

	return (
		<AnimatePresence>
			<motion.div
				initial={{ y: 120, opacity: 0 }}
				animate={{ y: 0, opacity: 1 }}
				exit={{ y: 120, opacity: 0 }}
				transition={{ duration: 0.3 }}
				className="fixed bottom-4 left-1/2 z-50 w-[min(100%,900px)] -translate-x-1/2 px-4"
			>
				<div className="rounded-[28px] border border-white/10 bg-gradient-to-br from-[#080A1F] via-[#0D122E] to-[#05060C] p-4 text-white shadow-[0_25px_80px_rgba(3,5,20,0.65)] backdrop-blur-xl">
					<div className="flex items-center justify-between gap-4">
						<div className="flex items-center gap-3">
							<div className="relative flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-white/5">
								{currentTrack.thumbnail ? (
									<Image
										src={currentTrack.thumbnail}
										alt={currentTrack.title}
										fill
										className="object-cover"
										unoptimized
									/>
								) : (
									<Volume2Icon className="h-6 w-6 text-white/40" />
								)}
							</div>
							<div>
								<p className="text-sm uppercase tracking-[0.4em] text-white/50">{currentTrack.trackType}</p>
								<h4 className="text-lg font-semibold">{currentTrack.title}</h4>
								<p className="text-sm text-white/70 line-clamp-1">
									{currentTrack.subtitle ?? "Mindify Studio"}
								</p>
							</div>
						</div>

						<div className="flex flex-1 flex-col gap-2">
							<div className="flex items-center justify-center gap-4">
								<button
									type="button"
									onClick={playPrevious}
									className="rounded-full border border-white/10 p-2 text-white/70 hover:border-white/30"
								>
									<SkipBackIcon className="h-5 w-5" />
								</button>
								<button
									type="button"
									onClick={togglePlay}
									className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-black shadow-lg transition hover:-translate-y-0.5"
								>
									{isPlaying ? <PauseIcon className="h-5 w-5" /> : <PlayIcon className="h-5 w-5" />}
								</button>
								<button
									type="button"
									onClick={playNext}
									className="rounded-full border border-white/10 p-2 text-white/70 hover:border-white/30"
								>
									<SkipForwardIcon className="h-5 w-5" />
								</button>
							</div>
							<div className="flex items-center gap-3 text-xs text-white/60">
								<span>{formatTime(progress)}</span>
								<input
									type="range"
									min={0}
									max={duration || 1}
									value={progress}
									step={0.5}
									onChange={handleSeek}
									className="h-1 flex-1 accent-white"
								/>
								<span>{formatTime(duration)}</span>
							</div>
						</div>

						<div className="flex items-center gap-3">
							<div className="flex items-center gap-2">
								<Volume2Icon className="h-4 w-4 text-white/60" />
								<input
									type="range"
									min={0}
									max={1}
									step={0.05}
									value={volume}
									onChange={handleVolume}
									className="h-1 w-24 accent-white"
								/>
							</div>
							<button
								type="button"
								onClick={() => setIsExpanded((prev) => !prev)}
								className="rounded-full border border-white/10 p-2 text-white/70 hover:border-white/30"
							>
								{isExpanded ? <Minimize2Icon className="h-5 w-5" /> : <Maximize2Icon className="h-5 w-5" />}
							</button>
							<button
								type="button"
								onClick={handleClose}
								className="rounded-full border border-white/10 p-2 text-white/70 hover:border-white/30"
							>
								<XIcon className="h-5 w-5" />
							</button>
						</div>
					</div>

					<AnimatePresence>
						{isExpanded && (
							<motion.div
								initial={{ height: 0, opacity: 0 }}
								animate={{ height: "auto", opacity: 1 }}
								exit={{ height: 0, opacity: 0 }}
								transition={{ duration: 0.2 }}
								className="mt-4 border-t border-white/10 pt-4"
							>
								<div className="flex flex-wrap items-center justify-between gap-4">
									<div>
										<p className="text-xs uppercase tracking-[0.4em] text-white/60">Up Next</p>
										<div className="mt-2 flex items-center gap-3 text-sm text-white/70">
											<ListMusicIcon className="h-4 w-4" />
											<span>{queue.length > 0 ? `${queue.length} items queued` : "Queue is empty"}</span>
										</div>
									</div>
								</div>
								<div className="mt-3 max-h-48 space-y-2 overflow-y-auto pr-2">
									{queue.map((track, idx) => (
										<button
											type="button"
											key={`${track.id}-${idx}`}
											onClick={() => playTrack(track)}
											className="flex w-full items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-left transition hover:border-white/30"
										>
											<div>
												<p className="text-sm font-medium text-white">{track.title}</p>
												<p className="text-xs uppercase tracking-[0.3em] text-white/40">{track.trackType}</p>
											</div>
											<span className="text-xs text-white/50">Tap to play</span>
										</button>
									))}
									{queue.length === 0 && (
										<p className="rounded-2xl border border-dashed border-white/10 px-4 py-3 text-sm text-white/50">
											Add meditations, hypnosis, or resets to the queue to keep the flow going.
										</p>
									)}
								</div>
							</motion.div>
						)}
					</AnimatePresence>
				</div>
			</motion.div>
		</AnimatePresence>
	);
}
