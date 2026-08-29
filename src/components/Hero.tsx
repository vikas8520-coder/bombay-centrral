"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { business } from "@/data/business";

const Scene3D = dynamic(() => import("./Scene3D"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center">
      <div className="text-center">
        <div className="mb-4 animate-pulse text-6xl">🥘</div>
        <p className="text-sm text-[#f5f0e8]/40">Loading the stall...</p>
      </div>
    </div>
  ),
});

export default function Hero() {
  return (
    <section
      id="top"
      className="relative h-screen min-h-[700px] w-full overflow-hidden"
    >
      <div className="absolute inset-0">
        <Scene3D />
      </div>

      {/* Overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0908]/40 via-transparent to-[#0a0908]" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0a0908]/60 via-transparent to-transparent" />

      {/* Content */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
        {/* Logo — centerpiece */}
        <div className="fade-up mb-8">
          <Image
            src="/logo.png"
            alt="Bombay Centrral"
            width={300}
            height={300}
            className="rounded-3xl shadow-2xl shadow-[#f0c000]/30"
            priority
          />
        </div>

        <div className="mb-8 fade-up" style={{ animationDelay: "0.1s" }}>
          <span className="rounded-full border-2 border-[#f0c000] bg-[#0a0908]/80 px-5 py-2.5 text-sm font-bold text-[#f0c000] backdrop-blur-md">
            📍 Mumbai Street Food · Now in Hyderabad
          </span>
        </div>

        <p className="fade-up max-w-2xl text-lg font-medium text-[#f5f0e8] md:text-xl" style={{ animationDelay: "0.2s", textShadow: "0 2px 8px rgba(0,0,0,0.9)" }}>
          {business.tagline}
        </p>

        <div className="fade-up mt-10 flex flex-col gap-4 sm:flex-row" style={{ animationDelay: "0.3s" }}>
          <a
            href="#menu"
            className="rounded-full bg-[#f0c000] px-8 py-4 text-base font-bold text-[#141210] transition-all hover:bg-[#ffd940] hover:shadow-lg hover:shadow-[#f0c000]/40"
          >
            Explore Menu
          </a>
          <a
            href="#reviews"
            className="rounded-full border border-[#f5f0e8]/20 bg-[#f5f0e8]/5 px-8 py-4 text-base font-bold text-[#f5f0e8] backdrop-blur-sm transition-all hover:border-[#f0c000] hover:bg-[#f0c000]/10 hover:text-[#f0c000]"
          >
            Read Reviews
          </a>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <div className="flex flex-col items-center gap-2 text-[#f5f0e8]/40">
            <span className="text-xs uppercase tracking-widest">Scroll</span>
            <div className="h-12 w-px animate-pulse bg-gradient-to-b from-[#f0c000] to-transparent" />
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 right-8 z-10 hidden items-center gap-2 rounded-full bg-[#141210]/60 px-4 py-2 text-xs text-[#f5f0e8]/50 backdrop-blur-sm md:flex">
        <span className="animate-pulse">🖱️</span>
        Drag to explore the stall
      </div>
    </section>
  );
}
