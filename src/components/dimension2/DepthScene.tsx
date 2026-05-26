"use client";

import { Suspense, useRef, useState, useCallback, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import DimensionalPortal from "./DimensionalPortal";
import AtmosphericField from "./AtmosphericField";
import DescentSequence, { type DescentPhase } from "./DescentSequence";
import { useDimensionStore } from "@/systems/progression/dimensionStore";
import { useAnomalyEngine } from "@/systems/procedural/anomalyEngine";
import { useAnomalySpawner, DIMENSION_PROFILES } from "@/systems/procedural/anomalySpawner";
import AnomalyRenderer from "@/systems/procedural/anomalyRenderer";

/* ── Global pointer tracker ─────────────────────────────── */

const pointerNorm = { x: 0, y: 0 };

if (typeof window !== "undefined") {
  window.addEventListener("pointermove", (e: PointerEvent) => {
    pointerNorm.x = (e.clientX / window.innerWidth) * 2 - 1;
    pointerNorm.y = -(e.clientY / window.innerHeight) * 2 + 1;
  });
}

/* ── Camera rig — active only during observation ────────── */

function CameraRig({ disabled }: { disabled: boolean }) {
  const { camera } = useThree();
  const target = useRef(new THREE.Vector3(0, 0, 6));

  const disabledRef = useRef(disabled);
  disabledRef.current = disabled;

  useFrame(() => {
    if (disabledRef.current) return;
    target.current.x = pointerNorm.x * 0.35;
    target.current.y = pointerNorm.y * 0.25;
    target.current.z = 6;
    camera.position.lerp(target.current, 0.035);
    camera.lookAt(0, 0, -1);
  });

  return null;
}

/* ── Anomaly layer ──────────────────────────────────────── */

function AnomalyLayer() {
  const anomalies = useAnomalySpawner(DIMENSION_PROFILES.depth);
  return (
    <>
      {anomalies.map((anomaly) => (
        <AnomalyRenderer key={anomaly.id} anomaly={anomaly} />
      ))}
    </>
  );
}

/* ── Scene orchestrator — manages descent state ─────────── */

function SceneOrchestrator() {
  const [descentPhase, setDescentPhase] = useState<DescentPhase>("idle");
  const [totalElapsed, setTotalElapsed] = useState(0);
  const descentStart = useRef(0);
  const rafRef = useRef(0);
  const arrivedRef = useRef(false);

  const jumpDimension = useDimensionStore((s) => s.jumpDimension);

  const PHASE_MAP: { start: number; phase: DescentPhase }[] = [
    { start: 0, phase: "destabilize" },
    { start: 300, phase: "pull" },
    { start: 900, phase: "traverse" },
    { start: 1800, phase: "arrival" },
  ];

  const handleDescend = useCallback(() => {
    if (descentPhase !== "idle") return;
    descentStart.current = performance.now();
    setDescentPhase("destabilize");
    arrivedRef.current = false;

    const tick = () => {
      const elapsed = performance.now() - descentStart.current;
      setTotalElapsed(elapsed);

      let currentPhase: DescentPhase = "destabilize";
      for (let i = PHASE_MAP.length - 1; i >= 0; i--) {
        if (elapsed >= PHASE_MAP[i].start) {
          currentPhase = PHASE_MAP[i].phase;
          break;
        }
      }

      setDescentPhase(currentPhase);

      if (currentPhase === "arrival" && !arrivedRef.current) {
        arrivedRef.current = true;
        setTimeout(() => jumpDimension(4), 2200);
      }

      if (elapsed < 3200) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };

    rafRef.current = requestAnimationFrame(tick);
  }, [descentPhase, jumpDimension]);

  useEffect(() => {
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  const isDescentActive = descentPhase !== "idle";
  const portalDestabilize =
    descentPhase === "destabilize" || descentPhase === "pull";

  return (
    <>
      <CameraRig disabled={isDescentActive} />

      <DimensionalPortal
        onDescend={handleDescend}
        destabilize={portalDestabilize}
        active={!isDescentActive}
      />

      <AtmosphericField dimmed={descentPhase === "traverse" || descentPhase === "arrival"} />

      <DescentSequence phase={descentPhase} totalElapsed={totalElapsed} />

      {!isDescentActive && <AnomalyLayer />}
    </>
  );
}

/* ── Dual engine tick ───────────────────────────────────── */

function DualTick() {
  const anomalyTick = useAnomalyEngine((s) => s.tick);
  useFrame(() => anomalyTick());
  return null;
}

/* ── Scene content ──────────────────────────────────────── */

function SceneContent() {
  return (
    <>
      <color attach="background" args={["#000000"]} />
      <fog attach="fog" args={["#000000", 6, 22]} />
      <DualTick />
      <SceneOrchestrator />
      <ambientLight intensity={0.02} color="#ffffff" />
    </>
  );
}

/* ── HUD ────────────────────────────────────────────────── */

function HUD() {
  return (
    <div className="pointer-events-none absolute inset-0 z-10 flex flex-col justify-between p-8">
      <div className="flex justify-between">
        <p className="font-mono text-[10px] tracking-[0.5em] text-zinc-800">
          D.02
        </p>
        <p className="font-mono text-[10px] tracking-[0.3em] text-zinc-800">
          DEPTH CHAMBER
        </p>
      </div>
      <div className="flex justify-between">
        <p className="font-mono text-[9px] tracking-[0.3em] text-zinc-900">
          void pressure: rising
        </p>
        <p className="font-mono text-[9px] tracking-[0.3em] text-zinc-900">
          observer contained
        </p>
      </div>
    </div>
  );
}

/* ── Depth Scene ────────────────────────────────────────── */

export default function DepthScene() {
  const activateAnomalies = useAnomalyEngine((s) => s.activate);
  const deactivateAnomalies = useAnomalyEngine((s) => s.deactivate);

  useEffect(() => {
    activateAnomalies();
    return () => deactivateAnomalies();
  }, [activateAnomalies, deactivateAnomalies]);

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
      <HUD />
    </div>
  );
}
