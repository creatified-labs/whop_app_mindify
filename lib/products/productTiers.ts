export interface ProductTier {
	id: string;
	name: string;
	features: string[];
	price: number;
	savings?: string;
	whopProductId?: string;
}

export const ProductTiers: Record<
	"FREE" | "PREMIUM" | "PREMIUM_ANNUAL",
	ProductTier
> = {
	FREE: {
		id: "free",
		name: "Free",
		features: [
			"Access to 5 meditations",
			"Access to 2 hypnosis sessions",
			"1 transformation program",
			"Basic quick resets",
			"Knowledge hub access",
		],
		price: 0,
	},
	PREMIUM: {
		id: "premium_monthly",
		name: "Premium Monthly",
		features: [
			"Full meditation library (50+)",
			"All hypnosis sessions (20+)",
			"All transformation programs (10+)",
			"Advanced quick resets",
			"Binaural beats audio",
			"Live monthly sessions",
			"Priority support",
			"Offline downloads (coming soon)",
		],
		price: 14.99,
		whopProductId: "prod_XXXXX",
	},
	PREMIUM_ANNUAL: {
		id: "premium_annual",
		name: "Premium Annual",
		features: [
			"Full meditation library (50+)",
			"All hypnosis sessions (20+)",
			"All transformation programs (10+)",
			"Advanced quick resets",
			"Binaural beats audio",
			"Live monthly sessions",
			"Priority support",
			"Offline downloads (coming soon)",
		],
		price: 149.99,
		savings: "2 months free",
		whopProductId: "prod_YYYYY",
	},
};

export type ProductTierId = ProductTier["id"];
