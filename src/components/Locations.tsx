import { locations } from "@/data/business";

export default function Locations() {
  return (
    <section id="locations" className="relative bg-[#0a0908]/75 py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-16 text-center">
          <p className="mb-2 text-sm font-bold uppercase tracking-widest text-[#f0c000]">
            Find Us
          </p>
          <h2 className="text-4xl font-bold md:text-5xl">
            Three spots in the <span className="text-gradient-brand">City of Nizams</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-[#f5f0e8]/60">
            Dine in at our outlets or order from our cloud kitchen for delivery.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {locations.map((loc, i) => (
            <div
              key={loc.name}
              className="tilt-card group relative overflow-hidden rounded-3xl border border-[#1f1c18] bg-gradient-to-b from-[#1f1c18]/60 to-[#141210]/40 p-8 bg-[#141210]/80"
            >
              <div className="mb-4 flex items-center justify-between">
                <span className="text-5xl font-bold text-[#f0c000]/20">0{i + 1}</span>
                <span className="text-3xl">{i === 2 ? "🛵" : "📍"}</span>
              </div>

              <h3 className="mb-1 text-xl font-bold text-[#f5f0e8]">{loc.name}</h3>
              <p className="mb-4 text-sm text-[#f5f0e8]/50">{loc.area}</p>

              <div className="mb-4 flex items-center gap-2 text-sm text-[#f5f0e8]/70">
                <span className="text-[#f0c000]">🕒</span>
                {loc.hours}
              </div>

              <div className="mb-6">
                <span className="rounded-full bg-[#f0c000]/15 px-3 py-1 text-xs font-medium text-[#ffd940]">
                  {loc.phone}
                </span>
              </div>

              <div className="mb-4 overflow-hidden rounded-xl border border-[#1f1c18]">
                <iframe
                  src={`https://www.google.com/maps?q=${encodeURIComponent(
                    loc.embedQuery
                  )}&output=embed`}
                  width="100%"
                  height="180"
                  style={{ border: 0, filter: "invert(0.9) hue-rotate(180deg)" }}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title={`Map of ${loc.name}`}
                />
              </div>

              <a
                href={loc.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#f0c000]/10 py-3 text-sm font-bold text-[#f0c000] transition-all hover:bg-[#f0c000] hover:text-[#141210]"
              >
                Get Directions →
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
