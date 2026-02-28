import { NextResponse } from "next/server";
import { getArticles } from "@/lib/database/contentService";
import { KNOWLEDGE_ARTICLES } from "@/lib/mockData/articles";

export async function GET() {
	// Try database first, fall back to mock data
	const { data: dbArticles, error } = await getArticles();

	if (!error && dbArticles.length > 0) {
		return NextResponse.json({
			total: dbArticles.length,
			items: dbArticles,
		});
	}

	// Fallback to mock data
	return NextResponse.json({
		total: KNOWLEDGE_ARTICLES.length,
		items: KNOWLEDGE_ARTICLES,
	});
}
