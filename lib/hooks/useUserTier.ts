"use client";

import { useAppStore } from "@/lib/stores/appStore";

export function useUserTier() {
	return useAppStore((state) => state.membershipTier);
}
