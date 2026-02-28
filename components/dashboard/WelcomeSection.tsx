"use client";

import { Sunrise, Sun, Moon, Target, BarChart3, type LucideIcon } from "lucide-react";

type WelcomeSectionProps = {
	userName: string;
	timeOfDay: "morning" | "afternoon" | "evening";
};

const greetings: Record<string, { icon: LucideIcon; text: string }> = {
	morning: { icon: Sunrise, text: "Good morning" },
	afternoon: { icon: Sun, text: "Good afternoon" },
	evening: { icon: Moon, text: "Good evening" },
};

export function WelcomeSection({ userName, timeOfDay }: WelcomeSectionProps) {
	const greeting = greetings[timeOfDay];

	return (
		<section className="relative mb-8 overflow-hidden rounded-3xl bg-gradient-meditation p-8 text-white">
			<div className="pointer-events-none absolute right-2 top-2 opacity-10">
				<svg width="260" height="260" viewBox="0 0 100 100" aria-hidden>
					<circle cx="50" cy="20" r="8" fill="white" />
					<path d="M35 35 Q50 30 65 35 L60 50 Q50 60 40 50 Z" fill="white" />
				</svg>
			</div>
			<div className="relative z-10">
				<div className="mb-3 flex items-center gap-3">
					<greeting.icon className="h-8 w-8" />
					<h1 className="text-3xl font-serif font-bold">
						{greeting.text}, {userName}
					</h1>
				</div>
				<p className="mb-6 text-lg text-white/90">Take a moment to center yourself and set your intention for today.</p>
				<div className="flex flex-wrap gap-4">
					<button className="flex items-center gap-2 rounded-xl bg-white px-6 py-3 font-semibold text-sage-700 shadow-soft transition hover:shadow-hover">
						<Target className="h-4 w-4" /> Start Daily Practice
					</button>
					<button className="flex items-center gap-2 rounded-xl bg-white/20 px-6 py-3 font-semibold text-white backdrop-blur-sm transition hover:bg-white/30">
						<BarChart3 className="h-4 w-4" /> View Progress
					</button>
				</div>
			</div>
		</section>
	);
}
