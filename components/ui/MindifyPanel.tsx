import type { PropsWithChildren, ReactNode } from "react";
import type { ChromaticTone } from "@/types";

const toneStyles: Record<ChromaticTone, string> = {
	deep: "border-sage-100 bg-cream-50 text-earth-900 shadow-card dark:border-white/10 dark:bg-[#13151A] dark:text-[#F4EFE6]",
	lagoon: "border-transparent bg-gradient-sage text-white shadow-glow-sage",
	mist: "border-sage-100 bg-cream-50 text-earth-900 shadow-card dark:border-white/10 dark:bg-[#12141A] dark:text-[#F4EFE6]",
	twilight: "border-cream-200 bg-gradient-zen text-earth-900 shadow-card dark:border-white/10 dark:bg-[#14171F] dark:text-[#F4EFE6]",
	dusk: "border-transparent bg-gradient-card text-earth-900 shadow-card dark:text-[#F4EFE6]",
	rose: "border-gold-100 bg-gradient-to-br from-gold-50 via-cream-50 to-cream-50 text-earth-900 shadow-card dark:border-white/10 dark:from-[#1B1410] dark:via-[#13151A] dark:to-[#13151A] dark:text-[#F4EFE6]",
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
		<div className="rounded-full border border-sage-200 bg-cream-50 px-4 py-1 text-[0.7rem] uppercase tracking-[0.3em] text-earth-600 dark:border-white/10 dark:bg-[#111318] dark:text-[#BFB6A8]">
			<span className="font-semibold text-earth-700 dark:text-[#D9D3C8]">{label}: </span>
			<span className="text-earth-900 dark:text-[#F4EFE6]">{value}</span>
		</div>
	);
}
