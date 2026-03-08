"use client";

import { useRouter } from "next/navigation";
import { useAppStore } from "@/lib/stores/appStore";

export function MotivationCTA() {
	const setNavSelection = useAppStore((state) => state.setNavSelection);
	const router = useRouter();

	const navigate = (section: "meditations" | "programs") => {
		setNavSelection(section);
		router.push("/");
	};

	return (
		<div className="flex flex-wrap justify-center gap-4">
			<button
				type="button"
				onClick={() => navigate("meditations")}
				className="rounded-xl bg-sage-600 px-6 py-3 font-medium text-white transition-colors hover:bg-sage-700 dark:bg-sage-500 dark:hover:bg-sage-600"
			>
				Start Meditating
			</button>
			<button
				type="button"
				onClick={() => navigate("programs")}
				className="rounded-xl border-2 border-sage-600 px-6 py-3 font-medium text-sage-700 transition-colors hover:bg-sage-50 dark:border-sage-400 dark:text-sage-400 dark:hover:bg-sage-900/30"
			>
				Browse Programs
			</button>
		</div>
	);
}
