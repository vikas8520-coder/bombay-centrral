"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

interface OrderData {
  orderId: string;
  items: { name: string; price: string; quantity: number }[];
  subtotal: string;
  deliveryCost: string;
  total: string;
  deliveryProvider: string;
  deliveryStatus: string;
  trackingUrl?: string;
  driverName?: string;
  driverPhone?: string;
  customerName: string;
  createdAt: string;
}

const STATUS_STEPS = [
  { key: "booked", label: "Order Confirmed", icon: "✓" },
  { key: "driver_assigned", label: "Driver Assigned", icon: "🛵" },
  { key: "picked_up", label: "Picked Up", icon: "📦" },
  { key: "on_the_way", label: "On the Way", icon: "🛵" },
  { key: "delivered", label: "Delivered", icon: "🎉" },
];

function getStatusIndex(status: string): number {
  const idx = STATUS_STEPS.findIndex((s) => s.key === status);
  if (status === "at_pickup") return 1;
  if (status === "at_drop") return 3;
  if (status === "cancelled" || status === "failed") return -1;
  return idx >= 0 ? idx : 0;
}

export default function TrackOrderPage() {
  const params = useParams();
  const orderId = params.orderId as string;
  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchOrder() {
      try {
        const res = await fetch(`/api/orders/${orderId}`);
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Order not found");
        }
        setOrder(data);
      } catch (err) {
        setError(String(err));
      } finally {
        setLoading(false);
      }
    }

    if (orderId) {
      fetchOrder();
      // Poll every 10 seconds for updates
      const interval = setInterval(fetchOrder, 10000);
      return () => clearInterval(interval);
    }
  }, [orderId]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0a0908]">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-[#f0c000] border-t-transparent" />
          <p className="text-[#f5f0e8]/60">Loading order...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0a0908]">
        <div className="text-center">
          <p className="mb-2 text-5xl">😕</p>
          <p className="text-lg font-bold text-[#f5f0e8]">Order not found</p>
          <p className="mt-1 text-sm text-[#f5f0e8]/60">{error}</p>
          <Link
            href="/"
            className="mt-4 inline-block rounded-xl bg-[#f0c000] px-6 py-3 font-bold text-[#141210] hover:bg-[#ffd940]"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const currentStep = getStatusIndex(order.deliveryStatus);
  const isCancelled = order.deliveryStatus === "cancelled" || order.deliveryStatus === "failed";

  return (
    <div className="min-h-screen bg-[#0a0908] py-12">
      <div className="mx-auto max-w-2xl px-6">
        {/* Header */}
        <div className="mb-8 text-center">
          <Link href="/" className="text-sm text-[#f5f0e8]/40 hover:text-[#f5f0e8]">
            ← Back to Home
          </Link>
          <h1 className="mt-4 text-3xl font-bold text-[#f0c000]">Track Your Order</h1>
          <p className="mt-2 font-mono text-sm text-[#f5f0e8]/60">{order.orderId}</p>
        </div>

        {/* Status tracker */}
        {!isCancelled ? (
          <div className="mb-8 rounded-2xl border border-[#1f1c18] bg-[#141210] p-6">
            <div className="flex justify-between">
              {STATUS_STEPS.map((step, i) => (
                <div key={step.key} className="flex flex-col items-center" style={{ flex: 1 }}>
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-full text-xl transition-all ${
                      i <= currentStep
                        ? "bg-[#f0c000] text-[#141210]"
                        : "bg-[#1f1c18] text-[#f5f0e8]/30"
                    }`}
                  >
                    {i < currentStep ? "✓" : step.icon}
                  </div>
                  <p
                    className={`mt-2 text-center text-[10px] font-bold ${
                      i <= currentStep ? "text-[#f5f0e8]" : "text-[#f5f0e8]/30"
                    }`}
                  >
                    {step.label}
                  </p>
                  {/* Connector line */}
                  {i < STATUS_STEPS.length - 1 && (
                    <div
                      className={`mt-[-24px] mb-[24px] h-0.5 w-full ${
                        i < currentStep ? "bg-[#f0c000]" : "bg-[#1f1c18]"
                      }`}
                      style={{ marginLeft: "50%", zIndex: -1 }}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="mb-8 rounded-2xl border border-red-500/30 bg-red-500/10 p-6 text-center">
            <p className="text-5xl">❌</p>
            <p className="mt-2 text-lg font-bold text-red-400">Order Cancelled</p>
          </div>
        )}

        {/* Driver info */}
        {order.driverName && (
          <div className="mb-6 rounded-2xl border border-[#f0c000]/30 bg-[#f0c000]/10 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-[#f5f0e8]/60">Your delivery partner</p>
                <p className="text-lg font-bold text-[#f5f0e8]">{order.driverName}</p>
                {order.driverPhone && (
                  <a
                    href={`tel:${order.driverPhone}`}
                    className="text-sm text-[#f0c000] hover:underline"
                  >
                    📞 {order.driverPhone}
                  </a>
                )}
              </div>
              <span className="text-4xl">🛵</span>
            </div>
            {order.trackingUrl && (
              <a
                href={order.trackingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 block w-full rounded-xl bg-[#f0c000] py-2.5 text-center font-bold text-[#141210] hover:bg-[#ffd940]"
              >
                Live Track on Map →
              </a>
            )}
          </div>
        )}

        {/* Order details */}
        <div className="rounded-2xl border border-[#1f1c18] bg-[#141210] p-6">
          <h2 className="mb-4 text-lg font-bold text-[#f5f0e8]">Order Details</h2>

          {/* Items */}
          <div className="space-y-2">
            {order.items.map((item, i) => (
              <div key={i} className="flex justify-between text-sm">
                <span className="text-[#f5f0e8]/80">
                  {item.quantity}× {item.name}
                </span>
                <span className="text-[#f5f0e8]">{item.price}</span>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="mt-4 space-y-1 border-t border-[#1f1c18] pt-4">
            <div className="flex justify-between text-sm">
              <span className="text-[#f5f0e8]/60">Food total</span>
              <span className="text-[#f5f0e8]">{order.subtotal}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[#f5f0e8]/60">Delivery ({order.deliveryProvider})</span>
              <span className="text-[#f5f0e8]">{order.deliveryCost}</span>
            </div>
            <div className="flex justify-between border-t border-[#1f1c18] pt-2">
              <span className="font-bold text-[#f5f0e8]">Total</span>
              <span className="font-bold text-[#f0c000]">{order.total}</span>
            </div>
          </div>

          {/* Meta */}
          <div className="mt-4 border-t border-[#1f1c18] pt-4 text-xs text-[#f5f0e8]/40">
            <p>Customer: {order.customerName}</p>
            <p>Ordered: {new Date(order.createdAt).toLocaleString("en-IN")}</p>
            <p>Delivery via: {order.deliveryProvider}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
