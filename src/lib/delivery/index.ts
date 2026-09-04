// Barrel export for delivery system

export type {
  DeliveryProvider,
  DeliveryStatus,
  Address,
  DeliveryQuote,
  DeliveryBooking,
  QuoteRequest,
  BookRequest,
  TrackResponse,
  CancelResponse,
  WebhookEvent,
} from "./types";

export type { DeliveryProviderClient } from "./provider-interface";

export { PorterClient, porterClient } from "./porter";
export { RapidoClient, rapidoClient } from "./rapido";
export { getBestQuote, getQuoteFromProvider, getProvider, getAvailableProviders } from "./router";
export { restaurantLocations, getLocationById } from "./locations";
export type { RestaurantLocation } from "./locations";

export {
  createOrder,
  getOrder,
  updateOrder,
  getActiveOrders,
  getAllOrders,
} from "./order-store";
export type { Order } from "./order-store";
