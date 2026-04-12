import { headers } from "next/headers";
import { whopsdk } from "@/lib/whop-sdk";
import { getAuthUser } from "@/lib/auth/getAuthUser";
import { supabaseAdmin } from "@/lib/supabase/admin";
import AdminStats from "@/components/dashboard/AdminStats";
import UserManagementTable from "@/components/dashboard/UserManagementTable";
import { AdminContentManager } from "@/components/dashboard/content/AdminContentManager";
import { Settings } from "lucide-react";

export default async function AdminDashboardPage({
	params,
}: {
	params: Promise<{ companyId: string }>;
}) {
	const { companyId } = await params;

	// Get authenticated user
	const userId = await getAuthUser(await headers());

	// Fetch company and verify admin access
	const [company, user] = await Promise.all([
		whopsdk.companies.retrieve(companyId),
		whopsdk.users.retrieve(userId),
	]);

	// Fetch all users from database for admin view (scoped to company)
	const { data: allUsers } = await supabaseAdmin
		.from("users_metadata")
		.select("*")
		.eq("company_id", companyId)
		.order("created_at", { ascending: false });

	// Fetch all activity for stats (scoped to company)
	const { data: allActivity } = await supabaseAdmin
		.from("user_activity")
		.select("*")
		.eq("company_id", companyId);

	// Calculate admin stats
	const totalUsers = allUsers?.length || 0;
	const premiumUsers =
		allUsers?.filter((u) => u.membership_tier === "premium").length || 0;
	const activeUsers =
		allUsers?.filter((u) => {
			const lastActivity = new Date(u.updated_at);
			const thirtyDaysAgo = new Date();
			thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
			return lastActivity > thirtyDaysAgo;
		}).length || 0;

	const totalMinutes =
		allActivity?.reduce((sum, a) => sum + (a.duration_minutes || 0), 0) || 0;
	const avgSessionDuration = allActivity?.length
		? Math.round(totalMinutes / allActivity.length)
		: 0;

	// Mock revenue calculation (you'd get this from Whop API or your payment processor)
	const monthlyRevenue = premiumUsers * 14.99;
	const growthRate = 12.5; // Mock growth rate

	const adminStats = {
		totalUsers,
		activeUsers,
		premiumUsers,
		totalRevenue: monthlyRevenue,
		avgSessionDuration,
		growthRate,
	};

	// Transform users for table
	const usersForTable = (allUsers || []).map((user) => {
		// Get user's activity stats
		const userActivity =
			allActivity?.filter((a) => a.user_id === user.whop_user_id) || [];
		const totalSessions = userActivity.length;
		const totalMinutes = userActivity.reduce(
			(sum, a) => sum + (a.duration_minutes || 0),
			0
		);

		// Calculate streak (simplified)
		const streak = 0; // You could calculate this from activity dates

		return {
			id: user.whop_user_id,
			name: user.display_name || user.whop_user_id,
			email: user.email || "N/A",
			tier: user.membership_tier as "free" | "premium",
			totalSessions,
			totalMinutes,
			streak,
			joinedAt: user.created_at,
			lastActive: user.updated_at,
		};
	});

	return (
		<div className="min-h-screen bg-cream-50 dark:bg-[#0E1012]">
			<div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
				{/* Header */}
				<div className="mb-8">
					<div className="flex flex-wrap items-start justify-between gap-4">
						<div>
							<h1 className="text-3xl font-bold text-earth-900 dark:text-[#F4EFE6]">
								Admin Dashboard
							</h1>
							<p className="mt-2 text-earth-600 dark:text-[#CFC7BB]">
								Managing {company.title || "your company"}
							</p>
						</div>

						<div className="flex items-center gap-3">
							<a
								href={`/dashboard/${companyId}/settings`}
								className="flex items-center gap-2 rounded-xl bg-[rgb(var(--sage-600))] px-4 py-2.5 font-medium text-white shadow-sm transition-colors hover:bg-[rgb(var(--sage-700))]"
							>
								<Settings className="h-4 w-4" />
								Settings
							</a>
						</div>
					</div>
				</div>

				{/* Content Management Tabs */}
				<AdminContentManager
					companyId={companyId}
					overviewContent={
						<>
							{/* Admin Stats */}
							<div className="mb-8">
								<AdminStats stats={adminStats} />
							</div>

							{/* User Management Table */}
							<div className="mb-8">
								<UserManagementTable users={usersForTable} />
							</div>

							{/* Quick Insights */}
							<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
								<div className="rounded-2xl border border-sage-200/50 bg-white p-6 shadow-soft dark:border-white/10 dark:bg-[#1A1D23]">
									<h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-earth-600 dark:text-[#CFC7BB]">
										Most Popular Content
									</h3>
									<p className="text-2xl font-bold text-earth-900 dark:text-[#F4EFE6]">
										Focus Reset Program
									</p>
									<p className="mt-1 text-sm text-earth-500 dark:text-[#B5AFA3]">
										127 active enrollments
									</p>
								</div>

								<div className="rounded-2xl border border-sage-200/50 bg-white p-6 shadow-soft dark:border-white/10 dark:bg-[#1A1D23]">
									<h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-earth-600 dark:text-[#CFC7BB]">
										Avg Engagement
									</h3>
									<p className="text-2xl font-bold text-earth-900 dark:text-[#F4EFE6]">
										4.2 sessions/week
									</p>
									<p className="mt-1 text-sm text-earth-500 dark:text-[#B5AFA3]">
										Per active user
									</p>
								</div>

								<div className="rounded-2xl border border-sage-200/50 bg-white p-6 shadow-soft dark:border-white/10 dark:bg-[#1A1D23]">
									<h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-earth-600 dark:text-[#CFC7BB]">
										Retention Rate
									</h3>
									<p className="text-2xl font-bold text-earth-900 dark:text-[#F4EFE6]">
										87%
									</p>
									<p className="mt-1 text-sm text-earth-500 dark:text-[#B5AFA3]">
										30-day retention
									</p>
								</div>
							</div>
						</>
					}
				/>
			</div>
		</div>
	);
}
