"use client";

import { Suspense, useRef, useMemo, useEffect, useState, useCallback } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import ContradictoryNode from "./ContradictoryNode";
import DuplicatedIdentity from "./DuplicatedIdentity";
import { useLogicEngine } from "@/systems/logic/logicEngine";
import type { ContradictoryNodeConfig } from "./ContradictoryNode";
import { Text } from "@react-three/drei";
import { useInterfaceLabel } from "@/systems/logic/interfaceContradiction";
import { useDimensionStore } from "@/systems/progression/dimensionStore";
import { useAnomalyEngine } from "@/systems/procedural/anomalyEngine";
import { useAnomalySpawner, DIMENSION_PROFILES } from "@/systems/procedural/anomalySpawner";
import AnomalyRenderer from "@/systems/procedural/anomalyRenderer";

/* ── Pointer tracking ───────────────────────────────────── */

const rawPointer = { x: 0, y: 0 };

if (typeof window !== "undefined") {
  window.addEventListener("pointermove", (e: PointerEvent) => {
    rawPointer.x = (e.clientX / window.innerWidth) * 2 - 1;
    rawPointer.y = -(e.clientY / window.innerHeight) * 2 + 1;
  });
}

/* ── Contradictory node configurations ──────────────────── */

const NODE_CONFIGS: ContradictoryNodeConfig[] = [
  // Center cluster
  {
    position: [0, 0.5, -1],
    type: "torus-knot",
    scale: 0.7,
    label: "ENTER",
    realAction: "loop",
    driftSpeed: 0.08,
    driftAmp: 0.04,
    rotSpeed: [0.002, 0.004, 0.001],
    baseOpacity: 0.1,
    reactOpacity: 0.22,
  },
  {
    position: [-1.5, -0.3, -0.8],
    type: "wireframe-dodeca",
    scale: 0.5,
    label: "CLOSE",
    realAction: "deeper",
    driftSpeed: 0.06,
    driftAmp: 0.06,
    rotSpeed: [0.003, -0.002, 0.002],
    baseOpacity: 0.08,
    reactOpacity: 0.18,
  },
  {
    position: [1.8, 0.9, -1.5],
    type: "void-cube",
    scale: 0.55,
    label: "BACK",
    realAction: "advance",
    driftSpeed: 0.1,
    driftAmp: 0.05,
    rotSpeed: [-0.001, 0.005, 0.001],
    baseOpacity: 0.09,
    reactOpacity: 0.2,
  },
  // Mid field
  {
    position: [-3, 1.8, -2.5],
    type: "intersecting-rings",
    scale: 0.65,
    label: "CONFIRM",
    realAction: "void",
    driftSpeed: 0.05,
    driftAmp: 0.08,
    rotSpeed: [0.001, 0.002, 0.003],
    baseOpacity: 0.06,
    reactOpacity: 0.14,
  },
  {
    position: [3.2, -1.2, -2],
    type: "helix-segment",
    scale: 0.55,
    label: "ASCEND",
    realAction: "descend",
    driftSpeed: 0.07,
    driftAmp: 0.07,
    rotSpeed: [0.002, -0.003, -0.001],
    baseOpacity: 0.07,
    reactOpacity: 0.16,
  },
  // Far field
  {
    position: [-2, -2.5, -4],
    type: "torus-knot",
    scale: 0.35,
    label: "OPEN",
    realAction: "seal",
    driftSpeed: 0.04,
    driftAmp: 0.1,
    rotSpeed: [0.001, 0.001, 0.002],
    baseOpacity: 0.04,
    reactOpacity: 0.1,
  },
  {
    position: [2.5, 2.5, -3.5],
    type: "wireframe-dodeca",
    scale: 0.3,
    label: "EXIT",
    realAction: "remain",
    driftSpeed: 0.035,
    driftAmp: 0.09,
    rotSpeed: [-0.001, 0.002, 0.001],
    baseOpacity: 0.045,
    reactOpacity: 0.11,
  },
];

/* ── Camera rig ─────────────────────────────────────────── */

function LogicCameraRig() {
  const { camera } = useThree();
  const target = useRef(new THREE.Vector3(0, 0, 6));

  useFrame(() => {
    target.current.x = rawPointer.x * 0.25;
    target.current.y = rawPointer.y * 0.18;
    target.current.z = 6;
    camera.position.lerp(target.current, 0.025);
    camera.lookAt(0, 0, -1);
  });

  return null;
}

/* ── Logic engine tick ──────────────────────────────────── */

function LogicTick() {
  const tick = useLogicEngine((s) => s.tick);
  const anomalyTick = useAnomalyEngine((s) => s.tick);
  useFrame(() => {
    tick();
    anomalyTick();
  });
  return null;
}

/* ── Anomaly layer ──────────────────────────────────────── */

function AnomalyLayer() {
  const anomalies = useAnomalySpawner(DIMENSION_PROFILES.logic);
  return (
    <>
      {anomalies.map((anomaly) => (
        <AnomalyRenderer key={anomaly.id} anomaly={anomaly} />
      ))}
    </>
  );
}

