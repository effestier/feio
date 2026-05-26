"use client";

import { Suspense, useRef, useMemo, useEffect, useState, useCallback } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import ObserverNode from "./ObserverNode";
import ObserverTypography from "./ObserverTypography";
import { useAwarenessEngine } from "@/systems/awareness/awarenessEngine";
import { useBehaviorTracker } from "@/systems/awareness/behaviorTracker";
import { useObserverResponse } from "@/systems/awareness/observerResponse";
import { useObserverText } from "@/systems/awareness/observerTypography";
import { useDimensionStore } from "@/systems/progression/dimensionStore";
import { useAnomalyEngine } from "@/systems/procedural/anomalyEngine";
import { useAnomalySpawner, DIMENSION_PROFILES } from "@/systems/procedural/anomalySpawner";
import AnomalyRenderer from "@/systems/procedural/anomalyRenderer";
import type { ObserverNodeConfig } from "./ObserverNode";

/* ── Pointer tracking ───────────────────────────────────── */

const rawPointer = { x: 0, y: 0 };

if (typeof window !== "undefined") {
  window.addEventListener("pointermove", (e: PointerEvent) => {
    rawPointer.x = (e.clientX / window.innerWidth) * 2 - 1;
    rawPointer.y = -(e.clientY / window.innerHeight) * 2 + 1;
  });
}

/* ── Observer node configurations — fewer, calmer ───────── */

const NODE_CONFIGS: ObserverNodeConfig[] = [
  {
    position: [0, 0.8, -1.5],
    type: "icosahedron",
    scale: 0.6,
    baseOpacity: 0.08,
    driftSpeed: 0.04,
    driftAmp: 0.03,
    rotSpeed: [0.001, 0.002, 0.001],
  },
  {
    position: [-2, -0.5, -2],
    type: "torus",
    scale: 0.5,
    baseOpacity: 0.06,
    driftSpeed: 0.03,
    driftAmp: 0.04,
    rotSpeed: [0.001, 0.001, 0.002],
  },
  {
    position: [2.5, 1, -2.5],
    type: "sphere",
    scale: 0.4,
    baseOpacity: 0.05,
    driftSpeed: 0.025,
    driftAmp: 0.05,
    rotSpeed: [0.001, 0.002, 0.001],
  },
  {
    position: [-1.5, 2, -3],
    type: "octahedron",
    scale: 0.35,
    baseOpacity: 0.045,
    driftSpeed: 0.035,
    driftAmp: 0.035,
    rotSpeed: [0.002, 0.001, 0.001],
  },
  {
    position: [1.5, -1.8, -3.5],
    type: "torus-knot",
    scale: 0.3,
    baseOpacity: 0.04,
    driftSpeed: 0.02,
    driftAmp: 0.06,
    rotSpeed: [0.001, 0.001, 0.002],
  },
];

/* ── Awareness tick ─────────────────────────────────────── */

function AwarenessTick() {
  const tick = useAwarenessEngine((s) => s.tick);
  const anomalyTick = useAnomalyEngine((s) => s.tick);
  useFrame(() => {
    tick();
    anomalyTick();
  });
  return null;
}

/* ── Anomaly layer ──────────────────────────────────────── */

function AnomalyLayer() {
  const anomalies = useAnomalySpawner(DIMENSION_PROFILES.observer);
  return (
    <>
      {anomalies.map((anomaly) => (
        <AnomalyRenderer key={anomaly.id} anomaly={anomaly} />
      ))}
    </>
  );
}

/* ── Camera rig — gentle parallax ───────────────────────── */

function ObserverCameraRig() {
  const { camera } = useThree();
  const target = useRef(new THREE.Vector3(0, 0, 6));

  useFrame(() => {
    target.current.x = rawPointer.x * 0.2;
    target.current.y = rawPointer.y * 0.15;
    target.current.z = 6;
    camera.position.lerp(target.current, 0.02);
    camera.lookAt(0, 0, -1);
  });

  return null;
}

/* ── Observer particles — respond to pointer velocity ───── */

const PARTICLE_COUNT = 400;

function ObserverParticles() {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const velocityRef = useRef(0);
  const driftRef = useRef(1);

  // Subscribe to metrics for particle behavior
  useEffect(() => {
    const unsub = useAwarenessEngine.subscribe((s) => {
      velocityRef.current = s.metrics.pointerVelocity;
      driftRef.current = 0.5 + s.metrics.pointerVelocity * 0.8;
    });
    return unsub;
  }, []);

  const data = useMemo(() => {
    const pos = new Float32Array(PARTICLE_COUNT * 3);
    const spd = new Float32Array(PARTICLE_COUNT);
    const off = new Float32Array(PARTICLE_COUNT);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 30;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 2] = -Math.random() * 20;
      spd[i] = 0.02 + Math.random() * 0.08;
      off[i] = Math.random() * Math.PI * 2;
    }
    return { pos, spd, off };
  }, []);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime();
    const drift = driftRef.current;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const bx = data.pos[i * 3];
      const by = data.pos[i * 3 + 1];
      const bz = data.pos[i * 3 + 2];

      dummy.position.set(
        bx + Math.sin(t * data.spd[i] * drift + data.off[i]) * 0.4,
        by + Math.cos(t * data.spd[i] * 0.6 * drift + data.off[i]) * 0.3,
        bz + Math.sin(t * data.spd[i] * 0.3 + data.off[i] * 2) * 0.15,
      );

      const s = 0.005 + Math.sin(t * 0.15 + data.off[i]) * 0.002;
      dummy.scale.setScalar(s);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, PARTICLE_COUNT]}>
      <sphereGeometry args={[1, 4, 4]} />
      <meshBasicMaterial color="#ffffff" transparent opacity={0.08} />
    </instancedMesh>
  );
}

