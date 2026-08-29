"use client";

import { useRef, useMemo, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  OrbitControls,
  Html,
  Environment,
  ContactShadows,
  Sparkles,
  RoundedBox,
} from "@react-three/drei";
import * as THREE from "three";

/* Brand colors */
const BRAND_YELLOW = "#f0c000";
const BRAND_GOLD = "#d09020";
const BRAND_LIGHT = "#ffd940";

/* ---------- Food Stall Structure ---------- */

function StallCounter() {
  return (
    <group position={[0, -0.5, 0]}>
      {/* Main counter body */}
      <RoundedBox args={[6, 1.2, 2]} radius={0.05} smoothness={4} position={[0, 0, 0]}>
        <meshStandardMaterial color="#3d2817" roughness={0.8} metalness={0.1} />
      </RoundedBox>

      {/* Counter top */}
      <RoundedBox args={[6.2, 0.15, 2.2]} radius={0.03} smoothness={4} position={[0, 0.67, 0]}>
        <meshStandardMaterial color="#5c3a1e" roughness={0.4} metalness={0.2} />
      </RoundedBox>

      {/* Front decorative panel — brand yellow stripes */}
      {[-2.2, -1.1, 0, 1.1, 2.2].map((x, i) => (
        <mesh key={i} position={[x, -0.1, 1.01]}>
          <boxGeometry args={[0.8, 0.8, 0.02]} />
          <meshStandardMaterial
            color={i % 2 === 0 ? BRAND_YELLOW : BRAND_GOLD}
            emissive={i % 2 === 0 ? BRAND_YELLOW : BRAND_GOLD}
            emissiveIntensity={0.2}
            roughness={0.5}
          />
        </mesh>
      ))}

      {/* Back splash wall */}
      <mesh position={[0, 1.5, -1]}>
        <boxGeometry args={[6, 2.5, 0.1]} />
        <meshStandardMaterial color="#141210" roughness={0.9} />
      </mesh>

      {/* Signboard — brand yellow */}
      <mesh position={[0, 2.2, -0.9]}>
        <boxGeometry args={[4, 0.8, 0.08]} />
        <meshStandardMaterial
          color={BRAND_YELLOW}
          emissive={BRAND_YELLOW}
          emissiveIntensity={0.4}
          roughness={0.3}
        />
      </mesh>
    </group>
  );
}

/* ---------- Food Items on Counter ---------- */

function VadaPav() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.position.y = -0.1 + Math.sin(state.clock.elapsedTime * 2) * 0.02;
    }
  });

  return (
    <group ref={groupRef} position={[-2, 0.2, 0.3]}>
      {/* Bun */}
      <mesh castShadow>
        <sphereGeometry args={[0.25, 16, 12]} />
        <meshStandardMaterial color="#c8a45c" roughness={0.7} />
      </mesh>
      <mesh position={[0, -0.15, 0]}>
        <sphereGeometry args={[0.25, 16, 12, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2]} />
        <meshStandardMaterial color="#b8902f" roughness={0.7} />
      </mesh>
      {/* Filling */}
      <mesh position={[0, -0.1, 0.15]}>
        <sphereGeometry args={[0.12, 8, 6]} />
        <meshStandardMaterial color="#8B4513" roughness={0.9} />
      </mesh>
      <Html position={[0, 0.6, 0]} center distanceFactor={8}>
        <div className="pointer-events-none select-none whitespace-nowrap rounded-full bg-[#f0c000] px-3 py-1 text-xs font-bold text-[#141210]">
          Vada Pav ₹40
        </div>
      </Html>
    </group>
  );
}

