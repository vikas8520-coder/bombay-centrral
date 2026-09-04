// Rapido Parcel API client
// Rapido does NOT have a self-service API yet — B2B partner access required.
// Signup: Contact Rapido business team or via uEngage (https://www.uengage.io/partners/rapido)
//
// Environment variables needed:
//   RAPIDO_API_KEY     — API key from Rapido B2B partnership
//   RAPIDO_BASE_URL    — API base URL (provided by Rapido after partnership)
//   RAPIDO_WEBHOOK_SECRET — Secret to verify webhook signatures
//
// Until we have official API access, this client uses a fallback mock mode
// that returns estimated pricing based on Rapido's public fare structure:
//   Base: ₹35 (2km included)
//   Per km after: ₹15/km

import type { DeliveryProviderClient } from "./provider-interface";
import type {
  DeliveryQuote,
  DeliveryBooking,
  TrackResponse,
  CancelResponse,
  QuoteRequest,
  BookRequest,
  WebhookEvent,
  DeliveryStatus,
} from "./types";

const BASE_URL = process.env.RAPIDO_BASE_URL || "https://api.rapido.bike";

// Rapido's public fare structure (Hyderabad)
const RAPIDO_BASE_FARE = 35; // ₹35 for first 2km
const RAPIDO_PER_KM = 15; // ₹15 per km after 2km
const RAPIDO_FREE_KM = 2; // First 2km included in base

// Haversine distance calculation
function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function calculateRapidoFare(distanceKm: number): number {
  if (distanceKm <= RAPIDO_FREE_KM) return RAPIDO_BASE_FARE;
  return RAPIDO_BASE_FARE + (distanceKm - RAPIDO_FREE_KM) * RAPIDO_PER_KM;
}

function mapRapidoStatus(status: string): DeliveryStatus {
  const map: Record<string, DeliveryStatus> = {
    "created": "booked",
    "accepted": "driver_assigned",
    "arrived_pickup": "at_pickup",
    "picked_up": "picked_up",
    "enroute": "on_the_way",
    "arrived_drop": "at_drop",
    "completed": "delivered",
    "cancelled": "cancelled",
    "failed": "failed",
  };
  return map[status] || "pending";
}

export class RapidoClient implements DeliveryProviderClient {
  readonly name = "rapido" as const;

  isConfigured(): boolean {
    return !!process.env.RAPIDO_API_KEY;
  }

  private get headers() {
    return {
      "Authorization": `Bearer ${process.env.RAPIDO_API_KEY}`,
      "Content-Type": "application/json",
    };
  }

