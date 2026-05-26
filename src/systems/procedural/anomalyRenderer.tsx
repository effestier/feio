"use client";

import { useRef, useMemo, useCallback } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type {
  ActiveAnomaly,
  AnomalyGeometry,
  AnomalyBehavior,
  AnomalyInteractivity,
} from "./anomalyEngine";
import { useDelayedReaction } from "@/systems/temporal/delayedReaction";

/* ── Pointer (module level) ─────────────────────────────── */

const pointerNorm = { x: 0, y: 0 };

if (typeof window !== "undefined") {
  window.addEventListener("pointermove", (e: PointerEvent) => {
    pointerNorm.x = (e.clientX / window.innerWidth) * 2 - 1;
    pointerNorm.y = -(e.clientY / window.innerHeight) * 2 + 1;
  });
}

/* ── Geometry switch ────────────────────────────────────── */

function AnomalyGeometryMesh({ type }: { type: AnomalyGeometry }) {
  switch (type) {
    case "torus":
      return <torusGeometry args={[0.25, 0.01, 8, 32]} />;
    case "icosa":
      return <icosahedronGeometry args={[0.25, 0]} />;
    case "sphere":
      return <sphereGeometry args={[0.2, 12, 12]} />;
    case "cube":
      return <boxGeometry args={[0.3, 0.3, 0.3]} />;
    case "ring":
      return <torusGeometry args={[0.2, 0.005, 6, 48]} />;
    case "knot":
      return <torusKnotGeometry args={[0.15, 0.04, 48, 6, 2, 3]} />;
    case "octahedron":
      return <octahedronGeometry args={[0.25, 0]} />;
    case "dodecahedron":
      return <dodecahedronGeometry args={[0.25, 0]} />;
    default:
      return <sphereGeometry args={[0.2, 8, 8]} />;
  }
}

/* ── Single anomaly renderer ────────────────────────────── */

interface Props {
  anomaly: ActiveAnomaly;
}

export default function AnomalyRenderer({ anomaly }: Props) {
  const groupRef = useRef<THREE.Group>(null);
  const matRef = useRef<THREE.MeshBasicMaterial>(null);
  const phaseRef = useRef(Math.random() * Math.PI * 2);
  const birthRef = useRef(anomaly.spawnedAt);

  // Mirror anomaly config for useFrame
  const anomalyRef = useRef(anomaly);
  anomalyRef.current = anomaly;

  // Delayed reaction for interactive anomalies
  const {
    isReactingRef,
    clickFiredRef,
    onHoverStart,
    onHoverEnd,
    onClick,
  } = useDelayedReaction({
    hoverDelay: 300 + Math.random() * 400,
    leaveDelay: 400 + Math.random() * 300,
    clickDelay: 500 + Math.random() * 500,
    jitterRange: 200,
  });

  useFrame(({ clock }) => {
    if (!groupRef.current || !matRef.current) return;
    const t = clock.getElapsedTime();
    const a = anomalyRef.current;
    const phase = phaseRef.current;
    const age = performance.now() - birthRef.current;
    const reacting = isReactingRef.current;
    const clicked = clickFiredRef.current;

    // ── Lifecycle opacity ──
    let lifecycleOpacity = 1;
    if (age < 1500) {
      // Fade in
      lifecycleOpacity = age / 1500;
    } else if (a.lifespan > 0 && age > a.lifespan - 3000) {
      // Fade out
      lifecycleOpacity = Math.max(0, (a.lifespan - age) / 3000);
    }

    // ── Behavior ──
    let dx = 0;
    let dy = 0;
    let dz = 0;
    let scaleMod = 1;
    let opacityMod = 1;

    switch (a.behavior) {
      case "drift":
        dx = Math.sin(t * 0.08 + phase) * 0.3;
        dy = Math.cos(t * 0.06 + phase) * 0.2;
        dz = Math.sin(t * 0.04 + phase * 2) * 0.1;
        break;

      case "orbit":
        dx = Math.cos(t * 0.1 + phase) * 0.4;
        dy = Math.sin(t * 0.1 + phase) * 0.3;
        dz = Math.sin(t * 0.05 + phase) * 0.15;
        break;

      case "pulse":
        scaleMod = 1 + Math.sin(t * 1.5 + phase) * 0.08;
        break;

      case "fade-cycle":
        opacityMod = 0.5 + Math.sin(t * 0.3 + phase) * 0.5;
        break;

      case "mirror-user": {
        // Slowly orient toward pointer
        const px = pointerNorm.x * 4;
        const py = pointerNorm.y * 3;
        dx = (px - a.position[0]) * 0.02;
        dy = (py - a.position[1]) * 0.02;
        break;
      }

      case "anticipate": {
        // Move toward where pointer seems to be going
        const px = pointerNorm.x * 3;
        const py = pointerNorm.y * 2;
        dx = (px - a.position[0]) * 0.05;
        dy = (py - a.position[1]) * 0.05;
        break;
      }
    }

    groupRef.current.position.x = a.position[0] + dx;
    groupRef.current.position.y = a.position[1] + dy;
    groupRef.current.position.z = a.position[2] + dz;

    // Rotation
    groupRef.current.rotation.x += 0.002;
    groupRef.current.rotation.y += 0.003;

    // ── Interactivity modifiers ──
    if (reacting) {
      scaleMod *= 1.06;
      opacityMod *= 1.3;
    }
    if (clicked) {
      scaleMod *= 1.12;
      opacityMod *= 1.5;
    }

    // ── Final values ──
    const finalOpacity = Math.min(
      a.baseOpacity * lifecycleOpacity * opacityMod,
      0.5,
    );
    matRef.current.opacity = Math.max(0, finalOpacity);
    groupRef.current.scale.setScalar(a.scale * scaleMod);
  });

  // Wireframe for specific geometries
  const wireframe =
    anomaly.geometry === "icosa" ||
    anomaly.geometry === "cube" ||
    anomaly.geometry === "dodecahedron" ||
    anomaly.geometry === "octahedron";

  // Clickable if interactive
  const isInteractive =
    anomaly.interactivity !== "inert";

  return (
    <group
      ref={groupRef}
      position={anomaly.position}
      onClick={isInteractive ? onClick : undefined}
      onPointerEnter={isInteractive ? onHoverStart : undefined}
      onPointerLeave={isInteractive ? onHoverEnd : undefined}
    >
      <AnomalyGeometryMesh type={anomaly.geometry} />
      <meshBasicMaterial
        ref={matRef}
        color="#ffffff"
        transparent
        opacity={0}
        wireframe={wireframe}
        side={THREE.DoubleSide}
        depthWrite={false}
      />
    </group>
  );
}
