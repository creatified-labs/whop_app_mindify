"use client";

import { useCallback } from "react";
import { useIframeSdk } from "@whop/react/iframe";

export function useExternalUrl() {
	const sdk = useIframeSdk();

	const openUrl = useCallback(
		async (url: string) => {
			try {
				await sdk.openExternalUrl({ url, newTab: true });
			} catch {
				// Fallback for local dev outside iframe context
				window.open(url, "_blank", "noopener,noreferrer");
			}
		},
		[sdk],
	);

	return { openUrl };
}
