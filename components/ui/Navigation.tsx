"use client";

import { useMemo, useState } from "react";
import { useAppStore } from "@/lib/stores/appStore";
import { motion, AnimatePresence } from "framer-motion";

const NAV_ITEMS = [
	{ icon: "🏠", label: "Dashboard", section: "dashboard", href: "/dashboard" },
	{ icon: "🧘", label: "Meditations", section: "meditations", href: "/meditations" },
	{ icon: "💫", label: "Hypnosis", section: "hypnosis", href: "/hypnosis" },
	{ icon: "📊", label: "Programs", section: "programs", href: "/programs" },
	{ icon: "⚡", label: "Quick Resets", section: "quick-resets", href: "/quick-resets" },
	{ icon: "📚", label: "Knowledge", section: "knowledge-hub", href: "/knowledge" },
	{ icon: "👥", label: "Community", section: "community", href: "/community" },
] as const;

interface NavigationProps {
	streakDays: number;
	membershipTier: "premium" | "free";
}

export function Navigation({ streakDays, membershipTier }: NavigationProps) {
	const [isExpanded, setIsExpanded] = useState(false);
	const navSelection = useAppStore((state) => state.navSelection);
	const setNavSelection = useAppStore((state) => state.setNavSelection);

	const tiersCopy = useMemo(
		() =>
			membershipTier === "premium"
				? "You're enjoying the full Mindify studio experience."
				: "Unlock the full meditation library, hypnosis vault, and live sessions.",
		[membershipTier],
	);

	return (
		<div
			className="space-y-6 text-earth-700 dark:text-[#D9D3C8]"
			onMouseEnter={() => setIsExpanded(true)}
			onMouseLeave={() => setIsExpanded(false)}
		>
			<nav className="space-y-2">
				{NAV_ITEMS.map((item) => {
					const isActive = navSelection === item.section;
					return (
						<button
							type="button"
							key={item.section}
							onClick={() => setNavSelection(item.section)}
							className={`w-full rounded-xl px-4 py-3 text-left text-sm font-medium transition-all duration-200 flex items-center ${
								isActive
									? "bg-gradient-card text-sage-700 shadow-soft dark:text-[#F4EFE6]"
									: "text-earth-600 hover:bg-cream-100 dark:text-[#BFB6A8] dark:hover:bg-white/5"
							}`}
						>
							<span className="text-xl flex-shrink-0">{item.icon}</span>
							<AnimatePresence>
								{isExpanded && (
									<motion.span
										initial={{ opacity: 0, width: 0, marginLeft: 0 }}
										animate={{ opacity: 1, width: "auto", marginLeft: 12 }}
										exit={{ opacity: 0, width: 0, marginLeft: 0 }}
										transition={{ duration: 0.2 }}
										className="whitespace-nowrap overflow-hidden"
									>
										{item.label}
									</motion.span>
								)}
							</AnimatePresence>
						</button>
					);
				})}
			</nav>

			<AnimatePresence>
				{isExpanded && (
					<motion.div
						initial={{ opacity: 0, height: 0 }}
						animate={{ opacity: 1, height: "auto" }}
						exit={{ opacity: 0, height: 0 }}
						transition={{ duration: 0.2 }}
						className="rounded-2xl border border-sage-100 bg-cream-50 p-4 shadow-card dark:border-white/10 dark:bg-[#111317] overflow-hidden"
					>
						<div className="flex items-center justify-between text-sm text-earth-600 dark:text-[#CFC7BB]">
							<span>🔥 Streak</span>
							<span className="font-semibold text-earth-900 dark:text-[#F4EFE6]">{streakDays} days</span>
						</div>
						<p className="mt-3 text-xs leading-relaxed text-earth-500 dark:text-[#AFA79B]">{tiersCopy}</p>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}
