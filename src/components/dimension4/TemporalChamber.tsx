"use client";

import { Suspense, useRef, useMemo, useEffect, useState, useCallback } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import TemporalObject from "./TemporalObject";
import TemporalTypography from "./TemporalTypography";
import { useTemporalEngine } from "@/systems/temporal/temporalEngine";
import { useTemporalCursor } from "@/systems/temporal/temporalCursor";
import { useDelayedReaction } from "@/systems/temporal/delayedReaction";
import { useDimensionStore } from "@/systems/progression/dimensionStore";
import { useAnomalyEngine } from "@/systems/procedural/anomalyEngine";
import { useAnomalySpawner, DIMENSION_PROFILES } from "@/systems/procedural/anomalySpawner";
import AnomalyRenderer from "@/systems/procedural/anomalyRenderer";

/* ── Temporal object configurations — expanded to 17 ────── */

const TEMPORAL_OBJECTS = [
  // Center cluster
  {
    position: [0, 0.3, -1] as [number, number, number],
    type: "torus-segment" as const,
    scale: 0.9,
    driftSpeed: 0.12,
    driftAmp: 0.06,
    rotSpeed: [0.003, 0.005, 0.001] as [number, number, number],
    reversedMotion: true,
    baseOpacity: 0.12,
    hoverOpacity: 0.25,
  },
  {
    position: [-1.2, -0.5, -0.5] as [number, number, number],
    type: "wireframe-icosa" as const,
    scale: 0.6,
    driftSpeed: 0.08,
    driftAmp: 0.08,
    rotSpeed: [0.004, -0.002, 0.003] as [number, number, number],
    reversedMotion: false,
    baseOpacity: 0.08,
    hoverOpacity: 0.18,
  },
  {
    position: [1.5, 0.8, -1.5] as [number, number, number],
    type: "broken-ring" as const,
    scale: 0.7,
    driftSpeed: 0.1,
    driftAmp: 0.05,
    rotSpeed: [-0.002, 0.004, 0.002] as [number, number, number],
    reversedMotion: true,
    baseOpacity: 0.1,
    hoverOpacity: 0.22,
  },
  // Mid field — original
  {
    position: [-3, 1.5, -3] as [number, number, number],
    type: "plane-cross" as const,
    scale: 0.8,
    driftSpeed: 0.06,
    driftAmp: 0.1,
    rotSpeed: [0.001, 0.003, -0.001] as [number, number, number],
    reversedMotion: false,
    baseOpacity: 0.06,
    hoverOpacity: 0.14,
  },
  {
    position: [3.5, -1, -2.5] as [number, number, number],
    type: "void-sphere" as const,
    scale: 0.5,
    driftSpeed: 0.09,
    driftAmp: 0.07,
    rotSpeed: [0.002, -0.003, 0.001] as [number, number, number],
    reversedMotion: true,
    baseOpacity: 0.1,
    hoverOpacity: 0.2,
  },
  {
    position: [-2, -2.5, -5] as [number, number, number],
    type: "torus-segment" as const,
    scale: 0.4,
    driftSpeed: 0.05,
    driftAmp: 0.12,
    rotSpeed: [0.001, 0.002, 0.001] as [number, number, number],
    reversedMotion: false,
    baseOpacity: 0.04,
    hoverOpacity: 0.1,
  },
  {
    position: [2.5, 2.5, -4] as [number, number, number],
    type: "wireframe-icosa" as const,
    scale: 0.35,
    driftSpeed: 0.04,
    driftAmp: 0.09,
    rotSpeed: [-0.001, 0.001, 0.002] as [number, number, number],
    reversedMotion: true,
    baseOpacity: 0.05,
    hoverOpacity: 0.12,
  },
  // NEW — expanded mid-field
  {
    position: [-4.5, -0.8, -2] as [number, number, number],
    type: "torus-segment" as const,
    scale: 0.45,
    driftSpeed: 0.07,
    driftAmp: 0.06,
    rotSpeed: [0.002, 0.001, 0.003] as [number, number, number],
    reversedMotion: true,
    baseOpacity: 0.06,
    hoverOpacity: 0.14,
  },
  {
    position: [4.5, 1.2, -1.8] as [number, number, number],
    type: "broken-ring" as const,
    scale: 0.55,
    driftSpeed: 0.09,
    driftAmp: 0.04,
    rotSpeed: [-0.001, 0.003, -0.001] as [number, number, number],
    reversedMotion: false,
    baseOpacity: 0.07,
    hoverOpacity: 0.16,
  },
  {
    position: [0, -1.8, -2.5] as [number, number, number],
    type: "wireframe-icosa" as const,
    scale: 0.5,
    driftSpeed: 0.05,
    driftAmp: 0.08,
    rotSpeed: [0.002, -0.001, 0.002] as [number, number, number],
    reversedMotion: true,
    baseOpacity: 0.07,
    hoverOpacity: 0.15,
  },
  // NEW — far field
  {
    position: [-5.5, 2.5, -4.5] as [number, number, number],
    type: "void-sphere" as const,
    scale: 0.3,
    driftSpeed: 0.03,
    driftAmp: 0.14,
    rotSpeed: [0.001, 0.002, 0.001] as [number, number, number],
    reversedMotion: false,
    baseOpacity: 0.035,
    hoverOpacity: 0.08,
  },
  {
    position: [5.5, -2, -5] as [number, number, number],
    type: "torus-segment" as const,
    scale: 0.25,
    driftSpeed: 0.04,
    driftAmp: 0.11,
    rotSpeed: [0.001, -0.002, 0.001] as [number, number, number],
    reversedMotion: true,
    baseOpacity: 0.03,
    hoverOpacity: 0.07,
  },
  {
    position: [-1.5, 3, -3.5] as [number, number, number],
    type: "plane-cross" as const,
    scale: 0.4,
    driftSpeed: 0.035,
    driftAmp: 0.07,
    rotSpeed: [0.002, 0.001, -0.002] as [number, number, number],
    reversedMotion: true,
    baseOpacity: 0.04,
    hoverOpacity: 0.09,
  },
  {
    position: [3, -2.8, -3.5] as [number, number, number],
    type: "broken-ring" as const,
    scale: 0.35,
    driftSpeed: 0.06,
    driftAmp: 0.09,
    rotSpeed: [-0.001, 0.002, 0.001] as [number, number, number],
    reversedMotion: false,
    baseOpacity: 0.04,
    hoverOpacity: 0.09,
  },
  // NEW — deep field
  {
    position: [0, 0.5, -6] as [number, number, number],
    type: "wireframe-icosa" as const,
    scale: 0.4,
    driftSpeed: 0.025,
    driftAmp: 0.15,
    rotSpeed: [0.001, 0.001, 0.002] as [number, number, number],
    reversedMotion: true,
    baseOpacity: 0.025,
    hoverOpacity: 0.06,
  },
  {
    position: [-3.5, -1.5, -7] as [number, number, number],
    type: "void-sphere" as const,
    scale: 0.2,
    driftSpeed: 0.02,
    driftAmp: 0.18,
    rotSpeed: [0.001, 0.001, 0.001] as [number, number, number],
    reversedMotion: false,
    baseOpacity: 0.02,
    hoverOpacity: 0.05,
  },
  {
    position: [4, 1.8, -6.5] as [number, number, number],
    type: "torus-segment" as const,
    scale: 0.22,
    driftSpeed: 0.03,
    driftAmp: 0.13,
    rotSpeed: [0.001, -0.001, 0.002] as [number, number, number],
    reversedMotion: true,
    baseOpacity: 0.02,
    hoverOpacity: 0.05,
  },
];

