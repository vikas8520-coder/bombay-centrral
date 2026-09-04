// Delivery provider interface — both Porter and Rapido implement this

import type {
  DeliveryQuote,
  DeliveryBooking,
  TrackResponse,
  CancelResponse,
  QuoteRequest,
  BookRequest,
  WebhookEvent,
} from "./types";

export interface DeliveryProviderClient {
  /** Provider identifier */
  readonly name: "porter" | "rapido";

  /** Check if the provider is configured (API key present) */
  isConfigured(): boolean;

  /** Get a delivery price estimate */
  getQuote(req: QuoteRequest): Promise<DeliveryQuote>;

  /** Book a delivery after customer confirms */
  bookDelivery(req: BookRequest): Promise<DeliveryBooking>;

  /** Track an active delivery */
  trackDelivery(providerOrderId: string): Promise<TrackResponse>;

  /** Cancel a booked delivery */
  cancelDelivery(providerOrderId: string): Promise<CancelResponse>;

  /** Parse an incoming webhook into a normalized event */
  parseWebhook(payload: unknown, headers?: Record<string, string>): WebhookEvent | null;
}
