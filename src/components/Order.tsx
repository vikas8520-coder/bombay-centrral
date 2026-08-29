const orderLinks = [
  {
    name: "Ownly",
    tagline: "Zero commission · Free delivery · Honest pricing",
    description: "Offline prices = Online prices. No hidden charges, no inflated menu prices.",
    url: "https://ownly.app",
    icon: "🛵",
    badge: "Recommended",
    color: "#f0c000",
    bgGradient: "from-[#f0c000]/20 to-[#d09020]/10",
  },
  {
    name: "Swiggy",
    tagline: "Order online · Fast delivery",
    description: "Get your favourite Mumbai street food delivered hot and fresh via Swiggy.",
    url: "https://www.swiggy.com/search?query=Bombay%20Centrral",
    icon: "🛍️",
    badge: "",
    color: "#fc8019",
    bgGradient: "from-[#fc8019]/15 to-transparent",
  },
  {
    name: "Zomato",
    tagline: "Order online · 4.2★ rated",
    description: "494+ reviews on Zomato. Dine in, takeaway, or order delivery.",
    url: "https://www.zomato.com/hyderabad/bombay-centrral-marredpally-secunderabad",
    icon: "🍽️",
    badge: "",
    color: "#e23744",
    bgGradient: "from-[#e23744]/15 to-transparent",
  },
];

export default function Order() {
  return (
    <section id="order" className="relative bg-[#0a0908]/85 backdrop-blur-sm py-24">
      <div className="mx-auto max-w-5xl px-6">
        {/* Header */}
        <div className="mb-16 text-center">
          <p className="mb-2 text-sm font-bold uppercase tracking-widest text-[#f0c000]">
            Order Online
          </p>
          <h2 className="text-4xl font-bold md:text-5xl">
            Get it <span className="text-gradient-brand">delivered</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-[#f5f0e8]/60">
            Order from your favourite platform — Ownly, Swiggy, or Zomato.
          </p>
        </div>

        {/* Order cards */}
        <div className="grid gap-6 md:grid-cols-3">
          {orderLinks.map((platform) => (
            <a
              key={platform.name}
              href={platform.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`tilt-card group relative overflow-hidden rounded-3xl border border-[#1f1c18] bg-gradient-to-b ${platform.bgGradient} p-8 backdrop-blur-sm transition-all hover:border-[${platform.color}]/40`}
            >
              {/* Badge */}
              {platform.badge && (
                <span className="absolute top-4 right-4 rounded-full bg-[#f0c000] px-3 py-1 text-xs font-bold text-[#141210]">
                  {platform.badge}
                </span>
              )}

              {/* Icon */}
              <div className="mb-4 text-5xl">{platform.icon}</div>

              {/* Name */}
              <h3 className="text-2xl font-bold text-[#f5f0e8]">{platform.name}</h3>

              {/* Tagline */}
              <p className="mt-1 text-sm font-medium" style={{ color: platform.color }}>
                {platform.tagline}
              </p>

              {/* Description */}
              <p className="mt-4 text-sm leading-relaxed text-[#f5f0e8]/60">
                {platform.description}
              </p>

              {/* CTA */}
              <div className="mt-6 flex items-center gap-2 text-sm font-bold text-[#f5f0e8] transition-colors group-hover:text-[#f0c000]">
                Order now
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </div>
            </a>
          ))}
        </div>

        {/* Note */}
        <p className="mt-8 text-center text-sm text-[#f5f0e8]/40">
          Ownly offers zero-commission pricing — what you see is what you pay. No hidden charges.
        </p>
      </div>
    </section>
  );
}
