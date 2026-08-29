"use client";

import { useRef, useMemo, useState, useEffect } from "react";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";

/* Floating text element that reacts to scroll */
type FloatItem = {
  text: string;
  hindi?: string;
  x: string;
  y: string;
  size: string;
  speed: number;
  rotation: number;
  color: string;
  href?: string;
};

const floatItems: FloatItem[] = [
  { text: "Vada Pav", hindi: "वडा पाव", x: "5%", y: "10vh", size: "2.5rem", speed: 0.3, rotation: -5, color: "#f0c000" },
  { text: "Pav Bhaji", hindi: "पाव भाजी", x: "70%", y: "5vh", size: "3rem", speed: 0.5, rotation: 3, color: "#f0c000" },
  { text: "Bhel Puri", hindi: "भेल पुरी", x: "40%", y: "15vh", size: "2rem", speed: 0.7, rotation: -2, color: "#ffd940" },
  { text: "Misal Pav", hindi: "मिसल पाव", x: "85%", y: "20vh", size: "2.2rem", speed: 0.4, rotation: 5, color: "#f0c000" },
  { text: "Cheese Pav Bhaji", x: "15%", y: "30vh", size: "1.8rem", speed: 0.6, rotation: -3, color: "#ffd940" },
  { text: "Dabeli", hindi: "दाबेली", x: "60%", y: "25vh", size: "2.8rem", speed: 0.35, rotation: 2, color: "#f0c000" },
  { text: "Bombay Sandwich", x: "30%", y: "40vh", size: "1.6rem", speed: 0.55, rotation: -4, color: "#ffd940" },
  { text: "Schezwan Maggi", hindi: "मग्गी", x: "75%", y: "35vh", size: "2rem", speed: 0.45, rotation: 4, color: "#f0c000" },
  { text: "Tandoori Maggi", x: "10%", y: "50vh", size: "1.8rem", speed: 0.65, rotation: -2, color: "#ffd940" },
  { text: "Tawa Pulav", hindi: "तवा पुलाव", x: "55%", y: "45vh", size: "2.2rem", speed: 0.5, rotation: 3, color: "#f0c000" },
  { text: "Bread Pakoda", x: "85%", y: "55vh", size: "1.7rem", speed: 0.4, rotation: -5, color: "#ffd940" },
  { text: "Shikanji", hindi: "शिकंजी", x: "20%", y: "60vh", size: "2.5rem", speed: 0.6, rotation: 2, color: "#f0c000" },
  { text: "Kokan Sharbat", x: "65%", y: "65vh", size: "1.9rem", speed: 0.35, rotation: -3, color: "#ffd940" },
  { text: "Batata Vada", hindi: "बटाटा वडा", x: "45%", y: "70vh", size: "2rem", speed: 0.5, rotation: 4, color: "#f0c000" },
  { text: "Masala Pav", x: "8%", y: "75vh", size: "1.8rem", speed: 0.55, rotation: -2, color: "#ffd940" },
  { text: "Sev Puri", hindi: "सेव पुरी", x: "80%", y: "80vh", size: "2.3rem", speed: 0.4, rotation: 3, color: "#f0c000" },
  { text: "Ussal Pav", x: "35%", y: "85vh", size: "1.7rem", speed: 0.6, rotation: -4, color: "#ffd940" },
  { text: "Dahi Papdi", x: "70%", y: "90vh", size: "2rem", speed: 0.45, rotation: 2, color: "#f0c000" },
  { text: "Cutting Chai", hindi: "चाय", x: "15%", y: "95vh", size: "2.5rem", speed: 0.5, rotation: -3, color: "#ffd940" },
  { text: "Mumbai Street Food", x: "50%", y: "50vh", size: "3.5rem", speed: 0.2, rotation: 0, color: "#f0c000" },
  { text: "₹40", x: "25%", y: "12vh", size: "3rem", speed: 0.8, rotation: 10, color: "#d09020" },
  { text: "₹120", x: "88%", y: "42vh", size: "2.5rem", speed: 0.7, rotation: -8, color: "#d09020" },
  { text: "₹60", x: "50%", y: "22vh", size: "2.8rem", speed: 0.9, rotation: 6, color: "#d09020" },
  { text: "₹110", x: "92%", y: "68vh", size: "2.2rem", speed: 0.6, rotation: -5, color: "#d09020" },
  { text: "Bombay Centrral", hindi: "बॉम्बे सेंट्रल", x: "3%", y: "45vh", size: "1.5rem", speed: 0.15, rotation: 90, color: "#d09020" },
];

function FloatingText({ item, scrollYProgress }: { item: FloatItem; scrollYProgress: MotionValue<number> }) {
  const y = useTransform(scrollYProgress, [0, 1], [0, -300 * item.speed]);
  const opacity = useTransform(scrollYProgress, [0, 0.1, 0.9, 1], [0, 0.7, 0.7, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 0.8]);
  const rotate = useTransform(scrollYProgress, [0, 1], [item.rotation, item.rotation * 3]);
  const xShift = useTransform(scrollYProgress, [0, 1], [0, 50 * (item.speed - 0.5)]);

  return (
    <motion.div
      style={{
        position: "absolute",
        left: item.x,
        top: item.y,
        y,
        x: xShift,
        opacity,
        scale,
        rotate,
        fontSize: item.size,
        color: item.color,
        fontWeight: 700,
        whiteSpace: "nowrap",
        textShadow: "0 0 20px rgba(240, 192, 0, 0.3)",
        fontFamily: "var(--font-geist-sans), sans-serif",
        pointerEvents: "none",
        userSelect: "none",
        willChange: "transform, opacity",
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

function GlowCircle({ x, y, size, speed, scrollYProgress }: { x: string; y: string; size: number; speed: number; scrollYProgress: MotionValue<number> }) {
  const cy = useTransform(scrollYProgress, [0, 1], [0, -200 * speed]);
  const cOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.05, 0.1, 0.05]);
  return (
    <motion.div
      style={{
        position: "absolute",
        left: x,
        top: y,
        y: cy,
        opacity: cOpacity,
        width: size,
        height: size,
        borderRadius: "50%",
        background: "#f0c000",
        filter: "blur(40px)",
      }}
    />
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

  // Wait for page to settle before enabling scroll-linked animations
  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const { scrollYProgress } = useScroll();
  const items = useMemo(() => floatItems, []);

  if (!mounted) return null;

  return (
    <>
      <ScrollProgress scrollYProgress={scrollYProgress} />

      <div
        className="fixed inset-0 z-[5] pointer-events-none overflow-hidden"
        style={{ perspective: "1000px" }}
      >
        {items.map((item, i) => (
          <FloatingText key={i} item={item} scrollYProgress={scrollYProgress} />
        ))}

        <GlowCircle x="10%" y="20vh" size={80} speed={0.3} scrollYProgress={scrollYProgress} />
        <GlowCircle x="80%" y="60vh" size={120} speed={0.5} scrollYProgress={scrollYProgress} />
        <GlowCircle x="50%" y="80vh" size={60} speed={0.7} scrollYProgress={scrollYProgress} />
        <GlowCircle x="30%" y="5vh" size={100} speed={0.4} scrollYProgress={scrollYProgress} />
      </div>
    </>
  );
}
