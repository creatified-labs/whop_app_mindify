"use client";

import { motion } from "framer-motion";
import { MIND_PROGRAMS } from "@/constants";
import { MindifyPanel } from "@/components/ui/MindifyPanel";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function ProgramGallery() {
	return (
		<section className="space-y-8">
			<SectionHeading
				eyebrow="Programs"
				title="Guided labs & rituals"
				description="Layer Mindify programs onto your Whop access tiers to deliver measurable nervous system support."
			/>
			<div className="grid gap-6 lg:grid-cols-3">
				{MIND_PROGRAMS.map((program, index) => (
					<motion.div
						key={program.id}
						initial={{ opacity: 0, translateY: 30 }}
						whileInView={{ opacity: 1, translateY: 0 }}
						transition={{ delay: index * 0.06 }}
						viewport={{ once: true }}
					>
						<MindifyPanel
							tone={program.tone}
							header={
								<div className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-earth-500">
									<span>{program.cadence}</span>
									<span>{program.startDate}</span>
								</div>
							}
						>
							<h3 className="text-2xl font-serif font-semibold text-earth-900">{program.title}</h3>
							<p className="mt-3 text-base leading-relaxed text-earth-600">
								{program.description}
							</p>
							<ul className="mt-5 space-y-2 text-sm text-earth-600">
								{program.modules.map((module) => (
									<li key={module} className="flex items-center gap-2">
										<span className="h-1.5 w-1.5 rounded-full bg-sage-300" />
										{module}
									</li>
								))}
							</ul>
						</MindifyPanel>
					</motion.div>
				))}
			</div>
		</section>
	);
}
