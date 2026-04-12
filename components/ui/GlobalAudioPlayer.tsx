"use client";

import { useState, useEffect, useCallback } from "react";
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
	ChevronDownIcon,
} from "lucide-react";
import { useAudioStore } from "@/lib/stores/audioStore";
import { FavoriteButton } from "@/components/ui/FavoriteButton";
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
	const [isMobileExpanded, setIsMobileExpanded] = useState(false);
	const [isVisible, setIsVisible] = useState(false);
	const currentTrack = useAudioStore((state) => state.currentTrack);
	const isPlaying = useAudioStore((state) => state.isPlaying);
	const progress = useAudioStore((state) => state.progress);
	const duration = useAudioStore((state) => state.duration);
	const volume = useAudioStore((state) => state.volume);
	const queue = useAudioStore((state) => state.queue);
	const playTrack = useAudioStore((state) => state.playTrack);
	const pauseTrack = useAudioStore((state) => state.pauseTrack);
	const resumeTrack = useAudioStore((state) => state.resumeTrack);
	const playNext = useAudioStore((state) => state.playNext);
	const playPrevious = useAudioStore((state) => state.playPrevious);
	const seekTo = useAudioStore((state) => state.seekTo);
	const setVolume = useAudioStore((state) => state.setVolume);
	const restoreFromPersisted = useAudioStore((state) => state.restoreFromPersisted);

	useEffect(() => {
		restoreFromPersisted();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		if (currentTrack) {
			setIsVisible(true);
		}
	}, [currentTrack]);

	const togglePlay = useCallback(() => {
		if (!currentTrack) return;
		if (isPlaying) {
			pauseTrack();
		} else {
			resumeTrack();
		}
	}, [currentTrack, isPlaying, pauseTrack, resumeTrack]);

	const handleSeek = (event: React.ChangeEvent<HTMLInputElement>) => {
		seekTo(Number(event.target.value));
	};

	const handleVolume = (event: React.ChangeEvent<HTMLInputElement>) => {
		setVolume(Number(event.target.value));
	};

	const handleClose = () => {
		pauseTrack();
		setIsVisible(false);
		setIsMobileExpanded(false);
	};

	if (!isVisible || !currentTrack) return null;

	// When duration is unknown (0), use progress as a reasonable fallback max
	// so the bar doesn't pin to 100% or show nonsense values.
	const effectiveDuration = duration > 0 ? duration : progress > 0 ? progress * 2 : 1;
	const progressPercent = duration > 0 ? (progress / duration) * 100 : 0;

	return (
		<>
			{/* ─── Desktop Player ─── */}
			<AnimatePresence>
				<motion.div
					initial={{ y: 120, opacity: 0 }}
					animate={{ y: 0, opacity: 1 }}
					exit={{ y: 120, opacity: 0 }}
					transition={{ duration: 0.3 }}
					className="fixed bottom-4 left-1/2 z-50 hidden w-[min(100%,900px)] -translate-x-1/2 px-4 lg:block"
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
										max={effectiveDuration}
										value={Math.min(progress, effectiveDuration)}
										step={0.5}
										onChange={handleSeek}
										className="h-1 flex-1 accent-white"
									/>
									<span>{duration > 0 ? formatTime(duration) : "--:--"}</span>
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
								<FavoriteButton
									contentType={currentTrack.trackType}
									contentId={currentTrack.id}
									size="md"
									variant="ghost"
									stopPropagation={false}
								/>
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

			{/* ─── Mobile Mini Player ─── */}
			<AnimatePresence>
				{!isMobileExpanded && (
					<motion.div
						initial={{ y: 80, opacity: 0 }}
						animate={{ y: 0, opacity: 1 }}
						exit={{ y: 80, opacity: 0 }}
						transition={{ duration: 0.25 }}
						className="fixed bottom-[calc(4.5rem+env(safe-area-inset-bottom))] left-0 right-0 z-50 block px-3 lg:hidden"
					>
						<div
							className="flex items-center gap-3 rounded-2xl border border-white/10 bg-gradient-to-br from-[#080A1F] via-[#0D122E] to-[#05060C] px-3 py-2 text-white shadow-[0_15px_50px_rgba(3,5,20,0.6)] backdrop-blur-xl"
							role="button"
							tabIndex={0}
							onClick={() => setIsMobileExpanded(true)}
							onKeyDown={(e) => e.key === "Enter" && setIsMobileExpanded(true)}
						>
							<div className="relative flex h-10 w-10 flex-shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-white/5">
								{currentTrack.thumbnail ? (
									<Image
										src={currentTrack.thumbnail}
										alt={currentTrack.title}
										fill
										className="object-cover"
										unoptimized
									/>
								) : (
									<Volume2Icon className="h-4 w-4 text-white/40" />
								)}
							</div>
							<div className="min-w-0 flex-1">
								<p className="truncate text-sm font-medium">{currentTrack.title}</p>
								<div className="mt-0.5 h-[2px] w-full rounded-full bg-white/10">
									<div
										className="h-full rounded-full bg-white/60 transition-[width] duration-300"
										style={{ width: `${progressPercent}%` }}
									/>
								</div>
							</div>
							<button
								type="button"
								onClick={(e) => {
									e.stopPropagation();
									togglePlay();
								}}
								className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-white text-black"
							>
								{isPlaying ? <PauseIcon className="h-4 w-4" /> : <PlayIcon className="h-4 w-4" />}
							</button>
							<FavoriteButton
								contentType={currentTrack.trackType}
								contentId={currentTrack.id}
								size="sm"
								variant="ghost"
								className="flex-shrink-0"
							/>
							<button
								type="button"
								onClick={(e) => {
									e.stopPropagation();
									handleClose();
								}}
								className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-white/50"
							>
								<XIcon className="h-4 w-4" />
							</button>
						</div>
					</motion.div>
				)}
			</AnimatePresence>

			{/* ─── Mobile Expanded Sheet ─── */}
			<AnimatePresence>
				{isMobileExpanded && (
					<motion.div
						initial={{ y: "100%" }}
						animate={{ y: 0 }}
						exit={{ y: "100%" }}
						transition={{ type: "spring", damping: 28, stiffness: 300 }}
						className="fixed inset-0 z-[60] flex flex-col bg-gradient-to-b from-[#0D122E] via-[#080A1F] to-[#05060C] text-white md:hidden"
					>
						{/* Drag handle + close */}
						<div className="flex items-center justify-between px-5 pb-2 pt-4">
							<button
								type="button"
								onClick={() => setIsMobileExpanded(false)}
								className="rounded-full p-2 text-white/60 active:bg-white/10"
							>
								<ChevronDownIcon className="h-6 w-6" />
							</button>
							<div className="h-1 w-10 rounded-full bg-white/20" />
							<button
								type="button"
								onClick={handleClose}
								className="rounded-full p-2 text-white/60 active:bg-white/10"
							>
								<XIcon className="h-5 w-5" />
							</button>
						</div>

						{/* Artwork */}
						<div className="flex flex-1 flex-col items-center justify-center gap-6 px-8">
							<div className="relative aspect-square w-full max-w-[280px] overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-2xl">
								{currentTrack.thumbnail ? (
									<Image
										src={currentTrack.thumbnail}
										alt={currentTrack.title}
										fill
										className="object-cover"
										unoptimized
									/>
								) : (
									<div className="flex h-full w-full items-center justify-center">
										<Volume2Icon className="h-16 w-16 text-white/20" />
									</div>
								)}
							</div>

							{/* Track info */}
							<div className="w-full text-center">
								<p className="text-xs uppercase tracking-[0.4em] text-white/50">{currentTrack.trackType}</p>
								<h3 className="mt-1 text-xl font-semibold">{currentTrack.title}</h3>
								<p className="mt-0.5 text-sm text-white/60">{currentTrack.subtitle ?? "Mindify Studio"}</p>
								<div className="mt-3 flex justify-center">
									<FavoriteButton
										contentType={currentTrack.trackType}
										contentId={currentTrack.id}
										size="lg"
										variant="ghost"
										stopPropagation={false}
									/>
								</div>
							</div>

							{/* Progress bar */}
							<div className="w-full">
								<input
									type="range"
									min={0}
									max={effectiveDuration}
									value={Math.min(progress, effectiveDuration)}
									step={0.5}
									onChange={handleSeek}
									className="h-1 w-full accent-white"
								/>
								<div className="mt-1 flex justify-between text-xs text-white/50">
									<span>{formatTime(progress)}</span>
									<span>{duration > 0 ? formatTime(duration) : "--:--"}</span>
								</div>
							</div>

							{/* Controls */}
							<div className="flex items-center justify-center gap-8">
								<button
									type="button"
									onClick={playPrevious}
									className="rounded-full p-3 text-white/70 active:bg-white/10"
								>
									<SkipBackIcon className="h-6 w-6" />
								</button>
								<button
									type="button"
									onClick={togglePlay}
									className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-black shadow-lg"
								>
									{isPlaying ? <PauseIcon className="h-7 w-7" /> : <PlayIcon className="h-7 w-7" />}
								</button>
								<button
									type="button"
									onClick={playNext}
									className="rounded-full p-3 text-white/70 active:bg-white/10"
								>
									<SkipForwardIcon className="h-6 w-6" />
								</button>
							</div>

							{/* Volume */}
							<div className="flex w-full items-center gap-3 px-4">
								<Volume2Icon className="h-4 w-4 flex-shrink-0 text-white/50" />
								<input
									type="range"
									min={0}
									max={1}
									step={0.05}
									value={volume}
									onChange={handleVolume}
									className="h-1 flex-1 accent-white"
								/>
							</div>
						</div>

						{/* Queue section */}
						<div className="border-t border-white/10 px-5 pb-[calc(16px+env(safe-area-inset-bottom))] pt-4">
							<div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-white/50">
								<ListMusicIcon className="h-4 w-4" />
								<span>{queue.length > 0 ? `Up Next · ${queue.length}` : "Queue Empty"}</span>
							</div>
							{queue.length > 0 && (
								<div className="mt-3 max-h-32 space-y-2 overflow-y-auto">
									{queue.map((track, idx) => (
										<button
											type="button"
											key={`${track.id}-${idx}`}
											onClick={() => playTrack(track)}
											className="flex w-full items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-left active:bg-white/10"
										>
											<p className="flex-1 truncate text-sm font-medium text-white">{track.title}</p>
											<span className="text-xs text-white/40">{track.trackType}</span>
										</button>
									))}
								</div>
							)}
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</>
	);
}
