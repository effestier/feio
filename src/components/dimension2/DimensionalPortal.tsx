"use client";

import { useRef, useState, useCallback } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/* ── Pointer tracking ───────────────────────────────────── */

const pointer = { x: 0, y: 0 };

if (typeof window !== "undefined") {
  window.addEventListener("pointermove", (e: PointerEvent) => {
    pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
    pointer.y = -(e.clientY / window.innerHeight) * 2 + 1;
  });
}

/* ── Ring configuration ─────────────────────────────────── */

interface RingConfig {
  radius: number;
  tube: number;
  tilt: [number, number, number];
  speed: number;
  amp: number;
  phase: number;
  rot: number;
  opacity: number;
  segs: number;
  heart: boolean;
}

const RINGS: RingConfig[] = [
  { radius: 0.2, tube: 0.005, tilt: [0, 0, 0], speed: 1.0, amp: 0.08, phase: 0, rot: 0.2, opacity: 0.9, segs: 64, heart: true },
  { radius: 0.35, tube: 0.006, tilt: [0.02, 0.01, 0], speed: 0.9, amp: 0.07, phase: 0.3, rot: 0.18, opacity: 0.85, segs: 64, heart: true },
  { radius: 0.55, tube: 0.007, tilt: [0.05, 0.03, 0.01], speed: 0.8, amp: 0.06, phase: 0.6, rot: 0.15, opacity: 0.75, segs: 64, heart: true },
  { radius: 0.85, tube: 0.006, tilt: [0.1, 0.06, -0.03], speed: 0.7, amp: 0.05, phase: 1.0, rot: 0.12, opacity: 0.6, segs: 48, heart: false },
  { radius: 1.25, tube: 0.005, tilt: [-0.08, 0.12, 0.05], speed: 0.6, amp: 0.04, phase: 1.4, rot: 0.1, opacity: 0.45, segs: 48, heart: false },
  { radius: 1.75, tube: 0.005, tilt: [0.15, -0.1, -0.08], speed: 0.5, amp: 0.035, phase: 1.8, rot: 0.08, opacity: 0.32, segs: 48, heart: false },
  { radius: 2.35, tube: 0.004, tilt: [-0.12, 0.18, 0.1], speed: 0.45, amp: 0.03, phase: 2.2, rot: 0.06, opacity: 0.2, segs: 32, heart: false },
  { radius: 3.0, tube: 0.003, tilt: [0.2, -0.15, -0.12], speed: 0.4, amp: 0.025, phase: 2.6, rot: 0.05, opacity: 0.12, segs: 32, heart: false },
  { radius: 3.65, tube: 0.003, tilt: [-0.18, 0.22, 0.15], speed: 0.35, amp: 0.02, phase: 3.0, rot: 0.04, opacity: 0.06, segs: 24, heart: false },
];

/* ── Single portal ring ─────────────────────────────────── */

function PortalRing({
  cfg,
  clicked,
  hovered,
  destabilize,
}: {
  cfg: RingConfig;
  clicked: boolean;
  hovered: boolean;
  destabilize: boolean;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const matRef = useRef<THREE.MeshBasicMaterial>(null);
  const prevClick = useRef(false);
  const pulseT = useRef(-10);

  // Mirror props into refs for useFrame
  const clickedRef = useRef(clicked);
  const hoveredRef = useRef(hovered);
  const destabilizeRef = useRef(destabilize);
  clickedRef.current = clicked;
  hoveredRef.current = hovered;
  destabilizeRef.current = destabilize;

  useFrame(({ clock }) => {
    if (!meshRef.current || !matRef.current) return;
    const t = clock.getElapsedTime();
    const c = clickedRef.current;
    const h = hoveredRef.current;
    const d = destabilizeRef.current;

    if (c && !prevClick.current) pulseT.current = t;
    prevClick.current = c;

    // Breathing — destabilize when hovered or during descent portal reaction
    const breathSpeed = d ? cfg.speed * 2.5 : h && cfg.heart ? cfg.speed * 1.5 : cfg.speed;
    const breathAmp = d ? cfg.amp * 2.2 : h && cfg.heart ? cfg.amp * 1.4 : cfg.amp;
    let breathe = Math.sin(t * breathSpeed + cfg.phase) * breathAmp;

    // Heartbeat — more violent when destabilized
    if (cfg.heart) {
      const heartPow = d ? 5 : 8;
      const heartAmp = d ? 0.22 : 0.12;
      breathe += Math.pow(Math.sin(t * 0.5), heartPow) * heartAmp;
    }

    // Instability stutter — frequent when destabilized
    const stutterChance = d ? 0.04 : 0.002;
    const stutterAmp = d ? 0.12 : 0.06;
    const stutter = Math.random() < stutterChance ? (Math.random() - 0.5) * stutterAmp : 0;

    // Hover pull
    const pull = h && cfg.heart ? -0.03 : 0;

    let scale = 1 + breathe + stutter + pull;

    // Click pulse
    const elapsed = t - pulseT.current;
    if (elapsed < 0.8) {
      const pulse = Math.sin((elapsed / 0.8) * Math.PI) * 0.5;
      matRef.current.opacity = Math.min(cfg.opacity + pulse, 1);
      scale += pulse * 0.12;
    } else {
      matRef.current.opacity = cfg.opacity;
    }

    meshRef.current.scale.setScalar(scale);

    // Rotation — erratic when destabilized
    const rotMult = d ? 3 : 1;
    meshRef.current.rotation.x += cfg.rot * 0.004 * rotMult;
    meshRef.current.rotation.y += cfg.rot * 0.002 * rotMult;
    meshRef.current.rotation.z += cfg.rot * 0.001 * rotMult;

    // Tilt jitter when destabilized
    if (d) {
      meshRef.current.rotation.x += (Math.random() - 0.5) * 0.005;
      meshRef.current.rotation.y += (Math.random() - 0.5) * 0.004;
    }
  });

  return (
    <mesh ref={meshRef} rotation={cfg.tilt}>
      <torusGeometry args={[cfg.radius, cfg.tube, 8, cfg.segs]} />
      <meshBasicMaterial
        ref={matRef}
        color="#ffffff"
        transparent
        opacity={cfg.opacity}
      />
    </mesh>
  );
}

/* ── Shockwave ring ─────────────────────────────────────── */

function Shockwave({ active }: { active: boolean }) {
  const ref = useRef<THREE.Mesh>(null);
  const startRef = useRef(0);
  const prev = useRef(false);

  const activeRef = useRef(active);
  activeRef.current = active;

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const mat = ref.current.material as THREE.MeshBasicMaterial;
    const a = activeRef.current;

    if (a && !prev.current) startRef.current = clock.getElapsedTime();
    prev.current = a;

    const e = clock.getElapsedTime() - startRef.current;
    if (e < 1.5 && a) {
      const p = e / 1.5;
      ref.current.scale.setScalar(0.3 + p * 5);
      mat.opacity = (1 - p) * 0.25;
    } else {
      mat.opacity = 0;
    }
  });

  return (
    <mesh ref={ref} rotation={[Math.PI / 2, 0, 0]}>
      <torusGeometry args={[1, 0.002, 4, 64]} />
      <meshBasicMaterial color="#ffffff" transparent opacity={0} />
    </mesh>
  );
}

