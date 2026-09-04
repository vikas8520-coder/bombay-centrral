// POST /api/webhooks/porter
// Receives delivery status updates from Porter
// Porter sends webhooks for: order_assigned, picked_up, on_the_way, delivered, cancelled
//
// Configure this URL in Porter Enterprise dashboard:
//   https://yourdomain.com/api/webhooks/porter

import { NextRequest, NextResponse } from "next/server";
import { porterClient } from "@/lib/delivery/porter";
import type { WebhookEvent } from "@/lib/delivery/types";

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();
    const headers = Object.fromEntries(req.headers.entries());

    // Verify webhook signature if secret is configured
    // Porter typically sends signature in a header — verify against PORTER_WEBHOOK_SECRET
    // For now, we accept all webhooks (in production, verify signature)
    if (process.env.PORTER_WEBHOOK_SECRET) {
      // TODO: Implement signature verification once we have the API docs
      // const signature = headers["x-porter-signature"] || headers["x-webhook-signature"];
      // Verify HMAC-SHA256 signature
    }

    const event: WebhookEvent | null = porterClient.parseWebhook(payload, headers);

    if (!event) {
      return NextResponse.json(
        { error: "Failed to parse webhook" },
        { status: 400 }
      );
    }

    // TODO: Once database is set up, update order status in DB
    // For now, log the event
    console.log("[Porter Webhook]", {
      providerOrderId: event.providerOrderId,
      externalReference: event.externalReference,
      status: event.status,
      driverName: event.driverName,
      timestamp: new Date(event.timestamp).toISOString(),
    });

    // TODO: Send notification to customer (SMS/WhatsApp)
    // Based on status:
    //   driver_assigned → "Your delivery driver is assigned!"
    //   picked_up → "Your order is on the way!"
    //   at_drop → "Your driver has arrived!"
    //   delivered → "Order delivered! Rate your experience."
    //   cancelled → "Delivery cancelled. Refund processing."

    return NextResponse.json({ status: "ok", event: event.status });
  } catch (error) {
    console.error("[Porter Webhook Error]", error);
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
    provider: "porter",
    configured: !!process.env.PORTER_API_KEY,
  });
}
