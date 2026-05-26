"use client";

import { useRef, useMemo, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useDimensionStore } from "@/systems/progression/dimensionStore";

/* ── Descent phases ─────────────────────────────────────── */

export type DescentPhase =
  | "idle"
  | "destabilize"
  | "pull"
  | "traverse"
  | "arrival";

export interface DescentState {
  phase: DescentPhase;
  progress: number;
  totalElapsed: number;
}

/* ── Tunnel ring generation ─────────────────────────────── */

interface TunnelRing {
  z: number;
  radius: number;
  rotOffset: number;
  opacity: number;
}

const TUNNEL_RING_COUNT = 40;
const TUNNEL_DEPTH = 30;

function generateTunnelRings(): TunnelRing[] {
  const rings: TunnelRing[] = [];
  for (let i = 0; i < TUNNEL_RING_COUNT; i++) {
    const t = i / TUNNEL_RING_COUNT;
    rings.push({
      z: -t * TUNNEL_DEPTH,
      radius: 0.3 + t * 0.15 + Math.sin(t * 8) * 0.04,
      rotOffset: t * Math.PI * 0.3,
      opacity: 0.7 - t * 0.5,
    });
  }
  return rings;
}

/* ── Tunnel ring ────────────────────────────────────────── */

function TunnelRingMesh({
  ring,
  phase,
  totalElapsed,
}: {
  ring: TunnelRing;
  phase: DescentPhase;
  totalElapsed: number;
}) {
  const ref = useRef<THREE.Mesh>(null);
  const matRef = useRef<THREE.MeshBasicMaterial>(null);

  const phaseRef = useRef(phase);
  const elapsedRef = useRef(totalElapsed);
  phaseRef.current = phase;
  elapsedRef.current = totalElapsed;

  useFrame(({ clock }) => {
    if (!ref.current || !matRef.current) return;
    const t = clock.getElapsedTime();
    const p = phaseRef.current;
    const e = elapsedRef.current;

    if (p === "traverse" || p === "arrival") {
      const speed = p === "traverse" ? 18 : 4;
      const offset = (e * 0.001 * speed + ring.z) % TUNNEL_DEPTH;
      ref.current.position.z = -offset;

      const travelProgress = p === "traverse" ? (e - 900) / 900 : 1;
      const squeeze = 1 - travelProgress * 0.3;
      ref.current.position.z *= squeeze;

      const baseOp = ring.opacity * (1 - travelProgress * 0.3);
      const strobe = Math.random() < 0.08 ? 0.4 : 0;
      matRef.current.opacity = Math.max(baseOp + strobe, 0);

      ref.current.rotation.z = ring.rotOffset + Math.sin(t * 2 + ring.rotOffset) * 0.03;
      ref.current.scale.setScalar(1 + Math.sin(t * 3 + ring.rotOffset) * 0.02);
    } else if (p === "pull") {
      const pullProgress = (e - 300) / 600;
      ref.current.position.z = ring.z * (1 - pullProgress * 0.3);
      matRef.current.opacity = ring.opacity * (0.8 + pullProgress * 0.2);
    } else {
      ref.current.position.z = ring.z;
      matRef.current.opacity = 0;
    }
  });

  return (
    <mesh ref={ref} rotation={[Math.PI / 2, 0, ring.rotOffset]}>
      <torusGeometry args={[ring.radius, 0.003, 6, 48]} />
      <meshBasicMaterial ref={matRef} color="#ffffff" transparent opacity={0} />
    </mesh>
  );
}

/* ── Streaking fragments ────────────────────────────────── */

const STREAK_COUNT = 30;

