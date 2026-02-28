"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { QUICK_RESETS } from "@/lib/mockData/quickResets";
import type { QuickReset } from "@/lib/types";
import { useAudioStore } from "@/lib/stores/audioStore";
import { QuickResetPlayer } from "@/components/quick-resets/QuickResetPlayer";

function toAudioTrack(reset: QuickReset) {
	return {
		...reset,
		trackType: "reset" as const,
		thumbnail: "/images/quick-resets/waveform.jpg",
		subtitle: reset.instructions,
	};
}

export function QuickResetsList() {
	const [resets, setResets] = useState<QuickReset[]>(QUICK_RESETS);
	const [selectedReset, setSelectedReset] = useState<QuickReset | null>(null);

	useEffect(() => {
		fetch("/api/quick-resets")
			.then((res) => res.json())
			.then((json) => {
				if (json.items?.length > 0) setResets(json.items);
			})
			.catch(() => {});
	}, []);

	const { playTrack, currentTrack, isPlaying } = useAudioStore((state) => ({
		playTrack: state.playTrack,
		currentTrack: state.currentTrack,
		isPlaying: state.isPlaying,
	}));

	const handlePlay = (reset: QuickReset) => {
		setSelectedReset(reset);
		playTrack(toAudioTrack(reset));
	};

	const playingResetId = useMemo(
		() => (currentTrack?.trackType === "reset" ? currentTrack.id : null),
		[currentTrack],
	);

	return (
		<section className="space-y-6">
			<header className="flex flex-wrap items-center justify-between gap-3">
				<div>
					<p className="text-xs uppercase tracking-[0.4em] text-white/60">Quick Resets</p>
					<h2 className="text-2xl font-semibold text-white">Rapid Nervous System Tools</h2>
				</div>
				<p className="text-sm text-white/60">Tap a protocol to play instantly • no modal, just action.</p>
			</header>
			<div className="grid gap-4 lg:grid-cols-2">
				{resets.map((reset, index) => {
					const isActive = playingResetId === reset.id;
					return (
						<motion.button
							key={reset.id}
							onClick={() => handlePlay(reset)}
							whileTap={{ scale: 0.98 }}
							className={`flex flex-col rounded-3xl border px-5 py-4 text-left transition ${
								isActive
									? "border-mindify-lagoon/60 bg-mindify-lagoon/10 text-white"
									: "border-white/15 bg-white/5 text-white/80 hover:border-white/30"
							}`}
							initial={{ opacity: 0, translateY: 20 }}
							animate={{ opacity: 1, translateY: 0 }}
							transition={{ delay: index * 0.05 }}
						>
							<div className="flex items-center justify-between text-xs uppercase tracking-[0.3em]">
								<span>{reset.type.replace("-", " ")}</span>
								<span>{reset.duration} min</span>
							</div>
							<h3 className="mt-2 text-xl font-semibold text-white">{reset.title}</h3>
							<p className="mt-1 text-sm text-white/70">{reset.instructions}</p>
							<div className="mt-4 flex items-center gap-3 text-xs text-white/50">
								<span className="rounded-full border border-white/15 px-3 py-1">Instant play</span>
								{isActive && isPlaying && <span className="text-mindify-lagoon">Now playing</span>}
							</div>
						</motion.button>
					);
				})}
			</div>

			{selectedReset && (
				<QuickResetPlayer
					key={selectedReset.id}
					track={toAudioTrack(selectedReset)}
					totalDurationSeconds={selectedReset.duration * 60}
					onAutoNextLabel="Next reset queued"
				/>
			)}
		</section>
	);
}
