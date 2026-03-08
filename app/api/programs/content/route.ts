import { NextResponse } from "next/server";
import { getPrograms } from "@/lib/database/contentService";

export async function GET() {
	const { data: dbPrograms, error } = await getPrograms();

	if (error) {
		return NextResponse.json({ error: error.message }, { status: 500 });
	}

	return NextResponse.json({
		total: dbPrograms.length,
		items: dbPrograms,
	});
}
