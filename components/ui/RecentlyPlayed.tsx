"use client";

import { PlayIcon, Trash2Icon } from "lucide-react";
import { useAudioStore } from "@/lib/stores/audioStore";
import type { AudioTrack } from "@/lib/types";

function formatElapsed(timestamp: string) {
	const diff = Date.now() - new Date(timestamp).getTime();
	const minutes = Math.floor(diff / 60000);
	if (minutes < 1) return "just now";
	if (minutes < 60) return `${minutes}m ago`;
	const hours = Math.floor(minutes / 60);
	if (hours < 24) return `${hours}h ago`;
	const days = Math.floor(hours / 24);
	return `${days}d ago`;
}

const trackTypeColors: Record<string, string> = {
	meditation: "bg-gradient-to-r from-mindify-dawn/30 to-mindify-lagoon/30 text-mindify-lagoon",
	hypnosis: "bg-gradient-to-r from-mindify-rose/30 to-mindify-dusk/30 text-mindify-rose",
	reset: "bg-gradient-to-r from-mindify-mist/30 to-white/20 text-mindify-mist",
	program: "bg-gradient-to-r from-mindify-deep/30 to-white/10 text-mindify-deep",
};

export function RecentlyPlayed() {
	const { history, playTrack, removeFromHistory } = useAudioStore((state) => ({
		history: state.history,
		playTrack: state.playTrack,
		removeFromHistory: state.removeFromHistory,
	}));

	if (history.length === 0) {
		return (
			<div className="rounded-4xl border border-white/10 bg-white/5 p-5 text-white">
				<p className="text-xs uppercase tracking-[0.4em] text-white/60">Recently Played</p>
				<p className="mt-3 text-sm text-white/70">Your listening history will appear here once you complete a session.</p>
			</div>
		);
	}

	return (
		<div className="rounded-4xl border border-white/10 bg-white/5 p-5 text-white">
			<div className="flex items-center justify-between">
				<div>
					<p className="text-xs uppercase tracking-[0.4em] text-white/60">Recently Played</p>
					<p className="text-sm text-white/70">Tap to replay or clear an item.</p>
				</div>
			</div>
			<ul className="mt-4 space-y-3">
				{[...history].reverse().map((item) => (
					<li
						key={`${item.track.id}-${item.listenedAt}`}
						className="flex items-center justify-between rounded-3xl border border-white/15 bg-black/20 px-4 py-3"
					>
						<div>
							<div className="flex items-center gap-3">
								<p className="text-base font-semibold">{item.track.title}</p>
								<span
									className={`rounded-full px-3 py-1 text-xs uppercase tracking-[0.3em] ${
										trackTypeColors[item.track.trackType] ?? "bg-white/10"
									}`}
								>
									{item.track.trackType}
								</span>
							</div>
							<p className="text-xs text-white/60">
								{formatElapsed(item.listenedAt)} • {Math.round(item.durationSeconds / 60)}m listened
							</p>
						</div>
						<div className="flex items-center gap-2">
							<button
								type="button"
								onClick={() => playTrack(item.track as AudioTrack)}
								className="rounded-full border border-white/20 p-2 text-white/80 hover:border-white/40"
							>
								<PlayIcon className="h-4 w-4" />
							</button>
							<button
								type="button"
								onClick={() => removeFromHistory(item.track.id)}
								className="rounded-full border border-white/20 p-2 text-white/60 hover:border-white/40"
							>
								<Trash2Icon className="h-4 w-4" />
							</button>
						</div>
					</li>
				))}
			</ul>
		</div>
	);
}
