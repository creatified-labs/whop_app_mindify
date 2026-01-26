import { ProductTiers } from "@/lib/products/productTiers";
import { whopsdk } from "@/lib/whop-sdk";
import { getUserTier } from "@/lib/database/userService";

const PREMIUM_PRODUCT_IDS = new Set(
	Object.values(ProductTiers)
		.map((tier) => tier.whopProductId)
		.filter((id): id is string => Boolean(id)),
);

const FREE_CONTENT_ALLOWLIST = new Set<string>([
	"alpha-entrain",
	"focus-activation",
	"grounding-breath-1",
	"stress-release-field",
	"focus-reset-7",
]);

/**
 * Check user access tier
 * First checks database cache, falls back to Whop API if needed
 */
export async function checkUserAccess(userId: string): Promise<"free" | "premium"> {
	try {
		// Try to get tier from database (fast, cached)
		const tier = await getUserTier(userId);

		if (tier) {
			return tier;
		}

		// Fallback: Check Whop API if not in database
		// This will be cached by webhook events going forward
		return await checkUserAccessFromWhop(userId);
	} catch (error) {
		console.error("[AccessControl] Failed to check user access", error);
		return "free";
	}
}

/**
 * Check user access directly from Whop API
 * Used as fallback when database doesn't have the tier cached yet
 */
export async function checkUserAccessFromWhop(userId: string): Promise<"free" | "premium"> {
	try {
		const membershipsPage = await whopsdk.memberships.list({
			user_ids: [userId],
			statuses: ["active"],
		});
		const memberships = "data" in membershipsPage ? membershipsPage.data : [];
		const hasPremium = memberships?.some((membership: any) => {
			const productId = membership.product?.id ?? membership.product_id;
			return productId && PREMIUM_PRODUCT_IDS.has(productId);
		});
		return hasPremium ? "premium" : "free";
	} catch (error) {
		console.error("[AccessControl] Failed to check user access from Whop", error);
		return "free";
	}
}

export function canAccessContent(contentType: string, contentId: string, userTier: "free" | "premium") {
	if (userTier === "premium") return true;

	if (contentType === "program" && contentId === "focus-reset-7") return true;
	if (FREE_CONTENT_ALLOWLIST.has(contentId)) return true;

	return false;
}
