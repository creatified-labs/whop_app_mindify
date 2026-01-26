import { NextResponse } from "next/server";
import { filterMeditations } from "@/lib/mockData/meditations";

export async function GET(request: Request) {
	const { searchParams } = new URL(request.url);
	const mood = searchParams.get("mood") ?? undefined;
	const duration = searchParams.get("duration") ?? undefined;
	const category = searchParams.get("category") ?? undefined;

	const results = filterMeditations({ mood, duration, category });

	return NextResponse.json({
		total: results.length,
		items: results,
		filters: { mood: mood ?? "all", duration: duration ?? "all", category: category ?? "all" },
	});
}
