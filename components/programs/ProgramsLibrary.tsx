"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { PROGRAMS_LIBRARY } from "@/lib/mockData/programs";
import { useProgramStore } from "@/lib/stores/programStore";
import type { Program } from "@/lib/types";

function getEnrollmentLabel(program: Program, enrolledIds: Record<string, boolean>, progress?: number) {
	if (!enrolledIds[program.id]) {
		return "Not started";
	}
	if (progress && progress >= 100) {
		return "Completed";
	}
	if (!progress || progress <= 0) {
		return "Enrolled";
	}
	return `In progress • ${progress.toFixed(0)}%`;
}

export function ProgramsLibrary() {
	const { enrolledPrograms, enrollInProgram, setCurrentProgram } = useProgramStore((state) => ({
		enrolledPrograms: state.enrolledPrograms,
		enrollInProgram: state.enrollInProgram,
		setCurrentProgram: state.setCurrentProgram,
	}));

	const enrolledLookup = Object.fromEntries(Object.keys(enrolledPrograms).map((id) => [id, true]));

	const handleEnroll = (program: Program) => {
		if (enrolledPrograms[program.id]) {
			setCurrentProgram(program.id);
			return;
		}
		enrollInProgram({
			programId: program.id,
			currentDay: 1,
			completedDays: [],
			enrolledAt: new Date().toISOString(),
			lastUpdated: new Date().toISOString(),
			streak: 0,
		});
	};

	return (
		<section className="space-y-8">
			<header className="space-y-2 text-white">
				<p className="text-xs uppercase tracking-[0.5em] text-white/60">Transformation Programs</p>
				<h2 className="text-3xl font-semibold">Choose your current protocol</h2>
				<p className="text-base text-white/70">
					Multi-day journeys blending meditations, hypnosis, tasks, and journaling. Commit to a track, then let
					Mindify steer your nervous system and execution rituals.
				</p>
			</header>
			<div className="grid gap-6 lg:grid-cols-2">
				{PROGRAMS_LIBRARY.map((program, index) => {
					const progress = enrolledPrograms[program.id];
					const completionPct =
						progress && program.duration > 0 ? (progress.completedDays.length / program.duration) * 100 : 0;
					const label = getEnrollmentLabel(program, enrolledLookup, completionPct);

					return (
						<motion.div
							key={program.id}
							initial={{ opacity: 0, translateY: 30 }}
							whileInView={{ opacity: 1, translateY: 0 }}
							transition={{ delay: index * 0.05 }}
							viewport={{ once: true }}
							className="rounded-4xl border border-white/10 bg-gradient-to-br from-[#0C0A20] via-[#161437] to-[#0B1127] p-1 shadow-[0_30px_80px_rgba(8,6,22,0.25)]"
						>
							<div className="overflow-hidden rounded-[28px] border border-white/5 bg-white/5 p-5">
								<div className="flex flex-col gap-5 md:flex-row">
									<div className="relative h-56 w-full overflow-hidden rounded-3xl md:h-64 md:w-1/3">
										<Image
											src={program.coverImage}
											alt={program.title}
											fill
											className="object-cover"
											unoptimized
										/>
										<div className="absolute left-4 top-4 rounded-full bg-black/60 px-3 py-1 text-xs uppercase tracking-[0.3em] text-white/80">
											{program.difficulty}
										</div>
										{program.isPremium && (
											<div className="absolute bottom-4 left-4 rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-black">
												Premium
											</div>
										)}
									</div>
									<div className="flex flex-1 flex-col gap-4 text-white">
										<div className="flex flex-wrap items-center justify-between gap-2 text-sm text-white/70">
											<span>{program.duration} days • {program.timeCommitment}</span>
											<span>{label}</span>
										</div>
										<h3 className="text-2xl font-semibold">{program.title}</h3>
										<p className="text-base text-white/70">{program.tagline}</p>
										<div className="flex flex-wrap gap-3 text-xs uppercase tracking-[0.3em] text-white/60">
											{program.recommendedFor.slice(0, 3).map((item) => (
												<span key={item} className="rounded-full border border-white/15 px-3 py-1 text-[11px]">
													{item}
												</span>
											))}
										</div>
										<div className="rounded-3xl border border-white/10 bg-black/30 p-4 text-sm text-white/80">
											<p className="text-xs uppercase tracking-[0.4em] text-white/50">What's included</p>
											<ul className="mt-2 grid grid-cols-3 gap-3 text-center text-sm">
												<li>
													<p className="text-2xl font-semibold">{program.includeSummary.meditations}</p>
													<span className="text-xs text-white/60">meditations</span>
												</li>
												<li>
													<p className="text-2xl font-semibold">{program.includeSummary.tasks}</p>
													<span className="text-xs text-white/60">tasks</span>
												</li>
												<li>
													<p className="text-2xl font-semibold">
														{program.includeSummary.journalPrompts}
													</p>
													<span className="text-xs text-white/60">journal prompts</span>
												</li>
											</ul>
										</div>
										<div className="flex flex-wrap items-center justify-between gap-3">
											<div className="flex flex-1 items-center gap-3">
												<div className="h-1 flex-1 rounded-full bg-white/10">
													<div
														className="h-1 rounded-full bg-gradient-to-r from-mindify-dusk to-mindify-lagoon"
														style={{ width: `${completionPct}%` }}
													/>
												</div>
												<span className="text-sm text-white/70">{completionPct.toFixed(0)}%</span>
											</div>
											<button
												type="button"
												onClick={() => handleEnroll(program)}
												className="rounded-3xl bg-white/90 px-5 py-2 text-sm font-semibold text-black transition hover:bg-white"
											>
												{enrolledPrograms[program.id] ? "Continue" : "Enroll"}
											</button>
										</div>
									</div>
								</div>
							</div>
						</motion.div>
					);
				})}
			</div>
		</section>
	);
}
