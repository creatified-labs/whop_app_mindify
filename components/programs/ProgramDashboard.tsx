"use client";

import { useMemo } from "react";
import type { Program, ProgramProgress } from "@/lib/types";
import { useProgramStore } from "@/lib/stores/programStore";

type ProgramDashboardProps = {
	program: Program;
	progress: ProgramProgress;
	onSelectDay?: (day: number) => void;
};

const dayStatus = (dayNumber: number, progress: ProgramProgress) => {
	if (progress.completedDays.includes(dayNumber)) return "complete";
	if (dayNumber === progress.currentDay) return "current";
	if (dayNumber < progress.currentDay) return "available";
	return "upcoming";
};

export function ProgramDashboard({ program, progress, onSelectDay }: ProgramDashboardProps) {
	const { setCurrentDay } = useProgramStore((state) => ({
		setCurrentDay: state.setCurrentDay,
	}));

	const completionPct = useMemo(() => {
		if (!program.duration) return 0;
		return (progress.completedDays.length / program.duration) * 100;
	}, [program.duration, progress.completedDays.length]);

	const handleSelectDay = (dayNumber: number) => {
		setCurrentDay(dayNumber);
		onSelectDay?.(dayNumber);
	};

	return (
		<section className="rounded-[36px] border border-white/10 bg-white/5 p-6 text-white shadow-[0_30px_80px_rgba(5,8,25,0.35)]">
			<header className="flex flex-wrap items-center justify-between gap-4">
				<div>
					<p className="text-xs uppercase tracking-[0.4em] text-white/60">Program Dashboard</p>
					<h3 className="text-2xl font-semibold">{program.title}</h3>
					<p className="text-sm text-white/70">
						Day {progress.currentDay} of {program.duration}
					</p>
				</div>
				<div className="text-right">
					<p className="text-xs uppercase tracking-[0.4em] text-white/60">Streak</p>
					<p className="text-3xl font-semibold">{progress.streak} days</p>
				</div>
			</header>

			<div className="mt-6 space-y-4">
				<div className="rounded-3xl border border-white/10 bg-black/30 p-5">
					<div className="flex items-center justify-between text-sm text-white/70">
						<span>Completion</span>
						<span>{completionPct.toFixed(0)}%</span>
					</div>
					<div className="mt-3 h-2 rounded-full bg-white/10">
						<div
							className="h-2 rounded-full bg-gradient-to-r from-mindify-dawn via-mindify-dusk to-mindify-lagoon transition-all"
							style={{ width: `${completionPct}%` }}
						/>
					</div>
				</div>

				<div className="rounded-3xl border border-white/10 bg-black/20 p-5">
					<div className="flex items-center justify-between text-sm text-white/70">
						<span>Daily Timeline</span>
						<span>
							Day {progress.currentDay} • {program.days[progress.currentDay - 1]?.title ?? "Preview"}
						</span>
					</div>
					<div className="mt-4 grid grid-cols-7 gap-2">
						{program.days.slice(0, 14).map((day) => {
							const status = dayStatus(day.dayNumber, progress);
							return (
								<button
									key={day.dayNumber}
									type="button"
									onClick={() => handleSelectDay(day.dayNumber)}
									className={[
										"rounded-2xl border px-3 py-2 text-left text-xs transition",
										status === "complete"
											? "border-mindify-lagoon/60 bg-mindify-lagoon/15 text-white"
											: status === "current"
												? "border-white/50 bg-white/10 text-white"
												: status === "available"
													? "border-white/15 text-white/70 hover:border-white/40"
													: "border-white/10 text-white/40",
									].join(" ")}
								>
									<p className="text-[10px] uppercase tracking-[0.3em] text-white/50">Day {day.dayNumber}</p>
									<p className="mt-1 line-clamp-2 text-xs">{day.title}</p>
								</button>
							);
						})}
					</div>
				</div>

				<div className="rounded-3xl border border-white/10 bg-black/30 p-5">
					<div className="flex items-center justify-between text-sm text-white/70">
						<span>Calendar view</span>
						<span>Tap any day to jump</span>
					</div>
					<div className="mt-4 grid grid-cols-7 gap-2 text-xs">
						{program.days.map((day) => {
							const status = dayStatus(day.dayNumber, progress);
							return (
								<button
									key={day.dayNumber}
									type="button"
									onClick={() => handleSelectDay(day.dayNumber)}
									className={[
										"aspect-square rounded-2xl border font-semibold transition",
										status === "complete"
											? "border-mindify-lagoon/70 bg-mindify-lagoon/20"
											: status === "current"
												? "border-white/60 bg-white/10"
												: status === "available"
													? "border-white/20 hover:border-white/50"
													: "border-white/10 text-white/40",
									].join(" ")}
								>
									{day.dayNumber}
								</button>
							);
						})}
					</div>
				</div>
			</div>
		</section>
	);
}
