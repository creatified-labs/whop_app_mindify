import { NextResponse } from "next/server";
import { getHypnosisSessions } from "@/lib/database/contentService";
import { filterHypnosisSessions } from "@/lib/mockData/hypnosis";

export async function GET(request: Request) {
	const { searchParams } = new URL(request.url);
	const theme = (searchParams.get("theme") as string) ?? "all";

	// Try database first, fall back to mock data
	const { data: dbSessions, error } = await getHypnosisSessions();

	if (!error && dbSessions.length > 0) {
		const filtered = theme === "all"
			? dbSessions
			: dbSessions.filter((s) => s.theme === theme);

		return NextResponse.json({
			total: filtered.length,
			items: filtered,
			recommendation: theme === "all" ? "Try 7 consecutive days for best results" : undefined,
		});
	}

	// Fallback to mock data
	const sessions = filterHypnosisSessions(theme === "all" ? undefined : (theme as any));
	return NextResponse.json({
		total: sessions.length,
		items: sessions,
		recommendation: theme === "all" ? "Try 7 consecutive days for best results" : undefined,
	});
}
