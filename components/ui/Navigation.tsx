"use client";

import { useMemo } from "react";
import { useAppStore, type NavSection } from "@/lib/stores/appStore";
import { motion, AnimatePresence } from "framer-motion";
import { Home, Leaf, Sparkles, BarChart3, Zap, BookOpen, Users, Flame, type LucideIcon } from "lucide-react";

const NAV_ITEMS: { icon: LucideIcon; label: string; section: NavSection; href: string }[] = [
	{ icon: Home, label: "Home", section: "dashboard", href: "/dashboard" },
	{ icon: Leaf, label: "Meditations", section: "meditations", href: "/meditations" },
	{ icon: Sparkles, label: "Hypnosis", section: "hypnosis", href: "/hypnosis" },
	{ icon: BarChart3, label: "Programs", section: "programs", href: "/programs" },
	{ icon: Zap, label: "Quick Resets", section: "quick-resets", href: "/quick-resets" },
	{ icon: BookOpen, label: "Knowledge", section: "knowledge-hub", href: "/knowledge" },
	{ icon: Users, label: "Community", section: "community", href: "/community" },
];

interface NavigationProps {
	streakDays: number;
	membershipTier: "premium" | "free";
	isExpanded: boolean;
}

export function Navigation({ streakDays, membershipTier, isExpanded }: NavigationProps) {
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
		<div className="space-y-6 text-[rgb(var(--earth-700))] dark:text-[#D9D3C8]">
			<nav className="space-y-2">
				{NAV_ITEMS.map((item) => {
					const isActive = navSelection === item.section;
					return (
						<motion.button
							type="button"
							key={item.section}
							onClick={() => setNavSelection(item.section)}
							whileHover={{ scale: 1.04 }}
							whileTap={{ scale: 0.97 }}
							transition={{ type: "spring", stiffness: 400, damping: 20 }}
							className={`w-full rounded-xl py-3 text-sm font-medium transition-colors duration-200 flex items-center ${
							isExpanded ? "px-4" : "justify-center"
						} ${
								isActive
									? "bg-[rgb(var(--sage-600))] text-white shadow-soft"
									: "text-[rgb(var(--earth-600))] hover:bg-[rgb(var(--cream-100))] dark:text-[#BFB6A8] dark:hover:bg-white/5"
							}`}
						>
							<item.icon className="h-5 w-5 flex-shrink-0" />
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
						</motion.button>
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
						className="rounded-2xl border border-[rgb(var(--sage-100))] bg-white p-4 shadow-card dark:border-white/10 dark:bg-[#111317] overflow-hidden"
					>
						<div className="flex items-center justify-between text-sm text-[rgb(var(--earth-600))] dark:text-[#CFC7BB]">
							<span className="flex items-center gap-1.5"><Flame className="h-4 w-4" /> Streak</span>
							<span className="font-semibold text-[rgb(var(--earth-900))] dark:text-[#F4EFE6]">{streakDays} days</span>
						</div>
						<p className="mt-3 text-xs leading-relaxed text-[rgb(var(--earth-500))] dark:text-[#AFA79B]">{tiersCopy}</p>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}
