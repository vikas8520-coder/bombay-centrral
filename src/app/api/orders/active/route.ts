// GET /api/orders/active
// Returns all active orders (for restaurant dashboard)
// Query param: locationId (optional filter)

import { NextRequest, NextResponse } from "next/server";
import { getActiveOrders } from "@/lib/delivery/order-store";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const locationId = searchParams.get("locationId") || undefined;

  const orders = getActiveOrders(locationId);

  return NextResponse.json({
    count: orders.length,
    orders: orders.map((o) => ({
      orderId: o.id,
      locationId: o.locationId,
      items: o.items.map((i) => ({
        name: i.name,
        quantity: i.quantity,
        price: `₹${(i.price / 100).toFixed(0)}`,
      })),
      subtotal: `₹${(o.subtotal / 100).toFixed(0)}`,
      deliveryCost: `₹${(o.deliveryCost / 100).toFixed(0)}`,
      total: `₹${(o.total / 100).toFixed(0)}`,
      customerName: o.customerName,
      customerPhone: o.customerPhone,
      customerAddress: o.customerAddress,
      deliveryProvider: o.deliveryProvider,
      deliveryStatus: o.deliveryStatus,
      trackingUrl: o.trackingUrl,
      driverName: o.driverName,
      driverPhone: o.driverPhone,
      createdAt: new Date(o.createdAt).toISOString(),
    })),
  });
}
