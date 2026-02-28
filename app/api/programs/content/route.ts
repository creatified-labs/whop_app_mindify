import { NextResponse } from "next/server";
import { getPrograms } from "@/lib/database/contentService";
import { PROGRAMS_LIBRARY } from "@/lib/mockData/programs";

export async function GET() {
	// Try database first, fall back to mock data
	const { data: dbPrograms, error } = await getPrograms();

	if (!error && dbPrograms.length > 0) {
		return NextResponse.json({
			total: dbPrograms.length,
			items: dbPrograms,
		});
	}

	// Fallback to mock data
	return NextResponse.json({
		total: PROGRAMS_LIBRARY.length,
		items: PROGRAMS_LIBRARY,
	});
}
