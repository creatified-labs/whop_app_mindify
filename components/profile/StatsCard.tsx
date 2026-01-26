"use client";

import { motion } from "framer-motion";
import { Flame, Clock, CheckCircle, Trophy, Heart, Calendar } from "lucide-react";

export interface UserStats {
	streakDays: number;
	totalMinutes: number;
	completedMeditations: number;
	completedHypnosis: number;
	completedPrograms: number;
	favoritesCount: number;
	memberSince: string;
}

interface StatsCardProps {
	stats: UserStats;
}

const statItems = [
	{
		icon: Flame,
		label: "Current Streak",
		getValue: (stats: UserStats) => `${stats.streakDays} days`,
		color: "text-orange-500 dark:text-orange-400",
		bgColor: "bg-orange-50 dark:bg-orange-900/20",
	},
	{
		icon: Clock,
		label: "Total Minutes",
		getValue: (stats: UserStats) => `${stats.totalMinutes}m`,
		color: "text-purple-500 dark:text-purple-400",
		bgColor: "bg-purple-50 dark:bg-purple-900/20",
	},
	{
		icon: CheckCircle,
		label: "Meditations",
		getValue: (stats: UserStats) => stats.completedMeditations.toString(),
		color: "text-sage-600 dark:text-sage-400",
		bgColor: "bg-sage-50 dark:bg-sage-900/20",
	},
	{
		icon: Trophy,
		label: "Hypnosis Sessions",
		getValue: (stats: UserStats) => stats.completedHypnosis.toString(),
		color: "text-gold-600 dark:text-gold-400",
		bgColor: "bg-gold-50 dark:bg-gold-900/20",
	},
	{
		icon: Heart,
		label: "Favorites",
		getValue: (stats: UserStats) => stats.favoritesCount.toString(),
		color: "text-red-500 dark:text-red-400",
		bgColor: "bg-red-50 dark:bg-red-900/20",
	},
	{
		icon: Calendar,
		label: "Member Since",
		getValue: (stats: UserStats) => new Date(stats.memberSince).toLocaleDateString("en-US", { month: "short", year: "numeric" }),
		color: "text-earth-600 dark:text-earth-400",
		bgColor: "bg-earth-50 dark:bg-earth-900/20",
	},
];

export function StatsCard({ stats }: StatsCardProps) {
	return (
		<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
			{statItems.map((item, index) => {
				const Icon = item.icon;
				return (
					<motion.div
						key={item.label}
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: index * 0.05 }}
						className="rounded-3xl border border-sage-100 bg-cream-50 p-6 shadow-card dark:border-white/10 dark:bg-[#13151A]"
					>
						<div className={`inline-flex rounded-2xl p-3 ${item.bgColor}`}>
							<Icon className={`h-6 w-6 ${item.color}`} />
						</div>
						<p className="mt-4 text-3xl font-serif font-semibold text-earth-900 dark:text-[#F4EFE6]">
							{item.getValue(stats)}
						</p>
						<p className="mt-1 text-sm text-earth-600 dark:text-[#CFC7BB]">{item.label}</p>
					</motion.div>
				);
			})}
		</div>
	);
}
