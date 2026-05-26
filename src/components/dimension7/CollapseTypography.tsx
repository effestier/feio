"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";
import { useInterferenceBleed } from "@/systems/collapse/interferenceBleed";
import { useCollapseEngine } from "@/systems/collapse/collapseEngine";
import { scrambleText } from "@/systems/temporal/temporalTypography";

/* ── Fragment definition ────────────────────────────────── */

interface CollapseFragment {
  text: string;
  position: [number, number, number];
  rotation: [number, number, number];
  size: number;
  baseOpacity: number;
  driftSpeed: number;
  driftAmp: number;
  /** Which dimension this fragment echoes from */
  source: "structure" | "temporal" | "logic" | "awareness" | "collapse";
  /** If true, text runs backward */
  reversed: boolean;
}

const FRAGMENTS: CollapseFragment[] = [
  // Echoes from prior dimensions
  { text: "D.07", position: [0, 2.5, -1], rotation: [0, 0, 0], size: 0.22, baseOpacity: 0.3, driftSpeed: 0.03, driftAmp: 0.02, source: "collapse", reversed: false },
  { text: "COLLAPSE", position: [0, -2.2, -1], rotation: [0, 0, 0], size: 0.09, baseOpacity: 0.2, driftSpeed: 0.02, driftAmp: 0.015, source: "collapse", reversed: false },

  // Structure echoes
  { text: "D.02", position: [-5, 2, -3], rotation: [0, 0.15, 0.04], size: 0.07, baseOpacity: 0.08, driftSpeed: 0.04, driftAmp: 0.04, source: "structure", reversed: false },
  { text: "depth:unknown", position: [4.5, -1.5, -3], rotation: [0, -0.2, -0.02], size: 0.06, baseOpacity: 0.06, driftSpeed: 0.035, driftAmp: 0.035, source: "structure", reversed: false },

  // Temporal echoes
  { text: "TEMPORAL", position: [-3, -2.5, -4], rotation: [0.01, 0.12, 0], size: 0.065, baseOpacity: 0.07, driftSpeed: 0.03, driftAmp: 0.04, source: "temporal", reversed: false },
  { text: "now ≠ now", position: [3.5, 2.5, -4], rotation: [-0.02, -0.08, 0.02], size: 0.06, baseOpacity: 0.06, driftSpeed: 0.04, driftAmp: 0.03, source: "temporal", reversed: true },

  // Logic echoes
  { text: "LOGICAL", position: [-4, 0.5, -5], rotation: [0, 0.2, 0.01], size: 0.06, baseOpacity: 0.055, driftSpeed: 0.025, driftAmp: 0.05, source: "logic", reversed: false },
  { text: "identity:void", position: [2.5, -3, -5], rotation: [0.01, -0.15, 0], size: 0.055, baseOpacity: 0.05, driftSpeed: 0.03, driftAmp: 0.04, source: "logic", reversed: true },

  // Awareness echoes
  { text: "OBSERVER", position: [5, 0.5, -6], rotation: [0, -0.3, 0.02], size: 0.06, baseOpacity: 0.05, driftSpeed: 0.035, driftAmp: 0.04, source: "awareness", reversed: false },

  // System autonomous messages
  { text: "coherence: failing", position: [-2, 3.5, -4], rotation: [0, 0.1, 0], size: 0.05, baseOpacity: 0.04, driftSpeed: 0.02, driftAmp: 0.02, source: "collapse", reversed: false },
  { text: "model: divergent", position: [3, -3.5, -5], rotation: [0, -0.12, 0], size: 0.05, baseOpacity: 0.04, driftSpeed: 0.025, driftAmp: 0.025, source: "collapse", reversed: false },
  { text: "containment: exceeded", position: [-3.5, -3.5, -6], rotation: [0, 0.15, 0], size: 0.05, baseOpacity: 0.035, driftSpeed: 0.02, driftAmp: 0.03, source: "collapse", reversed: false },
];

/* ── Single collapse text fragment ──────────────────────── */

function CollapseTextFragment({ fragment }: { fragment: CollapseFragment }) {
  const ref = useRef<THREE.Mesh>(null);
  const matRef = useRef<THREE.MeshBasicMaterial>(null);
  const phaseRef = useRef(Math.random() * Math.PI * 2);
  const scrambleTimerRef = useRef(0);

  const { collapseRef, temporalRef, logicRef } = useInterferenceBleed();

  // Mirror fragment config
  const fragRef = useRef(fragment);
  fragRef.current = fragment;

  useFrame(({ clock }) => {
    if (!ref.current || !matRef.current) return;
    const t = clock.getElapsedTime();
    const frag = fragRef.current;
    const phase = phaseRef.current;
    const cl = collapseRef.current;
    const tB = temporalRef.current;
    const lB = logicRef.current;

    // Drift
    ref.current.position.x = frag.position[0] + Math.sin(t * frag.driftSpeed + phase) * frag.driftAmp;
    ref.current.position.y = frag.position[1] + Math.cos(t * frag.driftSpeed * 0.8 + phase) * frag.driftAmp;

    // Reversed text — slight backward drift
    if (frag.reversed) {
      ref.current.position.x -= Math.sin(t * 0.01 + phase) * 0.005;
    }

    // Temporal bleed — scale jitter
    if (tB > 0.1) {
      ref.current.scale.x = 1 + (Math.random() - 0.5) * tB * 0.03;
      ref.current.scale.y = 1 + (Math.random() - 0.5) * tB * 0.02;
    } else {
      ref.current.scale.x += (1 - ref.current.scale.x) * 0.1;
      ref.current.scale.y += (1 - ref.current.scale.y) * 0.1;
    }

    // Logic bleed — brief position teleport
    if (lB > 0.1 && Math.random() < lB * 0.003) {
      ref.current.position.x += (Math.random() - 0.5) * 0.3;
    }

    // Opacity — decay with collapse, flicker
    const baseOp = frag.baseOpacity;
    const collapseBoost = cl * 0.02;
    const flicker = Math.random() < 0.015 ? (Math.random() - 0.5) * 0.06 : 0;
    matRef.current.opacity = Math.max(0, baseOp + collapseBoost + flicker);
  });

  // Compute display text — static (scramble happens in CollapseChamber)
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
      {fragment.text}
      <meshBasicMaterial
        ref={matRef}
        color="#ffffff"
        transparent
        opacity={fragment.baseOpacity}
      />
    </Text>
  );
}

/* ── Export ──────────────────────────────────────────────── */

export default function CollapseTypography() {
  return (
    <group>
      {FRAGMENTS.map((f, i) => (
        <CollapseTextFragment key={i} fragment={f} />
      ))}
    </group>
  );
}
