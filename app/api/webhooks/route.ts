import { waitUntil } from "@vercel/functions";
import type { Payment, Membership } from "@whop/sdk/resources.js";
import type { NextRequest } from "next/server";
import { whopsdk } from "@/lib/whop-sdk";
import { syncUserTier, getOrCreateUser } from "@/lib/database/userService";
import { extractCompanyId } from "@/lib/auth/getAuthUser";

export async function POST(request: NextRequest): Promise<Response> {
	try {
		// Extract company ID from request if available
		let companyId: string | undefined;
		try {
			companyId = extractCompanyId(request);
		} catch {
			// Webhooks may not always have company_id; fall back gracefully
			companyId = undefined;
		}

		// Validate the webhook to ensure it's from Whop
		const requestBodyText = await request.text();
		const headers = Object.fromEntries(request.headers);
		const webhookData = whopsdk.webhooks.unwrap(requestBodyText, { headers });

		// Handle different webhook events
		switch (webhookData.type) {
			case "payment.succeeded":
				waitUntil(handlePaymentSucceeded(webhookData.data, companyId));
				break;

			case "membership.activated":
				waitUntil(handleMembershipActivated(webhookData.data, companyId));
				break;

			case "membership.deactivated":
				waitUntil(handleMembershipDeactivated(webhookData.data, companyId));
				break;

			default:
				console.log(`[Webhook] Unhandled event type: ${webhookData.type}`);
		}

		// Return 2xx status code quickly to acknowledge receipt
		return new Response("OK", { status: 200 });
	} catch (error) {
		console.error("[Webhook] Error processing webhook:", error);
		// Still return 200 to prevent retries for malformed requests
		return new Response("Error", { status: 200 });
	}
}

/**
 * Handle payment.succeeded event
 * Syncs user tier to database when payment is successful
 */
async function handlePaymentSucceeded(payment: Payment, companyId?: string) {
	try {
		console.log("[Webhook] Payment succeeded:", payment.id);

		// Get user ID from payment
		const user = payment.user;
		if (!user || typeof user === "string") {
			console.error("[Webhook] Invalid user data in payment");
			return;
		}

		if (!companyId) {
			console.warn("[Webhook] No company_id available for payment webhook, skipping DB sync");
			return;
		}

		const userId = user.id;

		// Ensure user exists in database
		await getOrCreateUser(companyId, userId, {
			whop_user_id: userId,
		});

		// Sync user tier based on their current memberships
		await syncUserTier(companyId, userId, "premium");

		console.log(`[Webhook] Successfully synced tier for user ${userId}`);
	} catch (error) {
		console.error("[Webhook] Error handling payment.succeeded:", error);
	}
}

/**
 * Handle membership.activated event
 * Grants access and updates tier when membership is activated
 */
async function handleMembershipActivated(membership: Membership, companyId?: string) {
	try {
		console.log("[Webhook] Membership activated:", membership.id);

		const user = membership.user;
		if (!user || typeof user === "string") {
			console.error("[Webhook] Invalid user data in membership");
			return;
		}

		if (!companyId) {
			console.warn("[Webhook] No company_id available for membership webhook, skipping DB sync");
			return;
		}

		const userId = user.id;

		// Ensure user exists in database
		await getOrCreateUser(companyId, userId, {
			whop_user_id: userId,
		});

		// Grant premium access
		await syncUserTier(companyId, userId, "premium");

		console.log(`[Webhook] Granted premium access to user ${userId}`);
	} catch (error) {
		console.error("[Webhook] Error handling membership.activated:", error);
	}
}

/**
 * Handle membership.deactivated event
 * Revokes access and downgrades tier when membership is deactivated
 */
async function handleMembershipDeactivated(membership: Membership, companyId?: string) {
	try {
		console.log("[Webhook] Membership deactivated:", membership.id);

		const user = membership.user;
		if (!user || typeof user === "string") {
			console.error("[Webhook] Invalid user data in membership");
			return;
		}

		if (!companyId) {
			console.warn("[Webhook] No company_id available for membership webhook, skipping DB sync");
			return;
		}

		const userId = user.id;

		// Downgrade to free tier
		await syncUserTier(companyId, userId, "free");

		console.log(`[Webhook] Revoked premium access for user ${userId}`);
	} catch (error) {
		console.error("[Webhook] Error handling membership.deactivated:", error);
	}
}
