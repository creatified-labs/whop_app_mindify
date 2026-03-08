"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Brain, Sparkles, BookOpen, Users } from "lucide-react";
import { useAppStore, type NavSection } from "@/lib/stores/appStore";

interface QuickAction {
	title: string;
	description: string;
	navTarget: NavSection | null;
	href?: string;
	icon: React.ReactNode;
	color: string;
	gradient: string;
}

const quickActions: QuickAction[] = [
	{
		title: "Start Meditating",
		description: "Browse meditation library",
		navTarget: "meditations",
		icon: <Brain className="h-6 w-6" />,
		color: "text-sage-600 dark:text-sage-400",
		gradient: "from-sage-500 to-sage-600",
	},
	{
		title: "Hypnosis Session",
		description: "Transform your mindset",
		navTarget: "hypnosis",
		icon: <Sparkles className="h-6 w-6" />,
		color: "text-purple-600 dark:text-purple-400",
		gradient: "from-purple-500 to-purple-600",
	},
	{
		title: "Programs",
		description: "Start a transformation",
		navTarget: "programs",
		icon: <BookOpen className="h-6 w-6" />,
		color: "text-amber-600 dark:text-amber-400",
		gradient: "from-amber-500 to-amber-600",
	},
	{
		title: "Community",
		description: "Connect with others",
		navTarget: null,
		href: "/community",
		icon: <Users className="h-6 w-6" />,
		color: "text-blue-600 dark:text-blue-400",
		gradient: "from-blue-500 to-blue-600",
	},
];

export default function QuickActions() {
	const setNavSelection = useAppStore((state) => state.setNavSelection);
	const router = useRouter();

	const handleClick = (action: QuickAction) => {
		if (action.navTarget) {
			setNavSelection(action.navTarget);
			router.push("/");
		} else if (action.href) {
			router.push(action.href);
		}
	};

	return (
		<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
			{quickActions.map((action, index) => (
				<motion.div
					key={action.title}
					initial={{ opacity: 0, scale: 0.9 }}
					animate={{ opacity: 1, scale: 1 }}
					transition={{ duration: 0.3, delay: index * 0.05 }}
				>
					<button type="button" onClick={() => handleClick(action)} className="w-full text-left">
						<div className="group relative overflow-hidden rounded-2xl border border-sage-200/50 bg-gradient-to-br from-cream-50 to-cream-100 p-6 shadow-sm transition-all hover:scale-105 hover:shadow-lg dark:border-white/10 dark:from-[#1A1D23] dark:to-[#14171C]">
							{/* Gradient background on hover */}
							<div
								className={`absolute inset-0 bg-gradient-to-br ${action.gradient} opacity-0 transition-opacity duration-300 group-hover:opacity-5`}
							/>

							<div className="relative">
								{/* Icon */}
								<div
									className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${action.gradient} text-white shadow-lg`}
								>
									{action.icon}
								</div>

								{/* Content */}
								<h3 className="mb-1 font-semibold text-earth-900 dark:text-[#F4EFE6]">
									{action.title}
								</h3>
								<p className="text-sm text-earth-600 dark:text-[#CFC7BB]">
									{action.description}
								</p>
							</div>
						</div>
					</button>
				</motion.div>
			))}
		</div>
	);
}
