"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

type SectionId = "menu" | "gallery" | "about" | "reviews" | "order";

const sectionTips: Record<SectionId, string[]> = {
  menu: [
    "🌶️ Try the Schezwan Cheese Vada Pav — our secret favorite!",
    "🌶️ Ask for the Jain option — no onion, no garlic!",
    "🌶️ The Ulta Vada Pav — pav inside the vada. Mind = blown!",
    "🌶️ Our Misal Pav is spiced just right — not for the faint-hearted!",
    "🌶️ Pair your Pav Bhaji with extra butter for the real Mumbai experience!",
    "🌶️ The Cheese Grill Sandwich is loaded — come hungry!",
    "🌶️ Dabeli is sweet, spicy, and crunchy all at once — must try!",
    "🌶️ Everything is 100% Pure Veg — no compromises!",
    "🌶️ Tandoori Maggi — a fusion you won't find anywhere else!",
    "🌶️ Extra Pav is just ₹40 — you'll want it, trust me!",
  ],
  gallery: [
    "📸 All these photos are real — shot in our kitchen!",
    "📸 Follow us @bombaycentrral.india for daily food posts!",
    "📸 We post new dishes every week on Instagram!",
    "📸 Tag us in your food photos — we love reposting fans!",
    "📸 That Cheese Pav Bhaji you see? Even better in person!",
  ],
  about: [
    "🚶 We started in 2019 with just one Vada Pav stall!",
    "🚶 Every recipe comes straight from Mumbai's street vendors!",
    "🚶 Now serving at 3 locations across Hyderabad!",
    "🚶 Our spices are imported from Mumbai — authentic taste guaranteed!",
    "🚶 We're 100% Pure Veg — always have been, always will be!",
  ],
  reviews: [
    "⭐ We've served 100,000+ happy customers!",
    "⭐ Our Vada Pav has a 4.6★ rating on Google!",
    "⭐ Most reviewed item? Classic Vada Pav — try it!",
    "⭐ Customers say our Misal Pav reminds them of Mumbai!",
    "⭐ Tag us @bombaycentrral.india — your review might be featured!",
  ],
  order: [
    "🛵 Ownly gets you the freshest delivery — try it first!",
    "🛵 We're open till 11 PM — late-night cravings sorted!",
    "🛵 Swiggy and Zomato both deliver to your doorstep!",
    "🛵 Ordering the Schezwan Maggi? You won't regret it!",
    "🛵 First-time? Try the Classic Vada Pav — can't go wrong!",
  ],
};

const sectionOrder: SectionId[] = ["menu", "gallery", "about", "reviews", "order"];

function pickRandomTip(section: SectionId): string {
  const tips = sectionTips[section];
  return tips[Math.floor(Math.random() * tips.length)];
}

export default function RishabStoryteller() {
  const [visible, setVisible] = useState(false);
  const [currentTip, setCurrentTip] = useState<string>("");
  const [activeSection, setActiveSection] = useState<SectionId | null>(null);
  const [hidden, setHidden] = useState(false);
  const activeSectionRef = useRef<SectionId | null>(null);

  useEffect(() => {
    if (window.innerWidth < 768) {
      setHidden(true);
      return;
    }

    const observers: IntersectionObserver[] = [];

    sectionOrder.forEach((section) => {
      const el = document.getElementById(section);
      if (!el) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              // Section entered — pick a new random tip and slide in
              activeSectionRef.current = section;
              setActiveSection(section);
              setCurrentTip(pickRandomTip(section));
              setVisible(true);
            } else {
              // Section left — if this was the active one, slide out
              if (activeSectionRef.current === section) {
                activeSectionRef.current = null;
                setVisible(false);
              }
            }
          });
        },
        {
          threshold: 0.15,
          rootMargin: "-5% 0px -5% 0px",
        }
      );

      observer.observe(el);
      observers.push(observer);
    });

    return () => {
      observers.forEach((o) => o.disconnect());
    };
  }, []);

  if (hidden) return null;

  return (
    <AnimatePresence>
      {visible && currentTip && (
        <motion.div
          key={activeSection}
          initial={{ x: 250, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 250, opacity: 0 }}
          transition={{ type: "spring", stiffness: 80, damping: 14 }}
          className="fixed bottom-6 right-6 z-40 flex flex-col items-center gap-2"
        >
          {/* Single message bubble */}
          <div className="relative max-w-[240px] rounded-2xl border-2 border-[#f0c000] bg-[#0a0908]/98 px-5 py-3 shadow-2xl shadow-[#f0c000]/20">
            <p className="text-sm font-medium leading-snug text-[#f5f0e8]">
              {currentTip}
            </p>
            <button
              onClick={() => setVisible(false)}
              className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-[#f0c000] text-xs font-bold text-[#141210] transition-transform hover:scale-110"
              aria-label="Dismiss"
            >
              ✕
            </button>
            {/* Tail pointing down to video circle */}
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 h-4 w-4 rotate-45 border-b-2 border-r-2 border-[#f0c000] bg-[#0a0908]/98" />
          </div>

          {/* Video circle */}
          <div className="relative h-36 w-36 overflow-hidden rounded-full border-4 border-[#f0c000] shadow-2xl shadow-[#f0c000]/30">
            <video
              src="/rishab.mp4"
              poster="/rishab.png"
              autoPlay
              loop
              muted
              playsInline
              className="h-full w-full object-cover"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
