"use client";

import { motion } from "framer-motion";
import { HYPNOSIS_JOURNEYS } from "@/constants";
import { MindifyPanel } from "@/components/ui/MindifyPanel";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function HypnosisStack() {
	return (
		<section className="space-y-8">
			<SectionHeading
				eyebrow="Hypnosis Lab"
				title="Scripted neural journeys"
				description="Clinical hypnotists craft each ritual with somatic cues, layered storytelling, and precise breath patterning."
			/>
			<div className="grid gap-6 lg:grid-cols-3">
				{HYPNOSIS_JOURNEYS.map((journey, index) => (
					<motion.div
						key={journey.id}
						initial={{ opacity: 0, translateY: 20 }}
						whileInView={{ opacity: 1, translateY: 0 }}
						transition={{ delay: index * 0.08 }}
						viewport={{ once: true }}
					>
						<MindifyPanel
							tone={journey.tone}
							header={
								<div className="text-xs uppercase tracking-[0.3em] text-earth-500">
									{journey.goal}
								</div>
							}
						>
							<h3 className="text-2xl font-serif font-semibold text-earth-900">{journey.title}</h3>
							<p className="text-sm text-earth-600">
								Script by{" "}
								<span className="font-medium text-earth-700">{journey.scriptAuthor}</span>
							</p>
							<p className="mt-4 text-base font-medium text-sage-600 tracking-wide">
								{journey.imageryCue}
							</p>
							<div className="mt-6 flex items-center justify-between text-sm text-earth-600">
								<span>Guided Duration</span>
								<span className="text-earth-900 font-semibold">{journey.duration}m</span>
							</div>
						</MindifyPanel>
					</motion.div>
				))}
			</div>
		</section>
	);
}
