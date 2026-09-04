// Shared types for the delivery system

export type DeliveryProvider = "porter" | "rapido";

export type DeliveryStatus =
  | "pending"
  | "quoted"
  | "booked"
  | "driver_assigned"
  | "at_pickup"
  | "picked_up"
  | "on_the_way"
  | "at_drop"
  | "delivered"
  | "cancelled"
  | "failed";

export interface Address {
  lat: number;
  lng: number;
  address: string;
  contactName?: string;
  contactPhone?: string;
}

export interface DeliveryQuote {
  provider: DeliveryProvider;
  estimateId: string; // Provider's quote/estimate ID
  amount: number; // Total delivery cost in paise (₹1 = 100 paise)
  currency: "INR";
  vehicleType: string; // e.g. "2_wheeler"
  etaMinutes: number; // Estimated delivery time
  distanceKm: number;
  validUntil: number; // Unix timestamp
}

export interface DeliveryBooking {
  provider: DeliveryProvider;
  orderId: string; // Provider's order ID
  status: DeliveryStatus;
  amount: number; // in paise
  driverName?: string;
  driverPhone?: string;
  driverLat?: number;
  driverLng?: number;
  trackingUrl?: string;
  etaMinutes?: number;
  createdAt: number;
}

export interface QuoteRequest {
  pickup: Address;
  drop: Address;
  vehicleType?: "2_wheeler" | "auto" | "4_wheeler";
}

export interface BookRequest {
  quote: DeliveryQuote;
  pickup: Address;
  drop: Address;
  packageDescription?: string;
  packageWeightKg?: number;
  externalReference?: string; // Our internal order ID
}

export interface TrackResponse {
  provider: DeliveryProvider;
  orderId: string;
  status: DeliveryStatus;
  driverName?: string;
  driverPhone?: string;
  driverLat?: number;
  driverLng?: number;
  trackingUrl?: string;
  etaMinutes?: number;
}

export interface CancelResponse {
  provider: DeliveryProvider;
  orderId: string;
  status: "cancelled" | "failed";
  cancellationFee?: number; // in paise
  message?: string;
}

// Webhook events from providers
export interface WebhookEvent {
  provider: DeliveryProvider;
  providerOrderId: string;
  externalReference?: string;
  status: DeliveryStatus;
  driverName?: string;
  driverPhone?: string;
  driverLat?: number;
  driverLng?: number;
  trackingUrl?: string;
  timestamp: number;
  raw: unknown; // Original payload for audit
}
