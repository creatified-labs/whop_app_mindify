"use client";

import { TrendingUp, Flame, Target, Clock } from "lucide-react";
import { motion } from "framer-motion";

export interface DashboardStatsData {
	totalMinutes: number;
	streak: number;
	completions: number;
	programsEnrolled: number;
}

interface StatsCardProps {
	icon: React.ReactNode;
	label: string;
	value: string | number;
	subtitle?: string;
	trend?: "up" | "down" | "neutral";
	index: number;
}

function StatsCard({ icon, label, value, subtitle, trend, index }: StatsCardProps) {
	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.4, delay: index * 0.1 }}
			className="group relative overflow-hidden rounded-2xl border border-sage-200/50 bg-gradient-to-br from-cream-50 to-cream-100 p-6 shadow-sm transition-all hover:shadow-md dark:border-white/10 dark:from-[#1A1D23] dark:to-[#14171C]"
		>
			{/* Gradient overlay on hover */}
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

			{/* Trend indicator */}
			{trend && trend !== "neutral" && (
				<div className="mt-4 flex items-center gap-1">
					<TrendingUp
						className={`h-4 w-4 ${trend === "up" ? "text-sage-600 dark:text-sage-400" : "rotate-180 text-earth-400"}`}
					/>
					<span className="text-xs font-medium text-earth-600 dark:text-[#CFC7BB]">
						{trend === "up" ? "Growing" : "Needs attention"}
					</span>
				</div>
			)}
		</motion.div>
	);
}

interface DashboardStatsProps {
	stats: DashboardStatsData;
	loading?: boolean;
}

export default function DashboardStats({ stats, loading = false }: DashboardStatsProps) {
	if (loading) {
		return (
			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
				{[...Array(4)].map((_, i) => (
					<div
						key={i}
						className="h-32 animate-pulse rounded-2xl bg-cream-200 dark:bg-[#1A1D23]"
					/>
				))}
			</div>
		);
	}

	const statsConfig = [
		{
			icon: <Clock className="h-6 w-6" />,
			label: "Total Minutes",
			value: stats.totalMinutes.toLocaleString(),
			subtitle: "Time spent meditating",
			trend: stats.totalMinutes > 0 ? ("up" as const) : ("neutral" as const),
		},
		{
			icon: <Flame className="h-6 w-6" />,
			label: "Current Streak",
			value: `${stats.streak} days`,
			subtitle: "Keep it going!",
			trend: stats.streak >= 7 ? ("up" as const) : ("neutral" as const),
		},
		{
			icon: <Target className="h-6 w-6" />,
			label: "Sessions",
			value: stats.completions,
			subtitle: "Completed sessions",
			trend: stats.completions > 10 ? ("up" as const) : ("neutral" as const),
		},
		{
			icon: <TrendingUp className="h-6 w-6" />,
			label: "Programs",
			value: stats.programsEnrolled,
			subtitle: "Active programs",
			trend: ("neutral" as const),
		},
	];

	return (
		<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
			{statsConfig.map((stat, index) => (
				<StatsCard key={stat.label} {...stat} index={index} />
			))}
		</div>
	);
}
