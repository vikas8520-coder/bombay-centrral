"use client";

import Image from "next/image";
import { business } from "@/data/business";

export default function Hero() {
  return (
    <section
      id="top"
      className="relative flex min-h-screen w-full items-center justify-center overflow-hidden"
    >
      {/* Semi-circle tint — bottom half, curved top, blended into background */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2"
        style={{
          width: "180vw",
          height: "60vh",
          borderRadius: "50% 50% 0 0",
          background: "radial-gradient(ellipse 60% 100% at center bottom, rgba(10,9,8,0.85) 0%, rgba(10,9,8,0.4) 40%, rgba(10,9,8,0.1) 70%, transparent 100%)",
          filter: "blur(20px)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center px-6 text-center">
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

        <div className="fade-up mb-8" style={{ animationDelay: "0.1s" }}>
          <span className="rounded-full border-2 border-[#f0c000] bg-[#0a0908]/95 px-5 py-2.5 text-sm font-bold text-[#f0c000]">
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
            className="rounded-full border border-[#f5f0e8]/20 bg-[#0a0908]/80 px-8 py-4 text-base font-bold text-[#f5f0e8] transition-all hover:border-[#f0c000] hover:bg-[#f0c000]/10 hover:text-[#f0c000]"
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
    </section>
  );
}
