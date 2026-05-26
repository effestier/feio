"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";
import { useTemporalText } from "@/systems/temporal/temporalTypography";

/* ── Fragment definition ────────────────────────────────── */

interface TextFragment {
  text: string;
  position: [number, number, number];
  rotation: [number, number, number];
  size: number;
  opacity: number;
  driftSpeed: number;
  driftAmp: number;
}

const FRAGMENTS: TextFragment[] = [
  { text: "D.04", position: [-5, 2.5, -2], rotation: [0, 0.2, 0.06], size: 0.09, opacity: 0.12, driftSpeed: 0.04, driftAmp: 0.03 },
  { text: "TEMPORAL FAILURE", position: [0, 3.5, -3], rotation: [0, 0, 0], size: 0.14, opacity: 0.2, driftSpeed: 0.03, driftAmp: 0.02 },
  { text: "t:unreliable", position: [4.5, -1, -2.5], rotation: [0, -0.3, -0.02], size: 0.07, opacity: 0.08, driftSpeed: 0.05, driftAmp: 0.04 },
  { text: "sequence.broken", position: [-3.5, -2, -4], rotation: [0.01, 0.12, 0], size: 0.065, opacity: 0.07, driftSpeed: 0.035, driftAmp: 0.05 },
  { text: "causality:leaking", position: [3, 2.8, -5], rotation: [-0.02, -0.08, 0.03], size: 0.06, opacity: 0.06, driftSpeed: 0.04, driftAmp: 0.04 },
  { text: "observer.delay(∞)", position: [-2, -3, -3.5], rotation: [0, 0.15, 0], size: 0.07, opacity: 0.09, driftSpeed: 0.025, driftAmp: 0.03 },
  { text: "now ≠ now", position: [5, 0.5, -4.5], rotation: [0, -0.4, 0.02], size: 0.08, opacity: 0.1, driftSpeed: 0.06, driftAmp: 0.05 },
];

/* ── Single temporal text fragment ──────────────────────── */

function TemporalTextFragment({ fragment }: { fragment: TextFragment }) {
  const ref = useRef<THREE.Mesh>(null);
  const matRef = useRef<THREE.MeshBasicMaterial>(null);

  const { displayText, isScrambling } = useTemporalText(fragment.text, {
    scrambleOnMount: true,
    scrambleOnHover: false,
    resolveDelay: 1200 + Math.random() * 2000,
    scrambleDuration: 250,
    intensity: 0.6,
    interval: 5000 + Math.random() * 8000,
  });

  // Mirror for useFrame
  const scramblingRef = useRef(isScrambling);
  scramblingRef.current = isScrambling;

  useFrame(({ clock }) => {
    if (!ref.current || !matRef.current) return;
    const t = clock.getElapsedTime();

    // Drift
    ref.current.position.y =
      fragment.position[1] + Math.sin(t * fragment.driftSpeed) * fragment.driftAmp;
    ref.current.position.x =
      fragment.position[0] + Math.cos(t * fragment.driftSpeed * 0.8) * fragment.driftAmp * 0.4;

    // Scramble visual distortion — brief scale jitter
    if (scramblingRef.current) {
      ref.current.scale.x = 1 + (Math.random() - 0.5) * 0.08;
      ref.current.scale.y = 1 + (Math.random() - 0.5) * 0.06;
    } else {
      ref.current.scale.x += (1 - ref.current.scale.x) * 0.1;
      ref.current.scale.y += (1 - ref.current.scale.y) * 0.1;
    }
  });

  return (
    <Text
      ref={ref}
      position={fragment.position}
      rotation={fragment.rotation}
      fontSize={fragment.size}
      color="#ffffff"
      anchorX="center"
      anchorY="middle"
    >
      {displayText}
      <meshBasicMaterial
        ref={matRef}
        color="#ffffff"
        transparent
        opacity={fragment.opacity}
      />
    </Text>
  );
}

/* ── Export ──────────────────────────────────────────────── */

export default function TemporalTypography() {
  return (
    <group>
      {FRAGMENTS.map((f, i) => (
        <TemporalTextFragment key={i} fragment={f} />
      ))}
    </group>
  );
}
