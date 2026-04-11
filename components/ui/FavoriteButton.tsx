"use client";

import { Heart } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/lib/stores/appStore";
import {
	useFavoritesStore,
	type FavoriteContentType,
} from "@/lib/stores/favoritesStore";

/**
 * Heart-shaped toggle button. Uses the global favoritesStore for state and
 * calls router.refresh() after each successful toggle so the server-rendered
 * Favorites strip on the home dashboard stays in sync.
 *
 * Stops click propagation so wrapping it inside a parent button (e.g. a card
 * that plays the track on click) doesn't trigger the parent action.
 */
export function FavoriteButton({
	contentType,
	contentId,
	className = "",
	size = "md",
	variant = "ghost",
	stopPropagation = true,
}: {
	contentType: FavoriteContentType;
	contentId: string;
	className?: string;
	size?: "sm" | "md" | "lg";
	variant?: "ghost" | "solid";
	stopPropagation?: boolean;
}) {
	const router = useRouter();
	const companyId = useAppStore((state) => state.companyId);
	const isFavorited = useFavoritesStore((state) => state.isFavorited(contentType, contentId));
	const toggleFavorite = useFavoritesStore((state) => state.toggleFavorite);

	const sizeClasses =
		size === "sm"
			? "h-7 w-7"
			: size === "lg"
				? "h-10 w-10"
				: "h-8 w-8";
	const iconClasses =
		size === "sm" ? "h-3.5 w-3.5" : size === "lg" ? "h-5 w-5" : "h-4 w-4";

	const variantClasses =
		variant === "solid"
			? "bg-white/90 text-[rgb(var(--earth-900))] shadow-sm hover:bg-white dark:bg-white/10 dark:text-white dark:hover:bg-white/20"
			: "bg-black/20 text-white hover:bg-black/40 dark:bg-white/10 dark:hover:bg-white/20";

	const handleClick = async (e: React.MouseEvent) => {
		if (stopPropagation) {
			e.stopPropagation();
			e.preventDefault();
		}
		if (!companyId) return;
		await toggleFavorite(contentType, contentId, companyId);
		router.refresh();
	};

	return (
		<button
			type="button"
			onClick={handleClick}
			aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
			aria-pressed={isFavorited}
			className={`inline-flex shrink-0 items-center justify-center rounded-full transition ${sizeClasses} ${variantClasses} ${className}`}
		>
			<Heart
				className={`${iconClasses} transition ${
					isFavorited
						? "fill-[rgb(var(--sage-500))] text-[rgb(var(--sage-500))]"
						: ""
				}`}
			/>
		</button>
	);
}
