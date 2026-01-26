"use client";

import type { ComponentType } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { MEDITATION_SESSIONS } from "@/constants";
import { useSoundscapeStore } from "@/lib/stores/soundscapeStore";
import { MindifyPanel, StatBadge } from "@/components/ui/MindifyPanel";

type MindifyPlayerProps = {
	url: string;
	controls?: boolean;
	width?: string | number;
	height?: string | number;
	playing?: boolean;
};

const ReactPlayer = dynamic(
	() => import("react-player").then((mod) => mod.default),
	{
		ssr: false,
	},
) as unknown as ComponentType<MindifyPlayerProps>;

const toneAccents: Record<string, string> = {
	dusk: "border-sage-200",
	twilight: "border-cream-200",
	deep: "border-sage-300",
	lagoon: "border-teal-200",
	mist: "border-cream-300",
	rose: "border-gold-200",
};

export function MeditationGrid() {
	const { currentSession, selectSession } = useSoundscapeStore();

	return (
		<div className="space-y-8">
			<div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
				{MEDITATION_SESSIONS.map((session, index) => (
					<motion.button
						key={session.id}
						onClick={() => selectSession(session)}
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: index * 0.05, duration: 0.3 }}
						whileHover={{ y: -8, scale: 1.02 }}
						whileTap={{ scale: 0.98 }}
						className={`group relative overflow-hidden rounded-3xl border bg-cream-50 p-5 text-left shadow-card transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-sage-300 hover:shadow-elevated active:scale-98 dark:border-white/10 dark:bg-[#13151A] ${
							toneAccents[session.tone] ?? "border-sage-100"
						}`}
					>
						{/* Gradient overlay on hover */}
						<div className="absolute inset-0 bg-gradient-to-br from-sage-500/0 to-sage-500/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:from-sage-400/0 dark:to-sage-400/10" />

						<div className="relative flex items-center justify-between text-xs uppercase tracking-[0.3em] text-earth-500 dark:text-[#AFA79B]">
							<span>{session.focus}</span>
							<span>{session.duration}m</span>
						</div>
						<h3 className="relative mt-4 text-2xl font-serif font-semibold text-earth-900 dark:text-[#F4EFE6]">
							{session.title}
						</h3>
						<p className="relative mt-3 text-base leading-relaxed text-earth-600 dark:text-[#CFC7BB]">
							{session.description}
						</p>
						<div className="relative mt-6 flex flex-wrap gap-3 text-xs tracking-wide text-earth-600 dark:text-[#CFC7BB]">
							<StatBadge label="Scientist" value={session.neuroscientist} />
							<StatBadge label="Tone" value={session.tone} />
						</div>
						{currentSession?.id === session.id && (
							<motion.p
								initial={{ opacity: 0, y: -10 }}
								animate={{ opacity: 1, y: 0 }}
								className="relative mt-6 text-sm text-sage-600 dark:text-[#CBB796]"
							>
								Now channeling this soundscape.
							</motion.p>
						)}
					</motion.button>
				))}
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
						<div className="mt-4 overflow-hidden rounded-3xl border border-sage-100 bg-cream-50 p-4 dark:border-white/10 dark:bg-[#111318]">
							<ReactPlayer
								url={currentSession.audioUrl}
								controls
								width="100%"
								height="80px"
							/>
						</div>
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
