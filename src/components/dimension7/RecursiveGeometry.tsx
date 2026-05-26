"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useRecursiveMirror } from "@/systems/collapse/recursiveMirror";
import { useInterferenceBleed } from "@/systems/collapse/interferenceBleed";

/* ── Pointer (module level) ─────────────────────────────── */

const pointerNorm = { x: 0, y: 0 };

if (typeof window !== "undefined") {
  window.addEventListener("pointermove", (e: PointerEvent) => {
    pointerNorm.x = (e.clientX / window.innerWidth) * 2 - 1;
    pointerNorm.y = -(e.clientY / window.innerHeight) * 2 + 1;
  });
}

/* ── Recursive Geometry — nested self-referential portal ── */

const RING_COUNT = 8;

export default function RecursiveGeometry() {
  const ringRefs = useRef<THREE.Mesh[]>([]);
  const matRefs = useRef<THREE.MeshBasicMaterial[]>([]);
  const phaseRef = useRef(Math.random() * Math.PI * 2);

  const { pushState, getReflected, depth } = useRecursiveMirror({
    depth: RING_COUNT,
    decayFactor: 0.7,
    reflectionDelay: 150,
  });

  const { collapseRef, fractureRef } = useInterferenceBleed();

  useFrame(({ clock }) => {
    if (ringRefs.current.length === 0) return;
    const t = clock.getElapsedTime();
    const phase = phaseRef.current;
    const cl = collapseRef.current;
    const fB = fractureRef.current;

    // Outer ring — responds to pointer
    const outer = ringRefs.current[0];
    if (outer) {
      const targetX = pointerNorm.y * 0.15;
      const targetY = pointerNorm.x * 0.2;
      outer.rotation.x += (targetX - outer.rotation.x) * 0.02;
      outer.rotation.y += (targetY - outer.rotation.y) * 0.02;
      outer.rotation.z += 0.003;

      // Push state for mirror system
      pushState(
        [outer.rotation.x, outer.rotation.y, outer.rotation.z],
        outer.scale.x,
        0,
      );

      // Breathing
      const breathe = Math.sin(t * 0.6 + phase) * 0.03 * cl;
      const stutter = fB > 0.2 && Math.random() < 0.003 ? (Math.random() - 0.5) * 0.06 : 0;
      outer.scale.setScalar(1 + breathe + stutter);
    }

    // Inner rings — mirror parent with decay and delay
    for (let i = 1; i < RING_COUNT; i++) {
      const mesh = ringRefs.current[i];
      const mat = matRefs.current[i];
      if (!mesh || !mat) continue;

      const reflected = getReflected(i);
      if (reflected) {
        // Apply reflected rotation
        mesh.rotation.x = reflected.rotation[0];
        mesh.rotation.y = reflected.rotation[1];
        mesh.rotation.z = reflected.rotation[2];

        // Scale from reflection
        const baseScale = 1 - i * 0.1;
        mesh.scale.setScalar(Math.max(0.1, baseScale * reflected.scale));

        // Opacity decays with depth
        mat.opacity = Math.max(0, (0.5 - i * 0.05) * reflected.scale);

        // Fracture bleed — inner rings get position jitter
        if (fB > 0.2) {
          mesh.position.x = (Math.random() - 0.5) * fB * 0.02 * i;
          mesh.position.y = (Math.random() - 0.5) * fB * 0.02 * i;
        }
      } else {
        // No reflected state yet — default
        mesh.rotation.z += 0.001 * (i + 1);
        const s = Math.max(0.1, 1 - i * 0.1);
        mesh.scale.setScalar(s);
        mat.opacity = Math.max(0, 0.5 - i * 0.05);
      }
    }
  });

  return (
    <group position={[0, 0, -0.5]}>
      {Array.from({ length: RING_COUNT }, (_, i) => {
        const radius = 0.35 + i * 0.25;
        return (
          <mesh
            key={i}
            ref={(el) => { if (el) ringRefs.current[i] = el; }}
            rotation={[Math.PI / 2, 0, i * 0.1]}
          >
            <torusGeometry args={[radius, 0.004 + (RING_COUNT - i) * 0.0005, 6, 48]} />
            <meshBasicMaterial
              ref={(el) => { if (el) matRefs.current[i] = el; }}
              color="#ffffff"
              transparent
              opacity={0.5 - i * 0.05}
            />
          </mesh>
        );
      })}
    </group>
  );
}
