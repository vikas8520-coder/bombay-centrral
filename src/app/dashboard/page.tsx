"use client";

import { useEffect, useState } from "react";
import { restaurantLocations } from "@/lib/delivery/locations";

interface ActiveOrder {
  orderId: string;
  locationId: string;
  items: { name: string; quantity: number; price: string }[];
  subtotal: string;
  deliveryCost: string;
  total: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  deliveryProvider: string;
  deliveryStatus: string;
  trackingUrl?: string;
  driverName?: string;
  driverPhone?: string;
  createdAt: string;
}

export default function DashboardPage() {
  const [orders, setOrders] = useState<ActiveOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState<string>("all");

  async function fetchOrders() {
    try {
      const url = selectedLocation === "all"
        ? "/api/orders/active"
        : `/api/orders/active?locationId=${selectedLocation}`;
      const res = await fetch(url);
      const data = await res.json();
      setOrders(data.orders || []);
    } catch {
      // Ignore
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 5000);
    return () => clearInterval(interval);
  }, [selectedLocation]);

  const statusColors: Record<string, string> = {
    pending: "bg-yellow-500/20 text-yellow-400",
    booked: "bg-blue-500/20 text-blue-400",
    driver_assigned: "bg-purple-500/20 text-purple-400",
    at_pickup: "bg-purple-500/20 text-purple-400",
    picked_up: "bg-indigo-500/20 text-indigo-400",
    on_the_way: "bg-cyan-500/20 text-cyan-400",
    at_drop: "bg-cyan-500/20 text-cyan-400",
    delivered: "bg-green-500/20 text-green-400",
    cancelled: "bg-red-500/20 text-red-400",
    failed: "bg-red-500/20 text-red-400",
  };

  const statusLabels: Record<string, string> = {
    pending: "Pending",
    booked: "Booked",
    driver_assigned: "Driver Assigned",
    at_pickup: "At Pickup",
    picked_up: "Picked Up",
    on_the_way: "On the Way",
    at_drop: "At Drop",
    delivered: "Delivered",
    cancelled: "Cancelled",
    failed: "Failed",
  };

  return (
    <div className="min-h-screen bg-[#0a0908] py-8">
      <div className="mx-auto max-w-6xl px-6">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#f0c000]">Bombay Centrral — Orders</h1>
            <p className="text-sm text-[#f5f0e8]/60">Restaurant Dashboard</p>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="rounded-xl border border-[#1f1c18] bg-[#1f1c18] px-4 py-2 text-sm text-[#f5f0e8] focus:border-[#f0c000] focus:outline-none"
            >
              <option value="all">All Locations</option>
              {restaurantLocations.map((loc) => (
                <option key={loc.id} value={loc.id}>
                  {loc.name}
                </option>
              ))}
            </select>
            <button
              onClick={fetchOrders}
              className="rounded-xl border border-[#1f1c18] px-4 py-2 text-sm text-[#f5f0e8]/60 hover:bg-[#1f1c18]"
            >
              ↻ Refresh
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="mb-6 grid grid-cols-3 gap-4">
          <div className="rounded-xl border border-[#1f1c18] bg-[#141210] p-4">
            <p className="text-xs text-[#f5f0e8]/60">Active Orders</p>
            <p className="text-2xl font-bold text-[#f0c000]">{orders.length}</p>
          </div>
          <div className="rounded-xl border border-[#1f1c18] bg-[#141210] p-4">
            <p className="text-xs text-[#f5f0e8]/60">Total Value</p>
            <p className="text-2xl font-bold text-[#f5f0e8]">
              ₹{orders.reduce((sum, o) => sum + parseInt(o.total.replace("₹", "")), 0)}
            </p>
          </div>
          <div className="rounded-xl border border-[#1f1c18] bg-[#141210] p-4">
            <p className="text-xs text-[#f5f0e8]/60">Out for Delivery</p>
            <p className="text-2xl font-bold text-[#f5f0e8]">
              {orders.filter((o) => o.deliveryStatus === "on_the_way" || o.deliveryStatus === "picked_up").length}
            </p>
          </div>
        </div>

        {/* Orders */}
        {loading ? (
          <div className="py-20 text-center">
            <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-[#f0c000] border-t-transparent" />
            <p className="text-[#f5f0e8]/60">Loading orders...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-5xl mb-4">📭</p>
            <p className="text-[#f5f0e8]/60">No active orders right now</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.orderId}
                className="rounded-2xl border border-[#1f1c18] bg-[#141210] p-5"
              >
                {/* Order header */}
                <div className="mb-3 flex items-center justify-between">
                  <div>
                    <p className="font-mono text-sm font-bold text-[#f0c000]">
                      {order.orderId}
                    </p>
                    <p className="text-xs text-[#f5f0e8]/40">
                      {new Date(order.createdAt).toLocaleTimeString("en-IN")} ·
                      {" "} {order.deliveryProvider}
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold ${
                      statusColors[order.deliveryStatus] || "bg-gray-500/20 text-gray-400"
                    }`}
                  >
                    {statusLabels[order.deliveryStatus] || order.deliveryStatus}
                  </span>
                </div>

                {/* Items */}
                <div className="mb-3 flex flex-wrap gap-2">
                  {order.items.map((item, i) => (
                    <span
                      key={i}
                      className="rounded-lg bg-[#1f1c18] px-2.5 py-1 text-xs text-[#f5f0e8]/80"
                    >
                      {item.quantity}× {item.name}
                    </span>
                  ))}
                </div>

                {/* Customer + delivery info */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-xs text-[#f5f0e8]/40">Customer</p>
                    <p className="text-[#f5f0e8]">{order.customerName}</p>
                    <p className="text-xs text-[#f5f0e8]/60">{order.customerPhone}</p>
                    <p className="text-xs text-[#f5f0e8]/60">{order.customerAddress}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-[#f5f0e8]/40">Total</p>
                    <p className="text-lg font-bold text-[#f0c000]">{order.total}</p>
                    {order.driverName && (
                      <p className="text-xs text-[#f5f0e8]/60">🛵 {order.driverName}</p>
                    )}
                    {order.trackingUrl && (
                      <a
                        href={order.trackingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-[#f0c000] hover:underline"
                      >
                        Track →
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
