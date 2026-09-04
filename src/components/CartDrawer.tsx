"use client";

import { useCart } from "@/lib/cart-context";
import { useState } from "react";
import { restaurantLocations } from "@/lib/delivery/locations";

export default function CartDrawer() {
  const {
    items,
    isOpen,
    closeCart,
    updateQuantity,
    removeItem,
    clearCart,
    subtotal,
    totalItems,
  } = useCart();

  const [step, setStep] = useState<"cart" | "checkout" | "success">("cart");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [orderId, setOrderId] = useState("");

  // Checkout form
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [locationId, setLocationId] = useState(restaurantLocations[0].id);
  const [deliveryInfo, setDeliveryInfo] = useState<{
    provider: string;
    cost: string;
    eta: number;
  } | null>(null);

  // Get delivery quote when address is filled
  async function getQuote() {
    if (!customerAddress) return;
    // Use a default central Hyderabad coordinate for demo
    // In production, use Google Maps geocoding API
    const dropLat = 17.4474;
    const dropLng = 78.3762;

    try {
      const res = await fetch(
        `/api/delivery/quote?locationId=${locationId}&dropLat=${dropLat}&dropLng=${dropLng}&dropAddress=${encodeURIComponent(
          customerAddress
        )}`
      );
      const data = await res.json();
      if (data.best) {
        setDeliveryInfo({
          provider: data.best.provider,
          cost: data.best.amountDisplay,
          eta: data.best.etaMinutes,
        });
      }
    } catch {
      // Ignore — quote is optional until checkout
    }
  }

  async function placeOrder() {
    if (!customerName || !customerPhone || !customerAddress) {
      setError("Please fill in all fields");
      return;
    }

    if (items.length === 0) {
      setError("Cart is empty");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const dropLat = 17.4474; // Default — replace with geocoding
      const dropLng = 78.3762;

      const res = await fetch("/api/orders/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          locationId,
          items: items.map((i) => ({ name: i.name, quantity: i.quantity })),
          customerName,
          customerPhone,
          customerAddress,
          customerLat: dropLat,
          customerLng: dropLng,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to place order");
      }

      setOrderId(data.orderId);
      setStep("success");
      clearCart();
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  }

  function handleClose() {
    closeCart();
    // Reset to cart view after close animation
    setTimeout(() => {
      setStep("cart");
      setError("");
      setDeliveryInfo(null);
    }, 300);
  }

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[100] bg-black/60"
        onClick={handleClose}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 z-[101] h-full w-full max-w-md overflow-y-auto bg-[#141210] shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#1f1c18] bg-[#141210] px-5 py-4">
          <h3 className="text-lg font-bold text-[#f0c000]">
            {step === "cart" && `Your Cart (${totalItems})`}
            {step === "checkout" && "Checkout"}
            {step === "success" && "Order Placed!"}
          </h3>
          <button
            onClick={handleClose}
            className="rounded-full p-2 text-[#f5f0e8]/60 hover:bg-[#1f1c18] hover:text-[#f5f0e8]"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Cart Step */}
        {step === "cart" && (
          <div className="flex flex-col gap-4 p-5">
            {items.length === 0 ? (
              <div className="py-20 text-center">
                <p className="text-5xl mb-4">🛒</p>
                <p className="text-[#f5f0e8]/60">Your cart is empty</p>
                <p className="mt-1 text-sm text-[#f5f0e8]/40">
                  Add some delicious items from the menu!
                </p>
              </div>
            ) : (
              <>
                {items.map((item) => (
                  <div
                    key={item.name}
                    className="flex items-center gap-3 rounded-xl border border-[#1f1c18] bg-[#1f1c18]/60 p-3"
                  >
                    <div className="flex-1">
                      <p className="text-sm font-bold text-[#f5f0e8]">
                        {item.name}
                      </p>
                      <p className="text-xs text-[#f0c000]">₹{item.price}</p>
                    </div>

                    {/* Quantity controls */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.name, item.quantity - 1)}
                        className="flex h-7 w-7 items-center justify-center rounded-full bg-[#141210] text-[#f5f0e8] hover:bg-[#f0c000] hover:text-[#141210]"
                      >
                        −
                      </button>
                      <span className="w-6 text-center text-sm font-bold text-[#f5f0e8]">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.name, item.quantity + 1)}
                        className="flex h-7 w-7 items-center justify-center rounded-full bg-[#141210] text-[#f5f0e8] hover:bg-[#f0c000] hover:text-[#141210]"
                      >
                        +
                      </button>
                    </div>

                    <div className="w-16 text-right">
                      <p className="text-sm font-bold text-[#f5f0e8]">
                        ₹{item.price * item.quantity}
                      </p>
                    </div>
                  </div>
                ))}

                {/* Subtotal */}
                <div className="mt-2 flex items-center justify-between border-t border-[#1f1c18] pt-4">
                  <span className="text-sm text-[#f5f0e8]/60">Subtotal</span>
                  <span className="text-xl font-bold text-[#f0c000]">₹{subtotal}</span>
                </div>

                {/* Checkout button */}
                <button
                  onClick={() => setStep("checkout")}
                  className="mt-2 w-full rounded-xl bg-[#f0c000] py-3.5 text-center font-bold text-[#141210] transition-all hover:bg-[#ffd940]"
                >
                  Proceed to Checkout →
                </button>
              </>
            )}
          </div>
        )}

        {/* Checkout Step */}
        {step === "checkout" && (
          <div className="flex flex-col gap-4 p-5">
            {/* Location selector */}
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-[#f5f0e8]/60">
                Pickup Location
              </label>
              <select
                value={locationId}
                onChange={(e) => setLocationId(e.target.value)}
                className="w-full rounded-xl border border-[#1f1c18] bg-[#1f1c18] px-4 py-3 text-sm text-[#f5f0e8] focus:border-[#f0c000] focus:outline-none"
              >
                {restaurantLocations.map((loc) => (
                  <option key={loc.id} value={loc.id}>
                    {loc.name} — {loc.area}
                  </option>
                ))}
              </select>
            </div>

            {/* Customer details */}
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-[#f5f0e8]/60">
                Your Name
              </label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Enter your name"
                className="w-full rounded-xl border border-[#1f1c18] bg-[#1f1c18] px-4 py-3 text-sm text-[#f5f0e8] placeholder:text-[#f5f0e8]/30 focus:border-[#f0c000] focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-[#f5f0e8]/60">
                Phone Number
              </label>
              <input
                type="tel"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full rounded-xl border border-[#1f1c18] bg-[#1f1c18] px-4 py-3 text-sm text-[#f5f0e8] placeholder:text-[#f5f0e8]/30 focus:border-[#f0c000] focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-[#f5f0e8]/60">
                Delivery Address
              </label>
              <textarea
                value={customerAddress}
                onChange={(e) => setCustomerAddress(e.target.value)}
                onBlur={getQuote}
                placeholder="Full address with landmark, area, pincode"
                rows={3}
                className="w-full rounded-xl border border-[#1f1c18] bg-[#1f1c18] px-4 py-3 text-sm text-[#f5f0e8] placeholder:text-[#f5f0e8]/30 focus:border-[#f0c000] focus:outline-none"
              />
            </div>

            {/* Delivery estimate */}
            {deliveryInfo && (
              <div className="rounded-xl border border-[#f0c000]/30 bg-[#f0c000]/10 p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-[#f5f0e8]/60">Delivery via {deliveryInfo.provider}</p>
                    <p className="text-sm font-bold text-[#f0c000]">
                      {deliveryInfo.cost} · ETA {deliveryInfo.eta} min
                    </p>
                  </div>
                  <span className="text-2xl">🛵</span>
                </div>
              </div>
            )}

            {/* Order summary */}
            <div className="rounded-xl border border-[#1f1c18] bg-[#1f1c18]/60 p-4">
              <p className="mb-2 text-xs font-bold uppercase tracking-wider text-[#f5f0e8]/60">
                Order Summary
              </p>
              {items.map((item) => (
                <div key={item.name} className="flex justify-between py-1 text-sm">
                  <span className="text-[#f5f0e8]/80">
                    {item.quantity}× {item.name}
                  </span>
                  <span className="text-[#f5f0e8]">
                    ₹{item.price * item.quantity}
                  </span>
                </div>
              ))}
              <div className="mt-2 flex justify-between border-t border-[#1f1c18] pt-2">
                <span className="text-sm text-[#f5f0e8]/60">Food total</span>
                <span className="text-sm font-bold text-[#f5f0e8]">₹{subtotal}</span>
              </div>
              {deliveryInfo && (
                <>
                  <div className="flex justify-between py-1 text-sm">
                    <span className="text-[#f5f0e8]/60">Delivery</span>
                    <span className="text-[#f5f0e8]">{deliveryInfo.cost}</span>
                  </div>
                  <div className="flex justify-between border-t border-[#1f1c18] pt-2">
                    <span className="font-bold text-[#f5f0e8]">Total</span>
                    <span className="font-bold text-[#f0c000]">
                      ₹{subtotal + parseInt(deliveryInfo.cost.replace("₹", ""))}
                    </span>
                  </div>
                </>
              )}
            </div>

            {error && (
              <p className="text-sm text-red-400">{error}</p>
            )}

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => setStep("cart")}
                className="rounded-xl border border-[#1f1c18] px-5 py-3 text-sm font-bold text-[#f5f0e8]/60 hover:bg-[#1f1c18]"
              >
                ← Back
              </button>
              <button
                onClick={placeOrder}
                disabled={loading}
                className="flex-1 rounded-xl bg-[#f0c000] py-3 text-center font-bold text-[#141210] transition-all hover:bg-[#ffd940] disabled:opacity-50"
              >
                {loading ? "Placing order..." : "Place Order →"}
              </button>
            </div>
          </div>
        )}

        {/* Success Step */}
        {step === "success" && (
          <div className="flex flex-col items-center gap-4 p-8 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#4a7c2f]/20">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#7bc55f" strokeWidth="3">
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-[#f5f0e8]">Order Placed!</h3>
            <p className="text-sm text-[#f5f0e8]/60">
              Your order ID is
            </p>
            <p className="rounded-lg bg-[#1f1c18] px-4 py-2 font-mono text-lg font-bold text-[#f0c000]">
              {orderId}
            </p>
            <p className="text-sm text-[#f5f0e8]/60">
              We're booking your delivery now. You'll receive an SMS with tracking details.
            </p>
            <a
              href={`/track/${orderId}`}
              className="mt-2 w-full rounded-xl bg-[#f0c000] py-3 text-center font-bold text-[#141210] hover:bg-[#ffd940]"
            >
              Track Your Order →
            </a>
            <button
              onClick={handleClose}
              className="text-sm text-[#f5f0e8]/40 hover:text-[#f5f0e8]"
            >
              Continue browsing
            </button>
          </div>
        )}
      </div>
    </>
  );
}
