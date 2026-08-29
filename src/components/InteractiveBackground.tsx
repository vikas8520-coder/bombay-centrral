"use client";

import { useMemo, useState, useEffect } from "react";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";

/* Reduced set of floating text — fewer elements for performance */
type FloatItem = {
  text: string;
  hindi?: string;
  x: string;
  y: string;
  size: string;
  speed: number;
  rotation: number;
  color: string;
};

const floatItems: FloatItem[] = [
  { text: "Vada Pav", hindi: "वडा पाव", x: "5%", y: "10vh", size: "2.5rem", speed: 0.3, rotation: -5, color: "#f0c000" },
  { text: "Pav Bhaji", hindi: "पाव भाजी", x: "70%", y: "5vh", size: "3rem", speed: 0.5, rotation: 3, color: "#f0c000" },
  { text: "Misal Pav", hindi: "मिसल पाव", x: "85%", y: "20vh", size: "2.2rem", speed: 0.4, rotation: 5, color: "#f0c000" },
  { text: "Dabeli", hindi: "दाबेली", x: "60%", y: "25vh", size: "2.8rem", speed: 0.35, rotation: 2, color: "#f0c000" },
  { text: "Shikanji", hindi: "शिकंजी", x: "20%", y: "60vh", size: "2.5rem", speed: 0.6, rotation: 2, color: "#f0c000" },
  { text: "Sev Puri", hindi: "सेव पुरी", x: "80%", y: "80vh", size: "2.3rem", speed: 0.4, rotation: 3, color: "#f0c000" },
  { text: "Cutting Chai", hindi: "चाय", x: "15%", y: "95vh", size: "2.5rem", speed: 0.5, rotation: -3, color: "#ffd940" },
  { text: "Mumbai Street Food", x: "50%", y: "50vh", size: "3.5rem", speed: 0.2, rotation: 0, color: "#f0c000" },
];

function FloatingText({ item, scrollYProgress }: { item: FloatItem; scrollYProgress: MotionValue<number> }) {
  // Single transform for Y position — the only scroll-linked animation
  const y = useTransform(scrollYProgress, [0, 1], [0, -200 * item.speed]);
  const opacity = useTransform(scrollYProgress, [0, 0.05, 0.9, 1], [0, 0.5, 0.5, 0]);

  return (
    <motion.div
      style={{
        position: "absolute",
        left: item.x,
        top: item.y,
        y,
        opacity,
        fontSize: item.size,
        color: item.color,
        fontWeight: 700,
        whiteSpace: "nowrap",
        textShadow: "0 0 20px rgba(240, 192, 0, 0.3)",
        fontFamily: "var(--font-geist-sans), sans-serif",
        pointerEvents: "none",
        userSelect: "none",
        willChange: "transform",
        transform: `rotate(${item.rotation}deg)`,
      }}
    >
      {item.text}
      {item.hindi && (
        <span style={{ display: "block", fontSize: "0.7em", opacity: 0.6, marginTop: "0.2em" }}>
          {item.hindi}
        </span>
      )}
    </motion.div>
  );
}

function ScrollProgress({ scrollYProgress }: { scrollYProgress: MotionValue<number> }) {
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);
  return (
    <motion.div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: "3px",
        background: "linear-gradient(90deg, #f0c000, #ffd940, #d09020)",
        transformOrigin: "0%",
        scaleX,
        zIndex: 100,
      }}
    />
  );
}

export default function InteractiveBackground() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 200);
    return () => clearTimeout(timer);
  }, []);

  const { scrollYProgress } = useScroll();
  const items = useMemo(() => floatItems, []);

  if (!mounted) return null;

  return (
    <>
      <ScrollProgress scrollYProgress={scrollYProgress} />

      <div className="fixed inset-0 z-[5] pointer-events-none overflow-hidden">
        {items.map((item, i) => (
          <FloatingText key={i} item={item} scrollYProgress={scrollYProgress} />
        ))}
      </div>
    </>
  );
}
