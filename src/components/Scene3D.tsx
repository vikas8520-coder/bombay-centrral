"use client";

import { useRef, useMemo, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  OrbitControls,
  Html,
  Float,
  Billboard,
} from "@react-three/drei";
import * as THREE from "three";
import { useLoader } from "@react-three/fiber";

/* ---------- Sticker Textures — character images floating in scene ---------- */

function StickerPlane({ src, position, scale = 1, rotation = 0 }: {
  src: string;
  position: [number, number, number];
  scale?: number;
  rotation?: number;
}) {
  const texture = useLoader(THREE.TextureLoader, src);
  const ref = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (ref.current) {
      const t = state.clock.elapsedTime;
      ref.current.position.y = position[1] + Math.sin(t * 0.6) * 0.1;
      ref.current.rotation.z = rotation + Math.sin(t * 0.4) * 0.05;
    }
  });

  return (
    <group ref={ref} position={position} rotation={[0, 0, rotation]}>
      <Billboard>
        <mesh scale={[scale, scale, scale]}>
          <planeGeometry args={[1, 1]} />
          <meshBasicMaterial
            map={texture}
            transparent
            alphaTest={0.1}
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>
      </Billboard>
    </group>
  );
}

/* Brand colors */
const BRAND_YELLOW = "#f0c000";
const BRAND_GOLD = "#d09020";
const BRAND_LIGHT = "#ffd940";

/* ---------- Simple Stall — minimal wireframe-like structure ---------- */

function SimpleStall() {
  return (
    <group position={[0, -0.5, 0]} scale={0.6}>
      {/* Counter — simple flat box, semi-transparent */}
      <mesh position={[0, 0, 0]} castShadow>
        <boxGeometry args={[5, 0.8, 1.5]} />
        <meshStandardMaterial
          color="#2d1a0a"
          roughness={0.8}
          transparent
          opacity={0.85}
        />
      </mesh>

      {/* Counter top — thin slab */}
      <mesh position={[0, 0.45, 0]}>
        <boxGeometry args={[5.2, 0.06, 1.7]} />
        <meshStandardMaterial
          color={BRAND_YELLOW}
          emissive={BRAND_YELLOW}
          emissiveIntensity={0.3}
          roughness={0.3}
          transparent
          opacity={0.9}
        />
      </mesh>

      {/* Two support poles */}
      {[-2.4, 2.4].map((x) => (
        <mesh key={x} position={[x, 1.2, 0.4]}>
          <cylinderGeometry args={[0.04, 0.04, 2.8, 6]} />
          <meshStandardMaterial color="#3d2817" roughness={0.8} transparent opacity={0.7} />
        </mesh>
      ))}

      {/* Awning top — simple striped flat plane */}
      <mesh position={[0, 2.5, 0.5]} rotation={[-0.12, 0, 0]}>
        <boxGeometry args={[5, 0.04, 1.5]} />
        <meshStandardMaterial
          color={BRAND_YELLOW}
          emissive={BRAND_YELLOW}
          emissiveIntensity={0.2}
          transparent
          opacity={0.8}
        />
      </mesh>

      {/* Awning stripes */}
      {Array.from({ length: 10 }).map((_, i) => (
        <mesh
          key={`stripe-${i}`}
          position={[-2.2 + i * 0.5, 2.52, 0.5]}
          rotation={[-0.12, 0, 0]}
        >
          <boxGeometry args={[0.05, 0.02, 1.4]} />
          <meshStandardMaterial
            color={i % 2 === 0 ? "#f5f0e8" : BRAND_GOLD}
            transparent
            opacity={0.6}
          />
        </mesh>
      ))}

      {/* Signboard — simple glowing panel */}
      <mesh position={[0, 1.8, -0.3]}>
        <boxGeometry args={[3.5, 0.6, 0.06]} />
        <meshStandardMaterial
          color={BRAND_YELLOW}
          emissive={BRAND_YELLOW}
          emissiveIntensity={0.4}
          transparent
          opacity={0.85}
        />
      </mesh>
    </group>
  );
}

/* ---------- Simple Food Items — minimal shapes ---------- */

