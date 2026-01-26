import { WhopApp } from "@whop/react/components";
import type { Metadata } from "next";
import { cookies } from "next/headers";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { WhopThemeSync } from "@/components/theme/WhopThemeSync";
import { MobileNav } from "@/components/ui/MobileNav";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "Mindify | Neuroscience-Based Meditation Studio",
	description:
		"Mindify blends neuroscience research with immersive rituals to support mindful teams on Whop.",
};

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const cookieStore = await cookies();
	const themeCookie = cookieStore.get("whop-frosted-theme")?.value ?? "";
	const hasThemeCookie = themeCookie.includes("appearance:dark") || themeCookie.includes("appearance:light");
	const themeClass = themeCookie.includes("appearance:dark")
		? "dark"
		: themeCookie.includes("appearance:light")
			? "light"
			: undefined;

	return (
		<html
			lang="en"
			suppressHydrationWarning
			className={hasThemeCookie ? themeClass : undefined}
			data-theme={hasThemeCookie ? themeClass : undefined}
		>
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased`}
			>
				<WhopThemeSync />
				<WhopApp>{children}</WhopApp>
				<MobileNav />
			</body>
		</html>
	);
}
