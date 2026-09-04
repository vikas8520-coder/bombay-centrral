// POST /api/webhooks/rapido
// Receives delivery status updates from Rapido
// Configure this URL in Rapido B2B partner dashboard:
//   https://yourdomain.com/api/webhooks/rapido

import { NextRequest, NextResponse } from "next/server";
import { rapidoClient } from "@/lib/delivery/rapido";
import type { WebhookEvent } from "@/lib/delivery/types";

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();
    const headers = Object.fromEntries(req.headers.entries());

    // Verify webhook signature if secret is configured
    if (process.env.RAPIDO_WEBHOOK_SECRET) {
      // TODO: Implement signature verification once we have the API docs
    }

    const event: WebhookEvent | null = rapidoClient.parseWebhook(payload, headers);

    if (!event) {
      return NextResponse.json(
        { error: "Failed to parse webhook" },
        { status: 400 }
      );
    }

    // TODO: Once database is set up, update order status in DB
    console.log("[Rapido Webhook]", {
      providerOrderId: event.providerOrderId,
      externalReference: event.externalReference,
      status: event.status,
      driverName: event.driverName,
      timestamp: new Date(event.timestamp).toISOString(),
    });

    // TODO: Send notification to customer (SMS/WhatsApp)

    return NextResponse.json({ status: "ok", event: event.status });
  } catch (error) {
    console.error("[Rapido Webhook Error]", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}

// Health check
export async function GET() {
  return NextResponse.json({
    status: "ok",
    provider: "rapido",
    configured: !!process.env.RAPIDO_API_KEY,
  });
}
