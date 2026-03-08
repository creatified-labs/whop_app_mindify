import { NextResponse } from "next/server";
import { getArticles } from "@/lib/database/contentService";
import { extractCompanyId } from "@/lib/auth/getAuthUser";

export async function GET(request: Request) {
	const companyId = extractCompanyId(request);
	const { data: dbArticles, error } = await getArticles(companyId);

	if (error) {
		return NextResponse.json({ error: error.message }, { status: 500 });
	}

	return NextResponse.json({
		total: dbArticles.length,
		items: dbArticles,
	});
}
