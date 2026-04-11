"use client";

import { Component, useEffect, useMemo, type ReactNode } from "react";
import { useAppStore, type NavSection } from "@/lib/stores/appStore";
import { useAudioStore } from "@/lib/stores/audioStore";
import type { UserProgress, Meditation, HypnosisSession, QuickReset, Program, ProgramProgress } from "@/lib/types";
import { Flame } from "lucide-react";
import { NoFavorites, NoActivity, NoPrograms } from "@/components/ui/EmptyState";
import { InlineErrorBoundaryFallback } from "@/components/ui/ErrorState";
import { MeditationGrid } from "@/components/meditation/MeditationGrid";
import { HypnosisStack } from "@/components/hypnosis/HypnosisStack";
import { ProgramsLibrary } from "@/components/programs/ProgramsLibrary";
import { QuickResetsList } from "@/components/quick-resets/QuickResetsList";
import { KnowledgeHub } from "@/components/knowledge/KnowledgeHub";
import { HorizontalStrip } from "@/components/ui/HorizontalStrip";
import { FeaturedProgramCard } from "@/components/ui/FeaturedProgramCard";
import { FeaturedContentCard } from "@/components/ui/FeaturedContentCard";
import { FavoriteButton } from "@/components/ui/FavoriteButton";
import { useFavoritesStore } from "@/lib/stores/favoritesStore";
import {
	interpolate,
	splitOnVariable,
	type ExperienceCopy,
	type ExperienceSections,
} from "@/lib/ui/experienceCopy";

class SectionErrorBoundary extends Component<
	{ children: ReactNode },
	{ error: Error | null }
> {
	state: { error: Error | null } = { error: null };
	static getDerivedStateFromError(error: Error) {
		return { error };
	}
	componentDidCatch(error: Error) {
		console.error("[Mindify] Section render error:", error);
	}
	render() {
		if (this.state.error) {
			return (
				<InlineErrorBoundaryFallback
					error={this.state.error}
					reset={() => this.setState({ error: null })}
				/>
			);
		}
		return this.props.children;
	}
}

type SessionType = "meditation" | "hypnosis" | "program" | "reset";

export interface ContinueSession {
	id: string;
	title: string;
	type: SessionType;
	progressPercent: number;
	durationMinutes: number;
	audioUrl?: string;
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
	audioUrl?: string;
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
	audioUrl?: string;
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
	companyId: string;
	meditations?: Meditation[];
	hypnosisSessions?: HypnosisSession[];
	quickResets?: QuickReset[];
	programs?: Program[];
	programProgress?: ProgramProgress[];
	experienceCopy: ExperienceCopy;
	experienceSections: ExperienceSections;
}

const glassCard =
	"rounded-4xl border border-[rgb(var(--sage-100))] bg-white p-6 text-[rgb(var(--earth-900))] shadow-card dark:border-white/10 dark:bg-[#13151A] dark:text-[#F4EFE6]";

