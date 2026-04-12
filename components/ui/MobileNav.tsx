"use client";

import { motion } from "framer-motion";
import { Home, Leaf, Sparkles, BarChart3, Zap, BookOpen, Users } from "lucide-react";
import { useAppStore, type NavSection } from "@/lib/stores/appStore";

const navItems: { section: NavSection; icon: typeof Home; label: string }[] = [
	{ section: "dashboard", icon: Home, label: "Home" },
	{ section: "meditations", icon: Leaf, label: "Meditate" },
	{ section: "hypnosis", icon: Sparkles, label: "Hypnosis" },
	{ section: "programs", icon: BarChart3, label: "Programs" },
	{ section: "quick-resets", icon: Zap, label: "Resets" },
	{ section: "knowledge-hub", icon: BookOpen, label: "Knowledge" },
	{ section: "community", icon: Users, label: "Community" },
];

export function MobileNav() {
	const navSelection = useAppStore((state) => state.navSelection);
	const setNavSelection = useAppStore((state) => state.setNavSelection);

	return (
		<nav
			className="fixed bottom-0 left-0 right-0 z-50 lg:hidden border-t border-black/5 bg-white/80 backdrop-blur-xl backdrop-saturate-150 dark:border-white/10 dark:bg-[#1C1C1E]/80"
			style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
		>
			<div className="flex items-center justify-around px-2 pt-2 pb-1">
				{navItems.map((item) => {
					const Icon = item.icon;
					const isActive = navSelection === item.section;

					return (
						<button
							type="button"
							key={item.section}
							onClick={() => setNavSelection(item.section)}
							className="relative flex flex-col items-center justify-center gap-0.5 min-w-[3.5rem] py-1 transition-transform active:scale-90"
						>
							<div className="relative flex items-center justify-center h-7 w-7">
								<Icon
									className={`h-[22px] w-[22px] transition-colors duration-200 ${
										isActive
											? "text-[rgb(var(--sage-600))] dark:text-[#64D2A0]"
											: "text-[#8E8E93] dark:text-[#8E8E93]"
									}`}
									strokeWidth={isActive ? 2.2 : 1.8}
								/>
							</div>
							<span
								className={`text-[10px] leading-tight transition-colors duration-200 ${
									isActive
										? "font-semibold text-[rgb(var(--sage-600))] dark:text-[#64D2A0]"
										: "font-medium text-[#8E8E93] dark:text-[#8E8E93]"
								}`}
							>
								{item.label}
							</span>
							{isActive && (
								<motion.div
									layoutId="activeTabIndicator"
									className="absolute -top-1 left-1/2 -translate-x-1/2 h-[3px] w-5 rounded-full bg-[rgb(var(--sage-600))] dark:bg-[#64D2A0]"
									transition={{ type: "spring", stiffness: 400, damping: 30 }}
								/>
							)}
						</button>
					);
				})}
			</div>
		</nav>
	);
}
