"use client";

import { create } from "zustand";
import { DEFAULT_FILTER_STATE } from "../constants";
import type { FilterState, UserProgress } from "../types";

export type NavSection =
	| "dashboard"
	| "meditations"
	| "hypnosis"
	| "programs"
	| "quick-resets"
	| "knowledge-hub"
	| "community";

interface AppStore {
	navSelection: NavSection;
	filterState: FilterState;
	userProgress: UserProgress | null;
	membershipTier: "free" | "premium";
	setNavSelection: (section: NavSection) => void;
	setFilterState: (updater: Partial<FilterState>) => void;
	setUserProgress: (progress: UserProgress) => void;
	setMembershipTier: (tier: "free" | "premium") => void;
}

export const useAppStore = create<AppStore>((set) => ({
	navSelection: "dashboard",
	filterState: DEFAULT_FILTER_STATE,
	userProgress: null,
	membershipTier: "free",
	setNavSelection: (section) => set({ navSelection: section }),
	setFilterState: (updater) =>
		set((state) => ({
			filterState: {
				...state.filterState,
				...updater,
			},
		})),
	setUserProgress: (progress) => set({ userProgress: progress }),
	setMembershipTier: (tier) => set({ membershipTier: tier }),
}));
