import { NextResponse } from "next/server";
import { getQuickResets } from "@/lib/database/contentService";
import { QUICK_RESETS } from "@/lib/mockData/quickResets";

export async function GET() {
	// Try database first, fall back to mock data
	const { data: dbResets, error } = await getQuickResets();

	if (!error && dbResets.length > 0) {
		return NextResponse.json({
			total: dbResets.length,
			items: dbResets,
		});
	}

	// Fallback to mock data
	return NextResponse.json({
		total: QUICK_RESETS.length,
		items: QUICK_RESETS,
	});
}
