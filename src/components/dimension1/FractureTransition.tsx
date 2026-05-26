"use client";

import { useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import {
  useDimensionStore,
  type TransitionPhase,
} from "@/systems/progression/dimensionStore";
import {
  generateCrackNetwork,
  drawCrackNetwork,
  type CrackNetwork,
} from "@/systems/fracture/crackGenerator";
import { generateShards, type Shard } from "@/systems/fracture/shardGenerator";

const EASE = [0.22, 1, 0.36, 1] as const;
const EXPLOSIVE = [0.16, 1, 0.3, 1] as const;

/* ── Phase timeline (ms) ────────────────────────────────── */

const TIMELINE: Record<TransitionPhase, number> = {
  idle: 0,
  tension: 0,
  destabilize: 250,
  fracture: 500,
  separate: 850,
  complete: 1600,
};

export default function FractureTransition() {
  const transitionPhase = useDimensionStore((s) => s.transitionPhase);
  const isTransitioning = useDimensionStore((s) => s.isTransitioning);
  const setTransitionPhase = useDimensionStore((s) => s.setTransitionPhase);
  const completeTransition = useDimensionStore((s) => s.completeTransition);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const crackRef = useRef<CrackNetwork | null>(null);
  const shardsRef = useRef<Shard[]>([]);
  const rafRef = useRef(0);
  const stageRef = useRef(0);
  const surfaceRef = useRef<HTMLDivElement>(null);

  // Generate new crack/shard data when transition starts
  useEffect(() => {
    if (!isTransitioning) return;

    const w = window.innerWidth;
    const h = window.innerHeight;

    crackRef.current = generateCrackNetwork(w, h);
    shardsRef.current = generateShards(20);
    stageRef.current = 0;

    // Phase sequencer
    const timers = [
      setTimeout(() => setTransitionPhase("destabilize"), TIMELINE.destabilize),
      setTimeout(() => setTransitionPhase("fracture"), TIMELINE.fracture),
      setTimeout(() => setTransitionPhase("separate"), TIMELINE.separate),
      setTimeout(() => {
        setTransitionPhase("complete");
        completeTransition();
      }, TIMELINE.complete),
    ];

    return () => timers.forEach(clearTimeout);
  }, [isTransitioning, setTransitionPhase, completeTransition]);

  // Canvas crack rendering loop
  useEffect(() => {
    if (!isTransitioning || !crackRef.current) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let start = performance.now();

    const render = () => {
      if (!crackRef.current) return;
      const elapsed = performance.now() - start;

      // Progress stages based on time
      if (elapsed > TIMELINE.fracture - TIMELINE.tension) stageRef.current = 2;
      else if (elapsed > TIMELINE.destabilize - TIMELINE.tension) stageRef.current = 1;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawCrackNetwork(ctx, crackRef.current, stageRef.current, stageRef.current >= 2);

      rafRef.current = requestAnimationFrame(render);
    };

    rafRef.current = requestAnimationFrame(render);
    return () => cancelAnimationFrame(rafRef.current);
  }, [isTransitioning]);

  // GSAP surface destabilization
  useEffect(() => {
    if (transitionPhase === "destabilize" && surfaceRef.current) {
      gsap.to(surfaceRef.current, {
        scaleX: 1 + (Math.random() - 0.5) * 0.02,
        scaleY: 1 + (Math.random() - 0.5) * 0.02,
        skewX: (Math.random() - 0.5) * 1.5,
        skewY: (Math.random() - 0.5) * 1,
        duration: 0.4,
        ease: "power2.inOut",
      });
    }
    if (transitionPhase === "fracture" && surfaceRef.current) {
      gsap.to(surfaceRef.current, {
        scaleX: 1 + (Math.random() - 0.5) * 0.04,
        scaleY: 1 + (Math.random() - 0.5) * 0.03,
        skewX: (Math.random() - 0.5) * 3,
        skewY: (Math.random() - 0.5) * 2,
        duration: 0.3,
        ease: "power3.in",
      });
    }
  }, [transitionPhase]);

  if (!isTransitioning) return null;

  const activeShards =
    transitionPhase === "separate" || transitionPhase === "complete"
      ? shardsRef.current
      : [];

  return (
    <div className="fixed inset-0 z-[100] overflow-hidden">
      {/* Surface wrapper — gets distorted by GSAP */}
      <div ref={surfaceRef} className="absolute inset-0 origin-center" />

      {/* Impact flash */}
      <motion.div
        className="absolute inset-0 z-[110] bg-white"
        initial={{ opacity: 0 }}
        animate={
          transitionPhase === "fracture"
            ? { opacity: [0, 1, 0, 0.6, 0] }
            : { opacity: 0 }
        }
        transition={{ duration: 0.4, times: [0, 0.1, 0.25, 0.4, 1] }}
      />

      {/* Spatial pressure distortion — radial from center */}
      <motion.div
        className="pointer-events-none absolute inset-0 z-[105]"
        initial={{ opacity: 0 }}
        animate={{
          opacity:
            transitionPhase === "tension"
              ? 0.04
              : transitionPhase === "destabilize"
                ? 0.08
                : 0,
        }}
        transition={{ duration: 0.3 }}
        style={{
          background:
            "radial-gradient(circle at 50% 50%, transparent 30%, rgba(255,255,255,0.06) 60%, transparent 80%)",
          filter: "blur(40px)",
        }}
      />

      {/* Viewport shake */}
      <motion.div
        className="absolute inset-0 z-[102]"
        animate={
          transitionPhase === "tension"
            ? {
                x: [0, -2, 3, -1, 2, -3, 0],
                y: [0, 1, -2, 3, -1, 2, 0],
              }
            : transitionPhase === "destabilize"
              ? {
                  x: [0, -4, 5, -3, 4, -5, 2, 0],
                  y: [0, 3, -5, 4, -2, 3, -1, 0],
                }
              : transitionPhase === "fracture"
                ? {
                    x: [0, -12, 10, -8, 6, -4, 2, 0],
                    y: [0, 8, -10, 6, -4, 3, -1, 0],
                  }
                : { x: 0, y: 0 }
        }
        transition={{
          duration:
            transitionPhase === "tension"
              ? 0.25
              : transitionPhase === "destabilize"
                ? 0.3
                : 0.35,
          ease: "easeInOut",
        }}
      />

      {/* Crack canvas */}
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute inset-0 z-[108]"
      />

      {/* Fracture shards — fly outward on separate */}
      <AnimatePresence>
        {activeShards.map((shard) => (
          <motion.div
            key={shard.id}
            className="absolute inset-0 bg-black"
            style={{
              clipPath: shard.clipPath,
              opacity: shard.opacity,
            }}
            initial={{ x: 0, y: 0, scale: 1, rotate: 0 }}
            animate={{
              x: shard.dx + "vw",
              y: shard.dy + "vh",
              scale: shard.scale,
              rotate: shard.rot,
            }}
            transition={{
              delay: shard.delay,
              duration: shard.duration,
              ease: EXPLOSIVE,
            }}
          />
        ))}
      </AnimatePresence>

      {/* Crack edge glow — bright line along stress */}
      {crackRef.current && (transitionPhase === "fracture" || transitionPhase === "separate") && (
        <motion.div
          className="pointer-events-none absolute inset-0 z-[109]"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.25, 0.1] }}
          transition={{ duration: 0.6 }}
          style={{
            background: `radial-gradient(circle at ${crackRef.current.originX}px ${crackRef.current.originY}px, transparent 5%, rgba(255,255,255,0.04) 35%, transparent 65%)`,
            filter: "blur(20px)",
          }}
        />
      )}

      {/* Fade to black on completion */}
      <motion.div
        className="absolute inset-0 z-[115] bg-black"
        initial={{ opacity: 0 }}
        animate={{
          opacity: transitionPhase === "complete" ? 1 : 0,
        }}
        transition={{ duration: 0.4, ease: "easeIn" }}
      />
    </div>
  );
}
