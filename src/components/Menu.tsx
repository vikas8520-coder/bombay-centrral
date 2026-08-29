import Image from "next/image";
import { menu } from "@/data/business";

export default function Menu() {
  return (
    <section id="menu" className="relative bg-[#0a0908]/95 py-24">
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

              <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
                {category.items.map((item) => (
                  <div
                    key={item.name}
                    className="tilt-card group relative overflow-hidden rounded-xl border border-[#1f1c18] bg-[#1f1c18]/90"
                  >
                    {/* Food image — compact */}
                    {item.image && (
                      <div className="img-zoom relative h-24 w-full">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                          className="object-cover"
                        />
                        {/* Dark gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#1f1c18] via-transparent to-transparent" />
                        {/* Tag */}
                        {item.tag && (
                          <span className="absolute top-2 left-2 rounded-full bg-[#f0c000] px-2 py-0.5 text-[10px] font-bold text-[#141210]">
                            {item.tag}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Content */}
                    <div className="relative p-3">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-sm font-bold leading-tight text-[#f5f0e8]">{item.name}</h4>
                        <span className="whitespace-nowrap text-base font-bold text-[#f0c000]">
                          {item.price}
                        </span>
                      </div>
                      <p className="mt-1 text-xs leading-snug text-[#f5f0e8]/60">
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
    </section>
  );
}
