import { business } from "@/data/business";

export default function OrderCTA() {
  return (
    <section id="order" className="relative overflow-hidden bg-[#0a0908]/85 backdrop-blur-sm py-24">
      {/* Glow */}
      <div className="absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#f0c000]/10 blur-3xl" />

      <div className="relative mx-auto max-w-3xl px-6 text-center">
        <p className="mb-2 text-sm font-bold uppercase tracking-widest text-[#f0c000]">
          Hungry Yet?
        </p>
        <h2 className="mb-6 text-4xl font-bold md:text-6xl">
          Order now or <span className="text-gradient-brand">visit us</span>
        </h2>
        <p className="mb-12 text-lg text-[#f5f0e8]/60">
          Get your Mumbai street food fix delivered, or drop by for the full experience.
        </p>

        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <a
            href={business.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="glow-pulse flex w-full items-center justify-center gap-3 rounded-2xl bg-[#06a77d] px-8 py-4 text-lg font-bold text-white transition-all hover:scale-105 sm:w-auto"
          >
            <span className="text-2xl">💬</span>
            Order on WhatsApp
          </a>
          <a
            href={business.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center justify-center gap-3 rounded-2xl border border-[#1f1c18] bg-[#1f1c18]/40 px-8 py-4 text-lg font-bold text-[#f5f0e8] transition-all hover:border-[#f0c000] hover:bg-[#f0c000]/10 hover:text-[#f0c000] sm:w-auto"
          >
            <span className="text-2xl">📸</span>
            Follow on Instagram
          </a>
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-[#f5f0e8]/50">
          <a href={business.linktree} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-[#f0c000]">
            🔗 All Links
          </a>
          <a href={business.facebook} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-[#f0c000]">
            📘 Facebook
          </a>
          <a href={business.email} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-[#f0c000]">
            ✉️ Email Us
          </a>
          <a href="#locations" className="transition-colors hover:text-[#f0c000]">
            📍 Find a Location
          </a>
        </div>
      </div>
    </section>
  );
}
