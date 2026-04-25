import Link from "next/link";
import { Button } from "@whop/react/components";
import {
	FEATURE_PILLARS,
	HERO_COPY,
	PROGRESS_METRICS,
} from "@/constants";
import { getSettings } from "@/lib/database/settingsService";
import { AppLayout } from "@/components/layout/AppLayout";
import {
	ExperienceContent,
	type ContinueSession,
	type ProgramSnapshot,
	type FavoriteSession,
	type ActivityItem,
} from "@/components/ui/DashboardView";
import {
	resolveExperienceCopy,
	resolveExperienceFields,
	resolveExperienceSections,
} from "@/lib/ui/experienceCopy";
import type { UserProgress } from "@/lib/types";
import { ProgramGallery } from "@/components/programs/ProgramGallery";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { MindifyPanel } from "@/components/ui/MindifyPanel";

const streakDays = 6;
const continueSession: ContinueSession = {
	id: "limbic-release",
	title: "Limbic Release Reset",
	type: "meditation",
	progressPercent: 62,
	durationMinutes: 18,
};

const currentProgram: ProgramSnapshot = {
	programId: "neuro-leadership",
	title: "NeuroLeadership Reset",
	progressPercent: 48,
	nextMilestone: "Polyvagal mapping practice",
	isPremium: true,
};

const favorites: FavoriteSession[] = [
	{ id: "alpha-entrain", title: "Alpha Wave Entrainment", type: "meditation", durationMinutes: 14 },
	{ id: "soma-glow", title: "Soma Glow", type: "hypnosis", durationMinutes: 22, isPremium: true },
];

const recentActivity: ActivityItem[] = [
	{ id: "activity-1", label: "Completed Chronos Soften meditation", timestamp: new Date().toISOString(), type: "meditation" },
];

const userProgress: UserProgress = {
	userId: "demo",
	completedMeditations: ["alpha-entrain"],
	completedHypnosis: ["soma-glow"],
	currentPrograms: [{ programId: "neuro-leadership", currentDay: 5, startDate: new Date().toISOString(), completedDays: [1, 2, 3, 4] }],
	totalMinutesMeditated: 128,
	streakDays,
	lastActivityDate: new Date().toISOString(),
};

export default async function HomePage() {
	const { data: settings } = await getSettings("demo");
	return (
		<AppLayout userName="Creatified" streakDays={streakDays} membershipTier="free">
			<main className="space-y-16">
				<section className="relative overflow-hidden rounded-4xl border border-sage-100 bg-cream-50 p-8 shadow-card dark:border-white/10 dark:bg-[#13151A]">
					<div className="absolute right-0 top-0 opacity-10 text-sage-400 dark:text-white/10">
						<svg width="220" height="220" viewBox="0 0 100 100" fill="none">
							<circle cx="50" cy="20" r="10" fill="currentColor" />
							<path d="M35 35 Q50 32 65 35 L60 52 Q50 62 40 52 Z" fill="currentColor" />
							<ellipse cx="35" cy="62" rx="8" ry="6" fill="currentColor" />
							<ellipse cx="65" cy="62" rx="8" ry="6" fill="currentColor" />
						</svg>
					</div>
					<div className="relative z-10 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
						<div className="space-y-6">
							<p className="text-xs uppercase tracking-[0.5em] text-sage-600 dark:text-[#BFAF96]">{settings?.appTagline || HERO_COPY.tagline}</p>
							<h1 className="font-serif text-4xl lg:text-5xl text-earth-900 dark:text-[#F4EFE6]">{HERO_COPY.title}</h1>
							<p className="text-earth-600 dark:text-[#CFC7BB]">{HERO_COPY.description}</p>
							<div className="flex flex-wrap gap-3">
								<Link href="/experiences/demo">
									<Button variant="solid">Launch Whop Experience</Button>
								</Link>
								<Link href="https://docs.whop.com/apps" target="_blank" className="inline-flex">
									<Button variant="ghost">Read the SDK guide</Button>
								</Link>
							</div>
						</div>
						<div className="grid gap-4 lg:grid-cols-2">
							{FEATURE_PILLARS.map((pillar) => (
								<MindifyPanel key={pillar} tone="mist" className="p-4">
									<p className="text-sm uppercase tracking-[0.4em] text-earth-500 dark:text-[#AFA79B]">Pillar</p>
									<p className="text-lg font-medium text-earth-900 dark:text-[#F4EFE6]">{pillar}</p>
								</MindifyPanel>
							))}
						</div>
					</div>
				</section>

				<ExperienceContent
					userName="Creatified"
					membershipTier="free"
					continueSession={continueSession}
					currentProgram={currentProgram}
					favorites={favorites}
					recentActivity={recentActivity}
					streakDays={streakDays}
					userProgress={userProgress}
					companyId="demo"
					experienceCopy={resolveExperienceCopy()}
					experienceSections={resolveExperienceSections()}
					experienceFields={resolveExperienceFields()}
				/>

				<ProgramGallery />

				<section className="space-y-8">
					<SectionHeading
						eyebrow="Telemetry"
						title="Track nervous system recovery"
						description="Mindify pairs biofeedback with usage data so you spot patterns across your company access."
					/>
					<div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
						<MindifyPanel tone="mist" className="p-8">
							<div className="flex flex-wrap items-center gap-4 text-xs uppercase tracking-[0.4em] text-earth-500 dark:text-[#AFA79B]">
								<span>24h window</span>
								<span>alpha coherence</span>
								<span>team Atrium</span>
							</div>
							<div className="mt-8 grid gap-4 sm:grid-cols-2">
								{PROGRESS_METRICS.map((metric) => (
									<div key={metric.label} className="rounded-3xl border border-sage-100 bg-cream-50 p-4 shadow-soft dark:border-white/10 dark:bg-[#111318]">
										<p className="text-sm text-earth-500 dark:text-[#AFA79B]">{metric.label}</p>
										<p className="mt-2 text-3xl font-serif font-semibold text-earth-900 dark:text-[#F4EFE6]">{metric.change}</p>
									</div>
								))}
							</div>
						</MindifyPanel>
						<MindifyPanel tone="lagoon" className="p-8">
							<p className="text-sm uppercase tracking-[0.4em] text-white/80">Whop SDK</p>
							<h3 className="mt-3 text-3xl font-serif font-semibold">Ready for your B2B members</h3>
							<p className="mt-4 text-base leading-relaxed text-white/90">
								Authenticate Whop users, gate experiences by company, and stream data into your rituals dashboard. We handle the Whop App shell so you can focus on building Mindify.
							</p>
							<Link href="https://docs.whop.com/apps" target="_blank" className="mt-8 inline-block">
								<Button variant="classic" size="3">
									Read the SDK guide
								</Button>
							</Link>
						</MindifyPanel>
					</div>
				</section>
			</main>
		</AppLayout>
	);
}
