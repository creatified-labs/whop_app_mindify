"use client";

import { motion } from "framer-motion";
import { MindifyPanel } from "@/components/ui/MindifyPanel";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { EmptyState } from "@/components/ui/EmptyState";
import { Brain } from "lucide-react";
import type { HypnosisSession } from "@/lib/types";

interface HypnosisStackProps {
	hypnosisSessions?: HypnosisSession[];
}

export function HypnosisStack({ hypnosisSessions = [] }: HypnosisStackProps) {
	if (hypnosisSessions.length === 0) {
		return (
			<section className="space-y-8">
				<SectionHeading
					eyebrow="Hypnosis Lab"
					title="Scripted neural journeys"
					description="Clinical hypnotists craft each ritual with somatic cues, layered storytelling, and precise breath patterning."
				/>
				<EmptyState
					icon={<Brain className="h-10 w-10 text-purple-500" />}
					title="No hypnosis sessions yet"
					description="The creator hasn't added any hypnosis sessions yet. Check back soon!"
				/>
			</section>
		);
	}

	return (
		<section className="space-y-8">
			<SectionHeading
				eyebrow="Hypnosis Lab"
				title="Scripted neural journeys"
				description="Clinical hypnotists craft each ritual with somatic cues, layered storytelling, and precise breath patterning."
			/>
			<div className="grid gap-6 lg:grid-cols-3">
				{hypnosisSessions.map((session, index) => (
					<motion.div
						key={session.id}
						initial={{ opacity: 0, translateY: 20 }}
						whileInView={{ opacity: 1, translateY: 0 }}
						transition={{ delay: index * 0.08 }}
						viewport={{ once: true }}
					>
						<MindifyPanel
							tone="deep"
							header={
								<div className="text-xs uppercase tracking-[0.3em] text-earth-500">
									{session.theme}
								</div>
							}
						>
							<h3 className="text-2xl font-serif font-semibold text-earth-900">{session.title}</h3>
							<p className="mt-2 text-base leading-relaxed text-earth-600">
								{session.description}
							</p>
							<div className="mt-6 flex items-center justify-between text-sm text-earth-600">
								<span>Guided Duration</span>
								<span className="text-earth-900 font-semibold">{session.duration}m</span>
							</div>
						</MindifyPanel>
					</motion.div>
				))}
			</div>
		</section>
	);
}
