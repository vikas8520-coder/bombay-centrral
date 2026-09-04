"use client";

import { useCart } from "@/lib/cart-context";

export default function CartButton() {
  const { totalItems, openCart } = useCart();

  if (totalItems === 0) return null;

  return (
    <button
      onClick={openCart}
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full bg-[#f0c000] px-5 py-3 font-bold text-[#141210] shadow-lg shadow-[#f0c000]/30 transition-all hover:scale-105 hover:bg-[#ffd940]"
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <circle cx="9" cy="21" r="1" />
        <circle cx="20" cy="21" r="1" />
        <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" />
      </svg>
      <span>Cart</span>
      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#141210] text-xs text-[#f0c000]">
        {totalItems}
      </span>
    </button>
  );
}
