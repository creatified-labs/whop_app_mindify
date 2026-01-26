"use client";

type WelcomeSectionProps = {
	userName: string;
	timeOfDay: "morning" | "afternoon" | "evening";
};

const greetings = {
	morning: { icon: "🌅", text: "Good morning" },
	afternoon: { icon: "☀️", text: "Good afternoon" },
	evening: { icon: "🌙", text: "Good evening" },
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
					<span className="text-4xl">{greeting.icon}</span>
					<h1 className="text-3xl font-serif font-bold">
						{greeting.text}, {userName}
					</h1>
				</div>
				<p className="mb-6 text-lg text-white/90">Take a moment to center yourself and set your intention for today.</p>
				<div className="flex flex-wrap gap-4">
					<button className="rounded-xl bg-white px-6 py-3 font-semibold text-sage-700 shadow-soft transition hover:shadow-hover">
						🎯 Start Daily Practice
					</button>
					<button className="rounded-xl bg-white/20 px-6 py-3 font-semibold text-white backdrop-blur-sm transition hover:bg-white/30">
						📊 View Progress
					</button>
				</div>
			</div>
		</section>
	);
}
