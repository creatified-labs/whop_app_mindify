"use client";

import { useEffect } from "react";

type ThemeAppearance = "light" | "dark" | "inherit";

function applyTheme(appearance?: ThemeAppearance) {
	if (typeof document === "undefined") return;
	const root = document.documentElement;

	let next: "light" | "dark";
	if (appearance === "dark" || appearance === "light") {
		next = appearance;
	} else {
		const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
		next = root.classList.contains("dark") || prefersDark ? "dark" : "light";
	}

	root.classList.remove("light", "dark");
	root.classList.add(next);
	root.dataset.theme = next;
	root.style.colorScheme = next;
}

export function WhopThemeSync() {
	useEffect(() => {
		const handleThemeEvent = (event: Event) => {
			if (event instanceof CustomEvent) {
				const appearance = event.detail?.appearance as ThemeAppearance | undefined;
				applyTheme(appearance);
			}
		};

		applyTheme();
		document.documentElement.addEventListener("frosted-ui:on-theme-change", handleThemeEvent);
		document.documentElement.addEventListener("frosted-ui:set-theme", handleThemeEvent);

		return () => {
			document.documentElement.removeEventListener("frosted-ui:on-theme-change", handleThemeEvent);
			document.documentElement.removeEventListener("frosted-ui:set-theme", handleThemeEvent);
		};
	}, []);

	return null;
}
