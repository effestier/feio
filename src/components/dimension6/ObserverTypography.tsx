"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";
import { useObserverText } from "@/systems/awareness/observerTypography";

/* ── Typography fragment config ─────────────────────────── */

interface Fragment {
  baseText: string;
  position: [number, number, number];
  rotation: [number, number, number];
  size: number;
  baseOpacity: number;
  /** Which observer field to display */
  field: "observer" | "pointer" | "interaction" | "attention" | "static";
  /** Static text (when field === "static") */
  staticValue?: string;
  prefix?: string;
}

const FRAGMENTS: Fragment[] = [
  {
    baseText: "D.06",
    position: [0, 2.5, -1],
    rotation: [0, 0, 0],
    size: 0.2,
    baseOpacity: 0.3,
    field: "static",
    staticValue: "D.06",
  },
  {
    baseText: "OBSERVER AWARENESS",
    position: [0, -2, -1],
    rotation: [0, 0, 0],
    size: 0.08,
    baseOpacity: 0.18,
    field: "static",
    staticValue: "OBSERVER AWARENESS",
  },
  {
    baseText: "observer: active",
    position: [-4, 2, -3],
    rotation: [0, 0.15, 0.02],
    size: 0.065,
    baseOpacity: 0.1,
    field: "observer",
    prefix: "observer: ",
  },
  {
    baseText: "pointer: nominal",
    position: [4, 1.5, -3],
    rotation: [0, -0.2, -0.01],
    size: 0.065,
    baseOpacity: 0.1,
    field: "pointer",
    prefix: "pointer: ",
  },
  {
    baseText: "interaction: standard",
    position: [-3.5, -1.5, -4],
    rotation: [0.01, 0.1, 0],
    size: 0.06,
    baseOpacity: 0.08,
    field: "interaction",
    prefix: "interaction: ",
  },
  {
    baseText: "attention: ambient",
    position: [3.5, -2, -4],
    rotation: [-0.02, -0.1, 0.02],
    size: 0.06,
    baseOpacity: 0.08,
    field: "attention",
    prefix: "attention: ",
  },
  {
    baseText: "model.confidence: accumulating",
    position: [-2, -3.2, -5],
    rotation: [0, 0.12, 0],
    size: 0.055,
    baseOpacity: 0.06,
    field: "static",
    staticValue: "model.confidence: accumulating",
  },
  {
    baseText: "observer.pattern: mapping",
    position: [3, 3, -5],
    rotation: [-0.02, -0.08, 0.02],
    size: 0.055,
    baseOpacity: 0.06,
    field: "static",
    staticValue: "observer.pattern: mapping",
  },
];

/* ── Single observer text fragment ──────────────────────── */

function ObserverTextFragment({ fragment }: { fragment: Fragment }) {
  const ref = useRef<THREE.Mesh>(null);
  const matRef = useRef<THREE.MeshBasicMaterial>(null);
  const phaseRef = useRef(Math.random() * Math.PI * 2);

  const { observerState, pointerState, interactionState, attentionState } =
    useObserverText();

  // Mirror into refs for useFrame
  const observerRef = useRef(observerState);
  const pointerRef = useRef(pointerState);
  const interactionRef = useRef(interactionState);
  const attentionRef = useRef(attentionState);
  const baseOpacityRef = useRef(fragment.baseOpacity);
  observerRef.current = observerState;
  pointerRef.current = pointerState;
  interactionRef.current = interactionState;
  attentionRef.current = attentionState;
  baseOpacityRef.current = fragment.baseOpacity;

  useFrame(({ clock }) => {
    if (!ref.current || !matRef.current) return;
    const t = clock.getElapsedTime();
    const phase = phaseRef.current;

    // Drift
    ref.current.position.x =
      fragment.position[0] + Math.sin(t * 0.03 + phase) * 0.02;
    ref.current.position.y =
      fragment.position[1] + Math.cos(t * 0.025 + phase) * 0.015;

    matRef.current.opacity = baseOpacityRef.current;
  });

  // Resolve display text
  let displayText = fragment.staticValue || fragment.baseText;
  if (fragment.field !== "static" && fragment.prefix) {
    switch (fragment.field) {
      case "observer":
        displayText = `${fragment.prefix}${observerRef.current}`;
        break;
      case "pointer":
        displayText = `${fragment.prefix}${pointerRef.current}`;
        break;
      case "interaction":
        displayText = `${fragment.prefix}${interactionRef.current}`;
        break;
      case "attention":
        displayText = `${fragment.prefix}${attentionRef.current}`;
        break;
    }
  }

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
        opacity={fragment.baseOpacity}
      />
    </Text>
  );
}

/* ── Export ──────────────────────────────────────────────── */

export default function ObserverTypography() {
  return (
    <group>
      {FRAGMENTS.map((f, i) => (
        <ObserverTextFragment key={i} fragment={f} />
      ))}
    </group>
  );
}
