import { NextResponse } from "next/server";
import { filterHypnosisSessions } from "@/lib/mockData/hypnosis";

export async function GET(request: Request) {
	const { searchParams } = new URL(request.url);
	const theme = (searchParams.get("theme") as string) ?? "all";
	const sessions = filterHypnosisSessions(theme === "all" ? undefined : (theme as any));
	return NextResponse.json({
		total: sessions.length,
		items: sessions,
		recommendation: theme === "all" ? "Try 7 consecutive days for best results" : undefined,
	});
}
