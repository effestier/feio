"use client";

import { useRef, useState, useCallback } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useIdentityFailure } from "@/systems/logic/identityFailure";

/* ── Configuration ──────────────────────────────────────── */

interface DuplicateConfig {
  position: [number, number, number];
  duplicateOffset: [number, number, number];
  type: "torus" | "icosahedron" | "octahedron";
  scale: number;
  baseOpacity: number;
  driftSpeed: number;
  driftAmp: number;
}

/* ── Single identity node ───────────────────────────────── */

function IdentityNode({
  position,
  type,
  scale,
  opacity,
  driftSpeed,
  driftAmp,
  onClick,
}: {
  position: [number, number, number];
  type: DuplicateConfig["type"];
  scale: number;
  opacity: number;
  driftSpeed: number;
  driftAmp: number;
  onClick: () => void;
}) {
  const ref = useRef<THREE.Group>(null);
  const matRef = useRef<THREE.MeshBasicMaterial>(null);
  const phaseRef = useRef(Math.random() * Math.PI * 2);
  const [clickFlash, setClickFlash] = useState(false);

  // Mirror ALL props into refs for useFrame — no stale closures
  const opacityRef = useRef(opacity);
  const driftSpeedRef = useRef(driftSpeed);
  const driftAmpRef = useRef(driftAmp);
  const scaleRef = useRef(scale);
  const positionRef = useRef(position);
  const clickFlashRef = useRef(false);

  opacityRef.current = opacity;
  driftSpeedRef.current = driftSpeed;
  driftAmpRef.current = driftAmp;
  scaleRef.current = scale;
  positionRef.current = position;
  clickFlashRef.current = clickFlash;

  const handleClick = useCallback(() => {
    onClick();
    setClickFlash(true);
    setTimeout(() => setClickFlash(false), 400);
  }, [onClick]);

  useFrame(({ clock }) => {
    if (!ref.current || !matRef.current) return;
    const t = clock.getElapsedTime();
    const phase = phaseRef.current;
    const pos = positionRef.current;

    ref.current.position.x =
      pos[0] + Math.sin(t * driftSpeedRef.current + phase) * driftAmpRef.current;
    ref.current.position.y =
      pos[1] + Math.cos(t * driftSpeedRef.current * 0.7 + phase) * driftAmpRef.current;
    ref.current.position.z =
      pos[2] + Math.sin(t * 0.06 + phase) * 0.1;

    ref.current.rotation.x += 0.003;
    ref.current.rotation.y += 0.005;

    let op = opacityRef.current;
    if (clickFlashRef.current) op = Math.min(op + 0.2, 0.6);
    matRef.current.opacity = op;

    ref.current.scale.setScalar(scaleRef.current);
  });

  return (
    <group ref={ref} position={position} onClick={handleClick}>
      {type === "torus" && <torusGeometry args={[0.3, 0.015, 8, 32]} />}
      {type === "icosahedron" && <icosahedronGeometry args={[0.3, 0]} />}
      {type === "octahedron" && <octahedronGeometry args={[0.3, 0]} />}
      <meshBasicMaterial
        ref={matRef}
        color="#ffffff"
        transparent
        opacity={opacity}
        wireframe
      />
    </group>
  );
}

/* ── Duplicated Identity ────────────────────────────────── */

export default function DuplicatedIdentity({ config }: { config: DuplicateConfig }) {
  const {
    isActive,
    duplicateVisible,
    driftAmount,
    onPrimaryClick,
    onDuplicateClick,
  } = useIdentityFailure({
    objectId: `dup-${config.position.join(",")}`,
    duplicateOffset: config.duplicateOffset,
    duplicateDelay: 1500,
    behaviorDrift: 0.06,
    activeDuration: 10000,
    restDuration: 5000,
  });

  // Compute behaviors based on drift
  const primaryOpacity = isActive
    ? config.baseOpacity * (1 - driftAmount * 0.4)
    : config.baseOpacity;
  const duplicateOpacity = isActive
    ? config.baseOpacity * (0.3 + driftAmount * 0.4)
    : 0;
  const primaryDrift = isActive
    ? config.driftSpeed * (1 + driftAmount * 0.5)
    : config.driftSpeed;
  const duplicateDrift = isActive
    ? config.driftSpeed * (1 - driftAmount * 0.3)
    : config.driftSpeed;

  const dupPos: [number, number, number] = [
    config.position[0] + config.duplicateOffset[0],
    config.position[1] + config.duplicateOffset[1],
    config.position[2] + config.duplicateOffset[2],
  ];

  const handlePrimaryClick = useCallback(() => {
    onPrimaryClick();
  }, [onPrimaryClick]);

  const handleDuplicateClick = useCallback(() => {
    onDuplicateClick();
  }, [onDuplicateClick]);

  return (
    <group>
      {/* Primary */}
      <IdentityNode
        position={config.position}
        type={config.type}
        scale={config.scale}
        opacity={primaryOpacity}
        driftSpeed={primaryDrift}
        driftAmp={config.driftAmp}
        onClick={handlePrimaryClick}
      />

      {/* Duplicate — only visible during active cycle */}
      {duplicateVisible && (
        <IdentityNode
          position={dupPos}
          type={config.type}
          scale={config.scale * 0.95}
          opacity={duplicateOpacity}
          driftSpeed={duplicateDrift}
          driftAmp={config.driftAmp * 0.8}
          onClick={handleDuplicateClick}
        />
      )}
    </group>
  );
}
