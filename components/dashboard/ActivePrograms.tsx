"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Calendar, CheckCircle2, Flame } from "lucide-react";
import type { Program, ProgramProgress } from "@/lib/types";
import { useAppStore } from "@/lib/stores/appStore";

interface ActiveProgramCardProps {
	program: Program;
	progress: ProgramProgress;
	index: number;
}

function ActiveProgramCard({ program, progress, index }: ActiveProgramCardProps) {
	const progressPercentage = Math.round((progress.completedDays.length / program.duration) * 100);
	const daysRemaining = program.duration - progress.completedDays.length;

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.4, delay: index * 0.1 }}
		>
			<Link href={`/experiences/${program.id}`}>
				<div className="group relative overflow-hidden rounded-2xl border border-sage-200/50 bg-gradient-to-br from-cream-50 to-cream-100 p-6 shadow-sm transition-all hover:shadow-lg dark:border-white/10 dark:from-[#1A1D23] dark:to-[#14171C]">
					{/* Hover gradient */}
					<div className="absolute inset-0 bg-gradient-to-br from-sage-400/0 via-sage-400/0 to-sage-400/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:from-sage-300/0 dark:via-sage-300/0 dark:to-sage-300/10" />

					<div className="relative">
						{/* Header */}
						<div className="mb-4 flex items-start justify-between">
							<div className="flex-1">
								<h3 className="text-lg font-semibold text-earth-900 transition-colors group-hover:text-sage-700 dark:text-[#F4EFE6] dark:group-hover:text-sage-400">
									{program.title}
								</h3>
								<p className="mt-1 text-sm text-earth-600 dark:text-[#CFC7BB]">
									{program.tagline}
								</p>
							</div>
							<ArrowRight className="h-5 w-5 text-earth-400 transition-transform group-hover:translate-x-1 dark:text-[#B5AFA3]" />
						</div>

						{/* Progress bar */}
						<div className="mb-4">
							<div className="mb-2 flex items-center justify-between text-sm">
								<span className="font-medium text-earth-700 dark:text-[#D9D3C8]">
									Day {progress.currentDay} of {program.duration}
								</span>
								<span className="font-semibold text-sage-600 dark:text-sage-400">
									{progressPercentage}%
								</span>
							</div>
							<div className="h-2 overflow-hidden rounded-full bg-sage-100 dark:bg-sage-900/30">
								<motion.div
									initial={{ width: 0 }}
									animate={{ width: `${progressPercentage}%` }}
									transition={{ duration: 1, delay: index * 0.1 + 0.3 }}
									className="h-full rounded-full bg-gradient-to-r from-sage-500 to-sage-600 dark:from-sage-400 dark:to-sage-500"
								/>
							</div>
						</div>

						{/* Stats */}
						<div className="flex items-center gap-4 text-sm text-earth-600 dark:text-[#CFC7BB]">
							<div className="flex items-center gap-1.5">
								<CheckCircle2 className="h-4 w-4" />
								<span>{progress.completedDays.length} completed</span>
							</div>
							<div className="flex items-center gap-1.5">
								<Calendar className="h-4 w-4" />
								<span>{daysRemaining} days left</span>
							</div>
						</div>

						{/* Streak badge */}
						{progress.streak >= 3 && (
							<div className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-sage-100 px-3 py-1 text-xs font-medium text-sage-700 dark:bg-sage-900/30 dark:text-sage-400">
								<Flame className="h-3.5 w-3.5" /> {progress.streak} day streak!
							</div>
						)}
					</div>
				</div>
			</Link>
		</motion.div>
	);
}

interface ActiveProgramsProps {
	programs: Array<{ program: Program; progress: ProgramProgress }>;
	loading?: boolean;
}

export default function ActivePrograms({ programs, loading = false }: ActiveProgramsProps) {
	if (loading) {
		return (
			<div className="space-y-4">
				{[...Array(2)].map((_, i) => (
					<div
						key={i}
						className="h-48 animate-pulse rounded-2xl bg-cream-200 dark:bg-[#1A1D23]"
					/>
				))}
			</div>
		);
	}

	if (programs.length === 0) {
		return (
			<div className="rounded-2xl border border-dashed border-sage-300 bg-cream-50 p-8 text-center dark:border-white/10 dark:bg-[#1A1D23]">
				<div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-sage-100 dark:bg-sage-900/30">
					<Target className="h-8 w-8 text-sage-600 dark:text-sage-400" />
				</div>
				<h3 className="mb-2 text-lg font-semibold text-earth-900 dark:text-[#F4EFE6]">
					No active programs
				</h3>
				<p className="mb-4 text-sm text-earth-600 dark:text-[#CFC7BB]">
					Start a transformation program to track your progress
				</p>
				<button
					type="button"
					onClick={() => useAppStore.getState().setNavSelection("programs")}
					className="inline-flex items-center gap-2 rounded-xl bg-sage-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-sage-700 dark:bg-sage-500 dark:hover:bg-sage-600"
				>
					Browse Programs
					<ArrowRight className="h-4 w-4" />
				</button>
			</div>
		);
	}

	return (
		<div className="space-y-4">
			{programs.map((item, index) => (
				<ActiveProgramCard
					key={item.program.id}
					program={item.program}
					progress={item.progress}
					index={index}
				/>
			))}
		</div>
	);
}

function Target({ className }: { className?: string }) {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
			strokeWidth={1.5}
			stroke="currentColor"
			className={className}
		>
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				d="M12 6v6m0 0v6m0-6h6m-6 0H6"
			/>
		</svg>
	);
}
