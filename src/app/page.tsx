import dynamic from "next/dynamic";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Menu from "@/components/Menu";
import Locations from "@/components/Locations";
import Gallery from "@/components/Gallery";
import About from "@/components/About";
import Reviews from "@/components/Reviews";
import Order from "@/components/Order";
import Footer from "@/components/Footer";

// Lazy-load RishabStoryteller — it uses framer-motion which is heavy
const RishabStoryteller = dynamic(() => import("@/components/RishabStoryteller"), {
  loading: () => null,
});

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex flex-col">
        <Hero />

        {/* Marquee strip */}
        <div className="overflow-hidden border-y border-[#1f1c18] bg-[#0a0908]/75 py-4">
          <div className="marquee flex whitespace-nowrap">
            {Array.from({ length: 2 }).map((_, set) => (
              <div key={set} className="flex items-center gap-8 px-4">
                {[
                  "🥘 Vada Pav",
                  "🍛 Pav Bhaji",
                  "🥗 Bhel Puri",
                  "🥪 Bombay Sandwich",
                  "🧀 Cheese Pav Bhaji",
                  "🔥 Schezwan Maggi",
                  "🫓 Misal Pav",
                  "🌯 Dabeli",
                  "🍜 Tandoori Maggi",
                  "🥤 Shikanji",
                ].map((item, i) => (
                  <span
                    key={`${set}-${i}`}
                    className="flex items-center gap-2 text-lg font-medium text-[#f5f0e8]/40"
                  >
                    {item}
                    <span className="text-[#f0c000]">•</span>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>

        <Menu />
        <Locations />
        <Gallery />
        <About />
        <Reviews />
        <Order />
      </main>
      <Footer />
      <RishabStoryteller />
    </>
  );
}
