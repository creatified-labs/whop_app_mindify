"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Home, Sparkles, Trophy, BookOpen, User } from "lucide-react";

const navItems = [
	{ href: "/", icon: Home, label: "Home" },
	{ href: "/meditation", icon: Sparkles, label: "Meditate" },
	{ href: "/community", icon: Trophy, label: "Community" },
	{ href: "/discover", icon: BookOpen, label: "Discover" },
	{ href: "/profile", icon: User, label: "Profile" },
];

export function MobileNav() {
	const pathname = usePathname();

	// Don't show mobile nav on dashboard or experience pages
	if (pathname?.includes("/dashboard/") || pathname?.includes("/experiences/")) {
		return null;
	}

	return (
		<div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center md:hidden pointer-events-none" style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' }}>
			<div className="pb-4 px-4">
				<motion.nav
					initial={{ y: 100, opacity: 0 }}
					animate={{ y: 0, opacity: 1 }}
					transition={{ duration: 0.3 }}
					className="pointer-events-auto rounded-full border border-sage-200/50 bg-cream-50/95 backdrop-blur-2xl shadow-2xl dark:border-white/10 dark:bg-[#13151A]/95"
				>
					<div className="flex items-center justify-around px-3 py-3 gap-2">
						{navItems.map((item) => {
							const Icon = item.icon;
							const isActive = pathname === item.href;

							return (
								<Link
									key={item.href}
									href={item.href}
									className="relative flex flex-col items-center gap-1 rounded-2xl px-4 py-2 transition-all active:scale-95"
								>
									{isActive && (
										<motion.div
											layoutId="activeTab"
											className="absolute inset-0 rounded-2xl bg-gradient-sage/10 dark:bg-gradient-sage/20"
											transition={{ type: "spring", duration: 0.5, bounce: 0.2 }}
										/>
									)}
									<div className="relative">
										<Icon
											className={`h-5 w-5 transition-colors ${
												isActive
													? "text-sage-600 dark:text-sage-400"
													: "text-earth-500 dark:text-[#AFA79B]"
											}`}
										/>
										{isActive && (
											<motion.div
												initial={{ scale: 0 }}
												animate={{ scale: 1 }}
												className="absolute -bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-sage-600 dark:bg-sage-400"
											/>
										)}
									</div>
									<span
										className={`text-[10px] font-medium tracking-wide transition-colors ${
											isActive
												? "text-sage-700 dark:text-sage-300"
												: "text-earth-600 dark:text-[#CFC7BB]"
										}`}
									>
										{item.label}
									</span>
								</Link>
							);
						})}
					</div>
				</motion.nav>
			</div>
		</div>
	);
}
