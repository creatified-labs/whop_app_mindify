import { NextResponse } from "next/server";
import { getMeditations } from "@/lib/database/contentService";
import { filterMeditations } from "@/lib/mockData/meditations";

export async function GET(request: Request) {
	const { searchParams } = new URL(request.url);
	const mood = searchParams.get("mood") ?? undefined;
	const duration = searchParams.get("duration") ?? undefined;
	const category = searchParams.get("category") ?? undefined;

	// Try database first, fall back to mock data
	const { data: dbMeditations, error } = await getMeditations();

	if (!error && dbMeditations.length > 0) {
		// Apply filters in-memory for DB results
		const filtered = dbMeditations.filter((m) => {
			const matchesMood = !mood || mood === "all" || m.mood.includes(mood as any);
			const matchesCategory = !category || category === "all" || m.category === category;
			const matchesDuration = (() => {
				if (!duration || duration === "all") return true;
				if (duration === "1-5") return m.duration >= 1 && m.duration <= 5;
				if (duration === "6-10") return m.duration >= 6 && m.duration <= 10;
				if (duration === "11-20") return m.duration >= 11 && m.duration <= 20;
				if (duration === "20+") return m.duration >= 21;
				return true;
			})();
			return matchesMood && matchesCategory && matchesDuration;
		});

		return NextResponse.json({
			total: filtered.length,
			items: filtered,
			filters: { mood: mood ?? "all", duration: duration ?? "all", category: category ?? "all" },
		});
	}

	// Fallback to mock data
	const results = filterMeditations({ mood, duration, category });
	return NextResponse.json({
		total: results.length,
		items: results,
		filters: { mood: mood ?? "all", duration: duration ?? "all", category: category ?? "all" },
	});
}
