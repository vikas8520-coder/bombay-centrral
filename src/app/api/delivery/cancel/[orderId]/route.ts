// POST /api/delivery/cancel/[orderId]?provider=porter|rapido
// Cancels a delivery by provider order ID

import { NextRequest, NextResponse } from "next/server";
import { getProvider } from "@/lib/delivery/router";

export async function POST(
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
    const result = await client.cancelDelivery(orderId);

    return NextResponse.json({
      provider: result.provider,
      orderId: result.orderId,
      status: result.status,
      cancellationFee: result.cancellationFee,
      cancellationFeeDisplay: result.cancellationFee
        ? `₹${(result.cancellationFee / 100).toFixed(0)}`
        : "₹0",
      message: result.message,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to cancel delivery", detail: String(error) },
      { status: 500 }
    );
  }
}
