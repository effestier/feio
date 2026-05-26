"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/* ── Pointer ────────────────────────────────────────────── */

const pointer = { x: 0, y: 0 };

if (typeof window !== "undefined") {
  window.addEventListener("pointermove", (e: PointerEvent) => {
    pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
    pointer.y = -(e.clientY / window.innerHeight) * 2 + 1;
  });
}

/* ── Configuration ──────────────────────────────────────── */

const PARTICLE_COUNT = 600;
const SPREAD = 40;

/* ── Depth particles — impossible spatial behavior ──────── */

function DepthParticles({ dimmed }: { dimmed: boolean }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const data = useMemo(() => {
    const pos = new Float32Array(PARTICLE_COUNT * 3);
    const spd = new Float32Array(PARTICLE_COUNT);
    const off = new Float32Array(PARTICLE_COUNT);
    const layer = new Float32Array(PARTICLE_COUNT); // 0=far, 1=mid, 2=near

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      pos[i * 3] = (Math.random() - 0.5) * SPREAD;
      pos[i * 3 + 1] = (Math.random() - 0.5) * SPREAD;
      pos[i * 3 + 2] = (Math.random() - 0.5) * SPREAD;
      spd[i] = 0.05 + Math.random() * 0.25;
      off[i] = Math.random() * Math.PI * 2;

      // Depth layer assignment
      const absZ = Math.abs(pos[i * 3 + 2]);
      if (absZ > SPREAD * 0.35) layer[i] = 0;
      else if (absZ > SPREAD * 0.15) layer[i] = 1;
      else layer[i] = 2;
    }

    return { pos, spd, off, layer };
  }, []);

  useFrame(({ clock }) => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const t = clock.getElapsedTime();

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const baseX = data.pos[i * 3];
      const baseY = data.pos[i * 3 + 1];
      const baseZ = data.pos[i * 3 + 2];

      // Impossible motion: near particles drift backward, far particles drift forward
      const depthDrift =
        data.layer[i] === 2
          ? Math.sin(t * 0.08 + data.off[i]) * 0.8 // near → backward pull
          : data.layer[i] === 0
            ? Math.cos(t * 0.06 + data.off[i]) * 0.6 // far → forward creep
            : Math.sin(t * 0.1 + data.off[i]) * 0.3; // mid → normal

      // Mouse push — near particles react stronger
      const mouseInfluence = data.layer[i] === 2 ? 0.6 : data.layer[i] === 1 ? 0.25 : 0.08;

      dummy.position.set(
        baseX + Math.sin(t * data.spd[i] + data.off[i]) * 0.3 + pointer.x * mouseInfluence,
        baseY + Math.cos(t * data.spd[i] * 0.7 + data.off[i]) * 0.2 + pointer.y * mouseInfluence * 0.7,
        baseZ + depthDrift,
      );

      // Size: near particles slightly larger, but flickering
      const baseS =
        data.layer[i] === 2
          ? 0.012 + Math.sin(t * 2 + data.off[i]) * 0.006
          : data.layer[i] === 1
            ? 0.008
            : 0.005;
      dummy.scale.setScalar(baseS);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }

    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, PARTICLE_COUNT]}>
      <sphereGeometry args={[1, 4, 4]} />
      <meshBasicMaterial
        color="#ffffff"
        transparent
        opacity={dimmed ? 0.04 : 0.18}
      />
    </instancedMesh>
  );
}

/* ── Structural remnant fragments ───────────────────────── */

interface RemnantFragment {
  text: string;
  position: [number, number, number];
  rotation: [number, number, number];
  size: number;
  opacity: number;
  driftSpeed: number;
  driftAmp: number;
}

// Reduced set — structural remnants, not moodboard filler
const REMNANTS: RemnantFragment[] = [
  { text: "D.02", position: [-4.5, 2.8, -3], rotation: [0, 0.2, 0.08], size: 0.08, opacity: 0.1, driftSpeed: 0.05, driftAmp: 0.04 },
  { text: "CONTAINMENT BREACH", position: [0, -3.5, -2], rotation: [0, 0, 0], size: 0.1, opacity: 0.15, driftSpeed: 0.04, driftAmp: 0.03 },
  { text: "depth:unknown", position: [4, -1.5, -4], rotation: [0, -0.3, -0.02], size: 0.07, opacity: 0.08, driftSpeed: 0.06, driftAmp: 0.05 },
  { text: "void.pressure(rising)", position: [-3.8, -2, -5], rotation: [0.01, 0.15, 0], size: 0.065, opacity: 0.07, driftSpeed: 0.03, driftAmp: 0.06 },
  { text: "observer.frame[null]", position: [3.5, 3, -6], rotation: [-0.02, -0.1, 0.03], size: 0.06, opacity: 0.06, driftSpeed: 0.04, driftAmp: 0.04 },
];

/* ── Impossible geometric structures ────────────────────── */

interface ImpossibleGeo {
  position: [number, number, number];
  rotation: [number, number, number];
  scale: number;
  type: "intersecting-planes" | "wireframe-box" | "broken-ring";
  opacity: number;
  rotSpeed: number;
}

