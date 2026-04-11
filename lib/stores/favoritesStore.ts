"use client";

import { create } from "zustand";
import type { AudioTrackContext } from "@/lib/types";

/**
 * Client-side favorites store.
 *
 * Seeded from /api/user/favorites on first load, kept in sync with the server
 * via optimistic updates on toggle. The home dashboard's Favorites strip is
 * server-rendered from page.tsx, so callers should call router.refresh() after
 * a toggle to keep that strip up to date. (Optimistic local state handles the
 * immediate feedback on the heart button itself.)
 */
export type FavoriteContentType = AudioTrackContext | "article";

interface FavoritesStore {
	/** Per-type sets of favorited content IDs. */
	ids: Record<FavoriteContentType, Set<string>>;
	/** True once we've loaded the initial state from the API. */
	initialized: boolean;
	/** Company we initialized for — re-init if this changes. */
	initializedCompanyId: string | null;

	initialize: (companyId: string) => Promise<void>;
	isFavorited: (contentType: FavoriteContentType, contentId: string) => boolean;
	toggleFavorite: (
		contentType: FavoriteContentType,
		contentId: string,
		companyId: string,
	) => Promise<void>;
}

const emptyIds = (): FavoritesStore["ids"] => ({
	meditation: new Set(),
	hypnosis: new Set(),
	reset: new Set(),
	program: new Set(),
	article: new Set(),
});

export const useFavoritesStore = create<FavoritesStore>((set, get) => ({
	ids: emptyIds(),
	initialized: false,
	initializedCompanyId: null,

	initialize: async (companyId: string) => {
		const state = get();
		if (state.initialized && state.initializedCompanyId === companyId) return;

		try {
			const res = await fetch(
				`/api/user/favorites?company_id=${encodeURIComponent(companyId)}`,
			);
			if (!res.ok) {
				set({ initialized: true, initializedCompanyId: companyId });
				return;
			}
			const data = (await res.json()) as {
				favorites?: Array<{ content_type: FavoriteContentType; content_id: string }>;
			};

			const next = emptyIds();
			for (const fav of data.favorites ?? []) {
				const bucket = next[fav.content_type];
				if (bucket) bucket.add(fav.content_id);
			}

			set({ ids: next, initialized: true, initializedCompanyId: companyId });
		} catch (err) {
			console.error("[favoritesStore] Failed to initialize:", err);
			set({ initialized: true, initializedCompanyId: companyId });
		}
	},

	isFavorited: (contentType, contentId) => {
		return get().ids[contentType]?.has(contentId) ?? false;
	},

	toggleFavorite: async (contentType, contentId, companyId) => {
		const currentIds = get().ids;
		const wasFavorited = currentIds[contentType]?.has(contentId) ?? false;

		// Optimistic update
		const nextBucket = new Set(currentIds[contentType]);
		if (wasFavorited) nextBucket.delete(contentId);
		else nextBucket.add(contentId);
		set({ ids: { ...currentIds, [contentType]: nextBucket } });

		try {
			const res = await fetch(
				`/api/user/favorites?company_id=${encodeURIComponent(companyId)}`,
				{
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						content_type: contentType,
						content_id: contentId,
						toggle: true,
					}),
				},
			);
			if (!res.ok) throw new Error(`Toggle failed: ${res.status}`);
		} catch (err) {
			console.error("[favoritesStore] Failed to toggle favorite:", err);
			// Revert optimistic update
			const revertBucket = new Set(get().ids[contentType]);
			if (wasFavorited) revertBucket.add(contentId);
			else revertBucket.delete(contentId);
			set({ ids: { ...get().ids, [contentType]: revertBucket } });
		}
	},
}));
