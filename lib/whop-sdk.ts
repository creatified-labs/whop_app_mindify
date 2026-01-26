import { Whop } from "@whop/sdk";

const webhookKey = process.env.WHOP_WEBHOOK_SECRET
	? Buffer.from(process.env.WHOP_WEBHOOK_SECRET).toString("base64")
	: undefined;

export const whopsdk = new Whop({
	appID: process.env.NEXT_PUBLIC_WHOP_APP_ID ?? "",
	apiKey: process.env.WHOP_API_KEY ?? "",
	webhookKey,
});
