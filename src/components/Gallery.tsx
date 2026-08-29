"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { galleryImages, phoneGallery } from "@/data/business";

export default function Gallery() {
  const [activeIndex, setActiveIndex] = useState(0);

  const scrollToImage = (index: number) => {
    setActiveIndex(index);
  };

  return (
    <section id="gallery" className="relative bg-[#0a0908]/85 backdrop-blur-sm py-24">
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

        {/* Main showcase — 3D perspective */}
        <div className="relative" style={{ perspective: "1200px" }}>
          <div
            className="relative h-[400px] overflow-hidden rounded-3xl border border-[#1f1c18] bg-[#141210]"
            style={{ transformStyle: "preserve-3d" }}
          >
            {galleryImages.map((img, i) => (
              <div
                key={i}
                className="absolute inset-0 transition-all duration-700"
                style={{
                  opacity: i === activeIndex ? 1 : 0,
                  transform: `translateZ(${i === activeIndex ? 0 : -100}px) rotateY(${
                    i === activeIndex ? 0 : 15
                  }deg)`,
                }}
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, 1200px"
                  className="object-cover"
                  priority={i === 0}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0908] via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6">
                  <p className="text-2xl font-bold text-[#f0c000]">{img.label}</p>
                </div>
              </div>
            ))}

            {/* Navigation */}
            <button
              onClick={() => scrollToImage((activeIndex - 1 + galleryImages.length) % galleryImages.length)}
              className="absolute left-4 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-[#141210]/80 text-[#f5f0e8] backdrop-blur-sm transition-all hover:bg-[#f0c000] hover:text-[#141210]"
              aria-label="Previous"
            >
              ←
            </button>
            <button
              onClick={() => scrollToImage((activeIndex + 1) % galleryImages.length)}
              className="absolute right-4 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-[#141210]/80 text-[#f5f0e8] backdrop-blur-sm transition-all hover:bg-[#f0c000] hover:text-[#141210]"
              aria-label="Next"
            >
              →
            </button>
          </div>

          {/* Thumbnail strip */}
          <div className="mt-6 flex gap-3 overflow-x-auto pb-4" style={{ perspective: "800px" }}>
            {galleryImages.map((img, i) => (
              <button
                key={i}
                onClick={() => scrollToImage(i)}
                className={`relative h-20 w-28 flex-shrink-0 overflow-hidden rounded-xl border-2 transition-all duration-300 ${
                  i === activeIndex
                    ? "border-[#f0c000] scale-105 shadow-lg shadow-[#f0c000]/30"
                    : "border-[#1f1c18] opacity-50 hover:opacity-80"
                }`}
                style={{
                  transform: i === activeIndex ? "rotateY(-5deg) translateZ(20px)" : "rotateY(0)",
                  transformStyle: "preserve-3d",
                }}
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  sizes="112px"
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Phone photo mosaic — raw moments */}
        <div className="mt-16">
          <h3 className="mb-6 text-center text-xl font-bold text-[#f5f0e8]/80">
            From our kitchen to your screen
          </h3>
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
