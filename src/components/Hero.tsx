"use client";

import { business } from "@/data/business";

export default function Hero() {
  return (
    <section
      id="top"
      className="relative flex min-h-screen w-full items-end justify-center overflow-hidden pb-20"
    >
      {/* Tint — bottom half only, seamlessly blended */}
      <div
        className="absolute bottom-0 left-0 right-0"
        style={{
          height: "50vh",
          background: "linear-gradient(to top, rgba(10,9,8,0.92) 0%, rgba(10,9,8,0.7) 30%, rgba(10,9,8,0.3) 70%, transparent 100%)",
        }}
      />

      {/* Content — positioned in lower half */}
      <div className="relative z-10 flex flex-col items-center justify-center px-6 text-center pb-10">
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
