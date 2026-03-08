import { headers } from "next/headers";
import { whopsdk } from "@/lib/whop-sdk";
import {
	getActivityStats,
	getAllProgramProgress,
	getFavoriteCount,
	getUserMetadata,
	getOrCreateUser,
} from "@/lib/database";
import { ProfilePageClient } from "@/components/profile/ProfilePageClient";
import type { UserStats } from "@/components/profile/StatsCard";

export default async function ProfilePage({
	searchParams,
}: {
	searchParams: Promise<{ company_id?: string }>;
}) {
	const requestHeaders = await headers();
	const { userId } = await whopsdk.verifyUserToken(requestHeaders);
	const resolvedSearchParams = await searchParams;
	const companyId = resolvedSearchParams.company_id || "default";

	// Fetch all data in parallel
	const [whopUser, { data: activityStats }, { data: programProgress }, { count: favoritesCount }] =
		await Promise.all([
			whopsdk.users.retrieve(userId),
			getActivityStats(companyId, userId),
			getAllProgramProgress(companyId, userId),
			getFavoriteCount(companyId, userId),
		]);

	// Ensure user row exists and get metadata
	const displayName = whopUser.name || `@${whopUser.username ?? "member"}`;
	await getOrCreateUser(companyId, userId, { display_name: displayName });
	const { data: userMeta } = await getUserMetadata(companyId, userId);

	const completedPrograms = (programProgress || []).filter((p) => p.completedAt).length;

	const stats: UserStats = {
		streakDays: activityStats?.streakDays ?? 0,
		totalMinutes: activityStats?.totalMinutesMeditated ?? 0,
		completedMeditations: activityStats?.meditationCount ?? 0,
		completedHypnosis: activityStats?.hypnosisCount ?? 0,
		completedPrograms,
		favoritesCount: favoritesCount ?? 0,
		memberSince: userMeta?.created_at ?? new Date().toISOString(),
	};

	const membershipTier = userMeta?.membership_tier === "premium" ? "Premium" : "Free";

	const userData = {
		name: displayName,
		email: (whopUser as any).email || userMeta?.email || null,
		membershipTier,
		memberSince: userMeta?.created_at ?? new Date().toISOString(),
	};

	return <ProfilePageClient userData={userData} stats={stats} />;
}
