"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Leaf, Sparkles } from "lucide-react";
import { MindifyLogo } from "@/components/branding/MindifyLogo";
import { Navigation } from "@/components/ui/Navigation";

type AppLayoutProps = {
	children: ReactNode;
	userName?: string;
	userInitial?: string;
	streakDays?: number;
	membershipTier?: "free" | "premium";
	className?: string;
};

export function AppLayout({
	children,
	userName = "Guest",
	userInitial,
	streakDays = 0,
	membershipTier = "free",
	className,
}: AppLayoutProps) {
	const initial = userInitial ?? userName.charAt(0).toUpperCase();
	const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);

	return (
		<div
			className={`flex min-h-screen bg-cream-50 text-earth-900 dark:bg-[#0E1012] dark:text-[#F4EFE6] ${className ?? ""}`}
		>
			<motion.aside
				animate={{ width: isSidebarExpanded ? 256 : 80 }}
				transition={{ duration: 0.2, ease: "easeInOut" }}
				onMouseEnter={() => setIsSidebarExpanded(true)}
				onMouseLeave={() => setIsSidebarExpanded(false)}
				className="hidden border-r border-sage-100 bg-cream-50 dark:border-white/10 dark:bg-[#12141A] lg:flex lg:flex-col"
			>
				<div className={`py-6 flex items-center overflow-hidden ${isSidebarExpanded ? "px-4" : "justify-center"}`}>
					<Leaf className="h-6 w-6 text-sage-600 flex-shrink-0" />
					<AnimatePresence>
						{isSidebarExpanded && (
							<motion.span
								initial={{ opacity: 0, width: 0, marginLeft: 0 }}
								animate={{ opacity: 1, width: "auto", marginLeft: 12 }}
								exit={{ opacity: 0, width: 0, marginLeft: 0 }}
								transition={{ duration: 0.2 }}
								className="overflow-hidden whitespace-nowrap text-lg font-semibold text-earth-900 dark:text-[#F4EFE6]"
							>
								Mindify
							</motion.span>
						)}
					</AnimatePresence>
				</div>
				<div className="flex-1 overflow-y-auto overflow-x-hidden py-6">
					<Navigation streakDays={streakDays} membershipTier={membershipTier} isExpanded={isSidebarExpanded} />
				</div>
				<AnimatePresence>
					{isSidebarExpanded && (
						<motion.div
							initial={{ opacity: 0, height: 0 }}
							animate={{ opacity: 1, height: "auto" }}
							exit={{ opacity: 0, height: 0 }}
							transition={{ duration: 0.2 }}
							className="p-6 overflow-hidden"
						>
							<div className="rounded-2xl bg-gradient-sage p-5 text-white shadow-soft">
								<div className="mb-2 flex items-center gap-2 text-sm font-semibold">
									<Sparkles className="h-4 w-4" />
									<span>Premium</span>
								</div>
								<p className="text-sm text-white/90">Unlock all meditations & programs.</p>
								<button className="mt-4 w-full rounded-xl bg-cream-50 py-2 text-sm font-semibold text-earth-900 shadow-soft hover:bg-cream-100 hover:shadow-hover dark:bg-[#111318] dark:text-[#F4EFE6] dark:hover:bg-[#1C2029]">
									Upgrade Now
								</button>
							</div>
						</motion.div>
					)}
				</AnimatePresence>
			</motion.aside>

			<div className="flex-1">
				<header className="sticky top-0 z-40 bg-cream-50/90 backdrop-blur-md lg:hidden dark:bg-[#12141A]/80">
					<div className="px-4 py-3 md:px-8">
						<MindifyLogo size="sm" />
					</div>
				</header>

				<main className="min-h-screen bg-cream-50 px-4 py-4 pb-24 md:px-8 md:py-6 lg:px-12 dark:bg-[#0E1012]">{children}</main>
			</div>
		</div>
	);
}