/* ── Void center ────────────────────────────────────────── */

function VoidCenter({
  clicked,
  hovered,
}: {
  clicked: boolean;
  hovered: boolean;
}) {
  const glowRef = useRef<THREE.Mesh>(null);
  const matRef = useRef<THREE.MeshBasicMaterial>(null);
  const prev = useRef(false);
  const t0 = useRef(-10);

  const clickedRef = useRef(clicked);
  const hoveredRef = useRef(hovered);
  clickedRef.current = clicked;
  hoveredRef.current = hovered;

  useFrame(({ clock }) => {
    if (!glowRef.current || !matRef.current) return;
    const t = clock.getElapsedTime();
    const c = clickedRef.current;
    const h = hoveredRef.current;

    if (c && !prev.current) t0.current = t;
    prev.current = c;

    const breathe = Math.sin(t * 0.6) * 0.01;
    const e = t - t0.current;

    if (e < 0.6) {
      const p = e / 0.6;
      if (p < 0.3) {
        matRef.current.opacity = 0.03 - p * 0.06;
      } else {
        matRef.current.opacity = 0.01 + (p - 0.3) * 1.5;
      }
    } else {
      matRef.current.opacity = (h ? 0.08 : 0.03) + breathe;
    }
  });

  return (
    <group>
      <mesh>
        <sphereGeometry args={[0.12, 32, 32]} />
        <meshBasicMaterial color="#000000" />
      </mesh>
      <mesh ref={glowRef}>
        <sphereGeometry args={[0.14, 16, 16]} />
        <meshBasicMaterial
          ref={matRef}
          color="#ffffff"
          transparent
          opacity={0.03}
          wireframe
        />
      </mesh>
    </group>
  );
}

/* ── Portal assembly ────────────────────────────────────── */

interface Props {
  onDescend: () => void;
  destabilize: boolean;
  active: boolean;
}

export default function DimensionalPortal({ onDescend, destabilize, active }: Props) {
  const groupRef = useRef<THREE.Group>(null);
  const [clicked, setClicked] = useState(false);
  const [hovered, setHovered] = useState(false);
  const targetRot = useRef({ x: 0, y: 0 });

  useFrame(() => {
    if (!groupRef.current) return;
    targetRot.current.x += (pointer.y * 0.1 - targetRot.current.x) * 0.025;
    targetRot.current.y += (pointer.x * 0.12 - targetRot.current.y) * 0.025;
    groupRef.current.rotation.x = targetRot.current.x;
    groupRef.current.rotation.y = targetRot.current.y;
  });

  const activeRef = useRef(active);
  activeRef.current = active;

  const handleClick = useCallback(() => {
    if (!activeRef.current) return;
    setClicked(true);
    onDescend();
    setTimeout(() => setClicked(false), 1200);
  }, [onDescend]);

  return (
    <group ref={groupRef}>
      <mesh
        onClick={handleClick}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
      >
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      <VoidCenter clicked={clicked} hovered={hovered} />

      {RINGS.map((ring, i) => (
        <PortalRing
          key={i}
          cfg={ring}
          clicked={clicked}
          hovered={hovered}
          destabilize={destabilize}
        />
      ))}

      <Shockwave active={clicked} />
    </group>
  );
}