/* ── Contradictory particles ────────────────────────────── */

const PARTICLE_COUNT = 250;

function LogicParticles() {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const data = useMemo(() => {
    const pos = new Float32Array(PARTICLE_COUNT * 3);
    const spd = new Float32Array(PARTICLE_COUNT);
    const off = new Float32Array(PARTICLE_COUNT);
    const contradictionType = new Float32Array(PARTICLE_COUNT); // 0=normal, 1=reverse, 2=stutter

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 25;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 18;
      pos[i * 3 + 2] = -Math.random() * 18;
      spd[i] = 0.02 + Math.random() * 0.12;
      off[i] = Math.random() * Math.PI * 2;
      contradictionType[i] = Math.random();
    }
    return { pos, spd, off, contradictionType };
  }, []);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime();

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const bx = data.pos[i * 3];
      const by = data.pos[i * 3 + 1];
      const bz = data.pos[i * 3 + 2];

      let dx: number, dy: number;

      if (data.contradictionType[i] > 0.7) {
        // Reverse — moves opposite to expected
        dx = -Math.sin(t * data.spd[i] + data.off[i]) * 0.5;
        dy = -Math.cos(t * data.spd[i] * 0.6 + data.off[i]) * 0.4;
      } else if (data.contradictionType[i] > 0.4) {
        // Stutter — freezes intermittently
        const stutter = Math.sin(t * 0.5 + data.off[i]) > 0.3 ? 1 : 0;
        dx = Math.sin(t * data.spd[i] + data.off[i]) * 0.3 * stutter;
        dy = Math.cos(t * data.spd[i] * 0.6 + data.off[i]) * 0.2 * stutter;
      } else {
        // Normal drift
        dx = Math.sin(t * data.spd[i] + data.off[i]) * 0.3;
        dy = Math.cos(t * data.spd[i] * 0.6 + data.off[i]) * 0.2;
      }

      dummy.position.set(bx + dx, by + dy, bz);
      const s = 0.005 + Math.sin(t * 0.2 + data.off[i]) * 0.002;
      dummy.scale.setScalar(s);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, PARTICLE_COUNT]}>
      <sphereGeometry args={[1, 4, 4]} />
      <meshBasicMaterial color="#ffffff" transparent opacity={0.1} />
    </instancedMesh>
  );
}

/* ── Fog layers ─────────────────────────────────────────── */

function LogicFog() {
  const layers = useMemo(
    () =>
      Array.from({ length: 4 }, (_, i) => ({
        z: -3 - i * 5,
        opacity: 0.01 + i * 0.005,
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

/* ── Logic typography — contradicted labels ─────────────── */

function LogicTypography() {
  const fragments = useMemo(
    () => [
      { text: "D.05", position: [0, 2.2, -1] as [number, number, number], size: 0.18, opacity: 0.3 },
      { text: "LOGICAL FAILURE", position: [0, -1.8, -1] as [number, number, number], size: 0.08, opacity: 0.18 },
      { text: "causality:invalid", position: [-4, 2, -3] as [number, number, number], size: 0.06, opacity: 0.07 },
      { text: "identity:unstable", position: [3.5, -2, -2.5] as [number, number, number], size: 0.06, opacity: 0.07 },
      { text: "logic.containment:failed", position: [-2.5, -3, -4] as [number, number, number], size: 0.055, opacity: 0.05 },
      { text: "interface.contract:void", position: [4, 1.5, -5] as [number, number, number], size: 0.055, opacity: 0.05 },
    ],
    [],
  );

  return (
    <group>
      {fragments.map((f, i) => (
        <LogicTextFragment key={i} {...f} />
      ))}
    </group>
  );
}

function LogicTextFragment({
  text,
  position,
  size,
  opacity,
}: {
  text: string;
  position: [number, number, number];
  size: number;
  opacity: number;
}) {
  const ref = useRef<THREE.Mesh>(null);
  const matRef = useRef<THREE.MeshBasicMaterial>(null);
  const phaseRef = useRef(Math.random() * Math.PI * 2);

  // Refs for useFrame
  const opacityRef = useRef(opacity);
  const positionRef = useRef(position);
  opacityRef.current = opacity;
  positionRef.current = position;

  useFrame(({ clock }) => {
    if (!ref.current || !matRef.current) return;
    const t = clock.getElapsedTime();
    const pos = positionRef.current;
    const phase = phaseRef.current;

    ref.current.position.x = pos[0] + Math.sin(t * 0.03 + phase) * 0.02;
    ref.current.position.y = pos[1] + Math.cos(t * 0.025 + phase) * 0.015;

    matRef.current.opacity = opacityRef.current;
  });

  return (
    <Text
      ref={ref}
      position={position}
      fontSize={size}
      color="#ffffff"
      anchorX="center"
      anchorY="middle"
    >
      {text}
      <meshBasicMaterial ref={matRef} color="#ffffff" transparent opacity={opacity} />
    </Text>
  );
}

/* ── Logic exit portal — click to advance to D.06 ───────── */

function LogicExitPortal() {
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
    setTimeout(() => jumpDimension(6), 1500);
  }, [jumpDimension]);

  useFrame(({ clock }) => {
    if (!groupRef.current || !matRef.current) return;
    const t = clock.getElapsedTime();
    const h = hoveredRef.current;
    const trg = triggeredRef.current;

    const breathe = Math.sin(t * 0.8) * 0.012;
    const stutter = Math.random() < 0.005 ? (Math.random() - 0.5) * 0.04 : 0;
    groupRef.current.scale.setScalar(1 + breathe + stutter);
    groupRef.current.rotation.z += 0.002;

    if (trg) {
      matRef.current.opacity = 0.3 + Math.sin(t * 6) * 0.15;
      groupRef.current.scale.setScalar(1 + breathe + Math.sin(t * 4) * 0.1);
    } else {
      matRef.current.opacity = (h ? 0.12 : 0.05) + breathe * 0.3;
    }

    if (ringRef.current) {
      const ringMat = ringRef.current.material as THREE.MeshBasicMaterial;
      ringMat.opacity = trg ? 0.25 : (h ? 0.08 : 0.025);
      ringRef.current.rotation.z -= 0.004;
    }
  });

  return (
    <group ref={groupRef} position={[0, -3, -1.5]}>
      <mesh
        onClick={handleClick}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
      >
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.06, 12, 12]} />
        <meshBasicMaterial color="#000000" />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.08, 10, 10]} />
        <meshBasicMaterial
          ref={matRef}
          color="#ffffff"
          transparent
          opacity={0.05}
          wireframe
        />
      </mesh>
      <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.15, 0.003, 6, 48]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.025} />
      </mesh>
    </group>
  );
}