/* ── Camera rig with temporal desync ────────────────────── */

function TemporalCameraRig() {
  const { camera } = useThree();
  const target = useRef(new THREE.Vector3(0, 0, 6));
  const { desyncedRef } = useTemporalCursor();

  useFrame(() => {
    const dp = desyncedRef.current;
    const nx = (dp.x / window.innerWidth) * 2 - 1;
    const ny = -(dp.y / window.innerHeight) * 2 + 1;

    target.current.x = nx * 0.3;
    target.current.y = ny * 0.2;
    target.current.z = 6;

    camera.position.lerp(target.current, 0.03);
    camera.lookAt(0, 0, -1);
  });

  return null;
}

/* ── Temporal particles ─────────────────────────────────── */

const TEMPORAL_PARTICLE_COUNT = 300;

function TemporalParticles() {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const data = useMemo(() => {
    const pos = new Float32Array(TEMPORAL_PARTICLE_COUNT * 3);
    const spd = new Float32Array(TEMPORAL_PARTICLE_COUNT);
    const off = new Float32Array(TEMPORAL_PARTICLE_COUNT);
    const reverseChance = new Float32Array(TEMPORAL_PARTICLE_COUNT);

    for (let i = 0; i < TEMPORAL_PARTICLE_COUNT; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 30;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 2] = -Math.random() * 20;
      spd[i] = 0.03 + Math.random() * 0.15;
      off[i] = Math.random() * Math.PI * 2;
      reverseChance[i] = Math.random();
    }
    return { pos, spd, off, reverseChance };
  }, []);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime();

    for (let i = 0; i < TEMPORAL_PARTICLE_COUNT; i++) {
      const bx = data.pos[i * 3];
      const by = data.pos[i * 3 + 1];
      const bz = data.pos[i * 3 + 2];

      const reverse = data.reverseChance[i] > 0.7
        ? Math.sin(t * 0.3 + data.off[i]) > 0.5 ? -1 : 1
        : 1;

      dummy.position.set(
        bx + Math.sin(t * data.spd[i] * reverse + data.off[i]) * 0.4,
        by + Math.cos(t * data.spd[i] * 0.6 * reverse + data.off[i]) * 0.3,
        bz + Math.sin(t * data.spd[i] * 0.4 + data.off[i] * 2) * 0.2,
      );

      if (Math.random() < 0.001) {
        dummy.position.x += (Math.random() - 0.5) * 0.5;
        dummy.position.y += (Math.random() - 0.5) * 0.5;
      }

      const s = 0.006 + Math.sin(t * 0.3 + data.off[i]) * 0.003;
      dummy.scale.setScalar(s);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, TEMPORAL_PARTICLE_COUNT]}>
      <sphereGeometry args={[1, 4, 4]} />
      <meshBasicMaterial color="#ffffff" transparent opacity={0.12} />
    </instancedMesh>
  );
}