function SimpleFoodPlate({ position, color, label, price }: {
  position: [number, number, number];
  color: string;
  label: string;
  price: string;
}) {
  const ref = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (ref.current) {
      ref.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 1.2) * 0.02;
    }
  });

  return (
    <group ref={ref} position={position}>
      {/* Plate */}
      <mesh>
        <cylinderGeometry args={[0.3, 0.28, 0.02, 16]} />
        <meshStandardMaterial color="#e8e0d0" roughness={0.3} transparent opacity={0.7} />
      </mesh>
      {/* Food — simple dome */}
      <mesh position={[0, 0.06, 0]} castShadow>
        <sphereGeometry args={[0.18, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial
          color={color}
          roughness={0.5}
          emissive={color}
          emissiveIntensity={0.1}
          transparent
          opacity={0.9}
        />
      </mesh>
      <Html position={[0, 0.4, 0]} center distanceFactor={10}>
        <div className="pointer-events-none select-none whitespace-nowrap rounded-full bg-[#f0c000] px-2.5 py-1 text-xs font-bold text-[#141210]">
          {label} {price}
        </div>
      </Html>
    </group>
  );
}

/* ---------- Sticker — flat floating text like from the menu ---------- */

type StickerData = {
  text: string;
  hindi?: string;
  position: [number, number, number];
  color: string;
  rotation?: number;
  size?: number;
};

const stickers: StickerData[] = [
  { text: "वडा पाव", position: [-2.8, 1.5, 0.5], color: BRAND_YELLOW, rotation: -0.1, size: 0.3 },
  { text: "₹40", position: [-2.2, 0.8, 0.8], color: BRAND_GOLD, rotation: 0.15, size: 0.25 },
  { text: "पाव भाजी", position: [0, 1.2, 0.6], color: BRAND_LIGHT, rotation: 0.05, size: 0.3 },
  { text: "₹120", position: [0.5, 0.8, 0.8], color: BRAND_GOLD, rotation: -0.1, size: 0.25 },
  { text: "मिसल पाव", position: [2.8, 1.5, 0.5], color: BRAND_YELLOW, rotation: 0.1, size: 0.3 },
  { text: "₹110", position: [2.2, 0.8, 0.8], color: BRAND_GOLD, rotation: -0.15, size: 0.25 },
  { text: "चाय", position: [-1.5, 2.2, 0.3], color: BRAND_LIGHT, rotation: -0.2, size: 0.2 },
  { text: "भेल पुरी", position: [1.5, 2.2, 0.3], color: BRAND_YELLOW, rotation: 0.2, size: 0.25 },
  { text: "दाबेली", position: [-3.2, 0.5, 0.5], color: BRAND_GOLD, rotation: 0.3, size: 0.2 },
  { text: "सेव पुरी", position: [3.2, 0.5, 0.5], color: BRAND_GOLD, rotation: -0.3, size: 0.2 },
];

function Sticker({ data, index }: { data: StickerData; index: number }) {
  const ref = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (ref.current) {
      const t = state.clock.elapsedTime + index * 0.5;
      ref.current.position.y = data.position[1] + Math.sin(t * 0.8) * 0.08;
      ref.current.rotation.z = (data.rotation || 0) + Math.sin(t * 0.3) * 0.03;
    }
  });

  return (
    <group ref={ref} position={data.position} rotation={[0, 0, data.rotation || 0]}>
      <Billboard>
        <Html center distanceFactor={6}>
          <div
            className="pointer-events-none select-none whitespace-nowrap"
            style={{
              transform: `scale(${data.size || 0.25})`,
              transformOrigin: "center",
            }}
          >
            <div
              className="rounded-lg px-3 py-1.5 text-center"
              style={{
                background: "rgba(10, 9, 8, 0.7)",
                border: `2px solid ${data.color}`,
                boxShadow: `0 0 15px ${data.color}40, 0 4px 12px rgba(0,0,0,0.5)`,
                backdropFilter: "blur(4px)",
              }}
            >
              <div
                className="text-sm font-bold"
                style={{ color: data.color, textShadow: `0 0 8px ${data.color}80` }}
              >
                {data.text}
              </div>
            </div>
          </div>
        </Html>
      </Billboard>
    </group>
  );
}

/* ---------- Simple String Lights ---------- */

