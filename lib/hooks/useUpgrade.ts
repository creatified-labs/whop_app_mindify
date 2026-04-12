"use client";

import { useState, useEffect, useCallback } from "react";
import { useIframeSdk } from "@whop/react/iframe";

export function useUpgrade(companyId: string) {
	const sdk = useIframeSdk();
	const [planId, setPlanId] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		if (!companyId) return;
		fetch(`/api/plan-id?company_id=${encodeURIComponent(companyId)}`)
			.then((res) => res.json())
			.then((data) => setPlanId(data.planId || null))
			.catch(() => {});
	}, [companyId]);

	const triggerUpgrade = useCallback(async () => {
		if (!planId) {
			console.warn("[useUpgrade] No premium plan ID configured");
			return;
		}
		setIsLoading(true);
		try {
			const result = await sdk.inAppPurchase({ planId });
			if (result.status === "ok") {
				window.location.reload();
			}
		} catch (err) {
			console.error("[useUpgrade] Purchase failed:", err);
		} finally {
			setIsLoading(false);
		}
	}, [sdk, planId]);

	return { triggerUpgrade, isLoading, hasPlanId: !!planId };
}
