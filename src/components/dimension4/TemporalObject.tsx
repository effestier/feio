"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useDelayedReaction } from "@/systems/temporal/delayedReaction";

/* ── Object configuration ───────────────────────────────── */

interface TemporalObjectConfig {
  position: [number, number, number];
  type: "torus-segment" | "wireframe-icosa" | "plane-cross" | "broken-ring" | "void-sphere";
  scale: number;
  driftSpeed: number;
  driftAmp: number;
  rotSpeed: [number, number, number];
  reversedMotion: boolean;
  baseOpacity: number;
  hoverOpacity: number;
}

/* ── Temporal Object ────────────────────────────────────── */

export default function TemporalObject({ config }: { config: TemporalObjectConfig }) {
  const groupRef = useRef<THREE.Group>(null);
  const matRef = useRef<THREE.MeshBasicMaterial>(null);
  const phaseRef = useRef(Math.random() * Math.PI * 2);
  const settleRef = useRef(false);

  const {
    isReactingRef,
    clickFiredRef,
    onHoverStart,
    onHoverEnd,
    onClick,
  } = useDelayedReaction({
    hoverDelay: 400 + Math.random() * 300,
    leaveDelay: 500 + Math.random() * 400,
    clickDelay: 600 + Math.random() * 600,
    jitterRange: 250,
  });

  useFrame(({ clock }) => {
    if (!groupRef.current || !matRef.current) return;
    const t = clock.getElapsedTime();
    const phase = phaseRef.current;
    const reacting = isReactingRef.current;
    const clicked = clickFiredRef.current;

    // Drift — reversed objects settle then resume unexpectedly
    let driftX = Math.sin(t * config.driftSpeed + phase) * config.driftAmp;
    let driftY = Math.cos(t * config.driftSpeed * 0.7 + phase) * config.driftAmp;

    if (config.reversedMotion) {
      const cycle = (t + phase) % 8;
      if (cycle > 5 && cycle < 7) {
        driftX *= Math.max(0, 1 - (cycle - 5) * 0.8);
        driftY *= Math.max(0, 1 - (cycle - 5) * 0.8);
        settleRef.current = true;
      } else if (settleRef.current && cycle >= 7) {
        const snap = Math.min((cycle - 7) * 3, 1);
        driftX = Math.sin(t * config.driftSpeed * 2 + phase) * config.driftAmp * snap * 1.5;
        driftY = Math.cos(t * config.driftSpeed * 1.4 + phase) * config.driftAmp * snap * 1.5;
        if (cycle > 7.5) settleRef.current = false;
      }
    }

    groupRef.current.position.x = config.position[0] + driftX;
    groupRef.current.position.y = config.position[1] + driftY;
    groupRef.current.position.z = config.position[2] + Math.sin(t * 0.1 + phase) * 0.3;

    // Rotation
    groupRef.current.rotation.x += config.rotSpeed[0];
    groupRef.current.rotation.y += config.rotSpeed[1];
    groupRef.current.rotation.z += config.rotSpeed[2];

    // Opacity — temporal reactions (read from refs, always fresh)
    let opacity = config.baseOpacity;

    if (reacting) {
      opacity = config.hoverOpacity;
    }

    if (clicked) {
      opacity = Math.min(opacity + 0.15, 0.8);
      groupRef.current.position.x += (Math.random() - 0.5) * 0.02;
      groupRef.current.position.y += (Math.random() - 0.5) * 0.02;
    }

    matRef.current.opacity = opacity;

    // Scale pulse
    const reactionScale = reacting ? 1.04 : 1;
    const clickScale = clicked ? 1.08 : 1;
    groupRef.current.scale.setScalar(config.scale * reactionScale * clickScale);
  });

  return (
    <group
      ref={groupRef}
      position={config.position}
      onPointerEnter={onHoverStart}
      onPointerLeave={onHoverEnd}
      onClick={onClick}
    >
      <TemporalGeometry type={config.type} />
      <meshBasicMaterial
        ref={matRef}
        color="#ffffff"
        transparent
        opacity={config.baseOpacity}
        wireframe={config.type === "wireframe-icosa"}
        side={THREE.DoubleSide}
      />
    </group>
  );
}

/* ── Geometry shapes ────────────────────────────────────── */

function TemporalGeometry({ type }: { type: TemporalObjectConfig["type"] }) {
  switch (type) {
    case "torus-segment":
      return <torusGeometry args={[0.5, 0.015, 8, 32, Math.PI * 1.4]} />;
    case "wireframe-icosa":
      return <icosahedronGeometry args={[0.4, 0]} />;
    case "plane-cross":
      return <planeGeometry args={[0.6, 0.4]} />;
    case "broken-ring":
      return <torusGeometry args={[0.35, 0.01, 6, 24, Math.PI * 1.1]} />;
    case "void-sphere":
      return <sphereGeometry args={[0.25, 12, 12]} />;
    default:
      return <sphereGeometry args={[0.3, 8, 8]} />;
  }
}
