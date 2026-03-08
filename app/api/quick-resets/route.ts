import { NextResponse } from "next/server";
import { getQuickResets } from "@/lib/database/contentService";
import { extractCompanyId } from "@/lib/auth/getAuthUser";

export async function GET(request: Request) {
	const companyId = extractCompanyId(request);
	const { data: dbResets, error } = await getQuickResets(companyId);

	if (error) {
		return NextResponse.json({ error: error.message }, { status: 500 });
	}

	return NextResponse.json({
		total: dbResets.length,
		items: dbResets,
	});
}
