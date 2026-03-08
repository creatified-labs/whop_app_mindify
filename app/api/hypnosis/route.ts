import { NextResponse } from "next/server";
import { getHypnosisSessions } from "@/lib/database/contentService";
import { extractCompanyId } from "@/lib/auth/getAuthUser";

export async function GET(request: Request) {
	const companyId = extractCompanyId(request);
	const { searchParams } = new URL(request.url);
	const theme = (searchParams.get("theme") as string) ?? "all";

	const { data: dbSessions, error } = await getHypnosisSessions(companyId);

	if (error) {
		return NextResponse.json({ error: error.message }, { status: 500 });
	}

	const filtered = theme === "all"
		? dbSessions
		: dbSessions.filter((s) => s.theme === theme);

	return NextResponse.json({
		total: filtered.length,
		items: filtered,
		recommendation: theme === "all" ? "Try 7 consecutive days for best results" : undefined,
	});
}
