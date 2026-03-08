import { NextResponse } from "next/server";
import { getArticles } from "@/lib/database/contentService";

export async function GET() {
	const { data: dbArticles, error } = await getArticles();

	if (error) {
		return NextResponse.json({ error: error.message }, { status: 500 });
	}

	return NextResponse.json({
		total: dbArticles.length,
		items: dbArticles,
	});
}
