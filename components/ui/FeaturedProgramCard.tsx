"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import type { Program, ProgramCategory } from "@/lib/types";

const categoryGradients: Record<ProgramCategory, string> = {
	focus: "from-indigo-600/40 via-purple-500/30 to-blue-500/20",
	productivity: "from-teal-600/40 via-cyan-500/30 to-emerald-500/20",
	sleep: "from-blue-800/40 via-indigo-600/30 to-slate-700/20",
	mindset: "from-violet-600/40 via-fuchsia-500/30 to-purple-500/20",
	clarity: "from-emerald-600/40 via-teal-500/30 to-cyan-500/20",
};

export function FeaturedProgramCard({
	program,
	companyId,
	ctaLabel,
}: {
	program: Program;
	companyId: string;
	ctaLabel: string;
}) {
	const router = useRouter();
	const [enrolling, setEnrolling] = useState(false);

	const handleEnroll = async () => {
		setEnrolling(true);
		try {
			const res = await fetch(
				`/api/programs/progress?company_id=${encodeURIComponent(companyId)}`,
				{
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ programId: program.id, action: "enroll" }),
				},
			);
			if (res.ok) {
				router.refresh();
			}
		} catch {
			// silently fail
		} finally {
			setEnrolling(false);
		}
	};

	const gradient = categoryGradients[program.category] ?? categoryGradients.focus;

	return (
		<div className="flex w-[280px] shrink-0 snap-start flex-col overflow-hidden rounded-3xl border border-[rgb(var(--sage-100))] bg-[rgb(var(--cream-50))] shadow-card dark:border-white/10 dark:bg-[#111318]">
			<div className={`relative h-32 w-full bg-gradient-to-br ${gradient}`}>
				<div className="absolute left-3 top-3 rounded-full bg-black/60 px-2.5 py-1 text-[10px] uppercase tracking-[0.25em] text-white/90">
					{program.difficulty}
				</div>
				{program.isPremium && (
					<div className="absolute right-3 top-3 rounded-full bg-white/85 px-2.5 py-1 text-[10px] font-semibold text-black">
						Premium
					</div>
				)}
			</div>
			<div className="flex flex-1 flex-col gap-3 p-4">
				<div className="flex items-center justify-between text-xs text-[rgb(var(--earth-500))] dark:text-[#AFA79B]">
					<span>{program.duration} days</span>
					<span className="capitalize">{program.category}</span>
				</div>
				<h3 className="text-lg font-serif font-semibold text-[rgb(var(--earth-900))] dark:text-[#F4EFE6]">
					{program.title}
				</h3>
				<p className="line-clamp-2 text-sm text-[rgb(var(--earth-600))] dark:text-[#CFC7BB]">
					{program.tagline}
				</p>
				<button
					type="button"
					onClick={handleEnroll}
					disabled={enrolling}
					className="mt-auto inline-flex items-center justify-center gap-2 rounded-full bg-[rgb(var(--sage-600))] px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-white transition hover:bg-[rgb(var(--sage-700))] disabled:opacity-60"
				>
					{enrolling ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
					{enrolling ? "Starting…" : ctaLabel}
				</button>
			</div>
		</div>
	);
}
