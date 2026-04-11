"use client";

import { Play, Lock } from "lucide-react";
import { useAudioStore } from "@/lib/stores/audioStore";
import type { AudioTrackContext } from "@/lib/types";
import { FavoriteButton } from "@/components/ui/FavoriteButton";

export interface FeaturedContentItem {
	id: string;
	title: string;
	duration: number;
	audioUrl?: string;
	type: AudioTrackContext;
	isPremium?: boolean;
	subtitle?: string;
}

/**
 * Compact card used in horizontal content strips (meditations, hypnosis, quick
 * resets) on the experience home page. Clicking plays the track via the global
 * audio store; premium content is locked for free-tier users.
 */
export function FeaturedContentCard({
	item,
	membershipTier,
}: {
	item: FeaturedContentItem;
	membershipTier: "premium" | "free";
}) {
	const playTrack = useAudioStore((state) => state.playTrack);
	const locked = item.isPremium && membershipTier === "free";

	const handleClick = () => {
		if (locked || !item.audioUrl) return;
		playTrack({
			id: item.id,
			title: item.title,
			audioUrl: item.audioUrl,
			trackType: item.type,
		});
	};

	return (
		<div
			className={`group relative flex w-[240px] shrink-0 snap-start flex-col gap-3 rounded-3xl border border-[rgb(var(--sage-100))] bg-[rgb(var(--cream-50))] p-4 text-left shadow-card transition dark:border-white/10 dark:bg-[#111318] ${
				locked
					? "cursor-not-allowed opacity-70"
					: "cursor-pointer hover:-translate-y-1 hover:shadow-hover"
			}`}
			onClick={handleClick}
			onKeyDown={(e) => {
				if (e.key === "Enter" || e.key === " ") {
					e.preventDefault();
					handleClick();
				}
			}}
			role="button"
			tabIndex={locked ? -1 : 0}
			aria-disabled={locked}
		>
			<FavoriteButton
				contentType={item.type}
				contentId={item.id}
				size="sm"
				variant="solid"
				className="absolute right-3 top-3 z-10"
			/>
			<div className="flex items-center justify-between">
				<p className="text-[10px] uppercase tracking-[0.3em] text-[rgb(var(--earth-500))] dark:text-[#AFA79B]">
					{item.type}
				</p>
				<div className="flex h-8 w-8 items-center justify-center rounded-full bg-[rgb(var(--sage-600))] text-white shadow-sm group-hover:bg-[rgb(var(--sage-700))]">
					{locked ? <Lock className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" fill="currentColor" />}
				</div>
			</div>
			<h4 className="text-base font-serif font-semibold text-[rgb(var(--earth-900))] dark:text-[#F4EFE6]">
				{item.title}
			</h4>
			<p className="text-xs text-[rgb(var(--earth-600))] dark:text-[#CFC7BB]">
				{item.duration} min
				{item.subtitle ? ` • ${item.subtitle}` : ""}
			</p>
			{locked && (
				<span className="inline-flex self-start rounded-full border border-[rgb(var(--gold-200))] bg-[rgb(var(--gold-50))] px-2.5 py-0.5 text-[10px] uppercase tracking-[0.25em] text-[rgb(var(--gold-700))]">
					Premium
				</span>
			)}
		</div>
	);
}
