"use client";

import { useEffect, useMemo } from "react";
import { PauseIcon, PlayIcon, RotateCcwIcon } from "lucide-react";
import type { AudioTrack } from "@/lib/types";
import { useAudioStore } from "@/lib/stores/audioStore";

type QuickResetPlayerProps = {
	track: AudioTrack;
	totalDurationSeconds: number;
	onAutoNextLabel?: string;
};

const circumference = 2 * Math.PI * 54;

export function QuickResetPlayer({ track, totalDurationSeconds, onAutoNextLabel }: QuickResetPlayerProps) {
	const isPlaying = useAudioStore((state) => state.isPlaying);
	const progress = useAudioStore((state) => state.progress);
	const pauseTrack = useAudioStore((state) => state.pauseTrack);
	const resumeTrack = useAudioStore((state) => state.resumeTrack);
	const seekTo = useAudioStore((state) => state.seekTo);

	const remainingSeconds = Math.max(0, Math.round(totalDurationSeconds - progress));
	const progressOffset = useMemo(() => {
		const ratio = Math.min(progress / totalDurationSeconds, 1);
		return circumference * (1 - ratio);
	}, [progress, totalDurationSeconds]);

	useEffect(() => {
		if (typeof window !== "undefined" && "vibrate" in navigator && progress === 0) {
			navigator.vibrate?.(20);
		}
	}, [progress]);

	const handleRestart = () => {
		seekTo(0);
		resumeTrack();
		if ("vibrate" in navigator) {
			navigator.vibrate?.([10, 10, 10]);
		}
	};

	return (
		<div className="rounded-4xl border border-white/10 bg-gradient-to-br from-[#0D0F1F] to-[#05060E] p-6 text-white shadow-[0_20px_60px_rgba(5,6,15,0.4)]">
			<header className="flex flex-wrap items-center justify-between gap-4">
				<div>
					<p className="text-xs uppercase tracking-[0.4em] text-white/50">Now resetting</p>
					<h3 className="text-2xl font-semibold">{track.title}</h3>
					<p className="text-sm text-white/70">{track.subtitle ?? "Voice-guided breath work"}</p>
				</div>
				<button
					type="button"
					onClick={handleRestart}
					className="flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-sm text-white/80 hover:border-white/40"
				>
					<RotateCcwIcon className="h-4 w-4" />
					Restart
				</button>
			</header>

			<div className="mt-6 flex flex-wrap items-center gap-8">
				<div className="relative h-32 w-32">
					<svg className="h-32 w-32 -rotate-90" viewBox="0 0 120 120">
						<circle
							className="text-white/15"
							stroke="currentColor"
							strokeWidth="6"
							fill="transparent"
							r="54"
							cx="60"
							cy="60"
						/>
						<circle
							className="text-mindify-lagoon transition-[stroke-dashoffset]"
							stroke="currentColor"
							strokeLinecap="round"
							strokeWidth="6"
							fill="transparent"
							r="54"
							cx="60"
							cy="60"
							strokeDasharray={circumference}
							strokeDashoffset={progressOffset}
						/>
					</svg>
					<div className="absolute inset-0 flex flex-col items-center justify-center text-white">
						<span className="text-xs uppercase tracking-[0.4em] text-white/50">Remain</span>
						<span className="text-2xl font-semibold">
							{Math.floor(remainingSeconds / 60)}:{`${remainingSeconds % 60}`.padStart(2, "0")}
						</span>
					</div>
				</div>

				<div className="flex-1 space-y-4">
					<div className="flex flex-wrap items-center gap-4">
						<button
							type="button"
							onClick={isPlaying ? pauseTrack : resumeTrack}
							className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-black shadow-lg transition hover:-translate-y-0.5"
						>
							{isPlaying ? <PauseIcon className="h-6 w-6" /> : <PlayIcon className="h-6 w-6" />}
						</button>
						<div className="rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/80">
							<p className="text-xs uppercase tracking-[0.4em] text-white/40">Guidance</p>
							<p>{track.subtitle ?? "Inhale 4 • Hold 2 • Exhale 6"}</p>
						</div>
					</div>
					<div>
						<div className="flex justify-between text-xs uppercase tracking-[0.3em] text-white/40">
							<span>Progress</span>
							<span>Auto-next</span>
						</div>
						<div className="mt-2 flex items-center gap-4">
							<div className="h-2 flex-1 rounded-full bg-white/10">
								<div
									className="h-2 rounded-full bg-gradient-to-r from-mindify-dawn to-mindify-lagoon"
									style={{ width: `${Math.min((progress / totalDurationSeconds) * 100, 100)}%` }}
								/>
							</div>
							<p className="text-xs text-white/60">{onAutoNextLabel ?? "Next reset queued"}</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