/* ── Scene content ──────────────────────────────────────── */

function SceneContent() {
  return (
    <>
      <color attach="background" args={["#000000"]} />
      <fog attach="fog" args={["#000000", 5, 20]} />

      <LogicTick />
      <LogicCameraRig />

      {/* Contradictory nodes — click does unexpected things */}
      {NODE_CONFIGS.map((config, i) => (
        <ContradictoryNode key={`node-${i}`} config={config} />
      ))}

      {/* Duplicated identities — same object in two places */}
      <DuplicatedIdentity
        config={{
          position: [0.5, 1.5, -2],
          duplicateOffset: [-1.8, -0.5, -0.3],
          type: "torus",
          scale: 0.5,
          baseOpacity: 0.1,
          driftSpeed: 0.07,
          driftAmp: 0.05,
        }}
      />
      <DuplicatedIdentity
        config={{
          position: [-2, -1, -3],
          duplicateOffset: [2.2, 0.8, -0.5],
          type: "icosahedron",
          scale: 0.4,
          baseOpacity: 0.08,
          driftSpeed: 0.05,
          driftAmp: 0.07,
        }}
      />

      <LogicTypography />
      <LogicParticles />
      <LogicFog />
      <LogicExitPortal />
      <AnomalyLayer />

      <ambientLight intensity={0.012} color="#ffffff" />
    </>
  );
}

/* ── HUD ────────────────────────────────────────────────── */

function LogicHUD() {
  const { displayLabel: statusLabel } = useInterfaceLabel("CONFIRM", {
    swapInterval: [3000, 8000],
    contradictionProbability: 0.4,
    burstDuration: 1500,
  });

  const { displayLabel: observerLabel } = useInterfaceLabel("ASCEND", {
    swapInterval: [5000, 12000],
    contradictionProbability: 0.3,
    burstDuration: 2000,
  });

  return (
    <div className="pointer-events-none absolute inset-0 z-10 flex flex-col justify-between p-8">
      <div className="flex justify-between">
        <p className="font-mono text-[10px] tracking-[0.5em] text-zinc-800">
          D.05
        </p>
        <p className="font-mono text-[10px] tracking-[0.3em] text-zinc-800">
          {statusLabel === "CONFIRM" ? "LOGICAL FAILURE" : `LOGICAL ${statusLabel}`}
        </p>
      </div>
      <div className="flex justify-between">
        <p className="font-mono text-[9px] tracking-[0.3em] text-zinc-900">
          causality: {observerLabel === "ASCEND" ? "compromised" : observerLabel.toLowerCase()}
        </p>
        <p className="font-mono text-[9px] tracking-[0.3em] text-zinc-900">
          identity: unstable
        </p>
      </div>
    </div>
  );
}

/* ── Logic Chamber ──────────────────────────────────────── */

export default function LogicChamber() {
  const activate = useLogicEngine((s) => s.activate);
  const deactivate = useLogicEngine((s) => s.deactivate);
  const setLevel = useLogicEngine((s) => s.setContradictionLevel);
  const activateAnomalies = useAnomalyEngine((s) => s.activate);
  const deactivateAnomalies = useAnomalyEngine((s) => s.deactivate);

  useEffect(() => {
    setLevel(0.7);
    activate();
    activateAnomalies();
    return () => {
      deactivate();
      deactivateAnomalies();
    };
  }, [activate, deactivate, setLevel, activateAnomalies, deactivateAnomalies]);

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
      <LogicHUD />
    </div>
  );
}
