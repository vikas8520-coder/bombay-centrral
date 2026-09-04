// Simple in-memory order store
// TODO: Replace with Supabase once database is set up
// This is just for testing the framework without a database

import type { DeliveryStatus } from "./types";

export interface Order {
  id: string;
  locationId: string;
  items: {
    name: string;
    price: number; // in paise
    quantity: number;
  }[];
  subtotal: number; // in paise
  deliveryCost: number; // in paise
  total: number; // in paise
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  customerLat: number;
  customerLng: number;
  deliveryProvider: "porter" | "rapido";
  deliveryProviderOrderId?: string;
  deliveryStatus: DeliveryStatus;
  trackingUrl?: string;
  driverName?: string;
  driverPhone?: string;
  createdAt: number;
  updatedAt: number;
}

// In-memory store (resets on server restart — replace with DB)
const orders = new Map<string, Order>();

export function createOrder(order: Order): void {
  orders.set(order.id, order);
}

export function getOrder(id: string): Order | undefined {
  return orders.get(id);
}

export function updateOrder(id: string, updates: Partial<Order>): Order | undefined {
  const order = orders.get(id);
  if (!order) return undefined;

  const updated = { ...order, ...updates, updatedAt: Date.now() };
  orders.set(id, updated);
  return updated;
}

export function getActiveOrders(locationId?: string): Order[] {
  const all = Array.from(orders.values());
  const active = all.filter(
    (o) =>
      o.deliveryStatus !== "delivered" &&
      o.deliveryStatus !== "cancelled" &&
      o.deliveryStatus !== "failed"
  );
  if (locationId) {
    return active.filter((o) => o.locationId === locationId);
  }
  return active;
}

export function getAllOrders(locationId?: string): Order[] {
  const all = Array.from(orders.values());
  if (locationId) {
    return all.filter((o) => o.locationId === locationId);
  }
  return all.sort((a, b) => b.createdAt - a.createdAt);
}
