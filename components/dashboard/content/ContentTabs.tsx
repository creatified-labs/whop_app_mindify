"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
	LayoutDashboard,
	Music,
	Brain,
	CalendarDays,
	Zap,
	BookOpen,
} from "lucide-react";

export type ContentTab =
	| "overview"
	| "meditations"
	| "hypnosis"
	| "programs"
	| "quick-resets"
	| "knowledge";

const tabs: { id: ContentTab; label: string; icon: typeof LayoutDashboard }[] = [
	{ id: "overview", label: "Overview", icon: LayoutDashboard },
	{ id: "meditations", label: "Meditations", icon: Music },
	{ id: "hypnosis", label: "Hypnosis", icon: Brain },
	{ id: "programs", label: "Programs", icon: CalendarDays },
	{ id: "quick-resets", label: "Quick Resets", icon: Zap },
	{ id: "knowledge", label: "Knowledge", icon: BookOpen },
];

interface ContentTabsProps {
	activeTab: ContentTab;
	onTabChange: (tab: ContentTab) => void;
}

export function ContentTabs({ activeTab, onTabChange }: ContentTabsProps) {
	return (
		<div className="mb-6 flex flex-wrap gap-2">
			{tabs.map((tab) => {
				const Icon = tab.icon;
				const isActive = activeTab === tab.id;
				return (
					<button
						key={tab.id}
						type="button"
						onClick={() => onTabChange(tab.id)}
						className={`relative flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors ${
							isActive
								? "bg-[rgb(var(--sage-600))] text-white shadow-sm"
								: "border border-[rgb(var(--sage-200))] bg-white text-[rgb(var(--earth-700))] hover:bg-[rgb(var(--cream-100))] dark:border-white/10 dark:bg-[#14171C] dark:text-[#D9D3C8] dark:hover:bg-[#1E2228]"
						}`}
					>
						<Icon className="h-4 w-4" />
						{tab.label}
					</button>
				);
			})}
		</div>
	);
}

export function useContentTab() {
	const [activeTab, setActiveTab] = useState<ContentTab>("overview");
	return { activeTab, setActiveTab };
}
