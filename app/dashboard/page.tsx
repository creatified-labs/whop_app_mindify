import { headers } from "next/headers";
import { whopsdk } from "@/lib/whop-sdk";
import { getAuthUser } from "@/lib/auth/getAuthUser";
import { getActivityStats, getUserActivity } from "@/lib/database/activityService";
import { getAllProgramProgress } from "@/lib/database/programService";
import { PROGRAMS_LIBRARY } from "@/lib/mockData/programs";
import DashboardStats from "@/components/dashboard/DashboardStats";
import ActivePrograms from "@/components/dashboard/ActivePrograms";
import RecentActivity from "@/components/dashboard/RecentActivity";
import QuickActions from "@/components/dashboard/QuickActions";
import { WelcomeSection } from "@/components/dashboard/WelcomeSection";
import { getSettings } from "@/lib/database/settingsService";

export default async function UserDashboardPage() {
	// Get authenticated user
	const userId = await getAuthUser(await headers());

	// Fetch user data from Whop
	const user = await whopsdk.users.retrieve(userId);

	const displayName = user.name || `@${user.username}`;

	// Calculate time of day
	const hour = new Date().getHours();
	const timeOfDay = hour < 12 ? "morning" : hour < 18 ? "afternoon" : "evening";

	// Fetch user stats and activity from database
	const [statsResult, programsResult, activityResult, settingsResult] = await Promise.all([
		getActivityStats(userId),
		getAllProgramProgress(userId),
		getUserActivity(userId, { limit: 10 }),
		getSettings(),
	]);

	// Calculate stats
	const stats = {
		totalMinutes: statsResult.data?.totalMinutesMeditated || 0,
		streak: statsResult.data?.streakDays || 0,
		completions: statsResult.data?.totalSessions || 0,
		programsEnrolled: programsResult.data?.length || 0,
	};

	// Get active programs with details
	const activePrograms = (programsResult.data || [])
		.map((progress) => {
			const program = PROGRAMS_LIBRARY.find((p) => p.id === progress.programId);
			return program ? { program, progress } : null;
		})
		.filter((item): item is NonNullable<typeof item> => item !== null)
		.filter((item) => !item.progress.completedAt); // Only show incomplete programs

	// Format recent activity
	const recentActivity = (activityResult.data || []).map((activity) => ({
		id: activity.id || `${activity.content_id}-${activity.completed_at}`,
		type: activity.activity_type as "meditation" | "hypnosis" | "reset" | "program_day",
		title: (activity.metadata?.title as string) || activity.content_id,
		duration: activity.duration_minutes || undefined,
		completedAt: activity.completed_at,
	}));

	return (
		<div className="min-h-screen bg-cream-50 dark:bg-[#0E1012]">
			<div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
				{/* Welcome Section */}
				<div className="mb-8">
					<WelcomeSection userName={displayName} timeOfDay={timeOfDay} welcomeMessage={settingsResult.data?.welcomeMessage} />
				</div>

				{/* Stats Cards */}
				<div className="mb-8">
					<DashboardStats stats={stats} />
				</div>

				{/* Quick Actions */}
				<div className="mb-8">
					<h2 className="mb-4 text-xl font-semibold text-earth-900 dark:text-[#F4EFE6]">
						Quick Actions
					</h2>
					<QuickActions />
				</div>

				{/* Main Content Grid */}
				<div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
					{/* Active Programs - Takes 2 columns on large screens */}
					<div className="lg:col-span-2">
						<h2 className="mb-4 text-xl font-semibold text-earth-900 dark:text-[#F4EFE6]">
							Active Programs
						</h2>
						<ActivePrograms programs={activePrograms} />
					</div>

					{/* Recent Activity - Takes 1 column on large screens */}
					<div className="lg:col-span-1">
						<h2 className="mb-4 text-xl font-semibold text-earth-900 dark:text-[#F4EFE6]">
							Recent Activity
						</h2>
						<RecentActivity activities={recentActivity} />
					</div>
				</div>

				{/* Motivation Section */}
				{stats.completions === 0 && (
					<div className="mt-8 rounded-2xl border border-sage-300 bg-gradient-to-br from-sage-50 to-cream-50 p-8 text-center dark:border-white/10 dark:from-[#1A1D23] dark:to-[#14171C]">
						<h3 className="mb-2 text-2xl font-semibold text-earth-900 dark:text-[#F4EFE6]">
							Ready to begin your journey?
						</h3>
						<p className="mb-6 text-earth-600 dark:text-[#CFC7BB]">
							Start with a quick 5-minute meditation or dive into a transformation
							program
						</p>
						<div className="flex flex-wrap justify-center gap-4">
							<a
								href="/meditation"
								className="rounded-xl bg-sage-600 px-6 py-3 font-medium text-white transition-colors hover:bg-sage-700 dark:bg-sage-500 dark:hover:bg-sage-600"
							>
								Start Meditating
							</a>
							<a
								href="/programs"
								className="rounded-xl border-2 border-sage-600 px-6 py-3 font-medium text-sage-700 transition-colors hover:bg-sage-50 dark:border-sage-400 dark:text-sage-400 dark:hover:bg-sage-900/30"
							>
								Browse Programs
							</a>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
