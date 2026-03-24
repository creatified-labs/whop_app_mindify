"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import type { Program, ProgramProgress } from "@/lib/types";

type ProgramDetailProps = {
	program: Program;
	progress?: ProgramProgress | null;
	onStart?: () => void;
	isEnrolling?: boolean;
	enrollSuccess?: boolean;
};

const gradients: Record<string, string> = {
	focus: "from-[#27123E]/90 via-[#1C1B46]/80 to-[#0E0A22]/90",
	productivity: "from-[#1C1D3B]/90 via-[#0E1B2A]/85 to-[#030712]/90",
	sleep: "from-[#050921]/90 via-[#0A1230]/80 to-[#040716]/90",
	mindset: "from-[#1A0F32]/90 via-[#2B0D3A]/80 to-[#0B0414]/90",
	clarity: "from-[#0F1A2C]/90 via-[#17293B]/80 to-[#04070F]/90",
};

export function ProgramDetail({ program, progress, onStart, isEnrolling, enrollSuccess }: ProgramDetailProps) {
	const completionPct =
		progress && program.duration > 0 ? (progress.completedDays.length / program.duration) * 100 : 0;

	const buttonLabel = enrollSuccess
		? "Enrolled!"
		: isEnrolling
			? "Enrolling…"
			: progress
				? "Continue"
				: "Start program";

	return (
		<section className="rounded-[40px] border border-[rgb(var(--sage-100))] bg-white shadow-card dark:border-white/10 dark:bg-[#13151A]">
			<div className="grid gap-10 p-8 lg:grid-cols-[2fr,1fr]">
				<div className="space-y-6">
					<div className="relative overflow-hidden rounded-4xl">
						<div
							className={`absolute inset-0 bg-gradient-to-br ${
								gradients[program.category] ?? "from-[#151527] to-[#060610]"
							}`}
						/>
						{program.coverImage ? (
							<Image
								src={program.coverImage}
								alt={program.title}
								width={960}
								height={540}
								className="h-64 w-full object-cover opacity-60 mix-blend-screen"
								unoptimized
							/>
						) : (
							<div className="h-64 w-full" />
						)}
						<div className="relative z-10 p-8">
							<p className="text-xs uppercase tracking-[0.5em] text-white/70">{program.category}</p>
							<h2 className="mt-2 text-3xl font-semibold text-white">{program.title}</h2>
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
						<div className="rounded-3xl border border-[rgb(var(--sage-100))] bg-[rgb(var(--cream-50))] p-6 dark:border-white/10 dark:bg-[#111318]">
							<p className="text-xs uppercase tracking-[0.4em] text-[rgb(var(--earth-500))] dark:text-[#AFA79B]">What you&apos;ll achieve</p>
							<ul className="mt-4 space-y-3 text-sm text-[rgb(var(--earth-600))] dark:text-[#CFC7BB]">
								{program.benefits.map((benefit) => (
									<li key={benefit} className="flex items-start gap-3">
										<span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-mindify-dusk" />
										{benefit}
									</li>
								))}
							</ul>
						</div>
						<div className="rounded-3xl border border-[rgb(var(--sage-100))] bg-[rgb(var(--cream-50))] p-6 dark:border-white/10 dark:bg-[#111318]">
							<p className="text-xs uppercase tracking-[0.4em] text-[rgb(var(--earth-500))] dark:text-[#AFA79B]">Requirements</p>
							<ul className="mt-4 space-y-3 text-sm text-[rgb(var(--earth-600))] dark:text-[#CFC7BB]">
								{program.requirements.map((req) => (
									<li key={req} className="flex items-start gap-3">
										<span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-[rgb(var(--sage-400))] dark:bg-white/60" />
										{req}
									</li>
								))}
							</ul>
							<p className="mt-5 text-xs uppercase tracking-[0.4em] text-[rgb(var(--earth-500))] dark:text-[#AFA79B]">Time commitment</p>
							<p className="mt-1 text-lg font-semibold text-[rgb(var(--earth-900))] dark:text-[#F4EFE6]">{program.timeCommitment}</p>
						</div>
					</div>

					<div className="rounded-4xl border border-[rgb(var(--sage-100))] bg-white p-6 dark:border-white/10 dark:bg-[#13151A]">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-xs uppercase tracking-[0.4em] text-[rgb(var(--earth-500))] dark:text-[#AFA79B]">Daily breakdown</p>
								<p className="text-sm text-[rgb(var(--earth-600))] dark:text-[#CFC7BB]">Preview the first five days</p>
							</div>
							<button
								type="button"
								onClick={onStart}
								disabled={isEnrolling || enrollSuccess}
								className="rounded-full bg-[rgb(var(--sage-600))] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[rgb(var(--sage-700))] disabled:opacity-60 dark:bg-white/90 dark:text-black dark:hover:bg-white"
							>
								{buttonLabel}
							</button>
						</div>
						<div className="mt-5 space-y-3">
							{program.days.slice(0, 5).map((day) => (
								<details
									key={day.dayNumber}
									className="group rounded-3xl border border-[rgb(var(--sage-100))] bg-[rgb(var(--cream-50))] p-4 dark:border-white/10 dark:bg-[#111318]"
								>
									<summary className="flex cursor-pointer items-center justify-between text-base font-semibold">
										<div>
											<span className="text-xs uppercase tracking-[0.4em] text-[rgb(var(--earth-500))] dark:text-[#AFA79B]">
												Day {day.dayNumber}
											</span>
											<p className="text-[rgb(var(--earth-900))] dark:text-[#F4EFE6]">{day.title}</p>
										</div>
										<span className="text-sm text-[rgb(var(--earth-500))] dark:text-[#AFA79B]">Show tasks</span>
									</summary>
									<div className="mt-4 space-y-2 text-sm text-[rgb(var(--earth-600))] dark:text-[#CFC7BB]">
										{day.tasks.map((task) => (
											<p key={task} className="flex items-start gap-3">
												<span className="mt-1 h-1.5 w-1.5 rounded-full bg-[rgb(var(--sage-400))] dark:bg-white/60" />
												{task}
											</p>
										))}
										{day.journalPrompts.length > 0 && (
											<p className="text-xs uppercase tracking-[0.3em] text-[rgb(var(--earth-500))] dark:text-[#AFA79B]">
												Journal • {day.journalPrompts[0]}
											</p>
										)}
									</div>
								</details>
							))}
						</div>
					</div>

					<div className="rounded-4xl border border-[rgb(var(--sage-100))] bg-[rgb(var(--cream-50))] p-6 dark:border-white/10 dark:bg-[#111318]">
						<p className="text-xs uppercase tracking-[0.4em] text-[rgb(var(--earth-500))] dark:text-[#AFA79B]">Community Love</p>
						<div className="mt-4 grid gap-4 md:grid-cols-2">
							{["\u201CDay 4 flow state is unreal.\u201D", "\u201CI finally finish deep work without crash.\u201D"].map(
								(testimonial, idx) => (
									<div key={testimonial} className="rounded-3xl border border-[rgb(var(--sage-100))] bg-white p-4 dark:border-white/10 dark:bg-[#13151A]">
										<p className="text-base text-[rgb(var(--earth-600))] dark:text-[#CFC7BB]">{testimonial}</p>
										<p className="mt-3 text-xs uppercase tracking-[0.3em] text-[rgb(var(--earth-400))] dark:text-[#AFA79B]">
											Founder • Cohort 0{idx + 1}
										</p>
									</div>
								),
							)}
						</div>
					</div>
				</div>
				<aside className="space-y-6">
					<div className="rounded-4xl border border-[rgb(var(--sage-100))] bg-white p-6 dark:border-white/10 dark:bg-[#13151A]">
						<p className="text-xs uppercase tracking-[0.4em] text-[rgb(var(--earth-500))] dark:text-[#AFA79B]">Enrollment Status</p>
						<div className="mt-4 flex flex-col gap-4">
							<div className="text-4xl font-semibold text-[rgb(var(--earth-900))] dark:text-[#F4EFE6]">{completionPct.toFixed(0)}%</div>
							<div className="h-2 rounded-full bg-[rgb(var(--sage-100))] dark:bg-white/10">
								<div
									className="h-2 rounded-full bg-gradient-to-r from-mindify-dawn to-mindify-lagoon"
									style={{ width: `${completionPct}%` }}
								/>
							</div>
							<p className="text-sm text-[rgb(var(--earth-600))] dark:text-[#CFC7BB]">
								{progress ? `Day ${progress.currentDay} of ${program.duration}` : "Not enrolled"}
							</p>
							<button
								type="button"
								onClick={onStart}
								disabled={isEnrolling || enrollSuccess}
								className="rounded-full bg-[rgb(var(--sage-600))] px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-[rgb(var(--sage-700))] disabled:opacity-60 dark:bg-white/90 dark:text-black dark:hover:bg-white"
							>
								{enrollSuccess ? "Enrolled!" : isEnrolling ? "Enrolling…" : progress ? "Resume Journey" : "Start Program"}
							</button>
						</div>
					</div>
					<div className="rounded-4xl border border-[rgb(var(--sage-100))] bg-[rgb(var(--cream-50))] p-6 dark:border-white/10 dark:bg-[#111318]">
						<p className="text-xs uppercase tracking-[0.4em] text-[rgb(var(--earth-500))] dark:text-[#AFA79B]">Recommended For</p>
						<ul className="mt-4 space-y-2 text-sm text-[rgb(var(--earth-600))] dark:text-[#CFC7BB]">
							{program.recommendedFor.map((item) => (
								<li key={item} className="flex items-center gap-3">
									<span className="h-1.5 w-1.5 rounded-full bg-mindify-lagoon" />
									{item}
								</li>
							))}
						</ul>
					</div>
					<div className="rounded-4xl border border-[rgb(var(--sage-100))] bg-[rgb(var(--cream-50))] p-6 dark:border-white/10 dark:bg-[#111318]">
						<p className="text-xs uppercase tracking-[0.4em] text-[rgb(var(--earth-500))] dark:text-[#AFA79B]">Series recommendation</p>
						<p className="mt-3 text-sm text-[rgb(var(--earth-600))] dark:text-[#CFC7BB]">
							Pair this program with{" "}
							<span className="font-semibold text-[rgb(var(--earth-900))] dark:text-[#F4EFE6]">21-Day Productivity Challenge</span> for layered
							results.
						</p>
						<button className="mt-4 text-sm font-medium text-mindify-lagoon underline">View program</button>
					</div>
				</aside>
			</div>
		</section>
	);
}
