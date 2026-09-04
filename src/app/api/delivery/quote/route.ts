// GET /api/delivery/quote
// Returns delivery quotes from all available providers (Porter + Rapido)
// Query params: pickupLat, pickupLng, dropLat, dropLng, dropAddress, [vehicleType]

import { NextRequest, NextResponse } from "next/server";
import { getBestQuote } from "@/lib/delivery/router";
import { getLocationById } from "@/lib/delivery/locations";
import type { QuoteRequest } from "@/lib/delivery/types";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const locationId = searchParams.get("locationId");
  const dropLat = parseFloat(searchParams.get("dropLat") || "");
  const dropLng = parseFloat(searchParams.get("dropLng") || "");
  const dropAddress = searchParams.get("dropAddress") || "";
  const vehicleType = (searchParams.get("vehicleType") as "2_wheeler" | "auto" | "4_wheeler") || "2_wheeler";

  // Validate
  if (!locationId) {
    return NextResponse.json(
      { error: "locationId is required" },
      { status: 400 }
    );
  }

  if (isNaN(dropLat) || isNaN(dropLng)) {
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

  const quoteReq: QuoteRequest = {
    pickup: {
      lat: location.lat,
      lng: location.lng,
      address: location.address,
      contactName: location.name,
      contactPhone: location.phone,
    },
    drop: {
      lat: dropLat,
      lng: dropLng,
      address: dropAddress,
    },
    vehicleType,
  };

  try {
    const comparison = await getBestQuote(quoteReq);

    if (!comparison.best) {
      return NextResponse.json(
        { error: "No delivery providers available" },
        { status: 503 }
      );
    }

    return NextResponse.json({
      quotes: comparison.quotes.map((q) => ({
        provider: q.provider,
        amount: q.amount,
        amountDisplay: `₹${(q.amount / 100).toFixed(0)}`,
        etaMinutes: q.etaMinutes,
        distanceKm: q.distanceKm,
        vehicleType: q.vehicleType,
        estimateId: q.estimateId,
      })),
      best: {
        provider: comparison.best.provider,
        amount: comparison.best.amount,
        amountDisplay: `₹${(comparison.best.amount / 100).toFixed(0)}`,
        etaMinutes: comparison.best.etaMinutes,
        distanceKm: comparison.best.distanceKm,
        estimateId: comparison.best.estimateId,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to get delivery quote", detail: String(error) },
      { status: 500 }
    );
  }
}
