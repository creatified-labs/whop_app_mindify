import { headers } from "next/headers";
import { notFound } from "next/navigation";
import {
	type ActivityItem,
	type ContinueSession,
	type FavoriteSession,
	type ProgramSnapshot,
	type RecommendedSession,
	ExperienceContent,
} from "@/components/ui/DashboardView";
import { Flame } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { whopsdk } from "@/lib/whop-sdk";
import type { UserProgress } from "@/lib/types";
import {
	getActivityStats,
	getRecentActivity,
	getUserActivity,
	getFavorites,
	getAllProgramProgress,
	getMeditations,
	getHypnosisSessions,
	getQuickResets,
	getPrograms,
	getProgramById,
} from "@/lib/database";

export default async function ExperiencePage({
	params,
}: {
	params: Promise<{ experienceId?: string }>;
}) {
	const resolvedParams = await params;
	const experienceId = resolvedParams.experienceId?.trim();
	if (!experienceId || experienceId === "undefined") {
		notFound();
	}
	const requestHeaders = await headers();
	const { userId } = await whopsdk.verifyUserToken(requestHeaders);

	const [experience, user, access] = await Promise.all([
		whopsdk.experiences.retrieve(experienceId),
		whopsdk.users.retrieve(userId),
		whopsdk.users.checkAccess(experienceId, { id: userId }),
	]);

	const displayName = user.name || `@${user.username ?? "member"}`;
	const userInitial = displayName.trim().charAt(0).toUpperCase();
	const accessMeta = access as {
		products?: { tier?: string; name?: string }[];
	};

	const membershipTier: "premium" | "free" = accessMeta.products?.some((product) => {
		const label = `${product?.tier ?? ""}${product?.name ?? ""}`.toLowerCase();
		return label.includes("premium") || label.includes("pro");
	})
		? "premium"
		: "free";

	// Fetch all real data in parallel
	const [
		{ data: activityStats },
		{ data: recentActivityRows },
		{ data: allActivity },
		{ data: favoritesRows },
		{ data: programProgressRows },
		{ data: meditations },
		{ data: hypnosisSessions },
		{ data: quickResets },
		{ data: allPrograms },
	] = await Promise.all([
		getActivityStats(userId),
		getRecentActivity(userId, 5),
		getUserActivity(userId),
		getFavorites(userId),
		getAllProgramProgress(userId),
		getMeditations(),
		getHypnosisSessions(),
		getQuickResets(),
		getPrograms(),
	]);

	const streakDays = activityStats?.streakDays ?? 0;

	// --- Build userProgress ---
	const completedMeditationIds = (allActivity || [])
		.filter((a) => a.activity_type === "meditation")
		.map((a) => a.content_id);
	const completedHypnosisIds = (allActivity || [])
		.filter((a) => a.activity_type === "hypnosis")
		.map((a) => a.content_id);

	const userProgress: UserProgress = {
		userId,
		completedMeditations: [...new Set(completedMeditationIds)],
		completedHypnosis: [...new Set(completedHypnosisIds)],
		currentPrograms: (programProgressRows || [])
			.filter((p) => !p.completedAt)
			.map((p) => ({
				programId: p.programId,
				currentDay: p.currentDay,
				startDate: p.enrolledAt,
				completedDays: p.completedDays,
			})),
		totalMinutesMeditated: activityStats?.totalMinutesMeditated ?? 0,
		streakDays,
		lastActivityDate: activityStats?.lastActivityDate ?? new Date().toISOString(),
	};

	// --- Build continueSession (most recent incomplete activity or null) ---
	let continueSession: ContinueSession | null = null;
	if (recentActivityRows && recentActivityRows.length > 0) {
		const lastItem = recentActivityRows[0];
		const typeMap: Record<string, "meditation" | "hypnosis" | "reset" | "program"> = {
			meditation: "meditation",
			hypnosis: "hypnosis",
			reset: "reset",
			program_day: "program",
		};
		// Build a content lookup for titles
		const contentMap = new Map<string, { title: string; duration: number }>();
		for (const m of meditations || []) contentMap.set(m.id, { title: m.title, duration: m.duration });
		for (const h of hypnosisSessions || []) contentMap.set(h.id, { title: h.title, duration: h.duration });
		for (const r of quickResets || []) contentMap.set(r.id, { title: r.title, duration: r.duration });

		const content = contentMap.get(lastItem.content_id);
		if (content) {
			continueSession = {
				id: lastItem.content_id,
				title: content.title,
				type: typeMap[lastItem.activity_type] || "meditation",
				progressPercent: 100, // completed sessions
				durationMinutes: Math.round(content.duration / 60) || lastItem.duration_minutes || 10,
			};
		}
	}

	// --- Build currentProgram ---
	let currentProgram: ProgramSnapshot | null = null;
	const activeProgram = (programProgressRows || []).find((p) => !p.completedAt);
	if (activeProgram) {
		const { data: programData } = await getProgramById(activeProgram.programId);
		if (programData) {
			const totalDays = programData.days?.length || programData.duration || 1;
			const completedCount = activeProgram.completedDays.length;
			currentProgram = {
				programId: activeProgram.programId,
				title: programData.title,
				progressPercent: Math.round((completedCount / totalDays) * 100),
				nextMilestone: `Day ${activeProgram.currentDay}`,
				isPremium: programData.isPremium ?? false,
			};
		}
	}

	// --- Build favorites ---
	const contentMap = new Map<string, { title: string; duration: number; type: "meditation" | "hypnosis" | "program" | "reset" }>();
	for (const m of meditations || []) contentMap.set(m.id, { title: m.title, duration: m.duration, type: "meditation" });
	for (const h of hypnosisSessions || []) contentMap.set(h.id, { title: h.title, duration: h.duration, type: "hypnosis" });
	for (const r of quickResets || []) contentMap.set(r.id, { title: r.title, duration: r.duration, type: "reset" });
	for (const p of allPrograms || []) contentMap.set(p.id, { title: p.title, duration: p.duration, type: "program" });

	const favorites: FavoriteSession[] = (favoritesRows || [])
		.map((fav) => {
			const content = contentMap.get(fav.content_id);
			if (!content) return null;
			return {
				id: fav.content_id,
				title: content.title,
				type: content.type,
				durationMinutes: Math.round(content.duration / 60) || 10,
			};
		})
		.filter((f): f is FavoriteSession => f !== null)
		.slice(0, 6);

	// --- Build recentActivity ---
	const recentActivity: ActivityItem[] = (recentActivityRows || []).map((row, i) => {
		const typeMap: Record<string, "meditation" | "hypnosis" | "reset" | "program"> = {
			meditation: "meditation",
			hypnosis: "hypnosis",
			reset: "reset",
			program_day: "program",
		};
		const content = contentMap.get(row.content_id);
		const typeLabel = row.activity_type === "program_day" ? "program day" : row.activity_type;
		return {
			id: `activity-${i}`,
			label: content ? `Completed ${content.title} ${typeLabel}` : `Completed ${typeLabel} session`,
			timestamp: row.completed_at,
			type: typeMap[row.activity_type] || "meditation",
		};
	});

	// --- Build recommendedSessions (content not yet completed) ---
	const completedIds = new Set((allActivity || []).map((a) => a.content_id));
	const allContent = [
		...(meditations || []).map((m) => ({ id: m.id, title: m.title, type: "meditation" as const, duration: m.duration, isPremium: m.isPremium })),
		...(hypnosisSessions || []).map((h) => ({ id: h.id, title: h.title, type: "hypnosis" as const, duration: h.duration, isPremium: h.isPremium })),
		...(quickResets || []).map((r) => ({ id: r.id, title: r.title, type: "reset" as const, duration: r.duration, isPremium: false })),
	];
	const notCompleted = allContent.filter((c) => !completedIds.has(c.id));
	const recommendedSessions: RecommendedSession[] = notCompleted.slice(0, 3).map((c) => ({
		id: c.id,
		title: c.title,
		type: c.type,
		durationMinutes: Math.round(c.duration / 60) || 10,
		timeOfDay: "anytime",
		isPremium: c.isPremium && membershipTier === "free" ? true : undefined,
	}));

	return (
		<AppLayout
			userName={displayName}
			userInitial={userInitial}
			streakDays={streakDays}
			membershipTier={membershipTier}
			className="bg-gradient-zen"
		>
			<div className="space-y-8">
				<section className="rounded-3xl border border-sage-100 bg-cream-50 p-6 shadow-card dark:border-white/10 dark:bg-[#13151A]">
					<div className="flex flex-wrap items-center justify-between gap-4">
						<div>
							<p className="text-xs uppercase tracking-[0.5em] text-earth-500 dark:text-[#AFA79B]">Mindify Studio</p>
							<h1 className="mt-1 text-2xl font-serif font-semibold text-earth-900 dark:text-[#F4EFE6]">
								{(experience as { slug?: string }).slug ?? experience.name}
							</h1>
							<p className="mt-2 text-sm text-earth-600 dark:text-[#CFC7BB]">
								Personalized nervous system rituals guided by Nicola Smith's methodology.
							</p>
						</div>
						<div className="flex items-center gap-4 text-sm text-earth-600 dark:text-[#CFC7BB]">
							<div className="rounded-2xl border border-sage-100 bg-cream-50 px-4 py-2 text-earth-700 dark:border-white/10 dark:bg-[#111318] dark:text-[#E2DBCF]">
								<Flame className="h-4 w-4 inline" /> {streakDays} day streak
							</div>
							<div className="rounded-2xl border border-sage-100 bg-cream-50 px-4 py-2 text-earth-700 dark:border-white/10 dark:bg-[#111318] dark:text-[#E2DBCF]">
								{favorites.length} favorites
							</div>
						</div>
					</div>
				</section>

				<ExperienceContent
					userName={displayName}
					membershipTier={membershipTier}
					continueSession={continueSession}
					currentProgram={currentProgram}
					favorites={favorites}
					recentActivity={recentActivity}
					recommendedSessions={recommendedSessions}
					streakDays={streakDays}
					userProgress={userProgress}
				/>
			</div>
		</AppLayout>
	);
}
