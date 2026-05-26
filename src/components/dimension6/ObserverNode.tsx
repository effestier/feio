"use client";

import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

/* ── Configuration ──────────────────────────────────────── */

export interface ObserverNodeConfig {
  position: [number, number, number];
  type: "sphere" | "icosahedron" | "torus" | "octahedron" | "torus-knot";
  scale: number;
  baseOpacity: number;
  driftSpeed: number;
  driftAmp: number;
  rotSpeed: [number, number, number];
}

/* ── Pointer tracker (module level) ─────────────────────── */

const pointerNorm = { x: 0, y: 0 };

if (typeof window !== "undefined") {
  window.addEventListener("pointermove", (e: PointerEvent) => {
    pointerNorm.x = (e.clientX / window.innerWidth) * 2 - 1;
    pointerNorm.y = -(e.clientY / window.innerHeight) * 2 + 1;
  });
}

/* ── Observer Node ──────────────────────────────────────── */

interface Props {
  config: ObserverNodeConfig;
  pulseRate: number;
  ambientIntensity: number;
  attentionLevel: number;
}

export default function ObserverNode({
  config,
  pulseRate,
  ambientIntensity,
  attentionLevel,
}: Props) {
  const groupRef = useRef<THREE.Group>(null);
  const matRef = useRef<THREE.MeshBasicMaterial>(null);
  const phaseRef = useRef(Math.random() * Math.PI * 2);
  const lookTarget = useRef(new THREE.Vector3());

  // Mirror all props into refs for useFrame
  const cfgRef = useRef(config);
  cfgRef.current = config;
  const pulseRateRef = useRef(pulseRate);
  pulseRateRef.current = pulseRate;
  const ambientRef = useRef(ambientIntensity);
  ambientRef.current = ambientIntensity;
  const attentionRef = useRef(attentionLevel);
  attentionRef.current = attentionLevel;

  useFrame(({ clock }) => {
    if (!groupRef.current || !matRef.current) return;
    const t = clock.getElapsedTime();
    const cfg = cfgRef.current;
    const phase = phaseRef.current;

    // Drift
    groupRef.current.position.x =
      cfg.position[0] + Math.sin(t * cfg.driftSpeed + phase) * cfg.driftAmp;
    groupRef.current.position.y =
      cfg.position[1] + Math.cos(t * cfg.driftSpeed * 0.7 + phase) * cfg.driftAmp;
    groupRef.current.position.z =
      cfg.position[2] + Math.sin(t * 0.05 + phase) * 0.1;

    // Subtle orientation toward pointer — slow lerp, not direct tracking
    const px = pointerNorm.x * 3;
    const py = pointerNorm.y * 2;
    lookTarget.current.set(px, py, 0);
    const dir = lookTarget.current
      .clone()
      .sub(groupRef.current.position)
      .normalize();
    const targetX = Math.asin(dir.y) * 0.15;
    const targetY = Math.atan2(dir.x, dir.z) * 0.15;
    groupRef.current.rotation.x += (targetX - groupRef.current.rotation.x) * 0.008;
    groupRef.current.rotation.y += (targetY - groupRef.current.rotation.y) * 0.008;
    groupRef.current.rotation.z += cfg.rotSpeed[2];

    // Pulse — tied to click frequency
    const pr = pulseRateRef.current;
    const pulse = Math.sin(t * pr * 2) * 0.03;
    groupRef.current.scale.setScalar(cfg.scale * (1 + pulse));

    // Opacity — tied to attention level
    const att = attentionRef.current;
    const opacity = cfg.baseOpacity + att * 0.08 + pulse * 0.5;
    matRef.current.opacity = Math.min(opacity, 0.4);
  });

  return (
    <group ref={groupRef} position={config.position}>
      {config.type === "sphere" && <sphereGeometry args={[0.3, 16, 16]} />}
      {config.type === "icosahedron" && <icosahedronGeometry args={[0.3, 0]} />}
      {config.type === "torus" && <torusGeometry args={[0.25, 0.012, 8, 32]} />}
      {config.type === "octahedron" && <octahedronGeometry args={[0.3, 0]} />}
      {config.type === "torus-knot" && <torusKnotGeometry args={[0.2, 0.06, 48, 6, 2, 3]} />}
      <meshBasicMaterial
        ref={matRef}
        color="#ffffff"
        transparent
        opacity={config.baseOpacity}
        wireframe
      />
    </group>
  );
}
