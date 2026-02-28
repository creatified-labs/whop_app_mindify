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
		metrics?: {
			streakDays?: number;
			totalMinutes?: number;
			lastActivity?: string;
		};
		recentActivity?: { id: string; type?: string }[];
		programs?: {
			id: string;
			currentDay?: number;
			startedAt?: string;
			completedDays?: number[];
		}[];
	};

	const membershipTier: "premium" | "free" = accessMeta.products?.some((product) => {
		const label = `${product?.tier ?? ""}${product?.name ?? ""}`.toLowerCase();
		return label.includes("premium") || label.includes("pro");
	})
		? "premium"
		: "free";

	const streakDays =
		typeof accessMeta.metrics?.streakDays === "number"
			? Math.max(1, accessMeta.metrics.streakDays)
			: 6;

	const userProgress: UserProgress = {
		userId,
		completedMeditations: accessMeta.recentActivity
			?.filter((item: any) => item?.type === "meditation")
			.map((item: any) => item.id) ?? ["alpha-entrain"],
		completedHypnosis: accessMeta.recentActivity
			?.filter((item: any) => item?.type === "hypnosis")
			.map((item: any) => item.id) ?? ["soma-glow"],
		currentPrograms:
			accessMeta.programs?.map((program) => ({
				programId: program.id,
				currentDay: program.currentDay ?? 1,
				startDate: program.startedAt ?? new Date().toISOString(),
				completedDays: program.completedDays ?? [],
			})) ?? [
				{
					programId: "neuro-leadership",
					currentDay: 5,
					startDate: new Date(Date.now() - 5 * 86400000).toISOString(),
					completedDays: [1, 2, 3, 4],
				},
			],
		totalMinutesMeditated: accessMeta.metrics?.totalMinutes ?? 128,
		streakDays,
		lastActivityDate: accessMeta.metrics?.lastActivity ?? new Date().toISOString(),
	};

	const continueSession: ContinueSession = {
		id: "limbic-release",
		title: "Limbic Release Reset",
		type: "meditation",
		progressPercent: 64,
		durationMinutes: 18,
		moodTag: "overwhelmed",
	};

	const currentProgram: ProgramSnapshot | null =
		membershipTier === "premium"
			? {
					programId: "neuro-leadership",
					title: "NeuroLeadership Reset",
					progressPercent: 48,
					nextMilestone: "Polyvagal mapping practice",
					isPremium: true,
				}
			: null;

	const favorites: FavoriteSession[] = [
		{
			id: "alpha-entrain",
			title: "Alpha Wave Entrainment",
			type: "meditation",
			durationMinutes: 14,
		},
		{
			id: "soma-glow",
			title: "Soma Glow",
			type: "hypnosis",
			durationMinutes: 22,
			isPremium: true,
		},
		{
			id: "team-atrium",
			title: "Team Atrium Ritual",
			type: "program",
			durationMinutes: 30,
		},
		{
			id: "breath-reset",
			title: "Tri-Phase Breath Reset",
			type: "reset",
			durationMinutes: 5,
		},
	];

	const recentActivity: ActivityItem[] = [
		{
			id: "activity-1",
			label: "Completed Chronos Soften meditation",
			timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
			type: "meditation",
		},
		{
			id: "activity-2",
			label: "Logged hypnosis session Soma Glow",
			timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
			type: "hypnosis",
		},
		{
			id: "activity-3",
			label: "Checked in to NeuroLeadership Reset",
			timestamp: new Date(Date.now() - 16 * 60 * 60 * 1000).toISOString(),
			type: "program",
		},
	];

	const recommendedSessions: RecommendedSession[] = [
		{
			id: "aurora-briefing",
			title: "Aurora Briefing",
			type: "hypnosis",
			durationMinutes: 16,
			timeOfDay: "afternoon",
			isPremium: membershipTier === "free",
		},
		{
			id: "oceanic-sync",
			title: "Oceanic Sync",
			type: "meditation",
			durationMinutes: 28,
			timeOfDay: "night",
		},
		{
			id: "focus-spike",
			title: "Focus Spike Pattern Interrupt",
			type: "reset",
			durationMinutes: 4,
			timeOfDay: "anytime",
		},
	];

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
								Personalized nervous system rituals guided by Nicola Smith’s methodology.
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
