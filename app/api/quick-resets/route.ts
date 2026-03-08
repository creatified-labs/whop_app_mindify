import { NextResponse } from "next/server";
import { getQuickResets } from "@/lib/database/contentService";

export async function GET() {
	const { data: dbResets, error } = await getQuickResets();

	if (error) {
		return NextResponse.json({ error: error.message }, { status: 500 });
	}

	return NextResponse.json({
		total: dbResets.length,
		items: dbResets,
	});
}
