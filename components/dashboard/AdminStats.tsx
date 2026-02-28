"use client";

import { Users, TrendingUp, Activity, DollarSign } from "lucide-react";
import { motion } from "framer-motion";

export interface AdminStatsData {
	totalUsers: number;
	activeUsers: number;
	premiumUsers: number;
	totalRevenue: number;
	avgSessionDuration: number;
	growthRate: number;
}

interface AdminStatsProps {
	stats: AdminStatsData;
}

function StatCard({
	icon,
	label,
	value,
	subtitle,
	index,
}: {
	icon: React.ReactNode;
	label: string;
	value: string | number;
	subtitle?: string;
	index: number;
}) {
	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.4, delay: index * 0.1 }}
			className="group relative overflow-hidden rounded-2xl border border-sage-200/50 bg-gradient-to-br from-white to-cream-100 p-6 shadow-soft transition-all hover:shadow-medium dark:border-white/10 dark:from-[#1A1D23] dark:to-[#14171C]"
		>
			<div className="absolute inset-0 bg-gradient-to-br from-sage-400/0 via-sage-400/0 to-sage-400/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:from-sage-300/0 dark:via-sage-300/0 dark:to-sage-300/5" />

			<div className="relative flex items-start justify-between">
				<div className="flex-1">
					<p className="text-sm font-medium text-earth-600 dark:text-[#CFC7BB]">
						{label}
					</p>
					<p className="mt-2 text-3xl font-bold text-earth-900 dark:text-[#F4EFE6]">
						{value}
					</p>
					{subtitle && (
						<p className="mt-1 text-xs text-earth-500 dark:text-[#B5AFA3]">
							{subtitle}
						</p>
					)}
				</div>

				<div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sage-100 text-sage-600 transition-colors group-hover:bg-sage-200 dark:bg-sage-900/30 dark:text-sage-400">
					{icon}
				</div>
			</div>
		</motion.div>
	);
}

export default function AdminStats({ stats }: AdminStatsProps) {
	const statsConfig = [
		{
			icon: <Users className="h-6 w-6" />,
			label: "Total Users",
			value: stats.totalUsers.toLocaleString(),
			subtitle: `${stats.activeUsers} active this month`,
		},
		{
			icon: <TrendingUp className="h-6 w-6" />,
			label: "Premium Members",
			value: stats.premiumUsers.toLocaleString(),
			subtitle: `${Math.round((stats.premiumUsers / stats.totalUsers) * 100)}% conversion`,
		},
		{
			icon: <DollarSign className="h-6 w-6" />,
			label: "Monthly Revenue",
			value: `$${stats.totalRevenue.toLocaleString()}`,
			subtitle: `${stats.growthRate >= 0 ? "+" : ""}${stats.growthRate}% vs last month`,
		},
		{
			icon: <Activity className="h-6 w-6" />,
			label: "Avg Session",
			value: `${stats.avgSessionDuration} min`,
			subtitle: "Per user per session",
		},
	];

	return (
		<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
			{statsConfig.map((stat, index) => (
				<StatCard key={stat.label} {...stat} index={index} />
			))}
		</div>
	);
}