/* ── Fog layers ─────────────────────────────────────────── */

function ObserverFog() {
  const layers = useMemo(
    () =>
      Array.from({ length: 3 }, (_, i) => ({
        z: -4 - i * 6,
        opacity: 0.008 + i * 0.004,
        scale: 10 + i * 10,
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

/* ── Scene content ──────────────────────────────────────── */

function SceneContent() {
  const attentionLevel = useAwarenessEngine((s) => s.attentionLevel);
  const metrics = useAwarenessEngine((s) => s.metrics);
  const { ambientIntensityRef, pulseRateRef } = useObserverResponse();

  // Mirror for useFrame
  const attentionRef = useRef(attentionLevel);
  attentionRef.current = attentionLevel;

  // Observer nodes need pulseRate and ambientIntensity — read from engine
  const pulseRate = useAwarenessEngine.getState().metrics.clickFrequency * 0.12 + 0.3;

  return (
    <>
      <color attach="background" args={["#000000"]} />
      <fog attach="fog" args={["#000000", 6, 25]} />

      <AwarenessTick />
      <ObserverCameraRig />

      {NODE_CONFIGS.map((config, i) => (
        <ObserverNode
          key={i}
          config={config}
          pulseRate={pulseRate}
          ambientIntensity={ambientIntensityRef.current}
          attentionLevel={attentionLevel}
        />
      ))}

      <ObserverTypography />
      <ObserverParticles />
      <ObserverFog />
      <AnomalyLayer />
      <ObserverExitPortal />

      <ambientLight intensity={0.012} color="#ffffff" />
    </>
  );
}

/* ── HUD ────────────────────────────────────────────────── */

function ObserverHUD() {
  const { observerState, pointerState, interactionState, attentionState } =
    useObserverText();

  return (
    <div className="pointer-events-none absolute inset-0 z-10 flex flex-col justify-between p-8">
      <div className="flex justify-between">
        <p className="font-mono text-[10px] tracking-[0.5em] text-zinc-800">
          D.06
        </p>
        <p className="font-mono text-[10px] tracking-[0.3em] text-zinc-800">
          OBSERVER AWARENESS
        </p>
      </div>
      <div className="flex justify-between">
        <p className="font-mono text-[9px] tracking-[0.3em] text-zinc-900">
          observer: {observerState}
        </p>
        <p className="font-mono text-[9px] tracking-[0.3em] text-zinc-900">
          attention: {attentionState}
        </p>
      </div>
    </div>
  );
}

/* ── Observer exit portal — click to advance to D.07 ────── */

function ObserverExitPortal() {
  const groupRef = useRef<THREE.Group>(null);
  const matRef = useRef<THREE.MeshBasicMaterial>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const jumpDimension = useDimensionStore((s) => s.jumpDimension);
  const [hovered, setHovered] = useState(false);
  const hoveredRef = useRef(false);
  hoveredRef.current = hovered;
  const triggeredRef = useRef(false);

  const handleClick = useCallback(() => {
    if (triggeredRef.current) return;
    triggeredRef.current = true;
    setTimeout(() => jumpDimension(7), 1500);
  }, [jumpDimension]);

  useFrame(({ clock }) => {
    if (!groupRef.current || !matRef.current) return;
    const t = clock.getElapsedTime();
    const h = hoveredRef.current;
    const trg = triggeredRef.current;

    const breathe = Math.sin(t * 0.6) * 0.01;
    groupRef.current.scale.setScalar(1 + breathe);
    groupRef.current.rotation.z += 0.002;

    if (trg) {
      matRef.current.opacity = 0.35 + Math.sin(t * 5) * 0.15;
      groupRef.current.scale.setScalar(1 + breathe + Math.sin(t * 4) * 0.1);
    } else {
      matRef.current.opacity = (h ? 0.12 : 0.05) + breathe * 0.3;
    }

    if (ringRef.current) {
      const rm = ringRef.current.material as THREE.MeshBasicMaterial;
      rm.opacity = trg ? 0.25 : (h ? 0.08 : 0.02);
      ringRef.current.rotation.z -= 0.003;
    }
  });

  return (
    <group ref={groupRef} position={[0, -3, -1.5]}>
      <mesh onClick={handleClick} onPointerEnter={() => setHovered(true)} onPointerLeave={() => setHovered(false)}>
        <sphereGeometry args={[0.18, 16, 16]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.05, 12, 12]} />
        <meshBasicMaterial color="#000000" />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.07, 10, 10]} />
        <meshBasicMaterial ref={matRef} color="#ffffff" transparent opacity={0.05} wireframe />
      </mesh>
      <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.13, 0.003, 6, 48]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.02} />
      </mesh>
    </group>
  );
}

/* ── Observer Chamber ───────────────────────────────────── */

export default function ObserverChamber() {
  const activate = useAwarenessEngine((s) => s.activate);
  const deactivate = useAwarenessEngine((s) => s.deactivate);

  // Attach behavior tracker
  useBehaviorTracker();

  useEffect(() => {
    activate();
    return () => deactivate();
  }, [activate, deactivate]);

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
      <ObserverHUD />
    </div>
  );
}
