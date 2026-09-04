// GET /api/orders/[orderId]
// Returns order details by ID

import { NextRequest, NextResponse } from "next/server";
import { getOrder } from "@/lib/delivery/order-store";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  const { orderId } = await params;
  const order = getOrder(orderId);

  if (!order) {
    return NextResponse.json(
      { error: "Order not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({
    orderId: order.id,
    items: order.items.map((i) => ({
      name: i.name,
      price: `₹${(i.price / 100).toFixed(0)}`,
      quantity: i.quantity,
    })),
    subtotal: `₹${(order.subtotal / 100).toFixed(0)}`,
    deliveryCost: `₹${(order.deliveryCost / 100).toFixed(0)}`,
    total: `₹${(order.total / 100).toFixed(0)}`,
    deliveryProvider: order.deliveryProvider,
    deliveryStatus: order.deliveryStatus,
    trackingUrl: order.trackingUrl,
    driverName: order.driverName,
    driverPhone: order.driverPhone,
    customerName: order.customerName,
    createdAt: new Date(order.createdAt).toISOString(),
  });
}
