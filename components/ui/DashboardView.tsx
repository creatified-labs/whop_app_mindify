"use client";

import { useEffect, useMemo } from "react";
import { useAppStore, type NavSection } from "@/lib/stores/appStore";
import { useAudioStore } from "@/lib/stores/audioStore";
import type { UserProgress } from "@/lib/types";
import { NoFavorites, NoActivity, NoPrograms } from "@/components/ui/EmptyState";

type SessionType = "meditation" | "hypnosis" | "program" | "reset";

export interface ContinueSession {
	id: string;
	title: string;
	type: SessionType;
	progressPercent: number;
	durationMinutes: number;
	moodTag?: string;
}

export interface ProgramSnapshot {
	programId: string;
	title: string;
	progressPercent: number;
	nextMilestone: string;
	isPremium: boolean;
}

export interface FavoriteSession {
	id: string;
	title: string;
	type: SessionType;
	durationMinutes: number;
	isPremium?: boolean;
}

export interface ActivityItem {
	id: string;
	label: string;
	timestamp: string;
	type: SessionType;
}

export interface RecommendedSession {
	id: string;
	title: string;
	type: SessionType;
	durationMinutes: number;
	timeOfDay: string;
	isPremium?: boolean;
}

export interface DashboardViewProps {
	userName: string;
	membershipTier: "premium" | "free";
	continueSession: ContinueSession | null;
	currentProgram: ProgramSnapshot | null;
	favorites: FavoriteSession[];
	recentActivity: ActivityItem[];
	recommendedSessions: RecommendedSession[];
	streakDays: number;
	userProgress: UserProgress | null;
}

const glassCard =
	"rounded-4xl border border-sage-100 bg-cream-50 p-6 text-earth-900 shadow-card dark:border-white/10 dark:bg-[#13151A] dark:text-[#F4EFE6]";

export function ExperienceContent(props: DashboardViewProps) {
	const navSelection = useAppStore((state) => state.navSelection);

	if (navSelection === "dashboard") {
		return <DashboardView {...props} />;
	}

	return (
		<div className={`${glassCard} min-h-[420px]`}>
			<p className="text-xs uppercase tracking-[0.4em] text-earth-500">
				{navSelection.replace("-", " ")}
			</p>
			<h2 className="mt-6 text-4xl font-serif font-semibold text-earth-900">
				{navSelection === "meditations"
					? "Mindful sound libraries"
					: navSelection === "hypnosis"
						? "Somatic reprogramming"
						: navSelection === "programs"
							? "Immersive residencies"
							: navSelection === "quick-resets"
								? "Rapid nervous system resets"
								: navSelection === "knowledge-hub"
									? "Knowledge hub soon"
									: "Community drops coming soon"}
			</h2>
			<p className="mt-4 max-w-2xl text-base leading-relaxed text-earth-600">
				This section unlocks deeper once your team starts a ritual. Stay tuned—Mindify is
				streaming in fresh modules tailored for {navSelection.replace("-", " ")}.
			</p>
		</div>
	);
}

