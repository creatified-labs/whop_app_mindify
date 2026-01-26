"use client";

import { motion } from "framer-motion";
import { Brain, Sparkles, Wind, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface ActivityItem {
	id: string;
	type: "meditation" | "hypnosis" | "reset" | "program_day";
	title: string;
	duration?: number;
	completedAt: string;
}

interface RecentActivityProps {
	activities: ActivityItem[];
	loading?: boolean;
}

function getActivityIcon(type: ActivityItem["type"]) {
	switch (type) {
		case "meditation":
			return <Brain className="h-5 w-5" />;
		case "hypnosis":
			return <Sparkles className="h-5 w-5" />;
		case "reset":
			return <Wind className="h-5 w-5" />;
		case "program_day":
			return <Clock className="h-5 w-5" />;
		default:
			return <Brain className="h-5 w-5" />;
	}
}

function getActivityColor(type: ActivityItem["type"]) {
	switch (type) {
		case "meditation":
			return "bg-sage-100 text-sage-600 dark:bg-sage-900/30 dark:text-sage-400";
		case "hypnosis":
			return "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400";
		case "reset":
			return "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400";
		case "program_day":
			return "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400";
		default:
			return "bg-sage-100 text-sage-600 dark:bg-sage-900/30 dark:text-sage-400";
	}
}

function getActivityTypeLabel(type: ActivityItem["type"]) {
	switch (type) {
		case "meditation":
			return "Meditation";
		case "hypnosis":
			return "Hypnosis";
		case "reset":
			return "Quick Reset";
		case "program_day":
			return "Program Day";
		default:
			return "Session";
	}
}

export default function RecentActivity({ activities, loading = false }: RecentActivityProps) {
	if (loading) {
		return (
			<div className="space-y-3">
				{[...Array(5)].map((_, i) => (
					<div
						key={i}
						className="h-20 animate-pulse rounded-xl bg-cream-200 dark:bg-[#1A1D23]"
					/>
				))}
			</div>
		);
	}

	if (activities.length === 0) {
		return (
			<div className="rounded-2xl border border-dashed border-sage-300 bg-cream-50 p-8 text-center dark:border-white/10 dark:bg-[#1A1D23]">
				<div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-sage-100 dark:bg-sage-900/30">
					<Clock className="h-8 w-8 text-sage-600 dark:text-sage-400" />
				</div>
				<h3 className="mb-2 text-lg font-semibold text-earth-900 dark:text-[#F4EFE6]">
					No activity yet
				</h3>
				<p className="text-sm text-earth-600 dark:text-[#CFC7BB]">
					Complete your first session to see your activity here
				</p>
			</div>
		);
	}

	return (
		<div className="space-y-3">
			{activities.map((activity, index) => (
				<motion.div
					key={activity.id}
					initial={{ opacity: 0, x: -20 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ duration: 0.3, delay: index * 0.05 }}
					className="group flex items-center gap-4 rounded-xl border border-sage-200/50 bg-cream-50 p-4 transition-all hover:bg-cream-100 dark:border-white/10 dark:bg-[#1A1D23] dark:hover:bg-[#1E2228]"
				>
					{/* Icon */}
					<div
						className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl ${getActivityColor(activity.type)}`}
					>
						{getActivityIcon(activity.type)}
					</div>

					{/* Content */}
					<div className="flex-1 min-w-0">
						<div className="flex items-start justify-between gap-2">
							<div className="flex-1 min-w-0">
								<p className="truncate font-medium text-earth-900 dark:text-[#F4EFE6]">
									{activity.title}
								</p>
								<div className="mt-1 flex items-center gap-2 text-xs text-earth-600 dark:text-[#CFC7BB]">
									<span>{getActivityTypeLabel(activity.type)}</span>
									{activity.duration && (
										<>
											<span>•</span>
											<span>{activity.duration} min</span>
										</>
									)}
								</div>
							</div>
							<span className="flex-shrink-0 text-xs text-earth-500 dark:text-[#B5AFA3]">
								{formatDistanceToNow(new Date(activity.completedAt), {
									addSuffix: true,
								})}
							</span>
						</div>
					</div>
				</motion.div>
			))}
		</div>
	);
}