function PavBhajiPan() {
  const steamRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (steamRef.current) {
      steamRef.current.children.forEach((child, i) => {
        const t = state.clock.elapsedTime + i * 0.5;
        child.position.y = ((t * 0.3) % 1) + 0.3;
        const opacity = 1 - ((t * 0.3) % 1);
        (child as THREE.Mesh).material instanceof THREE.Material &&
          (((child as THREE.Mesh).material as THREE.MeshStandardMaterial).opacity = opacity * 0.4);
      });
    }
  });

  return (
    <group position={[0, 0.2, 0.3]}>
      {/* Pan */}
      <mesh castShadow>
        <cylinderGeometry args={[0.5, 0.4, 0.2, 24]} />
        <meshStandardMaterial color="#141210" roughness={0.3} metalness={0.8} />
      </mesh>
      {/* Bhaji */}
      <mesh position={[0, 0.12, 0]}>
        <cylinderGeometry args={[0.45, 0.45, 0.08, 24]} />
        <meshStandardMaterial
          color="#c41e1e"
          roughness={0.6}
          emissive="#c41e1e"
          emissiveIntensity={0.15}
        />
      </mesh>
      {/* Butter */}
      <mesh position={[0.1, 0.18, 0.1]}>
        <boxGeometry args={[0.08, 0.06, 0.08]} />
        <meshStandardMaterial color="#f5f0e8" roughness={0.3} />
      </mesh>
      {/* Steam */}
      <group ref={steamRef}>
        {[0, 1, 2, 3].map((i) => (
          <mesh key={i} position={[0, 0.3, 0]}>
            <sphereGeometry args={[0.08, 8, 6]} />
            <meshStandardMaterial color="#ffffff" transparent opacity={0.3} depthWrite={false} />
          </mesh>
        ))}
      </group>
      <Html position={[0, 0.7, 0]} center distanceFactor={8}>
        <div className="pointer-events-none select-none whitespace-nowrap rounded-full bg-[#c41e1e] px-3 py-1 text-xs font-bold text-[#f5f0e8]">
          Pav Bhaji ₹120
        </div>
      </Html>
    </group>
  );
}

function MisalBowl() {
  return (
    <group position={[2, 0.2, 0.3]}>
      {/* Bowl */}
      <mesh castShadow>
        <cylinderGeometry args={[0.4, 0.3, 0.15, 16]} />
        <meshStandardMaterial color="#2a1810" roughness={0.4} metalness={0.3} />
      </mesh>
      {/* Misal (sprout curry) */}
      <mesh position={[0, 0.1, 0]}>
        <cylinderGeometry args={[0.35, 0.35, 0.06, 16]} />
        <meshStandardMaterial
          color="#c41e1e"
          roughness={0.6}
          emissive="#c41e1e"
          emissiveIntensity={0.15}
        />
      </mesh>
      {/* Farsan topping (crunchy bits) */}
      {Array.from({ length: 5 }).map((_, i) => {
        const angle = (i / 5) * Math.PI * 2;
        return (
          <mesh key={i} position={[Math.cos(angle) * 0.15, 0.15, Math.sin(angle) * 0.15]}>
            <boxGeometry args={[0.04, 0.04, 0.04]} />
            <meshStandardMaterial color="#d4a017" roughness={0.7} />
          </mesh>
        );
      })}
      {/* Pav bun on the side */}
      <mesh position={[0.3, 0.08, 0.2]}>
        <boxGeometry args={[0.15, 0.08, 0.12]} />
        <meshStandardMaterial color="#c8a45c" roughness={0.7} />
      </mesh>
      <Html position={[0, 0.6, 0]} center distanceFactor={8}>
        <div className="pointer-events-none select-none whitespace-nowrap rounded-full bg-[#c41e1e] px-3 py-1 text-xs font-bold text-[#f5f0e8]">
          Misal Pav ₹110
        </div>
      </Html>
    </group>
  );
}

/* ---------- Hanging String Lights ---------- */

function StringLights() {
  const lights = useMemo(() => {
    const positions: { pos: [number, number, number]; color: string }[] = [];
    const colors = [BRAND_YELLOW, BRAND_LIGHT, BRAND_GOLD, BRAND_YELLOW, BRAND_LIGHT];
    for (let i = 0; i < 10; i++) {
      const x = -2.5 + (i / 9) * 5;
      const y = 2.8 - Math.sin((i / 9) * Math.PI) * 0.4;
      positions.push({ pos: [x, y, 0.5], color: colors[i % colors.length] });
    }
    return positions;
  }, []);

  return (
    <group>
      {lights.map((light, i) => (
        <group key={i} position={light.pos}>
          <mesh>
            <sphereGeometry args={[0.06, 8, 8]} />
            <meshStandardMaterial
              color={light.color}
              emissive={light.color}
              emissiveIntensity={2}
            />
          </mesh>
          {i % 2 === 0 && (
            <pointLight
              color={light.color}
              intensity={0.5}
              distance={3}
              decay={2}
            />
          )}
        </group>
      ))}
    </group>
  );
}