export function ExperienceContent(props: DashboardViewProps) {
	const navSelection = useAppStore((state) => state.navSelection);
	const setCompanyId = useAppStore((state) => state.setCompanyId);
	const storedCompanyId = useAppStore((state) => state.companyId);
	const initializeFavorites = useFavoritesStore((state) => state.initialize);

	useEffect(() => {
		if (props.companyId && props.companyId !== storedCompanyId) {
			setCompanyId(props.companyId);
		}
	}, [props.companyId, storedCompanyId, setCompanyId]);

	useEffect(() => {
		if (props.companyId) {
			initializeFavorites(props.companyId);
		}
	}, [props.companyId, initializeFavorites]);

	if (navSelection === "dashboard") {
		return <DashboardView {...props} />;
	}

	if (navSelection === "meditations") return <SectionErrorBoundary><MeditationGrid meditations={props.meditations} /></SectionErrorBoundary>;
	if (navSelection === "hypnosis") return <SectionErrorBoundary><HypnosisStack hypnosisSessions={props.hypnosisSessions} /></SectionErrorBoundary>;
	if (navSelection === "programs") return <SectionErrorBoundary><ProgramsLibrary companyId={props.companyId} programProgress={props.programProgress} /></SectionErrorBoundary>;
	if (navSelection === "quick-resets") return <SectionErrorBoundary><QuickResetsList companyId={props.companyId} /></SectionErrorBoundary>;
	if (navSelection === "knowledge-hub") return <SectionErrorBoundary><KnowledgeHub companyId={props.companyId} /></SectionErrorBoundary>;

	return (
		<div className={`${glassCard} min-h-[420px]`}>
			<p className="text-xs uppercase tracking-[0.4em] text-[rgb(var(--earth-500))]">
				{navSelection.replace("-", " ")}
			</p>
			<h2 className="mt-6 text-4xl font-serif font-semibold text-[rgb(var(--earth-900))]">
				Community drops coming soon
			</h2>
			<p className="mt-4 max-w-2xl text-base leading-relaxed text-[rgb(var(--earth-600))]">
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
	companyId,
	meditations,
	hypnosisSessions,
	quickResets,
	programs,
	experienceCopy,
	experienceSections,
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

	const handlePlay = (trackId: string, trackTitle: string, audioUrl?: string, trackType: "meditation" | "hypnosis" | "reset" | "program" = "meditation") => {
		if (!audioUrl) return;
		playTrack({
			id: trackId,
			title: trackTitle,
			audioUrl,
			trackType,
		});
	};

	const [welcomeBeforeName, welcomeAfterName] = splitOnVariable(
		experienceCopy.welcomeHeadingTemplate,
		"name",
	);
	const welcomeEyebrow = interpolate(experienceCopy.welcomeEyebrowTemplate, {
		timeOfDay: greeting,
		tier: membershipTier,
	});

	return (
		<div className="space-y-6">
			<section className={`${glassCard} grid gap-6 lg:grid-cols-[1.1fr_0.9fr]`}>
				<div className="space-y-6">
					<div>
						<p className="text-xs uppercase tracking-[0.4em] text-[rgb(var(--earth-500))]">
							{welcomeEyebrow}
						</p>
						<h2 className="mt-2 text-4xl font-serif font-semibold text-[rgb(var(--earth-900))]">
							{welcomeBeforeName}
							<span className="text-[rgb(var(--sage-600))]">{userName}</span>
							{welcomeAfterName}
						</h2>
						<p className="mt-2 max-w-2xl text-base leading-relaxed text-[rgb(var(--earth-600))]">
							{experienceCopy.welcomeBody}
						</p>
					</div>
					{experienceSections.continueRitual && continueSession && (
						<div className="rounded-3xl border border-[rgb(var(--sage-100))] bg-[rgb(var(--cream-50))] p-5 dark:border-white/10 dark:bg-[#111318]">
							<div className="flex flex-wrap items-center justify-between gap-4 text-sm text-[rgb(var(--earth-600))] dark:text-[#CFC7BB]">
								<p className="uppercase tracking-[0.3em] text-[rgb(var(--earth-500))]">
									{experienceCopy.continueRitualLabel}
								</p>
								<p className="font-medium text-[rgb(var(--earth-700))] dark:text-[#E2DBCF]">
									{continueSession.durationMinutes} mins • {continueSession.type}
								</p>
							</div>
							<h3 className="mt-3 text-2xl font-semibold text-[rgb(var(--earth-900))] dark:text-[#F4EFE6]">
								{continueSession.title}
							</h3>
							<div className="mt-4 h-2 w-full rounded-full bg-[rgb(var(--sage-100))]">
								<div
									className="h-full rounded-full bg-gradient-sage"
									style={{ width: `${continueSession.progressPercent}%` }}
								/>
							</div>
							<div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-[rgb(var(--earth-600))] dark:text-[#CFC7BB]">
								<span className="font-medium">{continueSession.progressPercent}% complete</span>
								<button
									type="button"
									onClick={() => handlePlay(continueSession.id, continueSession.title, continueSession.audioUrl, continueSession.type)}
									className="rounded-full border border-[rgb(var(--sage-200))] px-4 py-2 text-xs uppercase tracking-[0.3em] text-[rgb(var(--sage-700))] hover:bg-[rgb(var(--sage-50))] dark:border-white/10 dark:text-[#E2DBCF] dark:hover:bg-white/10"
								>
									Play
								</button>
							</div>
						</div>
					)}
				</div>
				{experienceSections.dailyStreak && (
					<div className="space-y-4 rounded-3xl border border-[rgb(var(--sage-100))] bg-[rgb(var(--cream-50))] p-6 dark:border-white/10 dark:bg-[#111318]">
						<p className="text-xs uppercase tracking-[0.4em] text-[rgb(var(--earth-500))] dark:text-[#AFA79B]">
							{experienceCopy.dailyStreakEyebrow}
						</p>
						<p className="flex items-center gap-2 text-5xl font-semibold text-[rgb(var(--earth-900))] dark:text-[#F4EFE6]"><Flame className="h-6 w-6" /> {streakDays}</p>
						<p className="text-sm text-[rgb(var(--earth-600))] dark:text-[#CFC7BB]">
							{experienceCopy.dailyStreakBody}
						</p>
						<div className="rounded-2xl border border-[rgb(var(--sage-100))] bg-[rgb(var(--cream-50))] p-4 text-sm dark:border-white/10 dark:bg-[#151821]">
							<p className="text-[rgb(var(--earth-500))] dark:text-[#AFA79B]">
								{experienceCopy.dailyStreakMinutesLabel}
							</p>
							<p className="text-3xl font-semibold text-[rgb(var(--earth-900))] dark:text-[#F4EFE6]">
								{userProgress?.totalMinutesMeditated ?? 0}m
							</p>
						</div>
					</div>
				)}
			</section>

			<section className="grid gap-6 lg:grid-cols-2">
				{experienceSections.currentProgram &&
					(currentProgram ? (
						<div className={`${glassCard}`}>
							<p className="text-xs uppercase tracking-[0.4em] text-[rgb(var(--earth-500))]">
								{experienceCopy.currentProgramLabel}
							</p>
							<h3 className="mt-2 text-3xl font-serif font-semibold text-[rgb(var(--earth-900))]">{currentProgram.title}</h3>
							<div className="mt-4 h-2 w-full rounded-full bg-[rgb(var(--sage-100))]">
								<div
									className="h-full rounded-full bg-gradient-sage"
									style={{ width: `${currentProgram.progressPercent}%` }}
								/>
							</div>
							<p className="mt-3 text-sm text-[rgb(var(--earth-600))]">
								Next milestone: {currentProgram.nextMilestone}
							</p>
							{!currentProgram.isPremium && membershipTier === "free" && (
								<p className="mt-3 inline-flex rounded-full border border-[rgb(var(--gold-200))] bg-[rgb(var(--gold-50))] px-4 py-1 text-xs uppercase tracking-[0.3em] text-[rgb(var(--gold-700))]">
									Premium Preview
								</p>
							)}
						</div>
					) : programs && programs.length > 0 ? (
						<div className={`${glassCard}`}>
							<p className="text-xs uppercase tracking-[0.4em] text-[rgb(var(--earth-500))] dark:text-[#AFA79B]">
								{experienceCopy.featuredProgramsLabel}
							</p>
							<h3 className="mt-2 text-2xl font-serif font-semibold text-[rgb(var(--earth-900))] dark:text-[#F4EFE6]">
								{experienceCopy.featuredProgramsHeading}
							</h3>
							<div className="mt-4">
								<HorizontalStrip>
									{programs.slice(0, 4).map((program) => (
										<FeaturedProgramCard
											key={program.id}
											program={program}
											companyId={companyId}
											ctaLabel={experienceCopy.featuredProgramsCTA}
										/>
									))}
								</HorizontalStrip>
							</div>
						</div>
					) : (
						<div className={`${glassCard}`}>
							<NoPrograms />
						</div>
					))}

				{experienceSections.recentActivity && (
				<div className={`${glassCard}`}>
					<p className="text-xs uppercase tracking-[0.4em] text-[rgb(var(--earth-500))] dark:text-[#AFA79B]">
						{experienceCopy.recentActivityLabel}
					</p>
					{recentActivity.length > 0 ? (
						<ul className="mt-4 space-y-4">
							{recentActivity.map((item) => (
								<li key={item.id} className="flex items-center justify-between text-sm text-[rgb(var(--earth-700))] dark:text-[#D9D3C8]">
									<div>
										<p className="font-medium text-[rgb(var(--earth-900))] dark:text-[#F4EFE6]">{item.label}</p>
										<p className="text-[rgb(var(--earth-500))] dark:text-[#AFA79B]">{formatRelativeTime(item.timestamp)}</p>
									</div>
									<span className="rounded-full border border-[rgb(var(--sage-100))] px-3 py-1 text-xs uppercase tracking-[0.3em] text-[rgb(var(--earth-600))] dark:border-white/10 dark:text-[#CFC7BB]">
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
				)}
			</section>

			{experienceSections.favoriteSoundscapes && (
			<section className={`${glassCard}`}>
				<div className="flex flex-wrap items-center justify-between gap-3">
					<div>
						<p className="text-xs uppercase tracking-[0.4em] text-[rgb(var(--earth-500))] dark:text-[#AFA79B]">{experienceCopy.favoritesEyebrow}</p>
						<h3 className="mt-2 text-2xl font-serif font-semibold text-[rgb(var(--earth-900))] dark:text-[#F4EFE6]">{experienceCopy.favoritesHeading}</h3>
					</div>
					{favorites.length > 0 && (
						<p className="text-sm text-[rgb(var(--earth-600))] dark:text-[#CFC7BB]">{experienceCopy.favoritesSubtitle}</p>
					)}
				</div>
				{favorites.length > 0 ? (
					<div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
						{favorites.map((fav) => (
							<div
								key={fav.id}
								onClick={() => handlePlay(fav.id, fav.title, fav.audioUrl, fav.type)}
								onKeyDown={(e) => {
									if (e.key === "Enter" || e.key === " ") {
										e.preventDefault();
										handlePlay(fav.id, fav.title, fav.audioUrl, fav.type);
									}
								}}
								role="button"
								tabIndex={0}
								className="group relative cursor-pointer rounded-3xl border border-[rgb(var(--sage-100))] bg-[rgb(var(--cream-50))] p-4 text-left shadow-card transition hover:-translate-y-1 hover:shadow-hover dark:border-white/10 dark:bg-[#13151A]"
							>
								<FavoriteButton
									contentType={fav.type}
									contentId={fav.id}
									size="sm"
									variant="solid"
									className="absolute right-3 top-3 z-10"
								/>
								<p className="pr-10 text-xs uppercase tracking-[0.4em] text-[rgb(var(--earth-500))] dark:text-[#AFA79B]">{fav.type}</p>
								<h4 className="mt-3 text-xl font-serif font-semibold text-[rgb(var(--earth-900))] dark:text-[#F4EFE6]">{fav.title}</h4>
								<p className="text-sm text-[rgb(var(--earth-600))] dark:text-[#CFC7BB]">{fav.durationMinutes} mins</p>
								{fav.isPremium && membershipTier === "free" && (
									<span className="mt-3 inline-flex rounded-full border border-[rgb(var(--gold-200))] bg-[rgb(var(--gold-50))] px-3 py-1 text-xs uppercase tracking-[0.3em] text-[rgb(var(--gold-700))]">
										Premium
									</span>
								)}
							</div>
						))}
					</div>
				) : (
					<div className="mt-6">
						<NoFavorites />
					</div>
				)}
			</section>
			)}

			{experienceSections.featuredMeditations && meditations && meditations.length > 0 && (
				<section className={`${glassCard}`}>
					<h3 className="text-2xl font-serif font-semibold text-[rgb(var(--earth-900))] dark:text-[#F4EFE6]">
						{experienceCopy.featuredMeditationsLabel}
					</h3>
					<div className="mt-4">
						<HorizontalStrip>
							{meditations.slice(0, 6).map((m) => (
								<FeaturedContentCard
									key={m.id}
									item={{
										id: m.id,
										title: m.title,
										duration: m.duration,
										audioUrl: m.audioUrl,
										type: "meditation",
										isPremium: m.isPremium,
										subtitle: m.category,
									}}
									membershipTier={membershipTier}
								/>
							))}
						</HorizontalStrip>
					</div>
				</section>
			)}

			{experienceSections.featuredHypnosis && hypnosisSessions && hypnosisSessions.length > 0 && (
				<section className={`${glassCard}`}>
					<h3 className="text-2xl font-serif font-semibold text-[rgb(var(--earth-900))] dark:text-[#F4EFE6]">
						{experienceCopy.featuredHypnosisLabel}
					</h3>
					<div className="mt-4">
						<HorizontalStrip>
							{hypnosisSessions.slice(0, 6).map((h) => (
								<FeaturedContentCard
									key={h.id}
									item={{
										id: h.id,
										title: h.title,
										duration: h.duration,
										audioUrl: h.audioUrl,
										type: "hypnosis",
										isPremium: h.isPremium,
										subtitle: h.theme,
									}}
									membershipTier={membershipTier}
								/>
							))}
						</HorizontalStrip>
					</div>
				</section>
			)}

			{experienceSections.featuredQuickResets && quickResets && quickResets.length > 0 && (
				<section className={`${glassCard}`}>
					<h3 className="text-2xl font-serif font-semibold text-[rgb(var(--earth-900))] dark:text-[#F4EFE6]">
						{experienceCopy.featuredQuickResetsLabel}
					</h3>
					<div className="mt-4">
						<HorizontalStrip>
							{quickResets.slice(0, 6).map((r) => (
								<FeaturedContentCard
									key={r.id}
									item={{
										id: r.id,
										title: r.title,
										duration: r.duration,
										audioUrl: r.audioUrl,
										type: "reset",
										subtitle: r.type,
									}}
									membershipTier={membershipTier}
								/>
							))}
						</HorizontalStrip>
					</div>
				</section>
			)}

			{experienceSections.recommended && (
			<section className={`${glassCard}`}>
				<div className="flex flex-wrap items-center justify-between gap-3">
					<div>
						<p className="text-xs uppercase tracking-[0.4em] text-[rgb(var(--earth-500))]">{experienceCopy.recommendedEyebrow}</p>
						<h3 className="mt-2 text-2xl font-serif font-semibold text-[rgb(var(--earth-900))]">
							{interpolate(experienceCopy.recommendedHeadingTemplate, { timeOfDay: greeting.toLowerCase() })}
						</h3>
					</div>
					<p className="text-sm text-[rgb(var(--earth-600))]">{experienceCopy.recommendedFooter}</p>
				</div>
				<div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
					{recommendedSessions.map((session) => {
						const locked = session.isPremium && membershipTier === "free";
						return (
							<div
								key={session.id}
								className={`relative overflow-hidden rounded-3xl border border-[rgb(var(--sage-100))] bg-[rgb(var(--cream-50))] p-5 shadow-card transition dark:border-white/10 dark:bg-[#13151A] ${
									locked ? "opacity-70" : "hover:-translate-y-1 hover:shadow-hover"
								}`}
							>
								<p className="text-xs uppercase tracking-[0.3em] text-[rgb(var(--earth-500))]">
									{session.type} • {session.timeOfDay}
								</p>
								<h4 className="mt-3 text-xl font-serif font-semibold text-[rgb(var(--earth-900))]">{session.title}</h4>
								<p className="text-sm text-[rgb(var(--earth-600))]">{session.durationMinutes} mins</p>
								<button
									type="button"
									disabled={locked}
									onClick={() => handlePlay(session.id, session.title, session.audioUrl, session.type)}
									className={`mt-4 rounded-full border px-4 py-2 text-xs uppercase tracking-[0.3em] ${
										locked
											? "border-[rgb(var(--sage-100))] text-[rgb(var(--earth-500))]"
											: "border-[rgb(var(--sage-200))] text-[rgb(var(--sage-700))] hover:bg-[rgb(var(--sage-50))]"
									}`}
								>
									{locked ? "Upgrade to unlock" : "Start"}
								</button>
								{locked && (
									<span className="absolute right-4 top-4 rounded-full border border-[rgb(var(--gold-200))] bg-[rgb(var(--gold-50))] px-3 py-1 text-xs uppercase tracking-[0.3em] text-[rgb(var(--gold-700))]">
										Premium
									</span>
								)}
							</div>
						);
					})}
				</div>
			</section>
			)}
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
