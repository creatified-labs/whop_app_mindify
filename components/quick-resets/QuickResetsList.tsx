"use client";

import { useState, useEffect } from "react";
import type { QuickReset } from "@/lib/types";
import { useAudioStore } from "@/lib/stores/audioStore";

export function QuickResetsList() {
	const [activeId, setActiveId] = useState<string | null>(null);
	const [resets, setResets] = useState<QuickReset[]>([]);
	const playTrack = useAudioStore((state) => state.playTrack);

	useEffect(() => {
		fetch("/api/quick-resets")
			.then((res) => res.json())
			.then((data) => setResets(data.items || []))
			.catch(() => {});
	}, []);

	const handlePlay = (reset: QuickReset) => {
		setActiveId(reset.id);
		playTrack({
			id: reset.id,
			title: reset.title,
			audioUrl: reset.audioUrl,
			duration: reset.duration * 60,
			trackType: "reset",
			subtitle: reset.instructions,
		});
	};

	if (resets.length === 0) {
		return (
			<section className="space-y-6">
				<header className="flex flex-wrap items-center justify-between gap-3">
					<div>
						<p className="text-xs uppercase tracking-[0.4em] text-[rgb(var(--earth-500))] dark:text-white/60">Quick Resets</p>
						<h2 className="text-2xl font-semibold text-[rgb(var(--earth-900))] dark:text-white">Rapid Nervous System Tools</h2>
					</div>
				</header>
				<p className="text-sm text-[rgb(var(--earth-500))] dark:text-white/60">No quick resets available yet.</p>
			</section>
		);
	}

	return (
		<section className="space-y-6">
			<header className="flex flex-wrap items-center justify-between gap-3">
				<div>
					<p className="text-xs uppercase tracking-[0.4em] text-[rgb(var(--earth-500))] dark:text-white/60">Quick Resets</p>
					<h2 className="text-2xl font-semibold text-[rgb(var(--earth-900))] dark:text-white">Rapid Nervous System Tools</h2>
				</div>
				<p className="text-sm text-[rgb(var(--earth-500))] dark:text-white/60">Tap a protocol to play instantly.</p>
			</header>
			<div className="grid gap-4 lg:grid-cols-2">
				{resets.map((reset) => (
					<button
						key={reset.id}
						type="button"
						onClick={() => handlePlay(reset)}
						className={`flex flex-col rounded-3xl border px-5 py-4 text-left transition ${
							activeId === reset.id
								? "border-mindify-lagoon/60 bg-mindify-lagoon/10 text-[rgb(var(--earth-900))] dark:text-white"
								: "border-[rgb(var(--sage-200))] bg-[rgb(var(--cream-50))] text-[rgb(var(--earth-700))] hover:border-[rgb(var(--sage-400))] dark:border-white/15 dark:bg-white/5 dark:text-white/80 dark:hover:border-white/30"
						}`}
					>
						<div className="flex items-center justify-between text-xs uppercase tracking-[0.3em]">
							<span>{String(reset.type).replace("-", " ")}</span>
							<span>{String(reset.duration)} min</span>
						</div>
						<h3 className="mt-2 text-xl font-semibold text-[rgb(var(--earth-900))] dark:text-white">{String(reset.title)}</h3>
						<p className="mt-1 text-sm text-[rgb(var(--earth-600))] dark:text-white/70">{String(reset.instructions)}</p>
						<div className="mt-4 flex items-center gap-3 text-xs text-[rgb(var(--earth-500))] dark:text-white/50">
							<span className="rounded-full border border-[rgb(var(--sage-200))] px-3 py-1 dark:border-white/15">Instant play</span>
							{activeId === reset.id && <span className="text-mindify-lagoon">Now playing</span>}
						</div>
					</button>
				))}
			</div>
		</section>
	);
}
