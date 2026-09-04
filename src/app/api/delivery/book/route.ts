// POST /api/delivery/book
// Books a delivery with the selected provider
// Body: { provider, estimateId, locationId, dropLat, dropLng, dropAddress, dropName, dropPhone, externalReference }

import { NextRequest, NextResponse } from "next/server";
import { getProvider } from "@/lib/delivery/router";
import { getLocationById } from "@/lib/delivery/locations";
import type { BookRequest, DeliveryQuote } from "@/lib/delivery/types";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      provider,
      estimateId,
      locationId,
      dropLat,
      dropLng,
      dropAddress,
      dropName,
      dropPhone,
      externalReference,
    } = body;

    // Validate
    if (!provider || !estimateId || !locationId) {
      return NextResponse.json(
        { error: "provider, estimateId, and locationId are required" },
        { status: 400 }
      );
    }

    if (isNaN(parseFloat(dropLat)) || isNaN(parseFloat(dropLng))) {
      return NextResponse.json(
        { error: "Valid dropLat and dropLng are required" },
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

    const client = getProvider(provider);

    // Reconstruct quote (in production, store quotes in DB and retrieve by ID)
    const quote: DeliveryQuote = {
      provider,
      estimateId,
      amount: 0, // Will be set by booking response
      currency: "INR",
      vehicleType: "2_wheeler",
      etaMinutes: 30,
      distanceKm: 0,
      validUntil: Date.now() + 300000,
    };

    const bookReq: BookRequest = {
      quote,
      pickup: {
        lat: location.lat,
        lng: location.lng,
        address: location.address,
        contactName: location.name,
        contactPhone: location.phone,
      },
      drop: {
        lat: parseFloat(dropLat),
        lng: parseFloat(dropLng),
        address: dropAddress,
        contactName: dropName,
        contactPhone: dropPhone,
      },
      packageDescription: "Food delivery",
      packageWeightKg: 0.5,
      externalReference,
    };

    const booking = await client.bookDelivery(bookReq);

    return NextResponse.json({
      provider: booking.provider,
      orderId: booking.orderId,
      status: booking.status,
      amount: booking.amount,
      amountDisplay: `₹${(booking.amount / 100).toFixed(0)}`,
      driverName: booking.driverName,
      driverPhone: booking.driverPhone,
      trackingUrl: booking.trackingUrl,
      etaMinutes: booking.etaMinutes,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to book delivery", detail: String(error) },
      { status: 500 }
    );
  }
}
