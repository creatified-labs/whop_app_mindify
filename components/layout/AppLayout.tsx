"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Leaf, Sparkles } from "lucide-react";
import { MindifyLogo } from "@/components/branding/MindifyLogo";
import { Navigation } from "@/components/ui/Navigation";
import { GlobalAudioPlayer } from "@/components/ui/GlobalAudioPlayer";
import { useAppStore } from "@/lib/stores/appStore";

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
	const navSelection = useAppStore((state) => state.navSelection);
	const goBack = useAppStore((state) => state.goBack);
	const canGoBack = useAppStore((state) => state.canGoBack);
	const showBackButton = navSelection !== "dashboard" && canGoBack();

	return (
		<div
			className={`flex min-h-screen bg-[rgb(var(--cream-50))] text-[rgb(var(--earth-900))] dark:bg-[#0E1012] dark:text-[#F4EFE6] ${className ?? ""}`}
		>
			<motion.aside
				animate={{ width: isSidebarExpanded ? 256 : 80 }}
				transition={{ duration: 0.2, ease: "easeInOut" }}
				onMouseEnter={() => setIsSidebarExpanded(true)}
				onMouseLeave={() => setIsSidebarExpanded(false)}
				className="hidden border-r border-[rgb(var(--sage-100))] bg-white dark:border-white/10 dark:bg-[#12141A] lg:flex lg:flex-col"
			>
				<div className={`py-6 flex items-center overflow-hidden ${isSidebarExpanded ? "px-4" : "justify-center"}`}>
					<Leaf className="h-6 w-6 text-[rgb(var(--sage-600))] flex-shrink-0" />
					<AnimatePresence>
						{isSidebarExpanded && (
							<motion.span
								initial={{ opacity: 0, width: 0, marginLeft: 0 }}
								animate={{ opacity: 1, width: "auto", marginLeft: 12 }}
								exit={{ opacity: 0, width: 0, marginLeft: 0 }}
								transition={{ duration: 0.2 }}
								className="overflow-hidden whitespace-nowrap text-lg font-semibold text-[rgb(var(--earth-900))] dark:text-[#F4EFE6]"
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
								<button className="mt-4 w-full rounded-xl bg-white py-2 text-sm font-semibold text-[rgb(var(--earth-900))] shadow-soft hover:bg-[rgb(var(--cream-100))] hover:shadow-hover dark:bg-[#111318] dark:text-[#F4EFE6] dark:hover:bg-[#1C2029]">
									Upgrade Now
								</button>
							</div>
						</motion.div>
					)}
				</AnimatePresence>
			</motion.aside>

			<div className="flex-1">
				<header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md lg:hidden dark:bg-[#12141A]/80">
					<div className="px-4 py-3 md:px-8">
						<MindifyLogo size="sm" />
					</div>
				</header>

				{showBackButton && (
					<div className="hidden lg:block px-12 pt-6">
						<button
							type="button"
							onClick={goBack}
							className="inline-flex items-center gap-2 rounded-full border border-[rgb(var(--sage-200))] px-4 py-2 text-sm text-[rgb(var(--earth-700))] hover:border-[rgb(var(--sage-400))] dark:border-white/15 dark:text-white/80 dark:hover:border-white/40"
						>
							<ArrowLeft className="h-4 w-4" />
							Back
						</button>
					</div>
				)}

				<main className="min-h-screen bg-[rgb(var(--cream-50))] px-4 py-4 pb-32 md:px-8 md:py-6 lg:px-12 dark:bg-[#0E1012]">{children}</main>
			</div>

			<GlobalAudioPlayer />
		</div>
	);
}
