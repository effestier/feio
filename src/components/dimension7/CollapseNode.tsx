"use client";

import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useInterferenceBleed } from "@/systems/collapse/interferenceBleed";

/* ── Configuration ──────────────────────────────────────── */

export interface CollapseNodeConfig {
  position: [number, number, number];
  type: "torus-knot" | "wireframe-icosa" | "broken-ring" | "void-cube" | "helix" | "sphere";
  scale: number;
  baseOpacity: number;
  driftSpeed: number;
  driftAmp: number;
  rotSpeed: [number, number, number];
  /** Which system dominates initially */
  primarySystem: "fracture" | "temporal" | "logic" | "awareness";
}

/* ── Pointer (module level) ─────────────────────────────── */

const pointerNorm = { x: 0, y: 0 };

if (typeof window !== "undefined") {
  window.addEventListener("pointermove", (e: PointerEvent) => {
    pointerNorm.x = (e.clientX / window.innerWidth) * 2 - 1;
    pointerNorm.y = -(e.clientY / window.innerHeight) * 2 + 1;
  });
}

/* ── Collapse Node — multi-system interference ──────────── */

interface Props {
  config: CollapseNodeConfig;
}

export default function CollapseNode({ config }: Props) {
  const groupRef = useRef<THREE.Group>(null);
  const matRef = useRef<THREE.MeshBasicMaterial>(null);
  const phaseRef = useRef(Math.random() * Math.PI * 2);

  const cfgRef = useRef(config);
  cfgRef.current = config;

  const { collapseRef, fractureRef, temporalRef, logicRef, awarenessRef } =
    useInterferenceBleed();

  useFrame(({ clock }) => {
    if (!groupRef.current || !matRef.current) return;
    const t = clock.getElapsedTime();
    const cfg = cfgRef.current;
    const phase = phaseRef.current;
    const cl = collapseRef.current;
    const fB = fractureRef.current;
    const tB = temporalRef.current;
    const lB = logicRef.current;
    const aB = awarenessRef.current;

    // Base drift
    let driftX = Math.sin(t * cfg.driftSpeed + phase) * cfg.driftAmp;
    let driftY = Math.cos(t * cfg.driftSpeed * 0.7 + phase) * cfg.driftAmp;

    // Fracture bleed — erratic position jitter
    if (fB > 0.1) {
      const jitter = fB * 0.08;
      driftX += (Math.random() - 0.5) * jitter;
      driftY += (Math.random() - 0.5) * jitter;
    }

    // Temporal bleed — reversed/stuttering motion
    if (tB > 0.1) {
      const reverse = Math.sin(t * 0.5 + phase) > 0.5 ? -1 : 1;
      driftX *= 1 + tB * reverse * 0.4;
      // Temporal stutter — freeze intermittently
      if (Math.random() < tB * 0.03) {
        driftX *= 0.1;
        driftY *= 0.1;
      }
    }

    // Logic bleed — contradictory position (teleport micro-shifts)
    if (lB > 0.1 && Math.random() < lB * 0.008) {
      driftX += (Math.random() - 0.5) * 0.3;
      driftY += (Math.random() - 0.5) * 0.2;
    }

    groupRef.current.position.x = cfg.position[0] + driftX;
    groupRef.current.position.y = cfg.position[1] + driftY;
    groupRef.current.position.z = cfg.position[2] + Math.sin(t * 0.04 + phase) * 0.15;

    // Awareness bleed — orient toward pointer
    if (aB > 0.1) {
      const px = pointerNorm.x * 3;
      const py = pointerNorm.y * 2;
      const dx = px - groupRef.current.position.x;
      const dy = py - groupRef.current.position.y;
      groupRef.current.rotation.x += Math.atan2(dy, 5) * aB * 0.005;
      groupRef.current.rotation.y += Math.atan2(dx, 5) * aB * 0.005;
    }

    // Rotation — base + interference
    groupRef.current.rotation.x += cfg.rotSpeed[0] * (1 + fB * 0.5);
    groupRef.current.rotation.y += cfg.rotSpeed[1] * (1 + tB * 0.3);
    groupRef.current.rotation.z += cfg.rotSpeed[2] * (1 + lB * 0.4);

    // Opacity — fluctuates with collapse
    const baseOp = cfg.baseOpacity;
    const collapseBoost = cl * 0.06;
    const flicker = Math.random() < 0.02 ? (Math.random() - 0.5) * 0.1 : 0;
    matRef.current.opacity = Math.max(0, baseOp + collapseBoost + flicker);

    // Scale — subtle breathing with instability
    const breathe = Math.sin(t * 0.8 + phase) * 0.02 * cl;
    const stutter = Math.random() < 0.005 ? (Math.random() - 0.5) * 0.05 : 0;
    groupRef.current.scale.setScalar(cfg.scale * (1 + breathe + stutter));
  });

  return (
    <group ref={groupRef} position={config.position}>
      {config.type === "torus-knot" && <torusKnotGeometry args={[0.25, 0.06, 48, 6, 2, 3]} />}
      {config.type === "wireframe-icosa" && <icosahedronGeometry args={[0.3, 0]} />}
      {config.type === "broken-ring" && <torusGeometry args={[0.3, 0.01, 8, 32, Math.PI * 1.4]} />}
      {config.type === "void-cube" && <boxGeometry args={[0.4, 0.4, 0.4]} />}
      {config.type === "helix" && <torusGeometry args={[0.25, 0.008, 6, 32, Math.PI * 1.7]} />}
      {config.type === "sphere" && <sphereGeometry args={[0.25, 12, 12]} />}
      <meshBasicMaterial
        ref={matRef}
        color="#ffffff"
        transparent
        opacity={config.baseOpacity}
        wireframe={config.type === "wireframe-icosa" || config.type === "void-cube"}
        side={THREE.DoubleSide}
      />
    </group>
  );
}