function StreakingFragments({
  phase,
  totalElapsed,
}: {
  phase: DescentPhase;
  totalElapsed: number;
}) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const phaseRef = useRef(phase);
  const elapsedRef = useRef(totalElapsed);
  phaseRef.current = phase;
  elapsedRef.current = totalElapsed;

  const data = useMemo(() => {
    const pos = new Float32Array(STREAK_COUNT * 3);
    const len = new Float32Array(STREAK_COUNT);
    const spd = new Float32Array(STREAK_COUNT);

    for (let i = 0; i < STREAK_COUNT; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 6;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 6;
      pos[i * 3 + 2] = -Math.random() * 20;
      len[i] = 0.3 + Math.random() * 1.2;
      spd[i] = 0.5 + Math.random() * 1.5;
    }
    return { pos, len, spd };
  }, []);

  useFrame(() => {
    if (!meshRef.current) return;
    const p = phaseRef.current;
    const e = elapsedRef.current;
    const isActive = p === "pull" || p === "traverse";
    const visible = isActive || p === "arrival";

    for (let i = 0; i < STREAK_COUNT; i++) {
      if (!visible) {
        dummy.scale.setScalar(0);
      } else {
        const baseX = data.pos[i * 3];
        const baseY = data.pos[i * 3 + 1];
        let z = data.pos[i * 3 + 2];

        if (p === "traverse") {
          const speed = data.spd[i] * 25;
          z = ((e * 0.001 * speed + z) % 20) - 10;
        } else if (p === "pull") {
          z += e * 0.002 * data.spd[i];
        }

        dummy.position.set(baseX, baseY, z);
        const stretch = p === "traverse" ? data.len[i] * 3 : data.len[i];
        dummy.scale.set(0.015, 0.015, stretch);
      }

      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, STREAK_COUNT]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshBasicMaterial color="#ffffff" transparent opacity={0.2} />
    </instancedMesh>
  );
}

/* ── Typography streaks ─────────────────────────────────── */

const STREAK_TEXTS = [
  "FEIO",
  "ENTERING",
  "D.02",
  "VOID",
  "DESCEND",
  "CONTAINMENT",
  "BREACH",
];

function TypographyStreaks({
  phase,
  totalElapsed,
}: {
  phase: DescentPhase;
  totalElapsed: number;
}) {
  const groupRef = useRef<THREE.Group>(null);

  const phaseRef = useRef(phase);
  const elapsedRef = useRef(totalElapsed);
  phaseRef.current = phase;
  elapsedRef.current = totalElapsed;

  useFrame(() => {
    if (!groupRef.current) return;
    const p = phaseRef.current;
    const e = elapsedRef.current;

    groupRef.current.children.forEach((child, i) => {
      const mesh = child as THREE.Mesh;
      const z = ((e * 0.001 * (8 + i * 2) + i * -3) % 15) - 7;
      mesh.position.z = -z;
      mesh.position.x = (i - 3) * 0.5;

      if (p === "traverse") {
        mesh.scale.z = 3 + Math.sin(e * 0.005 + i) * 2;
        mesh.scale.x = 0.8 + Math.sin(e * 0.003 + i * 0.5) * 0.15;
      } else {
        mesh.scale.set(1, 1, 1);
      }
    });
  });

  return (
    <group ref={groupRef}>
      {STREAK_TEXTS.map((text, i) => (
        <TypographyStreak key={i} text={text} index={i} phase={phase} />
      ))}
    </group>
  );
}

import { Text } from "@react-three/drei";

function TypographyStreak({
  text,
  index,
  phase,
}: {
  text: string;
  index: number;
  phase: DescentPhase;
}) {
  const ref = useRef<THREE.Mesh>(null);
  const matRef = useRef<THREE.MeshBasicMaterial>(null);

  const phaseRef = useRef(phase);
  phaseRef.current = phase;

  useFrame(() => {
    if (!ref.current || !matRef.current) return;
    const isVisible = phaseRef.current === "pull" || phaseRef.current === "traverse";
    matRef.current.opacity = isVisible ? 0.12 + Math.random() * 0.08 : 0;
  });

  return (
    <Text
      ref={ref}
      position={[(index - 3) * 0.5, 0, -index * 3]}
      fontSize={0.15}
      color="#ffffff"
      anchorX="center"
      anchorY="middle"
    >
      {text}
      <meshBasicMaterial ref={matRef} color="#ffffff" transparent opacity={0} />
    </Text>
  );
}

/* ── Arrival void ───────────────────────────────────────── */

