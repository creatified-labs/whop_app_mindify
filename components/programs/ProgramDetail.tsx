"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import type { Program, ProgramProgress } from "@/lib/types";

type ProgramDetailProps = {
	program: Program;
	progress?: ProgramProgress | null;
	onStart?: () => void;
};

const gradients: Record<string, string> = {
	focus: "from-[#27123E]/90 via-[#1C1B46]/80 to-[#0E0A22]/90",
	productivity: "from-[#1C1D3B]/90 via-[#0E1B2A]/85 to-[#030712]/90",
	sleep: "from-[#050921]/90 via-[#0A1230]/80 to-[#040716]/90",
	mindset: "from-[#1A0F32]/90 via-[#2B0D3A]/80 to-[#0B0414]/90",
	clarity: "from-[#0F1A2C]/90 via-[#17293B]/80 to-[#04070F]/90",
};

export function ProgramDetail({ program, progress, onStart }: ProgramDetailProps) {
	const completionPct =
		progress && program.duration > 0 ? (progress.completedDays.length / program.duration) * 100 : 0;

	return (
		<section className="rounded-[40px] border border-white/10 bg-white/5 text-white shadow-[0_40px_120px_rgba(3,5,25,0.55)]">
			<div className="grid gap-10 p-8 lg:grid-cols-[2fr,1fr]">
				<div className="space-y-6">
					<div className="relative overflow-hidden rounded-4xl">
						<div
							className={`absolute inset-0 bg-gradient-to-br ${
								gradients[program.category] ?? "from-[#151527] to-[#060610]"
							}`}
						/>
						<Image
							src={program.coverImage}
							alt={program.title}
							width={960}
							height={540}
							className="h-64 w-full object-cover opacity-60 mix-blend-screen"
							unoptimized
						/>
						<div className="relative z-10 p-8">
							<p className="text-xs uppercase tracking-[0.5em] text-white/70">{program.category}</p>
							<h2 className="mt-2 text-3xl font-semibold">{program.title}</h2>
							<p className="mt-3 max-w-3xl text-base text-white/80">{program.description}</p>
							<div className="mt-6 flex flex-wrap gap-4 text-sm text-white/80">
								<span className="rounded-full border border-white/30 px-4 py-1">
									{program.duration} days • {program.timeCommitment}
								</span>
								<span className="rounded-full border border-white/30 px-4 py-1 capitalize">
									{program.difficulty} level
								</span>
								{program.isPremium && (
									<span className="rounded-full border border-white/30 px-4 py-1 font-semibold text-white">
										Premium
									</span>
								)}
							</div>
						</div>
					</div>

					<div className="grid gap-6 md:grid-cols-2">
						<div className="rounded-3xl border border-white/15 bg-black/30 p-6">
							<p className="text-xs uppercase tracking-[0.4em] text-white/50">What you'll achieve</p>
							<ul className="mt-4 space-y-3 text-sm text-white/80">
								{program.benefits.map((benefit) => (
									<li key={benefit} className="flex items-start gap-3">
										<span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-mindify-dusk" />
										{benefit}
									</li>
								))}
							</ul>
						</div>
						<div className="rounded-3xl border border-white/15 bg-black/30 p-6">
							<p className="text-xs uppercase tracking-[0.4em] text-white/50">Requirements</p>
							<ul className="mt-4 space-y-3 text-sm text-white/80">
								{program.requirements.map((req) => (
									<li key={req} className="flex items-start gap-3">
										<span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-white/60" />
										{req}
									</li>
								))}
							</ul>
							<p className="mt-5 text-xs uppercase tracking-[0.4em] text-white/50">Time commitment</p>
							<p className="mt-1 text-lg font-semibold text-white">{program.timeCommitment}</p>
						</div>
					</div>

					<div className="rounded-4xl border border-white/10 bg-gradient-to-br from-white/5 to-white/0 p-6">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-xs uppercase tracking-[0.4em] text-white/60">Daily breakdown</p>
								<p className="text-sm text-white/70">Preview the first five days</p>
							</div>
							<button
								type="button"
								onClick={onStart}
								className="rounded-full bg-white/90 px-5 py-2 text-sm font-semibold text-black transition hover:bg-white"
							>
								{progress ? "Continue" : "Start program"}
							</button>
						</div>
						<div className="mt-5 space-y-3">
							{program.days.slice(0, 5).map((day) => (
								<details
									key={day.dayNumber}
									className="group rounded-3xl border border-white/10 bg-black/20 p-4"
								>
									<summary className="flex cursor-pointer items-center justify-between text-base font-semibold">
										<div>
											<span className="text-xs uppercase tracking-[0.4em] text-white/50">
												Day {day.dayNumber}
											</span>
											<p className="text-white">{day.title}</p>
										</div>
										<span className="text-sm text-white/60">Show tasks</span>
									</summary>
									<div className="mt-4 space-y-2 text-sm text-white/80">
										{day.tasks.map((task) => (
											<p key={task} className="flex items-start gap-3">
												<span className="mt-1 h-1.5 w-1.5 rounded-full bg-white/60" />
												{task}
											</p>
										))}
										{day.journalPrompts.length > 0 && (
											<p className="text-xs uppercase tracking-[0.3em] text-white/50">
												Journal • {day.journalPrompts[0]}
											</p>
										)}
									</div>
								</details>
							))}
						</div>
					</div>

					<div className="rounded-4xl border border-white/10 bg-black/20 p-6">
						<p className="text-xs uppercase tracking-[0.4em] text-white/50">Community Love</p>
						<div className="mt-4 grid gap-4 md:grid-cols-2">
							{["“Day 4 flow state is unreal.”", "“I finally finish deep work without crash.”"].map(
								(testimonial, idx) => (
									<div key={testimonial} className="rounded-3xl border border-white/10 bg-white/5 p-4">
										<p className="text-base text-white/80">{testimonial}</p>
										<p className="mt-3 text-xs uppercase tracking-[0.3em] text-white/40">
											Founder • Cohort 0{idx + 1}
										</p>
									</div>
								),
							)}
						</div>
					</div>
				</div>
				<aside className="space-y-6">
					<div className="rounded-4xl border border-white/10 bg-black/40 p-6">
						<p className="text-xs uppercase tracking-[0.4em] text-white/50">Enrollment Status</p>
						<div className="mt-4 flex flex-col gap-4">
							<div className="text-4xl font-semibold text-white">{completionPct.toFixed(0)}%</div>
							<div className="h-2 rounded-full bg-white/10">
								<div
									className="h-2 rounded-full bg-gradient-to-r from-mindify-dawn to-mindify-lagoon"
									style={{ width: `${completionPct}%` }}
								/>
							</div>
							<p className="text-sm text-white/70">
								{progress ? `Day ${progress.currentDay} of ${program.duration}` : "Not enrolled"}
							</p>
							<button
								type="button"
								onClick={onStart}
								className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-black shadow-lg transition hover:-translate-y-0.5"
							>
								{progress ? "Resume Journey" : "Start Program"}
							</button>
						</div>
					</div>
					<div className="rounded-4xl border border-white/10 bg-black/30 p-6">
						<p className="text-xs uppercase tracking-[0.4em] text-white/50">Recommended For</p>
						<ul className="mt-4 space-y-2 text-sm text-white/80">
							{program.recommendedFor.map((item) => (
								<li key={item} className="flex items-center gap-3">
									<span className="h-1.5 w-1.5 rounded-full bg-mindify-lagoon" />
									{item}
								</li>
							))}
						</ul>
					</div>
					<div className="rounded-4xl border border-white/10 bg-black/20 p-6">
						<p className="text-xs uppercase tracking-[0.4em] text-white/50">Series recommendation</p>
						<p className="mt-3 text-sm text-white/80">
							Pair this program with{" "}
							<span className="font-semibold text-white">21-Day Productivity Challenge</span> for layered
							results.
						</p>
						<button className="mt-4 text-sm font-medium text-mindify-lagoon underline">View program</button>
					</div>
				</aside>
			</div>
		</section>
	);
}
