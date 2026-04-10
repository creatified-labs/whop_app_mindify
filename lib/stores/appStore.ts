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
	navHistory: NavSection[];
	filterState: FilterState;
	userProgress: UserProgress | null;
	membershipTier: "free" | "premium";
	companyId: string | null;
	setNavSelection: (section: NavSection) => void;
	goBack: () => void;
	canGoBack: () => boolean;
	setFilterState: (updater: Partial<FilterState>) => void;
	setUserProgress: (progress: UserProgress) => void;
	setMembershipTier: (tier: "free" | "premium") => void;
	setCompanyId: (id: string) => void;
}

export const useAppStore = create<AppStore>((set, get) => ({
	navSelection: "dashboard",
	navHistory: [],
	filterState: DEFAULT_FILTER_STATE,
	userProgress: null,
	membershipTier: "free",
	companyId: null,
	setNavSelection: (section) =>
		set((state) => ({
			navSelection: section,
			navHistory: [...state.navHistory, state.navSelection].slice(-20),
		})),
	goBack: () => {
		const { navHistory } = get();
		if (navHistory.length === 0) return;
		const previous = navHistory[navHistory.length - 1];
		set({ navSelection: previous, navHistory: navHistory.slice(0, -1) });
	},
	canGoBack: () => get().navHistory.length > 0,
	setFilterState: (updater) =>
		set((state) => ({
			filterState: {
				...state.filterState,
				...updater,
			},
		})),
	setUserProgress: (progress) => set({ userProgress: progress }),
	setMembershipTier: (tier) => set({ membershipTier: tier }),
	setCompanyId: (id) => set({ companyId: id }),
}));
