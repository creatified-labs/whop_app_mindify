"use client";

import Image from "next/image";
type MeditationPlayerProps = {
	session: {
		id: string;
		title: string;
		imageUrl: string;
		duration: number;
	};
	onClose: () => void;
};

export function MeditationPlayer({ session, onClose }: MeditationPlayerProps) {
	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-8 backdrop-blur-xl">
			<div className="w-full max-w-2xl overflow-hidden rounded-3xl bg-cream-50 shadow-2xl dark:bg-[#14171F]">
				<div className="relative h-80">
					<Image src={session.imageUrl} alt={session.title} fill className="object-cover" />
					<div className="absolute inset-0 opacity-40 bg-gradient-meditation" />
					<button
						type="button"
						onClick={onClose}
						className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-cream-50/90 text-earth-700 transition hover:bg-cream-100 dark:bg-[#111318]/90 dark:text-[#E2DBCF] dark:hover:bg-[#1C2029]"
					>
						✕
					</button>
				</div>

				<div className="p-8">
					<h2 className="text-2xl font-bold text-earth-900">{session.title}</h2>
					<p className="mt-1 text-earth-600">{session.duration} minutes</p>

					<div className="mt-6">
						<div className="h-2 overflow-hidden rounded-full bg-sage-100">
							<div className="h-full w-1/2 rounded-full bg-gradient-sage transition-all" />
						</div>
						<div className="mt-2 flex justify-between text-sm text-earth-600">
							<span>5:23</span>
							<span>12:00</span>
						</div>
					</div>

					<div className="mt-6 flex items-center justify-center gap-6">
						<button className="flex h-12 w-12 items-center justify-center rounded-full bg-sage-50 text-xl text-earth-700">
							⏮
						</button>
						<button className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-sage text-2xl text-white shadow-lg transition hover:scale-105 hover:shadow-xl">
							▶
						</button>
						<button className="flex h-12 w-12 items-center justify-center rounded-full bg-sage-50 text-xl text-earth-700">
							⏭
						</button>
					</div>

					<div className="mt-6 flex items-center justify-between border-t border-sage-100 pt-6 text-earth-600">
						<button type="button">🔀 Queue</button>
						<button type="button">🔊 Volume</button>
						<button type="button">⚙️ Speed</button>
					</div>
				</div>
			</div>
		</div>
	);
}