  async getQuote(req: QuoteRequest): Promise<DeliveryQuote> {
    // If API is configured, use real API
    if (this.isConfigured()) {
      const body = {
        pickup: {
          lat: req.pickup.lat,
          lng: req.pickup.lng,
          address: req.pickup.address,
        },
        drop: {
          lat: req.drop.lat,
          lng: req.drop.lng,
          address: req.drop.address,
        },
        service_type: req.vehicleType || "bike",
      };

      const res = await fetch(`${BASE_URL}/v1/quotes`, {
        method: "POST",
        headers: this.headers,
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const err = await res.text();
        throw new Error(`Rapido quote failed: ${res.status} ${err}`);
      }

      const data = await res.json();

      return {
        provider: "rapido",
        estimateId: data.estimate_id || data.quote_id || "",
        amount: Math.round((data.estimated_price || data.amount || 0) * 100),
        currency: "INR",
        vehicleType: req.vehicleType || "2_wheeler",
        etaMinutes: data.eta || data.estimated_time_minutes || 30,
        distanceKm: data.distance || data.estimated_distance_km || 0,
        validUntil: Date.now() + (data.validity || 300) * 1000,
      };
    }

    // Fallback: calculate estimate using public fare structure
    const distance = haversineKm(
      req.pickup.lat,
      req.pickup.lng,
      req.drop.lat,
      req.drop.lng
    );
    const fare = calculateRapidoFare(distance);

    return {
      provider: "rapido",
      estimateId: `rapido_est_${Date.now()}`,
      amount: Math.round(fare * 100), // Convert to paise
      currency: "INR",
      vehicleType: req.vehicleType || "2_wheeler",
      etaMinutes: Math.max(20, Math.round(distance * 4) + 15), // ~4 min/km + 15 min prep
      distanceKm: Math.round(distance * 10) / 10,
      validUntil: Date.now() + 300 * 1000, // 5 min validity
    };
  }

  async bookDelivery(req: BookRequest): Promise<DeliveryBooking> {
    if (this.isConfigured()) {
      const body = {
        pickup: {
          lat: req.pickup.lat,
          lng: req.pickup.lng,
          address: req.pickup.address,
          contact: {
            name: req.pickup.contactName || "Restaurant",
            phone: req.pickup.contactPhone || "",
          },
        },
        drop: {
          lat: req.drop.lat,
          lng: req.drop.lng,
          address: req.drop.address,
          contact: {
            name: req.drop.contactName || "Customer",
            phone: req.drop.contactPhone || "",
          },
        },
        service_type: req.quote.vehicleType || "bike",
        package: {
          description: req.packageDescription || "Food delivery",
          weight: req.packageWeightKg || 0.5,
        },
        external_reference: req.externalReference,
        estimate_id: req.quote.estimateId,
      };

      const res = await fetch(`${BASE_URL}/v1/orders`, {
        method: "POST",
        headers: this.headers,
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const err = await res.text();
        throw new Error(`Rapido booking failed: ${res.status} ${err}`);
      }

      const data = await res.json();

      return {
        provider: "rapido",
        orderId: data.order_id || data.id || "",
        status: "booked",
        amount: Math.round((data.amount || req.quote.amount / 100) * 100),
        driverName: data.driver?.name,
        driverPhone: data.driver?.phone,
        trackingUrl: data.tracking_url,
        etaMinutes: data.eta_minutes,
        createdAt: Date.now(),
      };
    }

    // Fallback: return mock booking (for testing without API)
    return {
      provider: "rapido",
      orderId: `rapido_mock_${Date.now()}`,
      status: "booked",
      amount: req.quote.amount,
      createdAt: Date.now(),
    };
  }

  async trackDelivery(providerOrderId: string): Promise<TrackResponse> {
    if (this.isConfigured()) {
      const res = await fetch(`${BASE_URL}/v1/orders/${providerOrderId}/track`, {
        headers: this.headers,
      });

      if (!res.ok) {
        const err = await res.text();
        throw new Error(`Rapido tracking failed: ${res.status} ${err}`);
      }

      const data = await res.json();

      return {
        provider: "rapido",
        orderId: providerOrderId,
        status: mapRapidoStatus(data.status || data.order_status),
        driverName: data.driver?.name,
        driverPhone: data.driver?.phone,
        driverLat: data.driver?.lat,
        driverLng: data.driver?.lng,
        trackingUrl: data.tracking_url,
        etaMinutes: data.eta_minutes,
      };
    }

    // Fallback mock
    return {
      provider: "rapido",
      orderId: providerOrderId,
      status: "booked",
    };
  }

  async cancelDelivery(providerOrderId: string): Promise<CancelResponse> {
    if (this.isConfigured()) {
      const res = await fetch(`${BASE_URL}/v1/orders/${providerOrderId}/cancel`, {
        method: "POST",
        headers: this.headers,
      });

      if (!res.ok) {
        const err = await res.text();
        throw new Error(`Rapido cancel failed: ${res.status} ${err}`);
      }

      const data = await res.json();

      return {
        provider: "rapido",
        orderId: providerOrderId,
        status: data.status === "cancelled" ? "cancelled" : "failed",
        cancellationFee: data.cancellation_fee
          ? Math.round(data.cancellation_fee * 100)
          : 0,
        message: data.message,
      };
    }

    // Fallback mock
    return {
      provider: "rapido",
      orderId: providerOrderId,
      status: "cancelled",
    };
  }

  parseWebhook(payload: unknown, _headers?: Record<string, string>): WebhookEvent | null {
    try {
      const data = payload as Record<string, unknown>;

      return {
        provider: "rapido",
        providerOrderId: (data.order_id || data.id) as string,
        externalReference: (data.external_reference || data.reference) as string | undefined,
        status: mapRapidoStatus((data.status || data.event_type) as string),
        driverName: (data.driver as Record<string, unknown>)?.name as string | undefined,
        driverPhone: (data.driver as Record<string, unknown>)?.phone as string | undefined,
        driverLat: (data.driver as Record<string, unknown>)?.lat as number | undefined,
        driverLng: (data.driver as Record<string, unknown>)?.lng as number | undefined,
        trackingUrl: data.tracking_url as string | undefined,
        timestamp: Date.now(),
        raw: payload,
      };
    } catch {
      return null;
    }
  }
}

// Singleton
export const rapidoClient = new RapidoClient();