function SimpleLights() {
  const lights = useMemo(() => {
    const positions: [number, number, number][] = [];
    for (let i = 0; i < 8; i++) {
      const x = -2.2 + (i / 7) * 4.4;
      const y = 2.6 - Math.sin((i / 7) * Math.PI) * 0.3;
      positions.push([x, y, 0.4]);
    }
    return positions;
  }, []);

  return (
    <group>
      {lights.map((pos, i) => (
        <mesh key={i} position={pos}>
          <sphereGeometry args={[0.05, 8, 8]} />
          <meshStandardMaterial
            color={i % 2 === 0 ? BRAND_YELLOW : BRAND_LIGHT}
            emissive={i % 2 === 0 ? BRAND_YELLOW : BRAND_LIGHT}
            emissiveIntensity={2}
            toneMapped={false}
          />
        </mesh>
      ))}
    </group>
  );
}

/* ---------- Simple Ground ---------- */

function SimpleGround() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.9, 0]} receiveShadow>
      <circleGeometry args={[8, 32]} />
      <meshStandardMaterial
        color="#0a0908"
        roughness={0.4}
        transparent
        opacity={0.5}
      />
    </mesh>
  );
}

/* ---------- Main Scene ---------- */

function Scene() {
  return (
    <>
      {/* Minimal lighting */}
      <ambientLight intensity={0.4} color={BRAND_YELLOW} />
      <pointLight position={[0, 4, 3]} intensity={0.8} color={BRAND_LIGHT} />
      <pointLight position={[-3, 2, 2]} intensity={0.4} color={BRAND_YELLOW} />
      <pointLight position={[3, 2, 2]} intensity={0.4} color={BRAND_GOLD} />

      {/* Simple stall + food */}
      <SimpleStall />
      <group scale={0.6}>
        <SimpleFoodPlate position={[-1.8, 0.0, 0.2]} color="#c4382e" label="Vada Pav" price="₹40" />
        <SimpleFoodPlate position={[0, 0.0, 0.2]} color="#c4382e" label="Pav Bhaji" price="₹120" />
        <SimpleFoodPlate position={[1.8, 0.0, 0.2]} color="#b8302a" label="Misal Pav" price="₹110" />
      </group>

      {/* Floating stickers */}
      {stickers.map((sticker, i) => (
        <Sticker key={i} data={sticker} index={i} />
      ))}

      {/* Character sticker planes — extracted from menu background, black & white */}
      <Suspense fallback={null}>
        <StickerPlane src="/stickers/char1.png" position={[-2.8, 1.6, 0.6]} scale={0.8} rotation={-0.08} />
        <StickerPlane src="/stickers/char2.png" position={[2.5, 1.5, 0.5]} scale={0.6} rotation={0.1} />
        <StickerPlane src="/stickers/char3.png" position={[-1.8, 2.4, 0.4]} scale={0.5} rotation={-0.05} />
        <StickerPlane src="/stickers/char4.png" position={[1.5, 2.3, 0.4]} scale={0.5} rotation={0.08} />
        <StickerPlane src="/stickers/char5.png" position={[3.0, 0.8, 0.3]} scale={0.4} rotation={-0.12} />
        <StickerPlane src="/stickers/char6.png" position={[-3.0, 0.8, 0.3]} scale={0.35} rotation={0.12} />
        <StickerPlane src="/stickers/char7.png" position={[0.8, 2.8, 0.6]} scale={0.3} rotation={0.05} />
        <StickerPlane src="/stickers/char8.png" position={[-0.8, 2.8, 0.6]} scale={0.3} rotation={-0.05} />
      </Suspense>

      <SimpleLights />
      <SimpleGround />
    </>
  );
}

/* ---------- Canvas Wrapper — transparent, no postprocessing ---------- */

export default function Scene3D() {
  return (
    <div className="absolute inset-0 h-full w-full">
      <Canvas
        shadows={false}
        camera={{ position: [0, 1.5, 5], fov: 50 }}
        dpr={[1, 1.5]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
        style={{ background: "transparent" }}
      >
        <Suspense fallback={null}>
          <Scene />
          <OrbitControls
            enablePan={false}
            minDistance={3.5}
            maxDistance={8}
            minPolarAngle={Math.PI / 6}
            maxPolarAngle={Math.PI / 2.1}
            autoRotate
            autoRotateSpeed={0.3}
            target={[0, 0.3, 0]}
            enableDamping
            dampingFactor={0.08}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
