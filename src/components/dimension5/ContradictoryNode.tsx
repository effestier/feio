"use client";

import { useRef, useMemo, useCallback } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useContradictoryAction } from "@/systems/logic/contradictoryAction";
import { useInterfaceLabel } from "@/systems/logic/interfaceContradiction";

/* ── Node configuration ─────────────────────────────────── */

export interface ContradictoryNodeConfig {
  position: [number, number, number];
  type: "torus-knot" | "wireframe-dodeca" | "intersecting-rings" | "void-cube" | "helix-segment";
  scale: number;
  label: string;
  realAction: string;
  driftSpeed: number;
  driftAmp: number;
  rotSpeed: [number, number, number];
  baseOpacity: number;
  reactOpacity: number;
}

/* ── Contradictory Node ─────────────────────────────────── */

export default function ContradictoryNode({ config }: { config: ContradictoryNodeConfig }) {
  const groupRef = useRef<THREE.Group>(null);
  const matRef = useRef<THREE.MeshBasicMaterial>(null);
  const phaseRef = useRef(Math.random() * Math.PI * 2);

  // Mirror ALL config into a ref for useFrame
  const cfgRef = useRef(config);
  cfgRef.current = config;

  // Mirror hook states into refs for useFrame
  const isContradictedRef = useRef(false);
  const pendingInversionRef = useRef(false);
  const clickFlashRef = useRef(false);
  const restoreTimerRef = useRef<ReturnType<typeof setTimeout>>();

  // Interface contradiction
  const { displayLabel, isContradicted } = useInterfaceLabel(config.label, {
    swapInterval: [4000, 12000],
    contradictionProbability: 0.55,
    burstDuration: 2500,
  });
  isContradictedRef.current = isContradicted;

  // Contradictory action outcomes — stable refs for callbacks
  const outcomes = useMemo(
    () => [
      {
        id: "pulse",
        weight: 3,
        callback: () => {
          if (!groupRef.current) return;
          const cfg = cfgRef.current;
          groupRef.current.scale.setScalar(cfg.scale * 1.15);
          clearTimeout(restoreTimerRef.current);
          restoreTimerRef.current = setTimeout(() => {
            if (groupRef.current) groupRef.current.scale.setScalar(cfgRef.current.scale);
          }, 400);
        },
      },
      {
        id: "shift",
        weight: 2,
        callback: () => {
          if (!groupRef.current) return;
          const cfg = cfgRef.current;
          groupRef.current.position.x += (Math.random() - 0.5) * 0.4;
          groupRef.current.position.y += (Math.random() - 0.5) * 0.3;
          clearTimeout(restoreTimerRef.current);
          restoreTimerRef.current = setTimeout(() => {
            if (groupRef.current) {
              groupRef.current.position.x = cfgRef.current.position[0];
              groupRef.current.position.y = cfgRef.current.position[1];
            }
          }, 1200);
        },
      },
      {
        id: "flash",
        weight: 2,
        callback: () => {
          if (!matRef.current) return;
          matRef.current.opacity = 0.6;
          clickFlashRef.current = true;
          clearTimeout(restoreTimerRef.current);
          restoreTimerRef.current = setTimeout(() => {
            if (matRef.current) matRef.current.opacity = cfgRef.current.baseOpacity;
            clickFlashRef.current = false;
          }, 300);
        },
      },
      {
        id: "invert",
        weight: 1,
        callback: () => {
          if (!groupRef.current || !matRef.current) return;
          groupRef.current.rotation.y += Math.PI * 0.5;
          matRef.current.opacity = 0.4;
          clearTimeout(restoreTimerRef.current);
          restoreTimerRef.current = setTimeout(() => {
            if (matRef.current) matRef.current.opacity = cfgRef.current.baseOpacity;
          }, 600);
        },
      },
    ],
    [],
  );

  const { execute, pendingInversion } = useContradictoryAction({
    actionId: `node-${config.position.join(",")}`,
    outcomes,
    inversionLeadMs: 200 + Math.random() * 200,
    contradictionProbability: 0.65,
  });
  pendingInversionRef.current = pendingInversion;

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
      cfg.position[2] + Math.sin(t * 0.08 + phase) * 0.15;

    // Rotation
    groupRef.current.rotation.x += cfg.rotSpeed[0];
    groupRef.current.rotation.y += cfg.rotSpeed[1];
    groupRef.current.rotation.z += cfg.rotSpeed[2];

    // Causal inversion visual — shimmer BEFORE interaction
    if (pendingInversionRef.current) {
      matRef.current.opacity = cfg.reactOpacity * 0.7;
      groupRef.current.scale.setScalar(cfg.scale * 1.04);
    } else if (!clickFlashRef.current) {
      matRef.current.opacity = cfg.baseOpacity;
      groupRef.current.scale.setScalar(cfg.scale);
    }

    // Contradicted label glow
    if (isContradictedRef.current) {
      matRef.current.opacity = Math.min(matRef.current.opacity + 0.03, cfg.reactOpacity);
    }
  });

  return (
    <group ref={groupRef} position={config.position} onClick={execute}>
      <ContradictoryGeometry type={config.type} />
      <meshBasicMaterial
        ref={matRef}
        color="#ffffff"
        transparent
        opacity={config.baseOpacity}
        wireframe={config.type === "wireframe-dodeca"}
        side={THREE.DoubleSide}
      />
    </group>
  );
}

/* ── Geometry ───────────────────────────────────────────── */

function ContradictoryGeometry({ type }: { type: ContradictoryNodeConfig["type"] }) {
  switch (type) {
    case "torus-knot":
      return <torusKnotGeometry args={[0.3, 0.08, 64, 8, 2, 3]} />;
    case "wireframe-dodeca":
      return <dodecahedronGeometry args={[0.35, 0]} />;
    case "intersecting-rings":
      return <torusGeometry args={[0.4, 0.012, 8, 48]} />;
    case "void-cube":
      return <boxGeometry args={[0.45, 0.45, 0.45]} />;
    case "helix-segment":
      return <torusGeometry args={[0.3, 0.01, 6, 32, Math.PI * 1.6]} />;
    default:
      return <sphereGeometry args={[0.3, 12, 12]} />;
  }
}