export function DashboardView({
	userName,
	membershipTier,
	continueSession,
	currentProgram,
	favorites,
	recentActivity,
	recommendedSessions,
	streakDays,
	userProgress,
}: DashboardViewProps) {
	const setUserProgress = useAppStore((state) => state.setUserProgress);
	const storedProgress = useAppStore((state) => state.userProgress);
	const playTrack = useAudioStore((state) => state.playTrack);

	useEffect(() => {
		if (!userProgress) return;
		const isSame =
			storedProgress &&
			storedProgress.userId === userProgress.userId &&
			storedProgress.lastActivityDate === userProgress.lastActivityDate &&
			storedProgress.totalMinutesMeditated === userProgress.totalMinutesMeditated;
		if (isSame) return;
		setUserProgress(userProgress);
	}, [userProgress, storedProgress, setUserProgress]);

	const greeting = useMemo(() => {
		const hour = new Date().getHours();
		if (hour < 12) return "Morning";
		if (hour < 18) return "Afternoon";
		return "Evening";
	}, []);

	const handlePlay = (trackId: string, trackTitle: string) =>
		playTrack({
			id: trackId,
			title: trackTitle,
			audioUrl: `/audio/${trackId}.mp3`,
			trackType: "meditation",
		});

	return (
		<div className="space-y-6">
			<section className={`${glassCard} grid gap-6 lg:grid-cols-[1.1fr_0.9fr]`}>
				<div className="space-y-6">
					<div>
						<p className="text-xs uppercase tracking-[0.4em] text-earth-500">
							{greeting} ritual • {membershipTier} tier
						</p>
						<h2 className="mt-2 text-4xl font-serif font-semibold text-earth-900">
							Welcome back, <span className="text-sage-600">{userName}</span>
						</h2>
						<p className="mt-2 max-w-2xl text-base leading-relaxed text-earth-600">
							We’re holding space for your nervous system reset. Continue your ritual or
							explore curated recommendations below.
						</p>
					</div>
					{continueSession && (
						<div className="rounded-3xl border border-sage-100 bg-cream-50 p-5 dark:border-white/10 dark:bg-[#111318]">
							<div className="flex flex-wrap items-center justify-between gap-4 text-sm text-earth-600 dark:text-[#CFC7BB]">
								<p className="uppercase tracking-[0.3em] text-earth-500">
									Continue Ritual
								</p>
								<p className="font-medium text-earth-700 dark:text-[#E2DBCF]">
									{continueSession.durationMinutes} mins • {continueSession.type}
								</p>
							</div>
							<h3 className="mt-3 text-2xl font-semibold text-earth-900 dark:text-[#F4EFE6]">
								{continueSession.title}
							</h3>
							<div className="mt-4 h-2 w-full rounded-full bg-sage-100">
								<div
									className="h-full rounded-full bg-gradient-sage"
									style={{ width: `${continueSession.progressPercent}%` }}
								/>
							</div>
							<div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-earth-600 dark:text-[#CFC7BB]">
								<span className="font-medium">{continueSession.progressPercent}% complete</span>
								<button
									type="button"
									onClick={() => handlePlay(continueSession.id, continueSession.title)}
									className="rounded-full border border-sage-200 px-4 py-2 text-xs uppercase tracking-[0.3em] text-sage-700 hover:bg-sage-50 dark:border-white/10 dark:text-[#E2DBCF] dark:hover:bg-white/10"
								>
									Play
								</button>
							</div>
						</div>
					)}
				</div>
				<div className="space-y-4 rounded-3xl border border-sage-100 bg-cream-50 p-6 dark:border-white/10 dark:bg-[#111318]">
					<p className="text-xs uppercase tracking-[0.4em] text-earth-500 dark:text-[#AFA79B]">Daily streak</p>
					<p className="text-5xl font-semibold text-earth-900 dark:text-[#F4EFE6]">🔥 {streakDays}</p>
					<p className="text-sm text-earth-600 dark:text-[#CFC7BB]">
						Keep the chain going to unlock deeper labs and real-time biofeedback rituals.
					</p>
					<div className="rounded-2xl border border-sage-100 bg-cream-50 p-4 text-sm dark:border-white/10 dark:bg-[#151821]">
						<p className="text-earth-500 dark:text-[#AFA79B]">Total minutes</p>
						<p className="text-3xl font-semibold text-earth-900 dark:text-[#F4EFE6]">
							{userProgress?.totalMinutesMeditated ?? 0}m
						</p>
					</div>
				</div>
			</section>

			<section className="grid gap-6 lg:grid-cols-2">
				{currentProgram ? (
					<div className={`${glassCard}`}>
						<p className="text-xs uppercase tracking-[0.4em] text-earth-500">
							Current Program
						</p>
						<h3 className="mt-2 text-3xl font-serif font-semibold text-earth-900">{currentProgram.title}</h3>
						<div className="mt-4 h-2 w-full rounded-full bg-sage-100">
							<div
								className="h-full rounded-full bg-gradient-sage"
								style={{ width: `${currentProgram.progressPercent}%` }}
							/>
						</div>
						<p className="mt-3 text-sm text-earth-600">
							Next milestone: {currentProgram.nextMilestone}
						</p>
						{!currentProgram.isPremium && membershipTier === "free" && (
							<p className="mt-3 inline-flex rounded-full border border-gold-200 bg-gold-50 px-4 py-1 text-xs uppercase tracking-[0.3em] text-gold-700">
								Premium Preview
							</p>
						)}
					</div>
				) : (
					<div className={`${glassCard}`}>
						<NoPrograms />
					</div>
				)}

				<div className={`${glassCard}`}>
					<p className="text-xs uppercase tracking-[0.4em] text-earth-500 dark:text-[#AFA79B]">Recent Activity</p>
					{recentActivity.length > 0 ? (
						<ul className="mt-4 space-y-4">
							{recentActivity.map((item) => (
								<li key={item.id} className="flex items-center justify-between text-sm text-earth-700 dark:text-[#D9D3C8]">
									<div>
										<p className="font-medium text-earth-900 dark:text-[#F4EFE6]">{item.label}</p>
										<p className="text-earth-500 dark:text-[#AFA79B]">{formatRelativeTime(item.timestamp)}</p>
									</div>
									<span className="rounded-full border border-sage-100 px-3 py-1 text-xs uppercase tracking-[0.3em] text-earth-600 dark:border-white/10 dark:text-[#CFC7BB]">
										{item.type}
									</span>
								</li>
							))}
						</ul>
					) : (
						<div className="mt-4">
							<NoActivity />
						</div>
					)}
				</div>
			</section>

			<section className={`${glassCard}`}>
				<div className="flex flex-wrap items-center justify-between gap-3">
					<div>
						<p className="text-xs uppercase tracking-[0.4em] text-earth-500 dark:text-[#AFA79B]">Quick access</p>
						<h3 className="mt-2 text-2xl font-serif font-semibold text-earth-900 dark:text-[#F4EFE6]">Favorite soundscapes</h3>
					</div>
					{favorites.length > 0 && (
						<p className="text-sm text-earth-600 dark:text-[#CFC7BB]">Tap a tile to jump right in.</p>
					)}
				</div>
				{favorites.length > 0 ? (
					<div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
						{favorites.map((fav) => (
							<button
								type="button"
								key={fav.id}
								onClick={() => handlePlay(fav.id, fav.title)}
								className="group rounded-3xl border border-sage-100 bg-cream-50 p-4 text-left shadow-card transition hover:-translate-y-1 hover:shadow-hover dark:border-white/10 dark:bg-[#13151A]"
							>
								<p className="text-xs uppercase tracking-[0.4em] text-earth-500 dark:text-[#AFA79B]">{fav.type}</p>
								<h4 className="mt-3 text-xl font-serif font-semibold text-earth-900 dark:text-[#F4EFE6]">{fav.title}</h4>
								<p className="text-sm text-earth-600 dark:text-[#CFC7BB]">{fav.durationMinutes} mins</p>
								{fav.isPremium && membershipTier === "free" && (
									<span className="mt-3 inline-flex rounded-full border border-gold-200 bg-gold-50 px-3 py-1 text-xs uppercase tracking-[0.3em] text-gold-700">
										Premium
									</span>
								)}
							</button>
						))}
					</div>
				) : (
					<div className="mt-6">
						<NoFavorites />
					</div>
				)}
			</section>

			<section className={`${glassCard}`}>
				<div className="flex flex-wrap items-center justify-between gap-3">
					<div>
						<p className="text-xs uppercase tracking-[0.4em] text-earth-500">Recommended</p>
						<h3 className="mt-2 text-2xl font-serif font-semibold text-earth-900">
							Based on this {greeting.toLowerCase()}
						</h3>
					</div>
					<p className="text-sm text-earth-600">Auto-personalized by Mindify AI.</p>
				</div>
				<div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
					{recommendedSessions.map((session) => {
						const locked = session.isPremium && membershipTier === "free";
						return (
							<div
								key={session.id}
								className={`relative overflow-hidden rounded-3xl border border-sage-100 bg-cream-50 p-5 shadow-card transition dark:border-white/10 dark:bg-[#13151A] ${
									locked ? "opacity-70" : "hover:-translate-y-1 hover:shadow-hover"
								}`}
							>
								<p className="text-xs uppercase tracking-[0.3em] text-earth-500">
									{session.type} • {session.timeOfDay}
								</p>
								<h4 className="mt-3 text-xl font-serif font-semibold text-earth-900">{session.title}</h4>
								<p className="text-sm text-earth-600">{session.durationMinutes} mins</p>
								<button
									type="button"
									disabled={locked}
									onClick={() => handlePlay(session.id, session.title)}
									className={`mt-4 rounded-full border px-4 py-2 text-xs uppercase tracking-[0.3em] ${
										locked
											? "border-sage-100 text-earth-500"
											: "border-sage-200 text-sage-700 hover:bg-sage-50"
									}`}
								>
									{locked ? "Upgrade to unlock" : "Start"}
								</button>
								{locked && (
									<span className="absolute right-4 top-4 rounded-full border border-gold-200 bg-gold-50 px-3 py-1 text-xs uppercase tracking-[0.3em] text-gold-700">
										Premium
									</span>
								)}
							</div>
						);
					})}
				</div>
			</section>
		</div>
	);
}

function formatRelativeTime(timestamp: string) {
	const diffMs = Date.now() - new Date(timestamp).getTime();
	const minutes = Math.floor(diffMs / (1000 * 60));
	if (minutes < 60) return `${minutes}m ago`;
	const hours = Math.floor(minutes / 60);
	if (hours < 24) return `${hours}h ago`;
	const days = Math.floor(hours / 24);
	return `${days}d ago`;
}
