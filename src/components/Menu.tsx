import Image from "next/image";
import { menu } from "@/data/business";

export default function Menu() {
  return (
    <section id="menu" className="relative bg-[#0a0908]/85 backdrop-blur-sm py-24">
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
        <div className="space-y-16">
          {menu.map((category) => (
            <div key={category.category}>
              <h3 className="mb-8 flex items-center gap-3 text-2xl font-bold text-[#ffd940]">
                <span className="h-px flex-1 bg-[#f0c000]/30" />
                {category.category}
                <span className="h-px flex-1 bg-[#f0c000]/30" />
              </h3>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {category.items.map((item) => (
                  <div
                    key={item.name}
                    className="tilt-card group relative overflow-hidden rounded-2xl border border-[#1f1c18] bg-[#1f1c18]/60 backdrop-blur-sm"
                  >
                    {/* Food image */}
                    {item.image && (
                      <div className="img-zoom relative h-48 w-full">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className="object-cover"
                        />
                        {/* Dark gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#1f1c18] via-transparent to-transparent" />
                        {/* Tag */}
                        {item.tag && (
                          <span className="absolute top-3 left-3 rounded-full bg-[#f0c000] px-3 py-1 text-xs font-bold text-[#141210]">
                            {item.tag}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Content */}
                    <div className="relative p-5">
                      <div className="flex items-start justify-between gap-3">
                        <h4 className="text-lg font-bold text-[#f5f0e8]">{item.name}</h4>
                        <span className="whitespace-nowrap text-xl font-bold text-[#f0c000]">
                          {item.price}
                        </span>
                      </div>
                      <p className="mt-2 text-sm leading-relaxed text-[#f5f0e8]/60">
                        {item.description}
                      </p>
                    </div>

                    {/* Hover glow */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[#f0c000]/0 to-[#f0c000]/0 opacity-0 transition-opacity duration-300 group-hover:from-[#f0c000]/10 group-hover:to-transparent group-hover:opacity-100 pointer-events-none" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Note */}
        <p className="mt-16 text-center text-sm text-[#f5f0e8]/40">
          * Prices are indicative. Visit our outlets or order via WhatsApp for current pricing and availability.
        </p>
      </div>
    </section>
  );
}
