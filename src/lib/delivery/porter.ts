// Porter Enterprise API client
// Docs: https://porter.in/api-integrations
// Signup: https://porter.in/enterprise
//
// Environment variables needed:
//   PORTER_API_KEY     — Bearer token from Porter Enterprise dashboard
//   PORTER_BASE_URL    — API base URL (default: https://api.porter.in)
//   PORTER_WEBHOOK_SECRET — Secret to verify webhook signatures

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

const BASE_URL = process.env.PORTER_BASE_URL || "https://api.porter.in";

// Map Porter status strings to our internal status
function mapPorterStatus(status: string): DeliveryStatus {
  const map: Record<string, DeliveryStatus> = {
    "created": "booked",
    "assigned": "driver_assigned",
    "arrived_at_pickup": "at_pickup",
    "picked_up": "picked_up",
    "on_the_way": "on_the_way",
    "arrived_at_drop": "at_drop",
    "delivered": "delivered",
    "cancelled": "cancelled",
    "failed": "failed",
    "rejected": "failed",
  };
  return map[status] || "pending";
}

export class PorterClient implements DeliveryProviderClient {
  readonly name = "porter" as const;

  isConfigured(): boolean {
    return !!process.env.PORTER_API_KEY;
  }

  private get headers() {
    return {
      "Authorization": `Bearer ${process.env.PORTER_API_KEY}`,
      "Content-Type": "application/json",
      "X-Api-Key": process.env.PORTER_API_KEY || "",
    };
  }

  async getQuote(req: QuoteRequest): Promise<DeliveryQuote> {
    const vehicleType = req.vehicleType || "2_wheeler";

    const body = {
      pickup_details: {
        lat: req.pickup.lat,
        lng: req.pickup.lng,
        address: req.pickup.address,
      },
      drop_details: {
        lat: req.drop.lat,
        lng: req.drop.lng,
        address: req.drop.address,
      },
      service_type: vehicleType,
    };

    const res = await fetch(`${BASE_URL}/v1/quotes`, {
      method: "POST",
      headers: this.headers,
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Porter quote failed: ${res.status} ${err}`);
    }

    const data = await res.json();

    return {
      provider: "porter",
      estimateId: data.estimate_id || data.quote_id || "",
      amount: Math.round((data.estimated_price || data.amount || 0) * 100), // Convert to paise
      currency: "INR",
      vehicleType,
      etaMinutes: data.eta || data.estimated_time_minutes || 30,
      distanceKm: data.distance || data.estimated_distance_km || 0,
      validUntil: Date.now() + (data.validity || 300) * 1000, // Default 5 min validity
    };
  }

  async bookDelivery(req: BookRequest): Promise<DeliveryBooking> {
    const vehicleType = req.quote.vehicleType || "2_wheeler";

    const body = {
      pickup_details: {
        lat: req.pickup.lat,
        lng: req.pickup.lng,
        address: req.pickup.address,
        contact: {
          name: req.pickup.contactName || "Restaurant",
          phone: req.pickup.contactPhone || "",
        },
      },
      drop_details: {
        lat: req.drop.lat,
        lng: req.drop.lng,
        address: req.drop.address,
        contact: {
          name: req.drop.contactName || "Customer",
          phone: req.drop.contactPhone || "",
        },
      },
      service_type: vehicleType,
      package_info: {
        description: req.packageDescription || "Food delivery",
        weight: req.packageWeightKg || 0.5,
      },
      // Our internal order reference so we can match webhooks
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
      throw new Error(`Porter booking failed: ${res.status} ${err}`);
    }

    const data = await res.json();

    return {
      provider: "porter",
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

  async trackDelivery(providerOrderId: string): Promise<TrackResponse> {
    const res = await fetch(`${BASE_URL}/v1/orders/${providerOrderId}/track`, {
      headers: this.headers,
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Porter tracking failed: ${res.status} ${err}`);
    }

    const data = await res.json();

    return {
      provider: "porter",
      orderId: providerOrderId,
      status: mapPorterStatus(data.status || data.order_status),
      driverName: data.driver?.name,
      driverPhone: data.driver?.phone,
      driverLat: data.driver?.lat,
      driverLng: data.driver?.lng,
      trackingUrl: data.tracking_url,
      etaMinutes: data.eta_minutes,
    };
  }

  async cancelDelivery(providerOrderId: string): Promise<CancelResponse> {
    const res = await fetch(`${BASE_URL}/v1/orders/${providerOrderId}/cancel`, {
      method: "POST",
      headers: this.headers,
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Porter cancel failed: ${res.status} ${err}`);
    }

    const data = await res.json();

    return {
      provider: "porter",
      orderId: providerOrderId,
      status: data.status === "cancelled" ? "cancelled" : "failed",
      cancellationFee: data.cancellation_fee ? Math.round(data.cancellation_fee * 100) : 0,
      message: data.message,
    };
  }

  parseWebhook(payload: unknown, _headers?: Record<string, string>): WebhookEvent | null {
    try {
      const data = payload as Record<string, unknown>;

      // Verify webhook signature if secret is configured
      // Porter sends signature in headers — verify in the route handler

      return {
        provider: "porter",
        providerOrderId: (data.order_id || data.id) as string,
        externalReference: (data.external_reference || data.reference) as string | undefined,
        status: mapPorterStatus((data.status || data.event_type) as string),
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
export const porterClient = new PorterClient();
