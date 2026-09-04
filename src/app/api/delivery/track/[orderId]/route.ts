// GET /api/delivery/track/[orderId]?provider=porter|rapido
// Tracks a delivery by provider order ID

import { NextRequest, NextResponse } from "next/server";
import { getProvider } from "@/lib/delivery/router";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  const { orderId } = await params;
  const { searchParams } = new URL(req.url);
  const provider = searchParams.get("provider") as "porter" | "rapido";

  if (!provider) {
    return NextResponse.json(
      { error: "provider query param is required (porter or rapido)" },
      { status: 400 }
    );
  }

  try {
    const client = getProvider(provider);
    const tracking = await client.trackDelivery(orderId);

    return NextResponse.json({
      provider: tracking.provider,
      orderId: tracking.orderId,
      status: tracking.status,
      driverName: tracking.driverName,
      driverPhone: tracking.driverPhone,
      driverLat: tracking.driverLat,
      driverLng: tracking.driverLng,
      trackingUrl: tracking.trackingUrl,
      etaMinutes: tracking.etaMinutes,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to track delivery", detail: String(error) },
      { status: 500 }
    );
  }
}