/* ── Fog layers ─────────────────────────────────────────── */

function TemporalFog() {
  const layers = useMemo(
    () =>
      Array.from({ length: 4 }, (_, i) => ({
        z: -3 - i * 5,
        opacity: 0.012 + i * 0.006,
        scale: 8 + i * 8,
      })),
    [],
  );

  return (
    <group>
      {layers.map((layer, i) => (
        <mesh key={i} position={[0, 0, layer.z]}>
          <planeGeometry args={[layer.scale, layer.scale]} />
          <meshBasicMaterial
            color="#000000"
            transparent
            opacity={layer.opacity}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
}

/* ── Dual engine tick ───────────────────────────────────── */

function DualTick() {
  const temporalTick = useTemporalEngine((s) => s.tick);
  const anomalyTick = useAnomalyEngine((s) => s.tick);
  useFrame(() => {
    temporalTick();
    anomalyTick();
  });
  return null;
}

/* ── Anomaly layer ──────────────────────────────────────── */

function AnomalyLayer() {
  const anomalies = useAnomalySpawner(DIMENSION_PROFILES.temporal);

  return (
    <>
      {anomalies.map((anomaly) => (
        <AnomalyRenderer key={anomaly.id} anomaly={anomaly} />
      ))}
    </>
  );
}

/* ── Temporal exit portal ───────────────────────────────── */

function TemporalExitPortal() {
  const groupRef = useRef<THREE.Group>(null);
  const matRef = useRef<THREE.MeshBasicMaterial>(null);
  const jumpDimension = useDimensionStore((s) => s.jumpDimension);
  const [hovering, setHovering] = useState(false);

  const {
    isReactingRef,
    clickFiredRef,
    onHoverStart,
    onHoverEnd,
    onClick,
  } = useDelayedReaction({
    hoverDelay: 300,
    leaveDelay: 500,
    clickDelay: 900,
    jitterRange: 300,
  });

  const hoveringRef = useRef(hovering);
  hoveringRef.current = hovering;

  const reactRef = useRef(false);
  const clickRef = useRef(false);

  useFrame(({ clock }) => {
    if (!groupRef.current || !matRef.current) return;
    const t = clock.getElapsedTime();
    reactRef.current = isReactingRef.current;
    clickRef.current = clickFiredRef.current;

    const breathe = Math.sin(t * 0.5) * 0.015;
    const base = 0.06;
    let opacity = base + breathe;

    if (hoveringRef.current) opacity += 0.04;
    if (reactRef.current) opacity += 0.08;
    if (clickRef.current) {
      opacity = 0.4;
      groupRef.current.scale.setScalar(1.15);
    } else {
      groupRef.current.scale.setScalar(1 + breathe);
    }

    matRef.current.opacity = opacity;

    groupRef.current.rotation.x = Math.sin(t * 0.15) * 0.05;
    groupRef.current.rotation.y += 0.004;
  });

  const handleClick = useCallback(() => {
    onClick();
    setTimeout(() => jumpDimension(5), 1000);
  }, [onClick, jumpDimension]);

  return (
    <group
      ref={groupRef}
      position={[0, -3.5, -2]}
      onClick={handleClick}
      onPointerEnter={() => { onHoverStart(); setHovering(true); }}
      onPointerLeave={() => { onHoverEnd(); setHovering(false); }}
    >
      <torusGeometry args={[0.4, 0.008, 8, 48]} />
      <meshBasicMaterial
        ref={matRef}
        color="#ffffff"
        transparent
        opacity={0.06}
      />
    </group>
  );
}

/* ── Scene content ──────────────────────────────────────── */

function SceneContent() {
  return (
    <>
      <color attach="background" args={["#000000"]} />
      <fog attach="fog" args={["#000000", 5, 20]} />

      <DualTick />
      <TemporalCameraRig />

      {TEMPORAL_OBJECTS.map((config, i) => (
        <TemporalObject key={i} config={config} />
      ))}

      <AnomalyLayer />
      <TemporalTypography />
      <TemporalParticles />
      <TemporalFog />
      <TemporalExitPortal />

      <ambientLight intensity={0.015} color="#ffffff" />
    </>
  );
}

/* ── HUD ────────────────────────────────────────────────── */

function TemporalHUD() {
  return (
    <div className="pointer-events-none absolute inset-0 z-10 flex flex-col justify-between p-8">
      <div className="flex justify-between">
        <p className="font-mono text-[10px] tracking-[0.5em] text-zinc-800">
          D.04
        </p>
        <p className="font-mono text-[10px] tracking-[0.3em] text-zinc-800">
          TEMPORAL FAILURE
        </p>
      </div>
      <div className="flex justify-between">
        <p className="font-mono text-[9px] tracking-[0.3em] text-zinc-900">
          time integrity: compromised
        </p>
        <p className="font-mono text-[9px] tracking-[0.3em] text-zinc-900">
          causal sequence: invalid
        </p>
      </div>
    </div>
  );
}

/* ── Temporal Chamber ───────────────────────────────────── */

export default function TemporalChamber() {
  const activate = useTemporalEngine((s) => s.activate);
  const deactivate = useTemporalEngine((s) => s.deactivate);
  const setDrift = useTemporalEngine((s) => s.setDrift);
  const activateAnomalies = useAnomalyEngine((s) => s.activate);
  const deactivateAnomalies = useAnomalyEngine((s) => s.deactivate);

  useEffect(() => {
    setDrift(0.6);
    activate();
    activateAnomalies();
    return () => {
      deactivate();
      deactivateAnomalies();
    };
  }, [activate, deactivate, setDrift, activateAnomalies, deactivateAnomalies]);

  return (
    <div className="fixed inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 55, near: 0.1, far: 50 }}
        dpr={[1, 1.5]}
        gl={{
          antialias: true,
          toneMapping: THREE.NoToneMapping,
          outputColorSpace: THREE.SRGBColorSpace,
        }}
      >
        <Suspense fallback={null}>
          <SceneContent />
        </Suspense>
      </Canvas>
      <TemporalHUD />
    </div>
  );
}