const IMPOSSIBLE_GEOS: ImpossibleGeo[] = [
  // Intersecting planes — perspective ambiguity
  { position: [-3.5, 1.5, -2], rotation: [0.3, 0.5, 0.1], scale: 0.8, type: "intersecting-planes", opacity: 0.04, rotSpeed: 0.008 },
  // Wireframe box — architectural remnant
  { position: [4, -0.8, -3.5], rotation: [-0.2, -0.3, 0.4], scale: 0.5, type: "wireframe-box", opacity: 0.035, rotSpeed: 0.012 },
  // Broken ring — structural failure
  { position: [-2, -2.5, -4.5], rotation: [0.5, -0.1, 0.3], scale: 0.6, type: "broken-ring", opacity: 0.03, rotSpeed: 0.01 },
  { position: [2.5, 2.8, -5], rotation: [-0.4, 0.6, 0.2], scale: 0.45, type: "intersecting-planes", opacity: 0.025, rotSpeed: 0.006 },
];

function ImpossibleStructure({ geo, dimmed }: { geo: ImpossibleGeo; dimmed: boolean }) {
  const ref = useRef<THREE.Group>(null);
  const dimmedRef = useRef(dimmed);
  dimmedRef.current = dimmed;

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    ref.current.rotation.x = geo.rotation[0] + t * geo.rotSpeed;
    ref.current.rotation.y = geo.rotation[1] + t * geo.rotSpeed * 0.7;

    // Impossible depth behavior — oscillate Z position
    ref.current.position.z = geo.position[2] + Math.sin(t * 0.15) * 1.5;

    // Dim during traversal
    ref.current.visible = !dimmedRef.current;
  });

  return (
    <group ref={ref} position={geo.position} scale={geo.scale}>
      {geo.type === "intersecting-planes" && (
        <>
          <mesh rotation={[0, 0, 0]}>
            <planeGeometry args={[1.2, 0.8]} />
            <meshBasicMaterial color="#ffffff" transparent opacity={geo.opacity} side={THREE.DoubleSide} />
          </mesh>
          <mesh rotation={[0, Math.PI / 2, 0]}>
            <planeGeometry args={[1.2, 0.8]} />
            <meshBasicMaterial color="#ffffff" transparent opacity={geo.opacity * 0.8} side={THREE.DoubleSide} />
          </mesh>
          <mesh rotation={[Math.PI / 3, 0, Math.PI / 6]}>
            <planeGeometry args={[0.8, 0.6]} />
            <meshBasicMaterial color="#ffffff" transparent opacity={geo.opacity * 0.6} side={THREE.DoubleSide} />
          </mesh>
        </>
      )}
      {geo.type === "wireframe-box" && (
        <mesh>
          <boxGeometry args={[1, 1, 1]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={geo.opacity} wireframe />
        </mesh>
      )}
      {geo.type === "broken-ring" && (
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.5, 0.008, 6, 32, Math.PI * 1.3]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={geo.opacity} />
        </mesh>
      )}
    </group>
  );
}

/* ── Volumetric fog planes — depth layering ─────────────── */

function FogLayers() {
  const layers = useMemo(
    () =>
      Array.from({ length: 5 }, (_, i) => ({
        z: -4 - i * 4,
        opacity: 0.015 + i * 0.008,
        scale: 8 + i * 6,
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

/* ── Connection lines — sparse structural web ───────────── */

function ConnectionWeb() {
  const ref = useRef<THREE.LineSegments>(null);

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const verts: number[] = [];

    for (let i = 0; i < 8; i++) {
      const x1 = (Math.random() - 0.5) * 14;
      const y1 = (Math.random() - 0.5) * 10;
      const z1 = -2 - Math.random() * 8;
      const x2 = x1 + (Math.random() - 0.5) * 5;
      const y2 = y1 + (Math.random() - 0.5) * 4;
      const z2 = z1 + (Math.random() - 0.5) * 3;
      verts.push(x1, y1, z1, x2, y2, z2);
    }

    geo.setAttribute("position", new THREE.Float32BufferAttribute(verts, 3));
    return geo;
  }, []);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.015) * 0.015;
  });

  return (
    <lineSegments ref={ref} geometry={geometry}>
      <lineBasicMaterial color="#ffffff" transparent opacity={0.025} />
    </lineSegments>
  );
}

/* ── Export ──────────────────────────────────────────────── */

export default function AtmosphericField({ dimmed = false }: { dimmed?: boolean }) {
  return (
    <group>
      <DepthParticles dimmed={dimmed} />
      <FogLayers />
      <ConnectionWeb />
      {IMPOSSIBLE_GEOS.map((geo, i) => (
        <ImpossibleStructure key={`geo-${i}`} geo={geo} dimmed={dimmed} />
      ))}
      {REMNANTS.map((r, i) => (
        <RemnantText key={`remnant-${i}`} fragment={r} dimmed={dimmed} />
      ))}
    </group>
  );
}

/* ── Remnant text (using troika-three-text via drei) ────── */

import { Text } from "@react-three/drei";

function RemnantText({ fragment, dimmed }: { fragment: RemnantFragment; dimmed: boolean }) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    ref.current.position.y =
      fragment.position[1] + Math.sin(t * fragment.driftSpeed) * fragment.driftAmp;
    ref.current.position.x =
      fragment.position[0] + Math.cos(t * fragment.driftSpeed * 0.8) * fragment.driftAmp * 0.4;
  });

  return (
    <Text
      ref={ref}
      position={fragment.position}
      rotation={fragment.rotation}
      fontSize={fragment.size}
      color="#ffffff"
      anchorX="center"
      anchorY="middle"
      fillOpacity={dimmed ? 0 : fragment.opacity}
    >
      {fragment.text}
      <meshBasicMaterial
        color="#ffffff"
        transparent
        opacity={dimmed ? 0 : fragment.opacity}
      />
    </Text>
  );
}
