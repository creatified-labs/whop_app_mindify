import { frostedThemePlugin } from "@whop/react/tailwind";
import type { Config } from "tailwindcss";

const config: Config = {
	content: [
		"./pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./components/**/*.{js,ts,jsx,tsx,mdx}",
		"./app/**/*.{js,ts,jsx,tsx,mdx}",
	],
	darkMode: "class",
	theme: {
		extend: {
			fontFamily: {
				sans: ["Inter", "system-ui", "sans-serif"],
				serif: ["Playfair Display", "Georgia", "serif"],
				display: ["Poppins", "system-ui", "sans-serif"],
			},
			colors: {
				white: "rgb(var(--white) / <alpha-value>)",
				black: "rgb(var(--black) / <alpha-value>)",
				sage: {
					50: "rgb(var(--sage-50) / <alpha-value>)",
					100: "rgb(var(--sage-100) / <alpha-value>)",
					200: "rgb(var(--sage-200) / <alpha-value>)",
					300: "rgb(var(--sage-300) / <alpha-value>)",
					400: "rgb(var(--sage-400) / <alpha-value>)",
					500: "rgb(var(--sage-500) / <alpha-value>)",
					600: "rgb(var(--sage-600) / <alpha-value>)",
					700: "rgb(var(--sage-700) / <alpha-value>)",
					800: "rgb(var(--sage-800) / <alpha-value>)",
					900: "rgb(var(--sage-900) / <alpha-value>)",
				},
				gold: {
					50: "rgb(var(--gold-50) / <alpha-value>)",
					100: "rgb(var(--gold-100) / <alpha-value>)",
					200: "rgb(var(--gold-200) / <alpha-value>)",
					300: "rgb(var(--gold-300) / <alpha-value>)",
					400: "rgb(var(--gold-400) / <alpha-value>)",
					500: "rgb(var(--gold-500) / <alpha-value>)",
					600: "rgb(var(--gold-600) / <alpha-value>)",
					700: "rgb(var(--gold-700) / <alpha-value>)",
					800: "rgb(var(--gold-800) / <alpha-value>)",
					900: "rgb(var(--gold-900) / <alpha-value>)",
				},
				cream: {
					50: "rgb(var(--cream-50) / <alpha-value>)",
					100: "rgb(var(--cream-100) / <alpha-value>)",
					200: "rgb(var(--cream-200) / <alpha-value>)",
					300: "rgb(var(--cream-300) / <alpha-value>)",
					400: "rgb(var(--cream-400) / <alpha-value>)",
					500: "rgb(var(--cream-500) / <alpha-value>)",
				},
				earth: {
					50: "rgb(var(--earth-50) / <alpha-value>)",
					100: "rgb(var(--earth-100) / <alpha-value>)",
					200: "rgb(var(--earth-200) / <alpha-value>)",
					300: "rgb(var(--earth-300) / <alpha-value>)",
					400: "rgb(var(--earth-400) / <alpha-value>)",
					500: "rgb(var(--earth-500) / <alpha-value>)",
					600: "rgb(var(--earth-600) / <alpha-value>)",
					700: "rgb(var(--earth-700) / <alpha-value>)",
					900: "rgb(var(--earth-900) / <alpha-value>)",
				},
			},
			backgroundImage: {
				"gradient-sage":
					"linear-gradient(135deg, rgb(var(--sage-500) / 1) 0%, rgb(var(--gold-500) / 1) 100%)",
				"gradient-zen":
					"linear-gradient(180deg, rgb(var(--cream-50) / 1) 0%, rgb(var(--cream-100) / 1) 100%)",
				"gradient-meditation":
					"radial-gradient(circle at center, rgb(var(--gold-400) / 1) 0%, rgb(var(--sage-500) / 1) 70%, rgb(var(--sage-700) / 1) 100%)",
				"gradient-card":
					"linear-gradient(135deg, rgb(var(--sage-500) / 0.12) 0%, rgb(var(--gold-500) / 0.12) 100%)",
			},
			boxShadow: {
				soft: "0 2px 15px rgba(139, 158, 125, 0.1)",
				medium: "0 4px 25px rgba(139, 158, 125, 0.15)",
				card: "0 8px 30px rgba(58, 58, 58, 0.08)",
				hover: "0 12px 40px rgba(139, 158, 125, 0.2)",
				"glass": "0 8px 32px rgba(0, 0, 0, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
				"glow": "0 0 20px rgba(139, 158, 125, 0.3)",
				"elevated": "0 20px 60px -12px rgba(58, 58, 58, 0.25)",
			},
			borderRadius: {
				"3xl": "24px",
				"4xl": "32px",
				"5xl": "40px",
			},
			animation: {
				"fade-in": "fadeIn 0.5s ease-in-out",
				"slide-up": "slideUp 0.3s ease-out",
				"scale-in": "scaleIn 0.2s ease-out",
				"float": "float 3s ease-in-out infinite",
			},
			keyframes: {
				fadeIn: {
					"0%": { opacity: "0" },
					"100%": { opacity: "1" },
				},
				slideUp: {
					"0%": { transform: "translateY(10px)", opacity: "0" },
					"100%": { transform: "translateY(0)", opacity: "1" },
				},
				scaleIn: {
					"0%": { transform: "scale(0.95)", opacity: "0" },
					"100%": { transform: "scale(1)", opacity: "1" },
				},
				float: {
					"0%, 100%": { transform: "translateY(0px)" },
					"50%": { transform: "translateY(-10px)" },
				},
			},
		},
	},
	plugins: [frostedThemePlugin()],
};

export default config;
