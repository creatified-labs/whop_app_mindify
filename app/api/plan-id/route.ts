import { NextRequest, NextResponse } from "next/server";
import { getSettings } from "@/lib/database/settingsService";

export async function GET(req: NextRequest) {
	const companyId = req.nextUrl.searchParams.get("company_id");
	if (!companyId) {
		return NextResponse.json({ planId: "" });
	}

	const { data } = await getSettings(companyId);
	return NextResponse.json({ planId: data?.premiumPlanId ?? "" });
}
