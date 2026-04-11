"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";
import type { Program, ProgramCategory, ProgramProgress } from "@/lib/types";
import { ProgramDetail } from "@/components/programs/ProgramDetail";

const categoryGradients: Record<ProgramCategory, string> = {
	focus: "from-indigo-600/40 via-purple-500/30 to-blue-500/20",
	productivity: "from-teal-600/40 via-cyan-500/30 to-emerald-500/20",
	sleep: "from-blue-800/40 via-indigo-600/30 to-slate-700/20",
	mindset: "from-violet-600/40 via-fuchsia-500/30 to-purple-500/20",
	clarity: "from-emerald-600/40 via-teal-500/30 to-cyan-500/20",
};

export function ProgramsLibrary({
	companyId,
	programProgress = [],
}: {
	companyId: string;
	programProgress?: ProgramProgress[];
}) {
	const router = useRouter();
	const [programs, setPrograms] = useState<Program[]>([]);
	const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
	const [enrolling, setEnrolling] = useState(false);
	const [enrollSuccess, setEnrollSuccess] = useState(false);

	useEffect(() => {
		fetch(`/api/programs/content?company_id=${encodeURIComponent(companyId)}`)
			.then((res) => res.json())
			.then((data) => setPrograms(data.items || []))
			.catch(() => {});
	}, [companyId]);

	const progressByProgramId = new Map<string, ProgramProgress>();
	for (const p of programProgress) progressByProgramId.set(p.programId, p);
	const selectedProgress = selectedProgram ? progressByProgramId.get(selectedProgram.id) : null;

	const handleStart = async (program: Program) => {
		setEnrolling(true);
		try {
			const res = await fetch(`/api/programs/progress?company_id=${encodeURIComponent(companyId)}`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ programId: program.id, action: "enroll" }),
			});
			if (res.ok) {
				setEnrollSuccess(true);
				router.refresh();
				setTimeout(() => {
					setEnrollSuccess(false);
					setSelectedProgram(null);
				}, 1500);
			}
		} catch {
			// silently fail
		} finally {
			setEnrolling(false);
		}
	};

	if (selectedProgram) {
		return (
			<section className="space-y-4">
				<button
					type="button"
					onClick={() => setSelectedProgram(null)}
					className="inline-flex items-center gap-2 rounded-full border border-[rgb(var(--sage-200))] px-4 py-2 text-sm text-[rgb(var(--earth-700))] hover:border-[rgb(var(--sage-400))] dark:border-white/15 dark:text-white/80 dark:hover:border-white/40"
				>
					<ArrowLeft className="h-4 w-4" />
					Back to programs
				</button>
				<ProgramDetail
					program={selectedProgram}
					progress={selectedProgress}
					onStart={() => handleStart(selectedProgram)}
					isEnrolling={enrolling}
					enrollSuccess={enrollSuccess}
				/>
			</section>
		);
	}

	if (programs.length === 0) {
		return (
			<section className="space-y-8">
				<header className="space-y-2">
					<p className="text-xs uppercase tracking-[0.5em] text-[rgb(var(--earth-500))] dark:text-white/60">Transformation Programs</p>
					<h2 className="text-3xl font-semibold text-[rgb(var(--earth-900))] dark:text-white">Choose your current protocol</h2>
				</header>
				<p className="text-sm text-[rgb(var(--earth-500))] dark:text-white/60">No programs available yet.</p>
			</section>
		);
	}

	return (
		<section className="space-y-8">
			<header className="space-y-2">
				<p className="text-xs uppercase tracking-[0.5em] text-[rgb(var(--earth-500))] dark:text-white/60">Transformation Programs</p>
				<h2 className="text-3xl font-semibold text-[rgb(var(--earth-900))] dark:text-white">Choose your current protocol</h2>
				<p className="text-base text-[rgb(var(--earth-600))] dark:text-white/70">
					Multi-day journeys blending meditations, hypnosis, tasks, and journaling. Commit to a track, then let
					Mindify steer your nervous system and execution rituals.
				</p>
			</header>
			<div className="grid gap-6 lg:grid-cols-2">
				{programs.map((program) => {
					const gradient = categoryGradients[program.category] ?? categoryGradients.focus;
					const cardProgress = progressByProgramId.get(program.id);
					const isEnrolled = !!cardProgress && !cardProgress.completedAt;
					const isCompleted = !!cardProgress?.completedAt;
					return (
						<div
							key={program.id}
							className="rounded-[36px] border border-[rgb(var(--sage-100))] bg-white p-1 shadow-card dark:border-white/10 dark:bg-[#13151A]"
						>
							<div className="overflow-hidden rounded-[28px] border border-[rgb(var(--sage-100))] bg-[rgb(var(--cream-50))] p-5 dark:border-white/10 dark:bg-[#111318]">
								<div className="flex flex-col gap-5 md:flex-row">
									<div className={`relative flex h-56 w-full items-end overflow-hidden rounded-3xl bg-gradient-to-br ${gradient} md:h-64 md:w-1/3`}>
										<div className="absolute left-4 top-4 rounded-full bg-black/60 px-3 py-1 text-xs uppercase tracking-[0.3em] text-white/80">
											{String(program.difficulty)}
										</div>
										{isEnrolled && (
											<div className="absolute right-4 top-4 rounded-full bg-[rgb(var(--sage-600))] px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white">
												Enrolled
											</div>
										)}
										{isCompleted && (
											<div className="absolute right-4 top-4 rounded-full bg-[rgb(var(--gold-500))] px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white">
												Completed
											</div>
										)}
										{program.isPremium && (
											<div className="absolute bottom-4 left-4 rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-black">
												Premium
											</div>
										)}
									</div>
									<div className="flex flex-1 flex-col gap-4 text-[rgb(var(--earth-900))] dark:text-white">
										<div className="flex flex-wrap items-center justify-between gap-2 text-sm text-[rgb(var(--earth-600))] dark:text-white/70">
											<span>{String(program.duration)} days</span>
											<span>{String(program.timeCommitment)}</span>
										</div>
										<h3 className="text-2xl font-semibold">{String(program.title)}</h3>
										<p className="text-base text-[rgb(var(--earth-600))] dark:text-white/70">{String(program.tagline)}</p>
										{isEnrolled && (
											<p className="text-sm font-medium text-[rgb(var(--sage-700))] dark:text-[rgb(var(--sage-400))]">
												Day {cardProgress.currentDay} of {program.duration}
											</p>
										)}
										<div className="flex flex-wrap gap-3 text-xs uppercase tracking-[0.3em] text-[rgb(var(--earth-500))] dark:text-white/60">
											{program.recommendedFor.slice(0, 3).map((item) => (
												<span key={String(item)} className="rounded-full border border-[rgb(var(--sage-200))] px-3 py-1 text-[11px] dark:border-white/15">
													{String(item)}
												</span>
											))}
										</div>
										<div className="rounded-3xl border border-[rgb(var(--sage-100))] bg-[rgb(var(--cream-50))] p-4 text-sm text-[rgb(var(--earth-700))] dark:border-white/10 dark:bg-[#13151A] dark:text-white/80">
											<p className="text-xs uppercase tracking-[0.4em] text-[rgb(var(--earth-500))] dark:text-white/50">What&apos;s included</p>
											<ul className="mt-2 grid grid-cols-3 gap-3 text-center text-sm">
												<li>
													<p className="text-2xl font-semibold">{String(program.includeSummary.meditations)}</p>
													<span className="text-xs text-[rgb(var(--earth-500))] dark:text-white/60">meditations</span>
												</li>
												<li>
													<p className="text-2xl font-semibold">{String(program.includeSummary.tasks)}</p>
													<span className="text-xs text-[rgb(var(--earth-500))] dark:text-white/60">tasks</span>
												</li>
												<li>
													<p className="text-2xl font-semibold">{String(program.includeSummary.journalPrompts)}</p>
													<span className="text-xs text-[rgb(var(--earth-500))] dark:text-white/60">journal prompts</span>
												</li>
											</ul>
										</div>
										<button
											type="button"
											onClick={() => setSelectedProgram(program)}
											className="self-start rounded-3xl bg-[rgb(var(--sage-600))] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[rgb(var(--sage-700))] dark:bg-white/90 dark:text-black dark:hover:bg-white"
										>
											{isEnrolled ? "Continue" : isCompleted ? "Review" : "View Program"}
										</button>
									</div>
								</div>
							</div>
						</div>
					);
				})}
			</div>
		</section>
	);
}
