export default function About() {
  return (
    <section id="about" className="relative overflow-hidden bg-[#0a0908]/75 py-24">
      {/* Dot pattern */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 50%, #f0c000 1px, transparent 1px), radial-gradient(circle at 80% 80%, #d09020 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative mx-auto max-w-5xl px-6">
        <div className="mb-16 text-center">
          <p className="mb-2 text-sm font-bold uppercase tracking-widest text-[#f0c000]">
            Our Story
          </p>
          <h2 className="text-4xl font-bold md:text-5xl">
            From <span className="text-gradient-brand">Mumbai</span> to{" "}
            <span className="text-gradient-brand">Hyderabad</span>
          </h2>
        </div>

        <div className="grid gap-12 md:grid-cols-2 md:items-center">
          <div className="space-y-6">
            <p className="text-lg leading-relaxed text-[#f5f0e8]/80">
              The streets of Mumbai hum with a rhythm all their own — the sizzle of
              vada hitting hot oil, the rhythmic slap of pav bhaji on a flat griddle,
              the crunch of sev on a bhel puri at midnight.
            </p>
            <p className="text-lg leading-relaxed text-[#f5f0e8]/80">
              <span className="font-bold text-[#f0c000]">Bombay Centrral</span> was born
              from a simple longing: to bring that rhythm, those flavors, that
              feeling of standing at a Mumbai cart at midnight — to the city of
              Nizams.
            </p>
            <p className="text-lg leading-relaxed text-[#f5f0e8]/80">
              We started in <span className="font-bold text-[#f5f0e8]">Begumpet</span>,
              grew to <span className="font-bold text-[#f5f0e8]">Diamond Point</span>, and
              added a cloud kitchen to reach every corner of Hyderabad. Every chutney
              is ground fresh. Every pav is buttered just right. Every plate carries a
              piece of Marine Drive in it.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[
              { number: "3", label: "Locations", icon: "📍" },
              { number: "1,175+", label: "Instagram Family", icon: "📸" },
              { number: "2019", label: "Established", icon: "🎉" },
              { number: "∞", label: "Vada Pavs Served", icon: "🥘" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="tilt-card rounded-2xl border border-[#1f1c18] bg-[#1f1c18]/80 p-6 text-center"
              >
                <div className="mb-2 text-3xl">{stat.icon}</div>
                <div className="text-3xl font-bold text-gradient-brand">
                  {stat.number}
                </div>
                <div className="mt-1 text-xs uppercase tracking-wider text-[#f5f0e8]/50">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quote */}
        <div className="mt-16 rounded-3xl border border-[#f0c000]/20 bg-[#f0c000]/5 p-8 text-center">
          <p className="text-2xl font-medium italic text-[#f5f0e8]/90 md:text-3xl">
            &ldquo;Bringing you taste from the streets of Mumbai to the city of
            Nizams!&rdquo;
          </p>
          <p className="mt-4 text-sm font-bold uppercase tracking-widest text-[#f0c000]">
            — Bombay Centrral
          </p>
        </div>
      </div>
    </section>
  );
}
