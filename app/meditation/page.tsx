import { SectionHeading } from "@/components/ui/SectionHeading";
import { MeditationGrid } from "@/components/meditation/MeditationGrid";

export default function MeditationPage() {
	return (
		<div className="min-h-screen space-y-6 px-4 py-6 pb-24 sm:space-y-10 sm:px-8 sm:py-12 lg:px-16">
			<SectionHeading
				eyebrow="Mindify Meditation"
				title="Curate science-backed journeys"
				description="Use this space to curate curated rituals, playlists, or live studio drops."
			/>
			<MeditationGrid />
		</div>
	);
}
