"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { menu } from "@/data/business";
import { useCart } from "@/lib/cart-context";

interface SelectedItem {
  name: string;
  price: number;
  description: string;
  image?: string;
  tag?: string;
  category: string;
}

function MenuItemCard({
  item,
  category,
  onClick,
}: {
  item: typeof menu[0]["items"][0];
  category: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="tilt-card group relative w-full overflow-hidden rounded-lg border border-[#1f1c18] bg-[#1f1c18]/80 text-left transition-all hover:border-[#f0c000]/40"
    >
      {/* Food image — compact */}
      {item.image && (
        <div className="img-zoom relative h-16 w-full">
          <Image
            src={item.image}
            alt={item.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 20vw"
            className="object-cover"
          />
          {/* Dark gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#1f1c18] via-transparent to-transparent" />
          {/* Tag */}
          {item.tag && (
            <span className="absolute top-1 left-1 rounded-full bg-[#f0c000] px-1.5 py-0.5 text-[9px] font-bold text-[#141210]">
              {item.tag}
            </span>
          )}
        </div>
      )}

      {/* Content */}
      <div className="relative p-2">
        <div className="flex items-start justify-between gap-1">
          <h4 className="text-xs font-bold leading-tight text-[#f5f0e8]">{item.name}</h4>
          <span className="whitespace-nowrap text-sm font-bold text-[#f0c000]">
            {item.price}
          </span>
        </div>
        <p className="mt-0.5 text-[10px] leading-snug text-[#f5f0e8]/60">
          {item.description}
        </p>
        <div className="mt-1.5 flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-[#f0c000]/60 transition-colors group-hover:text-[#f0c000]">
          <span>Tap to add</span>
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </div>
      </div>

      {/* Hover glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#f0c000]/0 to-[#f0c000]/0 opacity-0 transition-opacity duration-300 group-hover:from-[#f0c000]/10 group-hover:to-transparent group-hover:opacity-100 pointer-events-none" />
    </button>
  );
}

function ItemModal({
  item,
  onClose,
  onAdd,
}: {
  item: SelectedItem;
  onClose: () => void;
  onAdd: (quantity: number) => void;
}) {
  const [quantity, setQuantity] = useState(1);

  return createPortal(
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 p-4"
      onClick={onClose}
    >
      {/* Modal — stopPropagation so clicks inside don't close */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm overflow-hidden rounded-2xl border border-[#1f1c18] bg-[#141210] shadow-2xl"
      >
        {/* Image */}
        {item.image && (
          <div className="relative h-40 w-full">
            <Image
              src={item.image}
              alt={item.name}
              fill
              sizes="(max-width: 400px) 100vw, 400px"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#141210] via-transparent to-transparent" />
            {item.tag && (
              <span className="absolute top-3 left-3 rounded-full bg-[#f0c000] px-2.5 py-1 text-[10px] font-bold text-[#141210]">
                {item.tag}
              </span>
            )}
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        {/* Content */}
        <div className="p-5">
          {/* Category */}
          <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-[#f0c000]/60">
            {item.category}
          </p>

          {/* Name + price */}
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-lg font-bold leading-tight text-[#f5f0e8]">
              {item.name}
            </h3>
            <span className="whitespace-nowrap text-xl font-bold text-[#f0c000]">
              ₹{item.price}
            </span>
          </div>

          {/* Description */}
          <p className="mt-2 text-sm leading-relaxed text-[#f5f0e8]/60">
            {item.description}
          </p>

          {/* Quantity selector */}
          <div className="mt-5 flex items-center justify-between">
            <span className="text-sm font-bold text-[#f5f0e8]/80">Quantity</span>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1f1c18] text-lg font-bold text-[#f5f0e8] hover:bg-[#f0c000] hover:text-[#141210]"
              >
                −
              </button>
              <span className="w-8 text-center text-lg font-bold text-[#f5f0e8]">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1f1c18] text-lg font-bold text-[#f5f0e8] hover:bg-[#f0c000] hover:text-[#141210]"
              >
                +
              </button>
            </div>
          </div>

          {/* Total + add button */}
          <div className="mt-5 flex items-center justify-between gap-3">
            <div>
              <p className="text-xs text-[#f5f0e8]/40">Total</p>
              <p className="text-xl font-bold text-[#f0c000]">
                ₹{item.price * quantity}
              </p>
            </div>
            <button
              onClick={() => {
                onAdd(quantity);
                onClose();
              }}
              className="flex-1 rounded-xl bg-[#f0c000] py-3.5 text-center font-bold text-[#141210] transition-all hover:bg-[#ffd940]"
            >
              Add to Cart · ₹{item.price * quantity}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

export default function Menu() {
  const { addItem } = useCart();
  const [selectedItem, setSelectedItem] = useState<SelectedItem | null>(null);

  function handleClickItem(
    item: typeof menu[0]["items"][0],
    category: string
  ) {
    const price = parseInt(item.price.replace("₹", ""), 10);
    setSelectedItem({
      name: item.name,
      price,
      description: item.description,
      image: item.image,
      tag: item.tag,
      category,
    });
  }

  function handleAdd(quantity: number) {
    if (!selectedItem) return;
    addItem({
      name: selectedItem.name,
      price: selectedItem.price,
      quantity,
      image: selectedItem.image,
    });
  }

  return (
    <section id="menu" className="relative bg-[#0a0908]/75 py-24">
      {/* Top border */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#f0c000] to-transparent" />

      <div className="relative mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="mb-16 text-center">
          <p className="mb-2 text-sm font-bold uppercase tracking-widest text-[#f0c000]">
            Our Menu
          </p>
          <h2 className="text-4xl font-bold md:text-5xl">
            Straight from the <span className="text-gradient-brand">streets of Mumbai</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-[#f5f0e8]/60">
            Every dish made fresh with authentic Mumbai recipes, brought to the heart of Hyderabad.
          </p>
        </div>

        {/* Menu categories */}
        <div className="space-y-10">
          {menu.map((category) => (
            <div key={category.category}>
              <h3 className="mb-5 flex items-center gap-3 text-xl font-bold text-[#ffd940]">
                <span className="h-px flex-1 bg-[#f0c000]/30" />
                {category.category}
                <span className="h-px flex-1 bg-[#f0c000]/30" />
              </h3>

              <div className="grid gap-3 md:grid-cols-4 lg:grid-cols-5">
                {category.items.map((item) => (
                  <MenuItemCard
                    key={item.name}
                    item={item}
                    category={category.category}
                    onClick={() => handleClickItem(item, category.category)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Note */}
        <div className="mt-16 flex flex-col items-center gap-3 text-center">
          <div className="flex items-center gap-4">
            <span className="rounded-full border border-[#4a7c2f]/40 bg-[#4a7c2f]/10 px-4 py-2 text-sm font-bold text-[#7bc55f]">
              100% Pure Veg
            </span>
            <span className="rounded-full border border-[#f0c000]/40 bg-[#f0c000]/10 px-4 py-2 text-sm font-bold text-[#f0c000]">
              Ask for Jain option
            </span>
          </div>
          <p className="text-sm text-[#f5f0e8]/40">
            * Prices are indicative. Visit our outlets or order via WhatsApp for current pricing and availability.
          </p>
        </div>
      </div>

      {/* Item modal */}
      {selectedItem && (
        <ItemModal
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
          onAdd={handleAdd}
        />
      )}
    </section>
  );
}
