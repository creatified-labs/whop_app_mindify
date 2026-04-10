"use client";

import type { ReactNode } from "react";

/**
 * Thin horizontal scroll container used for featured content strips on the
 * experience home page. Children should use `shrink-0` with a fixed width so
 * each card becomes a snap target.
 */
export function HorizontalStrip({
	children,
	className = "",
}: {
	children: ReactNode;
	className?: string;
}) {
	return (
		<div
			className={`scrollbar-thin -mx-2 flex snap-x snap-mandatory gap-4 overflow-x-auto px-2 pb-2 ${className}`}
		>
			{children}
		</div>
	);
}
