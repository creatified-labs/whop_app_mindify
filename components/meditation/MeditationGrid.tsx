"use client";

import { motion } from "framer-motion";
import { useSoundscapeStore } from "@/lib/stores/soundscapeStore";
import { useAudioStore } from "@/lib/stores/audioStore";
import { MindifyPanel, StatBadge } from "@/components/ui/MindifyPanel";
import { EmptyState } from "@/components/ui/EmptyState";
import { FavoriteButton } from "@/components/ui/FavoriteButton";
import { Music, Play } from "lucide-react";
import type { Meditation, MeditationCategory } from "@/lib/types";

interface MeditationGridProps {
	meditations?: Meditation[];
}

export function MeditationGrid({ meditations = [] }: MeditationGridProps) {
	const { currentSession, selectSession } = useSoundscapeStore();
	const playTrack = useAudioStore((state) => state.playTrack);

	const handlePlayInGlobalPlayer = (session: Meditation) => {
		playTrack({
			id: session.id,
			title: session.title,
			audioUrl: session.audioUrl,
			duration: session.duration * 60,
			trackType: "meditation",
		});
	};

	if (meditations.length === 0) {
		return (
			<EmptyState
				icon={<Music className="h-10 w-10 text-[rgb(var(--sage-600))]" />}
				title="No meditations yet"
				description="The creator hasn't added any meditation sessions yet. Check back soon!"
			/>
		);
	}

	return (
		<div className="space-y-8">
			<div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
				{meditations.map((session, index) => {
					const soundscapeSession = {
						id: session.id,
						title: session.title,
						duration: session.duration,
						focus: session.category,
						neuroscientist: "",
						audioUrl: session.audioUrl,
						tone: "mist" as const,
						description: session.description,
					};
					return (
						<motion.div
							key={session.id}
							onClick={() => selectSession(soundscapeSession)}
							onKeyDown={(e) => {
								if (e.key === "Enter" || e.key === " ") {
									e.preventDefault();
									selectSession(soundscapeSession);
								}
							}}
							role="button"
							tabIndex={0}
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: index * 0.05, duration: 0.3 }}
							whileHover={{ y: -8, scale: 1.02 }}
							whileTap={{ scale: 0.98 }}
							className="group relative cursor-pointer overflow-hidden rounded-3xl border border-sage-100 bg-cream-50 p-5 text-left shadow-card transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-sage-300 hover:shadow-elevated active:scale-98 dark:border-white/10 dark:bg-[#13151A]"
						>
							<div className="absolute inset-0 bg-gradient-to-br from-sage-500/0 to-sage-500/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:from-sage-400/0 dark:to-sage-400/10" />

							<FavoriteButton
								contentType="meditation"
								contentId={session.id}
								size="md"
								variant="solid"
								className="absolute right-4 top-4 z-10"
							/>

							<div className="relative flex items-center justify-between text-xs uppercase tracking-[0.3em] text-earth-500 dark:text-[#AFA79B]">
								<span>{session.category}</span>
								<span>{session.duration}m</span>
							</div>
							<h3 className="relative mt-4 text-2xl font-serif font-semibold text-earth-900 dark:text-[#F4EFE6]">
								{session.title}
							</h3>
							<p className="relative mt-3 text-base leading-relaxed text-earth-600 dark:text-[#CFC7BB]">
								{session.description}
							</p>
							{session.tags && session.tags.length > 0 && (
								<div className="relative mt-6 flex flex-wrap gap-3 text-xs tracking-wide text-earth-600 dark:text-[#CFC7BB]">
									{session.tags.map((tag) => (
										<StatBadge key={tag} label="Tag" value={tag} />
									))}
								</div>
							)}
							{currentSession?.id === session.id && (
								<motion.p
									initial={{ opacity: 0, y: -10 }}
									animate={{ opacity: 1, y: 0 }}
									className="relative mt-6 text-sm text-sage-600 dark:text-[#CBB796]"
								>
									Now channeling this soundscape.
								</motion.p>
							)}
						</motion.div>
					);
				})}
			</div>

			<motion.div layout>
				{currentSession ? (
					<MindifyPanel
						tone={currentSession.tone}
						className="mt-4"
						header={
							<div
								className={`flex flex-wrap items-center gap-3 text-sm uppercase tracking-[0.3em] ${
									currentSession.tone === "lagoon" ? "text-white/80" : "text-earth-500"
								}`}
							>
								<span>
									Live Soundbath
								</span>
								<StatBadge label="Session" value={currentSession.title} />
								<StatBadge label="Duration" value={`${currentSession.duration}m`} />
							</div>
						}
					>
						<p className="text-lg text-earth-700 dark:text-[#D9D3C8]">
							{currentSession.description}
						</p>
						<button
							type="button"
							onClick={() => handlePlayInGlobalPlayer({
								id: currentSession.id,
								title: currentSession.title,
								description: currentSession.description,
								duration: currentSession.duration,
								category: currentSession.focus as MeditationCategory,
								audioUrl: currentSession.audioUrl,
								imageUrl: "",
								mood: [],
							})}
							className="mt-4 inline-flex items-center gap-2 rounded-full bg-[rgb(var(--sage-600))] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[rgb(var(--sage-700))] dark:bg-white/90 dark:text-black dark:hover:bg-white"
						>
							<Play className="h-4 w-4" />
							Play in global player
						</button>
					</MindifyPanel>
				) : (
					<MindifyPanel
						tone="deep"
						header={
							<div className="flex flex-wrap items-center gap-3 text-sm uppercase tracking-[0.3em] text-earth-500 dark:text-[#AFA79B]">
								<span>
									Select a session
								</span>
								<StatBadge label="Hint" value="Tap a card to preview audio" />
							</div>
						}
					>
						<p className="text-lg text-earth-600 dark:text-[#CFC7BB]">
							Mindify soundscapes layer medical-grade binaural engineering,
							neuroscientist-guided prompts, and somatic cues. Choose a ritual to
							preview its tone and let the studio adapt to your nervous system.
						</p>
					</MindifyPanel>
				)}
			</motion.div>
		</div>
	);
}
