"use client";

import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { ActiveAnomaly, AnomalyGeometry } from "./anomalyEngine";
import { evaluateAnimation, cleanupAnimState } from "./animationDNA";
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
    case "tetrahedron":
      return <tetrahedronGeometry args={[0.25, 0]} />;
    case "cone":
      return <coneGeometry args={[0.18, 0.35, 8]} />;
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
  const birthRef = useRef(anomaly.spawnedAt);
  const anomalyRef = useRef(anomaly);
  anomalyRef.current = anomaly;

  // Cleanup animation state on unmount
  useEffect(() => {
    return () => cleanupAnimState(anomaly.id);
  }, [anomaly.id]);

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
    const a = anomalyRef.current;
    const age = performance.now() - birthRef.current;
    const reacting = isReactingRef.current;
    const clicked = clickFiredRef.current;

    // Lifecycle opacity
    let lifecycleOpacity = 1;
    if (age < 1500) {
      lifecycleOpacity = age / 1500;
    } else if (a.lifespan > 0 && age > a.lifespan - 3000) {
      lifecycleOpacity = Math.max(0, (a.lifespan - age) / 3000);
    }

    // Phantom/ghost interactivity modifier
    if (a.interactivity === "phantom") {
      lifecycleOpacity *= 0.5 + Math.sin(clock.getElapsedTime() * 2) * 0.4;
    }
    if (a.interactivity === "ghost") {
      lifecycleOpacity *= 0.3 + Math.sin(clock.getElapsedTime() * 0.8) * 0.2;
    }

    // Legendary glow
    if (a.rarity === "legendary") {
      lifecycleOpacity *= 1.15 + Math.sin(clock.getElapsedTime() * 3) * 0.1;
    }

    // Evaluate DNA animation
    const result = evaluateAnimation(
      a.id,
      a.dna,
      a.position,
      a.scale,
      a.baseOpacity,
      clock.getElapsedTime(),
      pointerNorm,
      lifecycleOpacity,
      reacting,
      clicked,
    );

    groupRef.current.position.x = a.position[0] + result.dx;
    groupRef.current.position.y = a.position[1] + result.dy;
    groupRef.current.position.z = a.position[2] + result.dz;

    groupRef.current.rotation.x += result.rotDeltaX;
    groupRef.current.rotation.y += result.rotDeltaY;
    groupRef.current.rotation.z += result.rotDeltaZ;

    matRef.current.opacity = result.opacity;
    groupRef.current.scale.setScalar(result.scale);
  });

  const wireframe =
    anomaly.geometry === "icosa" ||
    anomaly.geometry === "cube" ||
    anomaly.geometry === "dodecahedron" ||
    anomaly.geometry === "octahedron" ||
    anomaly.geometry === "tetrahedron";

  const isInteractive = anomaly.interactivity !== "inert";

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