/* ---------- Awning ---------- */

function Awning() {
  return (
    <group position={[0, 3.2, 0.5]}>
      {Array.from({ length: 12 }).map((_, i) => (
        <mesh key={i} position={[-2.8 + i * 0.5, 0, 0]} rotation={[-0.15, 0, 0]}>
          <boxGeometry args={[0.5, 0.02, 1.8]} />
          <meshStandardMaterial
            color={i % 2 === 0 ? BRAND_YELLOW : "#f5f0e8"}
            roughness={0.6}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
      <mesh position={[-3, -1.5, 0.5]}>
        <cylinderGeometry args={[0.04, 0.04, 3, 8]} />
        <meshStandardMaterial color="#3d2817" roughness={0.8} />
      </mesh>
      <mesh position={[3, -1.5, 0.5]}>
        <cylinderGeometry args={[0.04, 0.04, 3, 8]} />
        <meshStandardMaterial color="#3d2817" roughness={0.8} />
      </mesh>
    </group>
  );
}

/* ---------- Ground ---------- */

function StreetGround() {
  return (
    <>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.1, 0]} receiveShadow>
        <planeGeometry args={[30, 30]} />
        <meshStandardMaterial color="#141210" roughness={0.95} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.09, 3]}>
        <planeGeometry args={[0.15, 8]} />
        <meshStandardMaterial color={BRAND_GOLD} emissive={BRAND_GOLD} emissiveIntensity={0.1} />
      </mesh>
    </>
  );
}

/* ---------- Floating Spices ---------- */

function FloatingSpices() {
  const ref = useRef<THREE.Points>(null);
  const count = 80;

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 8;
      arr[i * 3 + 1] = Math.random() * 4;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 4;
    }
    return arr;
  }, []);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.05;
      const positions = ref.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < count; i++) {
        positions[i * 3 + 1] += 0.005;
        if (positions[i * 3 + 1] > 4) positions[i * 3 + 1] = 0;
      }
      ref.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.04} color={BRAND_YELLOW} transparent opacity={0.5} sizeAttenuation />
    </points>
  );
}

/* ---------- Main Scene ---------- */

function Scene() {
  return (
    <>
      <ambientLight intensity={0.3} color={BRAND_YELLOW} />
      <hemisphereLight args={[BRAND_YELLOW, "#141210", 0.4]} />
      <spotLight
        position={[0, 6, 3]}
        angle={0.5}
        penumbra={0.8}
        intensity={1.5}
        color={BRAND_LIGHT}
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <pointLight position={[-3, 2, 2]} intensity={0.8} color={BRAND_YELLOW} distance={8} />
      <pointLight position={[3, 2, 2]} intensity={0.8} color={BRAND_GOLD} distance={8} />

      <fog attach="fog" args={["#0a0908", 8, 20]} />

      <StallCounter />
      <Awning />
      <StringLights />
      <VadaPav />
      <PavBhajiPan />
      <MisalBowl />
      <StreetGround />
      <FloatingSpices />

      <Sparkles
        count={40}
        scale={[8, 4, 4]}
        size={3}
        speed={0.3}
        color={BRAND_LIGHT}
        opacity={0.6}
      />

      <ContactShadows
        position={[0, -1.09, 0]}
        opacity={0.5}
        scale={12}
        blur={2}
        far={4}
        color="#000000"
      />

      <Environment preset="sunset" />
    </>
  );
}

/* ---------- Canvas Wrapper ---------- */

export default function Scene3D() {
  return (
    <div className="absolute inset-0 h-full w-full">
      <Canvas
        shadows
        camera={{ position: [0, 1.5, 6], fov: 50 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense fallback={null}>
          <Scene />
          <OrbitControls
            enablePan={false}
            minDistance={4}
            maxDistance={10}
            minPolarAngle={Math.PI / 6}
            maxPolarAngle={Math.PI / 2.1}
            autoRotate
            autoRotateSpeed={0.5}
            target={[0, 0.5, 0]}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
