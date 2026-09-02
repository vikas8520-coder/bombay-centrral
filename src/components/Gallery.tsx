"use client";

import Image from "next/image";
import { phoneGallery } from "@/data/business";

export default function Gallery() {
  return (
    <section id="gallery" className="relative bg-[#0a0908]/75 py-24">
      <div className="mx-auto max-w-6xl px-6">
        {/* Header */}
        <div className="mb-16 text-center">
          <p className="mb-2 text-sm font-bold uppercase tracking-widest text-[#f0c000]">
            Gallery
          </p>
          <h2 className="text-4xl font-bold md:text-5xl">
            A feast for the <span className="text-gradient-brand">eyes</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-[#f5f0e8]/60">
            Real food, real moments from the streets of Bombay Centrral.
          </p>
        </div>

        {/* Phone photo mosaic — raw moments */}
        <div className="mt-16">
          <div className="grid grid-cols-3 gap-3 md:grid-cols-6">
            {phoneGallery.map((src, i) => (
              <div
                key={i}
                className="img-zoom relative aspect-square overflow-hidden rounded-xl border border-[#1f1c18]"
              >
                <Image
                  src={src}
                  alt={`Moment ${i + 1}`}
                  fill
                  sizes="(max-width: 768px) 33vw, 16vw"
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Instagram CTA */}
        <div className="mt-12 text-center">
          <p className="mb-4 text-[#f5f0e8]/50">See more on our Instagram</p>
          <a
            href="https://www.instagram.com/bombaycentrral.india/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-[#1f1c18] bg-[#1f1c18]/40 px-6 py-3 text-sm font-bold text-[#f5f0e8] transition-all hover:border-[#f0c000] hover:bg-[#f0c000]/10 hover:text-[#f0c000]"
          >
            <span>📸</span>
            @bombaycentrral.india
          </a>
        </div>
      </div>
    </section>
  );
}
