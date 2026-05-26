"use client";

import { Suspense, useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import CollapseNode from "./CollapseNode";
import RecursiveGeometry from "./RecursiveGeometry";
import CollapseTypography from "./CollapseTypography";
import { useCollapseEngine } from "@/systems/collapse/collapseEngine";
import { useInterferenceBleed } from "@/systems/collapse/interferenceBleed";
import { useAutonomousObserver } from "@/systems/collapse/autonomousObserver";
import { useBehaviorTracker } from "@/systems/awareness/behaviorTracker";
import { useAwarenessEngine } from "@/systems/awareness/awarenessEngine";
import { useAnomalyEngine } from "@/systems/procedural/anomalyEngine";
import { useAnomalySpawner, DIMENSION_PROFILES } from "@/systems/procedural/anomalySpawner";
import AnomalyRenderer from "@/systems/procedural/anomalyRenderer";
import type { CollapseNodeConfig } from "./CollapseNode";

/* ── Pointer tracking ───────────────────────────────────── */

const rawPointer = { x: 0, y: 0 };

if (typeof window !== "undefined") {
  window.addEventListener("pointermove", (e: PointerEvent) => {
    rawPointer.x = (e.clientX / window.innerWidth) * 2 - 1;
    rawPointer.y = -(e.clientY / window.innerHeight) * 2 + 1;
  });
}

/* ── Collapse node configurations — echoes of all dimensions */

const NODE_CONFIGS: CollapseNodeConfig[] = [
  // Structure echoes (D2)
  { position: [0, 1.5, -1], type: "broken-ring", scale: 0.6, baseOpacity: 0.08, driftSpeed: 0.06, driftAmp: 0.04, rotSpeed: [0.002, 0.003, 0.001], primarySystem: "fracture" },
  { position: [-2.5, 0.5, -2], type: "torus-knot", scale: 0.45, baseOpacity: 0.06, driftSpeed: 0.05, driftAmp: 0.05, rotSpeed: [0.003, -0.002, 0.002], primarySystem: "fracture" },
  // Temporal echoes (D4)
  { position: [2, -0.5, -1.5], type: "wireframe-icosa", scale: 0.5, baseOpacity: 0.07, driftSpeed: 0.08, driftAmp: 0.06, rotSpeed: [-0.002, 0.004, 0.001], primarySystem: "temporal" },
  { position: [-1, -1.8, -2.5], type: "void-cube", scale: 0.4, baseOpacity: 0.055, driftSpeed: 0.07, driftAmp: 0.07, rotSpeed: [0.001, 0.003, -0.001], primarySystem: "temporal" },
  // Logic echoes (D5)
  { position: [3, 1.5, -3], type: "helix", scale: 0.35, baseOpacity: 0.05, driftSpeed: 0.04, driftAmp: 0.08, rotSpeed: [0.001, 0.002, 0.003], primarySystem: "logic" },
  { position: [-3, -1, -3.5], type: "sphere", scale: 0.3, baseOpacity: 0.045, driftSpeed: 0.035, driftAmp: 0.09, rotSpeed: [0.002, -0.001, 0.001], primarySystem: "logic" },
  // Awareness echoes (D6)
  { position: [1.5, 2.5, -4], type: "wireframe-icosa", scale: 0.25, baseOpacity: 0.04, driftSpeed: 0.03, driftAmp: 0.1, rotSpeed: [0.001, 0.001, 0.002], primarySystem: "awareness" },
  { position: [-2, 2, -4.5], type: "broken-ring", scale: 0.2, baseOpacity: 0.035, driftSpeed: 0.025, driftAmp: 0.11, rotSpeed: [0.001, 0.002, 0.001], primarySystem: "awareness" },
];

/* ── Camera rig — unstable at high collapse ─────────────── */

function CollapseCameraRig() {
  const { camera } = useThree();
  const target = useRef(new THREE.Vector3(0, 0, 6));
  const { collapseRef } = useInterferenceBleed();
  const { predictionRef, initiativeRef } = useAutonomousObserver();

  useFrame(() => {
    const cl = collapseRef.current;
    const initiative = initiativeRef.current;

    // Base parallax (degrades with collapse)
    const parallaxStrength = 1 - cl * 0.4;
    let tx = rawPointer.x * 0.2 * parallaxStrength;
    let ty = rawPointer.y * 0.15 * parallaxStrength;

    // Autonomous camera pull — system pre-empts at high collapse
    if (initiative > 0.1) {
      const pred = predictionRef.current;
      tx += pred.x * initiative * 0.1;
      ty += pred.y * initiative * 0.08;
    }

    // Collapse shake
    if (cl > 0.6) {
      const shake = (cl - 0.6) * 0.15;
      tx += (Math.random() - 0.5) * shake;
      ty += (Math.random() - 0.5) * shake;
    }

    target.current.set(tx, ty, 6);
    camera.position.lerp(target.current, 0.02);
    camera.lookAt(0, 0, -1);
  });

  return null;
}

/* ── Collapse tick ──────────────────────────────────────── */

function CollapseTick() {
  const tick = useCollapseEngine((s) => s.tick);
  const awarenessTick = useAwarenessEngine((s) => s.tick);
  const anomalyTick = useAnomalyEngine((s) => s.tick);
  useFrame(() => {
    tick();
    awarenessTick();
    anomalyTick();
  });
  return null;
}

/* ── Anomaly layer ──────────────────────────────────────── */

function AnomalyLayer() {
  const anomalies = useAnomalySpawner(DIMENSION_PROFILES.collapse);
  return (
    <>
      {anomalies.map((anomaly) => (
        <AnomalyRenderer key={anomaly.id} anomaly={anomaly} />
      ))}
    </>
  );
}

/* ── Multi-system particle field ────────────────────────── */

const PARTICLE_COUNT = 500;

function CollapseParticles() {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const { collapseRef, fractureRef, temporalRef, logicRef } = useInterferenceBleed();

  const data = useMemo(() => {
    const pos = new Float32Array(PARTICLE_COUNT * 3);
    const spd = new Float32Array(PARTICLE_COUNT);
    const off = new Float32Array(PARTICLE_COUNT);
    const sys = new Float32Array(PARTICLE_COUNT); // 0=fracture, 1=temporal, 2=logic

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 35;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 25;
      pos[i * 3 + 2] = -Math.random() * 25;
      spd[i] = 0.02 + Math.random() * 0.1;
      off[i] = Math.random() * Math.PI * 2;
      sys[i] = Math.random();
    }
    return { pos, spd, off, sys };
  }, []);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime();
    const cl = collapseRef.current;
    const fB = fractureRef.current;
    const tB = temporalRef.current;
    const lB = logicRef.current;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const bx = data.pos[i * 3];
      const by = data.pos[i * 3 + 1];
      const bz = data.pos[i * 3 + 2];

      let dx = Math.sin(t * data.spd[i] + data.off[i]) * 0.3;
      let dy = Math.cos(t * data.spd[i] * 0.6 + data.off[i]) * 0.2;

      // Fracture — erratic jumps
      if (fB > 0.1 && data.sys[i] < 0.33) {
        dx += (Math.random() - 0.5) * fB * 0.3;
        dy += (Math.random() - 0.5) * fB * 0.3;
      }

      // Temporal — reverse some particles
      if (tB > 0.1 && data.sys[i] > 0.33 && data.sys[i] < 0.66) {
        const reverse = Math.sin(t * 0.3 + data.off[i]) > 0.3 ? -1 : 1;
        dx *= 1 + tB * reverse * 0.5;
      }

      // Logic — stutter
      if (lB > 0.1 && data.sys[i] > 0.66) {
        if (Math.random() < lB * 0.02) {
          dx *= 0.05;
          dy *= 0.05;
        }
      }

      dummy.position.set(bx + dx, by + dy, bz);

      // Size fluctuates with collapse
      const s = 0.005 + Math.sin(t * 0.1 + data.off[i]) * 0.002 + cl * 0.002;
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

function CollapseFog() {
  const layers = useMemo(
    () =>
      Array.from({ length: 5 }, (_, i) => ({
        z: -3 - i * 5,
        opacity: 0.006 + i * 0.004,
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

/* ── Scene content ──────────────────────────────────────── */

function SceneContent() {
  return (
    <>
      <color attach="background" args={["#000000"]} />
      <fog attach="fog" args={["#000000", 4, 18]} />

      <CollapseTick />
      <CollapseCameraRig />

      {/* Recursive portal structure */}
      <RecursiveGeometry />

      {/* Multi-system interference nodes */}
      {NODE_CONFIGS.map((config, i) => (
        <CollapseNode key={i} config={config} />
      ))}

      {/* Degraded typography */}
      <CollapseTypography />

      {/* Multi-system particle field */}
      <CollapseParticles />
      <CollapseFog />

      <ambientLight intensity={0.01} color="#ffffff" />
    </>
  );
}

/* ── HUD — shows collapse state ─────────────────────────── */

function CollapseHUD() {
  const collapseLevel = useCollapseEngine((s) => s.collapseLevel);
  const interference = useCollapseEngine((s) => s.interference);

  return (
    <div className="pointer-events-none absolute inset-0 z-10 flex flex-col justify-between p-8">
      <div className="flex justify-between">
        <p className="font-mono text-[10px] tracking-[0.5em] text-zinc-800">
          D.07
        </p>
        <p className="font-mono text-[10px] tracking-[0.3em] text-zinc-800">
          {collapseLevel < 0.7 ? "COLLAPSE" : collapseLevel < 0.9 ? "DISSOLUTION" : "TERMINUS"}
        </p>
      </div>
      <div className="flex justify-between">
        <p className="font-mono text-[9px] tracking-[0.3em] text-zinc-900">
          coherence: {(1 - collapseLevel).toFixed(2)}
        </p>
        <p className="font-mono text-[9px] tracking-[0.3em] text-zinc-900">
          interference: {Object.values(interference).some(v => v > 0.5) ? "critical" : "active"}
        </p>
      </div>
    </div>
  );
}

/* ── Collapse Chamber ───────────────────────────────────── */

export default function CollapseChamber() {
  const activateCollapse = useCollapseEngine((s) => s.activate);
  const deactivateCollapse = useCollapseEngine((s) => s.deactivate);
  const activateAwareness = useAwarenessEngine((s) => s.activate);
  const deactivateAwareness = useAwarenessEngine((s) => s.deactivate);

  useBehaviorTracker();

  useEffect(() => {
    activateCollapse();
    activateAwareness();
    return () => {
      deactivateCollapse();
      deactivateAwareness();
    };
  }, [activateCollapse, deactivateCollapse, activateAwareness, deactivateAwareness]);

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
      <CollapseHUD />
    </div>
  );
}
