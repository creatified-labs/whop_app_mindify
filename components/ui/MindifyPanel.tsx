import type { PropsWithChildren, ReactNode } from "react";
import type { ChromaticTone } from "@/types";

const toneStyles: Record<ChromaticTone, string> = {
	deep: "border-[rgb(var(--sage-100))] bg-white text-[rgb(var(--earth-900))] shadow-card dark:border-white/10 dark:bg-[#13151A] dark:text-[#F4EFE6]",
	lagoon: "border-transparent bg-gradient-sage text-white shadow-glow-sage",
	mist: "border-[rgb(var(--sage-100))] bg-white text-[rgb(var(--earth-900))] shadow-card dark:border-white/10 dark:bg-[#12141A] dark:text-[#F4EFE6]",
	twilight: "border-[rgb(var(--cream-200))] bg-gradient-zen text-[rgb(var(--earth-900))] shadow-card dark:border-white/10 dark:bg-[#14171F] dark:text-[#F4EFE6]",
	dusk: "border-transparent bg-gradient-card text-[rgb(var(--earth-900))] shadow-card dark:text-[#F4EFE6]",
	rose: "border-[rgb(var(--gold-100))] bg-gradient-to-br from-[rgb(var(--gold-50))] via-[rgb(var(--cream-50))] to-[rgb(var(--cream-50))] text-[rgb(var(--earth-900))] shadow-card dark:border-white/10 dark:from-[#1B1410] dark:via-[#13151A] dark:to-[#13151A] dark:text-[#F4EFE6]",
};

export function MindifyPanel({
	children,
	tone = "deep",
	className = "",
	header,
}: PropsWithChildren<{ tone?: ChromaticTone; className?: string; header?: ReactNode }>) {
	return (
		<div
			className={`relative overflow-hidden rounded-3xl border p-6 transition-shadow duration-300 hover:shadow-hover ${toneStyles[tone]} ${className}`}
		>
			<div className="relative z-10 space-y-4">
				{header}
				{children}
			</div>
			<div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.12),_transparent_65%)]" />
		</div>
	);
}

export function StatBadge({ label, value }: { label: string; value: ReactNode }) {
	return (
		<div className="rounded-full border border-[rgb(var(--sage-200))] bg-white px-4 py-1 text-[0.7rem] uppercase tracking-[0.3em] text-[rgb(var(--earth-600))] dark:border-white/10 dark:bg-[#111318] dark:text-[#BFB6A8]">
			<span className="font-semibold text-[rgb(var(--earth-700))] dark:text-[#D9D3C8]">{label}: </span>
			<span className="text-[rgb(var(--earth-900))] dark:text-[#F4EFE6]">{value}</span>
		</div>
	);
}
