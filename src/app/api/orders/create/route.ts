// POST /api/orders/create
// Creates a new order and books delivery
// Body: { locationId, items, customerName, customerPhone, customerAddress, customerLat, customerLng }
//
// Flow:
// 1. Validate order
// 2. Get delivery quote (cheapest provider)
// 3. Create order in store
// 4. Book delivery with provider
// 5. Return order + delivery details

import { NextRequest, NextResponse } from "next/server";
import { getBestQuote, getProvider } from "@/lib/delivery/router";
import { getLocationById } from "@/lib/delivery/locations";
import { createOrder, updateOrder } from "@/lib/delivery/order-store";
import { menu } from "@/data/business";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      locationId,
      items: requestedItems,
      customerName,
      customerPhone,
      customerAddress,
      customerLat,
      customerLng,
    } = body;

    // Validate
    if (!locationId || !requestedItems || !customerName || !customerPhone || !customerAddress) {
      return NextResponse.json(
        { error: "Missing required fields: locationId, items, customerName, customerPhone, customerAddress" },
        { status: 400 }
      );
    }

    if (isNaN(parseFloat(customerLat)) || isNaN(parseFloat(customerLng))) {
      return NextResponse.json(
        { error: "Valid customerLat and customerLng are required" },
        { status: 400 }
      );
    }

    const location = getLocationById(locationId);
    if (!location) {
      return NextResponse.json(
        { error: "Invalid locationId" },
        { status: 400 }
      );
    }

    // Build order items from menu (validate prices)
    const allMenuItems = menu.flatMap((cat) => cat.items);
    const orderItems = requestedItems.map((req: { name: string; quantity: number }) => {
      const menuItem = allMenuItems.find((m) => m.name === req.name);
      if (!menuItem) {
        throw new Error(`Menu item not found: ${req.name}`);
      }
      const price = parseInt(menuItem.price.replace("₹", ""), 10);
      return {
        name: menuItem.name,
        price: price * 100, // Convert to paise
        quantity: req.quantity,
      };
    });

    const subtotal = orderItems.reduce((sum: number, item: { price: number; quantity: number }) => {
      return sum + item.price * item.quantity;
    }, 0);

    // Get delivery quote
    const { best } = await getBestQuote({
      pickup: {
        lat: location.lat,
        lng: location.lng,
        address: location.address,
        contactName: location.name,
        contactPhone: location.phone,
      },
      drop: {
        lat: parseFloat(customerLat),
        lng: parseFloat(customerLng),
        address: customerAddress,
        contactName: customerName,
        contactPhone: customerPhone,
      },
      vehicleType: "2_wheeler",
    });

    if (!best) {
      return NextResponse.json(
        { error: "No delivery providers available" },
        { status: 503 }
      );
    }

    const deliveryCost = best.amount;
    const total = subtotal + deliveryCost;
    const orderId = `BC${Date.now()}${Math.floor(Math.random() * 1000)}`;

    // Create order in store
    createOrder({
      id: orderId,
      locationId,
      items: orderItems,
      subtotal,
      deliveryCost,
      total,
      customerName,
      customerPhone,
      customerAddress,
      customerLat: parseFloat(customerLat),
      customerLng: parseFloat(customerLng),
      deliveryProvider: best.provider,
      deliveryStatus: "pending",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    // Book delivery
    try {
      const client = getProvider(best.provider);
      const booking = await client.bookDelivery({
        quote: best,
        pickup: {
          lat: location.lat,
          lng: location.lng,
          address: location.address,
          contactName: location.name,
          contactPhone: location.phone,
        },
        drop: {
          lat: parseFloat(customerLat),
          lng: parseFloat(customerLng),
          address: customerAddress,
          contactName: customerName,
          contactPhone: customerPhone,
        },
        packageDescription: "Food delivery",
        packageWeightKg: 0.5,
        externalReference: orderId,
      });

      updateOrder(orderId, {
        deliveryProviderOrderId: booking.orderId,
        deliveryStatus: booking.status,
        trackingUrl: booking.trackingUrl,
        driverName: booking.driverName,
        driverPhone: booking.driverPhone,
      });
    } catch (bookingError) {
      // Order created but delivery booking failed
      updateOrder(orderId, { deliveryStatus: "failed" });
      return NextResponse.json({
        orderId,
        warning: "Order created but delivery booking failed",
        error: String(bookingError),
        subtotal: `₹${(subtotal / 100).toFixed(0)}`,
        deliveryCost: `₹${(deliveryCost / 100).toFixed(0)}`,
        total: `₹${(total / 100).toFixed(0)}`,
      }, { status: 202 });
    }

    return NextResponse.json({
      orderId,
      items: orderItems.map((i: { name: string; price: number; quantity: number }) => ({
        name: i.name,
        price: `₹${(i.price / 100).toFixed(0)}`,
        quantity: i.quantity,
      })),
      subtotal: `₹${(subtotal / 100).toFixed(0)}`,
      deliveryCost: `₹${(deliveryCost / 100).toFixed(0)}`,
      deliveryProvider: best.provider,
      total: `₹${(total / 100).toFixed(0)}`,
      status: "booked",
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create order", detail: String(error) },
      { status: 500 }
    );
  }
}
