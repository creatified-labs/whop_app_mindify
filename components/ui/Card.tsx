"use client";

import Image from "next/image";
import { Sparkles, Calendar, Target } from "lucide-react";

type Session = {
	id: string;
	title: string;
	description: string;
	duration: number;
	imageUrl: string;
	isPremium?: boolean;
	mood?: string[];
};

type Program = {
	id: string;
	title: string;
	description: string;
	imageUrl: string;
	duration: string;
	days: { title: string }[];
};

export function SessionCard({ session }: { session: Session }) {
	return (
		<div className="group relative cursor-pointer overflow-hidden rounded-2xl bg-white shadow-card transition-all duration-300 hover:shadow-hover dark:bg-[#13151A]">
			<div className="relative h-48 overflow-hidden">
				<Image
					src={session.imageUrl}
					alt={session.title}
					fill
					className="object-cover transition-transform duration-500 group-hover:scale-105"
				/>
				<div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
				<div className="absolute top-3 right-3 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-[rgb(var(--earth-700))] dark:bg-[#111318]/90 dark:text-[#E2DBCF]">
					{session.duration} min
				</div>
				{session.isPremium && (
					<div className="absolute left-3 top-3 rounded-full bg-[rgb(var(--gold-500))] px-3 py-1 text-xs font-semibold text-white">
						<Sparkles className="h-3 w-3 inline" /> Premium
					</div>
				)}
				<div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
					<button className="flex h-16 w-16 items-center justify-center rounded-full bg-white/95 shadow-xl transition-transform hover:scale-110">
						<svg className="ml-1 h-8 w-8 text-[rgb(var(--sage-600))]" fill="currentColor" viewBox="0 0 20 20">
							<path d="M6 4l10 6-10 6V4z" />
						</svg>
					</button>
				</div>
			</div>
			<div className="p-4">
				<h3 className="mb-2 line-clamp-2 font-semibold text-[rgb(var(--earth-900))] text-lg dark:text-[#F4EFE6]">{session.title}</h3>
				<p className="mb-3 line-clamp-2 text-sm text-[rgb(var(--earth-600))] dark:text-[#CFC7BB]">{session.description}</p>
				<div className="flex flex-wrap gap-2">
					{session.mood?.slice(0, 2).map((mood) => (
						<span key={mood} className="rounded-full bg-[rgb(var(--sage-50))] px-3 py-1 text-xs text-[rgb(var(--sage-700))] dark:bg-white/10 dark:text-[#D9D3C8]">
							{mood}
						</span>
					))}
				</div>
			</div>
		</div>
	);
}

type StatCardProps = {
	icon: React.ReactNode;
	label: string;
	value: string | number;
	trend?: string;
};

export function StatCard({ icon, label, value, trend }: StatCardProps) {
	return (
		<div className="rounded-2xl bg-white p-6 shadow-card transition-shadow hover:shadow-hover dark:bg-[#13151A]">
			<div className="mb-4 flex items-start justify-between">
				<div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-card">
					{icon}
				</div>
				{trend && (
					<span className="rounded-full bg-green-50 px-2 py-1 text-xs text-green-600">↑ {trend}</span>
				)}
			</div>
			<div className="mb-1 text-3xl font-bold text-[rgb(var(--earth-900))] dark:text-[#F4EFE6]">{value}</div>
			<div className="text-sm text-[rgb(var(--earth-600))] dark:text-[#CFC7BB]">{label}</div>
		</div>
	);
}

export function ProgramCard({ program }: { program: Program }) {
	return (
		<div className="overflow-hidden rounded-3xl bg-white shadow-card transition-all duration-300 hover:shadow-hover dark:bg-[#13151A]">
			<div className="relative h-64">
				<Image src={program.imageUrl} alt={program.title} fill className="object-cover" />
				<div className="absolute inset-0 opacity-60 bg-gradient-meditation" />
				<div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
					<div className="rounded-xl bg-white/20 p-4 backdrop-blur-md">
						<h3 className="mb-2 text-2xl font-bold">{program.title}</h3>
						<p className="mb-3 text-sm text-white/90">{program.description}</p>
						<div className="flex items-center gap-4 text-sm">
							<span className="flex items-center gap-1"><Calendar className="h-4 w-4" /> {program.duration}</span>
							<span className="flex items-center gap-1"><Target className="h-4 w-4" /> {program.days.length} sessions</span>
						</div>
					</div>
				</div>
			</div>
			<div className="p-6">
				<button className="w-full rounded-xl bg-gradient-sage py-3 font-semibold text-white shadow-medium hover:shadow-hover">
					Start Program
				</button>
			</div>
		</div>
	);
}