function ArrivalVoid({ visible }: { visible: boolean }) {
  const gridRef = useRef<THREE.Group>(null);
  const pulseRef = useRef<THREE.Mesh>(null);

  const visibleRef = useRef(visible);
  visibleRef.current = visible;

  useFrame(({ clock }) => {
    if (!visibleRef.current) return;
    const t = clock.getElapsedTime();

    if (gridRef.current) {
      gridRef.current.rotation.x = -Math.PI / 2 + Math.sin(t * 0.05) * 0.01;
      gridRef.current.rotation.z = t * 0.005;
    }

    if (pulseRef.current) {
      const s = 0.08 + Math.sin(t * 0.4) * 0.02;
      pulseRef.current.scale.setScalar(s);
    }
  });

  if (!visible) return null;

  return (
    <group>
      <group ref={gridRef} position={[0, -2, 0]}>
        <gridHelper args={[20, 40, "#111111", "#111111"]} />
      </group>
      <mesh ref={pulseRef} position={[0, 0, -2]}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.015} wireframe />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, -2]}>
        <torusGeometry args={[1.5, 0.002, 4, 64]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.06} />
      </mesh>
    </group>
  );
}

/* ── Main descent sequence ──────────────────────────────── */

interface Props {
  phase: DescentPhase;
  totalElapsed: number;
}

export default function DescentSequence({ phase, totalElapsed }: Props) {
  const { camera } = useThree();
  const startPos = useRef(new THREE.Vector3(0, 0, 6));
  const startQuat = useRef(new THREE.Quaternion());
  const inited = useRef(false);
  const advancedRef = useRef(false);

  const advanceDimension = useDimensionStore((s) => s.advanceDimension);

  const tunnelRings = useMemo(() => generateTunnelRings(), []);

  const phaseRef = useRef(phase);
  const elapsedRef = useRef(totalElapsed);
  phaseRef.current = phase;
  elapsedRef.current = totalElapsed;

  useEffect(() => {
    if (phase !== "idle" && !inited.current) {
      startPos.current.copy(camera.position);
      startQuat.current.copy(camera.quaternion);
      inited.current = true;
    }
    if (phase === "idle") {
      inited.current = false;
      advancedRef.current = false;
    }
  }, [phase, camera]);

  // Advance dimension when arrival phase settles
  useEffect(() => {
    if (phase === "arrival" && !advancedRef.current) {
      advancedRef.current = true;
      const timer = setTimeout(() => {
        advanceDimension();
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [phase, advanceDimension]);

  useFrame(() => {
    const p = phaseRef.current;
    const e = elapsedRef.current;
    if (p === "idle") return;

    if (p === "destabilize") {
      const shake = 0.08;
      camera.position.x = startPos.current.x + (Math.random() - 0.5) * shake;
      camera.position.y = startPos.current.y + (Math.random() - 0.5) * shake;
      camera.position.z = startPos.current.z + (Math.random() - 0.5) * shake * 0.5;
    }

    if (p === "pull") {
      const progress = (e - 300) / 600;
      const eased = progress * progress;
      camera.position.z = startPos.current.z - eased * 3;
      camera.position.x = startPos.current.x * (1 - eased * 0.5);
      camera.position.y = startPos.current.y * (1 - eased * 0.5);
    }

    if (p === "traverse") {
      const progress = (e - 900) / 900;
      const eased = 1 - Math.pow(1 - progress, 3);
      camera.position.z = 3 - eased * 20;
      camera.position.x = Math.sin(progress * Math.PI * 2) * 0.15;
      camera.position.y = Math.cos(progress * Math.PI * 2) * 0.1;
      camera.lookAt(0, 0, -30);
    }

    if (p === "arrival") {
      const progress = Math.min((e - 1800) / 1200, 1);
      const eased = 1 - Math.pow(1 - progress, 2);
      camera.position.z = -17 + eased * 3;
      camera.position.x = (1 - eased) * 0.1;
      camera.position.y = (1 - eased) * 0.05;
      camera.lookAt(0, 0, -20);
    }
  });

  return (
    <group visible={phase !== "idle"}>
      {tunnelRings.map((ring, i) => (
        <TunnelRingMesh key={i} ring={ring} phase={phase} totalElapsed={totalElapsed} />
      ))}
      <StreakingFragments phase={phase} totalElapsed={totalElapsed} />
      {phase !== "idle" && phase !== "arrival" && (
        <TypographyStreaks phase={phase} totalElapsed={totalElapsed} />
      )}
      <ArrivalVoid visible={phase === "arrival"} />
    </group>
  );
}
