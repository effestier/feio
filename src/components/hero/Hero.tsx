"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import MeltButton from "@/components/interactions/MeltButton";
import {
  generateCrackNetwork,
  generateCodeDebris,
  generateDomDebris,
  generateSkelDebris,
  buildShards,
  type CrackNetwork,
  type CodeDebris,
  type DomDebris,
  type SkelDebris,
  type Shard,
} from "@/components/interactions/ScreenRupture";

/* ── constants ──────────────────────────────────────────── */

const EASE = [0.22, 1, 0.36, 1] as const;
const EXPLOSIVE = [0.16, 1, 0.3, 1] as const;
const GLYPHS = "\u2593\u2591\u2592\u2588\u2590\u258C\u2584\u2580\u25A0\u25A1\u25CA\u25C8\u00A4\u00B6\u00D7\u00F7\u2260\u2248\u221E\u220F\u2211";

const TERMINAL_MESSAGES = [
  "attempting recovery...",
  "recovery failed",
  "user still present",
  "containment lost",
  "render vessel terminated",
  "structural integrity: 0%",
  "all boundaries consumed",
  "no valid render target",
  "system halt impossible",
  "surface memory freed",
];

/* ── GlitchText ─────────────────────────────────────────── */

function GlitchText({
  text,
  glitchRate = 0.2,
  interval = 2500,
}: {
  text: string;
  glitchRate?: number;
  interval?: number;
}) {
  const [display, setDisplay] = useState(text);

  useEffect(() => {
    const id = setInterval(() => {
      if (Math.random() < glitchRate) {
        const corrupted = text
          .split("")
          .map((c) =>
            c === " "
              ? c
              : Math.random() > 0.45
                ? GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
                : c,
          )
          .join("");
        setDisplay(corrupted);
        setTimeout(() => setDisplay(text), 50 + Math.random() * 90);
      }
    }, interval + Math.random() * 1500);
    return () => clearInterval(id);
  }, [text, glitchRate, interval]);

  return <>{display}</>;
}

/* ── title corruption ───────────────────────────────────── */

function CorruptedTitle({ state }: { state: number }) {
  const [glitched, setGlitched] = useState("FEIO");

  useEffect(() => {
    if (state < 1) return;

    const id = setInterval(() => {
      if (Math.random() < 0.15 + state * 0.12) {
        const letters = ["F", "E", "I", "O"];
        const corrupted = letters
          .map((c) => {
            if (state >= 3 && Math.random() < 0.3) {
              return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
            }
            if (state >= 2 && Math.random() < 0.2) {
              return c + " ";
            }
            return Math.random() > 0.6
              ? GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
              : c;
          })
          .join(state >= 2 ? " " : "");
        setGlitched(corrupted);
        setTimeout(
          () => setGlitched(state >= 2 ? "F E I O" : "FEIO"),
          80 + Math.random() * 120,
        );
      }
    }, 1200 + Math.random() * 2000);

    return () => clearInterval(id);
  }, [state]);

  return <>{state >= 2 ? glitched || "F E I O" : "FEIO"}</>;
}

/* ── Main component ─────────────────────────────────────── */

export default function Hero() {
  const [state, setState] = useState(0);
  const [transitioning, setTransitioning] = useState(false);

  // Accumulated damage — arrays grow on each trigger
  const [crackNetworks, setCrackNetworks] = useState<CrackNetwork[]>([]);
  const [allCode, setAllCode] = useState<CodeDebris[]>([]);
  const [allDom, setAllDom] = useState<DomDebris[]>([]);
  const [allSkel, setAllSkel] = useState<SkelDebris[]>([]);
  const [allShards, setAllShards] = useState<Shard[]>([]);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef(0);
  const cursorRef = useRef({ x: 0.5, y: 0.5 });
  const cursorGlowRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  // Cursor corruption — ghost clone positions (updated by rAF)
  const [cursorGhosts, setCursorGhosts] = useState<
    Array<{ x: number; y: number; id: number }>
  >([]);
  const ghostHistoryRef = useRef<Array<{ x: number; y: number; t: number }>>(
    [],
  );
  const ghostFrameRef = useRef(0);
  const ghostIdRef = useRef(0);

  // Generate per-level quantities
  const triggerDestruction = useCallback(
    (nextState: number) => {
      const seed = Date.now() ^ (Math.random() * 0xffffffff);
      const w = typeof window !== "undefined" ? window.innerWidth : 1920;
      const h = typeof window !== "undefined" ? window.innerHeight : 1080;

      // More cracks each level
      const crackCount = nextState >= 3 ? 2 : 1;
      const newCracks: CrackNetwork[] = [];
      for (let i = 0; i < crackCount; i++) {
        newCracks.push(generateCrackNetwork(w, h));
      }

      // Scaling debris quantities — state 1 hits HARD
      const codeCount = [0, 16, 22, 30, 38][nextState];
      const domCount = [0, 8, 12, 18, 24][nextState];
      const skelCount = [0, 6, 10, 16, 22][nextState];
      const shardCount = [0, 28, 36, 44, 52][nextState];

      setCrackNetworks((prev) => [...prev, ...newCracks]);
      setAllCode((prev) => [
        ...prev,
        ...generateCodeDebris(codeCount, seed + 1),
      ]);
      setAllDom((prev) => [
        ...prev,
        ...generateDomDebris(domCount, seed + 2),
      ]);
      setAllSkel((prev) => [
        ...prev,
        ...generateSkelDebris(skelCount, seed + 3),
      ]);
      setAllShards((prev) => [
        ...prev,
        ...buildShards(shardCount, seed + nextState * 100),
      ]);
    },
    [],
  );

  // ENTER click handler
  const handleTrigger = useCallback(() => {
    if (state >= 4 || transitioning) return;

    setTransitioning(true);
    const nextState = state + 1;

    setTimeout(() => {
      triggerDestruction(nextState);
      setState(nextState);
      setTransitioning(false);
    }, 300);
  }, [state, transitioning, triggerDestruction]);

  // Draw all accumulated cracks on canvas
  const drawCracks = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (const network of crackNetworks) {
      for (const seg of network.segments) {
        // Wide glow layer
        ctx.beginPath();
        ctx.moveTo(seg.x1, seg.y1);
        ctx.lineTo(seg.x2, seg.y2);
        ctx.strokeStyle = `rgba(255,255,255,${seg.opacity * 0.5})`;
        ctx.lineWidth = seg.glowWidth * 1.5;
        ctx.stroke();

        // Mid glow
        ctx.beginPath();
        ctx.moveTo(seg.x1, seg.y1);
        ctx.lineTo(seg.x2, seg.y2);
        ctx.strokeStyle = `rgba(255,255,255,${seg.opacity * 0.7})`;
        ctx.lineWidth = seg.glowWidth * 0.6;
        ctx.stroke();

        // Core line — bright
        ctx.beginPath();
        ctx.moveTo(seg.x1, seg.y1);
        ctx.lineTo(seg.x2, seg.y2);
        ctx.strokeStyle = `rgba(255,255,255,${Math.min(seg.opacity * 1.4, 1)})`;
        ctx.lineWidth = seg.width * 1.3;
        ctx.stroke();
      }
    }
  }, [crackNetworks]);

  // Redraw on crack network change
  useEffect(() => {
    if (crackNetworks.length > 0) drawCracks();
  }, [crackNetworks, drawCracks]);

  // Stress flicker loop (state 2+)
  useEffect(() => {
    if (state < 2) return;

    const flicker = () => {
      const canvas = canvasRef.current;
      if (!canvas || crackNetworks.length === 0) {
        rafRef.current = requestAnimationFrame(flicker);
        return;
      }
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        rafRef.current = requestAnimationFrame(flicker);
        return;
      }

      drawCracks();

      // Random micro-flash along a random crack segment
      if (Math.random() < 0.2 + state * 0.1) {
        const allSegs = crackNetworks.flatMap((n) => n.segments);
        if (allSegs.length > 0) {
          const seg = allSegs[Math.floor(Math.random() * allSegs.length)];
          ctx.beginPath();
          ctx.moveTo(seg.x1, seg.y1);
          ctx.lineTo(seg.x2, seg.y2);
          ctx.strokeStyle = `rgba(255,255,255,${0.3 + Math.random() * 0.5})`;
          ctx.lineWidth = seg.width * 3;
          ctx.stroke();
        }
      }

      rafRef.current = requestAnimationFrame(flicker);
    };

    rafRef.current = requestAnimationFrame(flicker);
    return () => cancelAnimationFrame(rafRef.current);
  }, [state, crackNetworks, drawCracks]);

  // Cursor tracking — updates refs AND DOM directly
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const nx = e.clientX / window.innerWidth;
      const ny = e.clientY / window.innerHeight;
      cursorRef.current = { x: nx, y: ny };

      // Record history for ghost trails
      if (state >= 1) {
        ghostHistoryRef.current.push({ x: nx, y: ny, t: Date.now() });
        if (ghostHistoryRef.current.length > 60) {
          ghostHistoryRef.current.shift();
        }
      }

      // Update cursor glow position directly
      if (cursorGlowRef.current) {
        cursorGlowRef.current.style.background = `radial-gradient(circle 300px at ${nx * 100}% ${ny * 100}%, rgba(255,255,255,${0.01 + state * 0.008}) 0%, transparent 100%)`;
      }
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [state]);

  // Cursor ghost generation loop (state 1+)
  useEffect(() => {
    if (state < 1) return;

    const ghostLoop = () => {
      const now = Date.now();
      const history = ghostHistoryRef.current;

      // How many ghosts and how far back to look
      const ghostCount = state === 1 ? 1 : state === 2 ? 2 : state === 3 ? 3 : 4;
      const lagMs = state === 1 ? 120 : state === 2 ? 180 : state === 3 ? 250 : 350;

      const newGhosts: Array<{ x: number; y: number; id: number }> = [];

      for (let i = 0; i < ghostCount; i++) {
        const targetTime = now - lagMs * (i + 1);
        // Find the history entry closest to targetTime
        let closest = history[0];
        let minDiff = Infinity;
        for (const h of history) {
          const diff = Math.abs(h.t - targetTime);
          if (diff < minDiff) {
            minDiff = diff;
            closest = h;
          }
        }
        if (closest) {
          // Add slight random offset for state 3+ (chromatic split feel)
          const offsetX = state >= 3 ? (Math.random() - 0.5) * 0.015 : 0;
          const offsetY = state >= 3 ? (Math.random() - 0.5) * 0.015 : 0;
          newGhosts.push({
            x: closest.x + offsetX,
            y: closest.y + offsetY,
            id: i,
          });
        }
      }

      setCursorGhosts(newGhosts);
      ghostFrameRef.current = requestAnimationFrame(ghostLoop);
    };

    ghostFrameRef.current = requestAnimationFrame(ghostLoop);
    return () => cancelAnimationFrame(ghostFrameRef.current);
  }, [state]);

  // Cursor stress distortion (state 0+ — subtle)
  const cursorStress = useMemo(() => {
    if (state === 0) return { filter: "none", transform: "none" };
    const stress = Math.min(state * 0.3, 1);
    return {
      filter: `blur(${stress * 0.3}px) contrast(${1 + stress * 0.05})`,
      transform: "none",
    };
  }, [state]);

  // Viewport instability (state 2+)
  const viewportInstability = useMemo(() => {
    if (state < 2) return { x: 0, y: 0, rotate: 0 };
    return {
      x: [0, -(state * 0.8), state * 0.6, -(state * 0.4), 0],
      y: [0, state * 0.5, -(state * 0.7), state * 0.3, 0],
      rotate: [0, -(state * 0.1), state * 0.08, -(state * 0.05), 0],
    };
  }, [state]);

  // Visible debris — accumulate with state
  const visibleCode = allCode;
  const visibleDom = state >= 1 ? allDom : [];
  const visibleSkel = state >= 2 ? allSkel : [];

  // Title clip-path damage (state 1+)
  const titleClip = useMemo(() => {
    if (state < 1) return "none";
    if (state === 1)
      return "polygon(0% 0%, 100% 0%, 100% 95%, 92% 100%, 0% 100%)";
    if (state === 2)
      return "polygon(0% 0%, 98% 0%, 100% 88%, 85% 100%, 0% 100%)";
    if (state === 3)
      return "polygon(2% 3%, 96% 0%, 100% 82%, 78% 100%, 5% 97%)";
    return "polygon(5% 8%, 92% 2%, 100% 75%, 70% 100%, 8% 95%)";
  }, [state]);

  // Title offset per state
  const titleOffset = useMemo(() => {
    if (state < 1) return { x: 0, y: 0 };
    if (state === 1) return { x: 1, y: 0 };
    if (state === 2) return { x: -2, y: 1 };
    if (state === 3) return { x: 3, y: -2 };
    return { x: -4, y: 3 };
  }, [state]);

  // Button label per state
  const buttonLabel = useMemo(() => {
    if (state < 4) return "ENTER";
    return "BREACH COMPLETE";
  }, [state]);

  // Terminal messages (state 4)
  const [terminalIdx, setTerminalIdx] = useState(0);
  useEffect(() => {
    if (state < 4) return;
    const id = setInterval(() => {
      setTerminalIdx((prev) => (prev + 1) % TERMINAL_MESSAGES.length);
    }, 2500 + Math.random() * 1500);
    return () => clearInterval(id);
  }, [state]);

  return (
    <section ref={sectionRef} className="relative flex h-dvh w-full items-center justify-center overflow-hidden bg-black">
      {/* ── Background radial ──────────────────────────── */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(30,30,30,1)_0%,_rgba(0,0,0,1)_70%)]" />

      {/* ── Cursor stress glow (state 1+) ──────────────── */}
      {state >= 1 && (
        <div
          ref={cursorGlowRef}
          className="pointer-events-none absolute inset-0 z-[1]"
          style={{ filter: `blur(${40 + state * 10}px)` }}
        />
      )}

      {/* ── Crack canvas (persistent) ──────────────────── */}
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute inset-0 z-[5]"
        style={{ opacity: state >= 1 ? 1 : 0 }}
      />

      {/* ── Debris: code fragments ─────────────────────── */}
      <div className="pointer-events-none absolute inset-0 z-[6] overflow-hidden">
        <AnimatePresence>
          {visibleCode.map((item, i) => (
            <motion.div
              key={`code-${item.text}-${i}`}
              className="absolute font-mono text-white"
              style={{
                left: `${item.x}%`,
                top: `${item.y}%`,
                fontSize: `${item.size}px`,
                transform: `rotate(${item.rot}deg)`,
                whiteSpace: "nowrap",
              }}
              initial={{ opacity: 0, x: -15 }}
              animate={{
                opacity: [
                  0,
                  item.opacity,
                  item.opacity * 0.7,
                  item.opacity,
                ],
                x: [
                  0,
                  item.twitchX,
                  -item.twitchX * 0.6,
                  item.twitchX * 0.3,
                ],
                y: [0, item.twitchY, 0, -item.twitchY * 0.5],
              }}
              transition={{
                opacity: {
                  delay: 0.3 + i * 0.02,
                  duration: 3 + Math.random() * 4,
                  repeat: Infinity,
                  repeatDelay: 1 + Math.random() * 3,
                },
                x: {
                  delay: 0.3 + i * 0.02,
                  duration: item.twitchSpeed,
                  repeat: Infinity,
                  ease: "linear",
                },
                y: {
                  delay: 0.3 + i * 0.02 + 0.2,
                  duration: item.twitchSpeed * 1.4,
                  repeat: Infinity,
                  ease: "linear",
                },
              }}
              exit={{ opacity: 0, transition: { duration: 0.3 } }}
            >
              <GlitchText
                text={item.text}
                glitchRate={item.glitchRate}
                interval={item.glitchInterval}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* ── Debris: DOM fragments ──────────────────────── */}
      <div className="pointer-events-none absolute inset-0 z-[7] overflow-hidden">
        <AnimatePresence>
          {visibleDom.map((item, i) => (
            <motion.div
              key={`dom-${item.text}-${i}`}
              className="absolute font-mono text-white"
              style={{
                left: `${item.x}%`,
                top: `${item.y}%`,
                fontSize: `${item.size}px`,
                transform: `rotate(${item.rot}deg)`,
                whiteSpace: "nowrap",
              }}
              initial={{ opacity: 0 }}
              animate={{
                opacity: [
                  0,
                  item.opacity,
                  item.opacity * 0.5,
                  item.opacity,
                ],
                x: [0, item.flickerX, -item.flickerX, 0],
                filter: [
                  "blur(0px)",
                  `blur(${item.blur}px)`,
                  "blur(0px)",
                  `blur(${item.blur * 0.5}px)`,
                ],
              }}
              transition={{
                delay: 0.5 + i * 0.04,
                duration: item.cycleDuration,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              exit={{ opacity: 0, transition: { duration: 0.3 } }}
            >
              <GlitchText
                text={item.text}
                glitchRate={0.35}
                interval={1800}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* ── Debris: UI skeletons ───────────────────────── */}
      <div className="pointer-events-none absolute inset-0 z-[8] overflow-hidden">
        <AnimatePresence>
          {visibleSkel.map((sk, i) => (
            <motion.div
              key={`skel-${sk.type}-${i}`}
              className="absolute"
              style={{
                left: `${sk.x}%`,
                top: `${sk.y}%`,
                transform: `rotate(${sk.rot}deg)`,
              }}
              initial={{ opacity: 0, y: 12 }}
              animate={{
                opacity: sk.opacity,
                y: [0, sk.driftY, 0, -sk.driftY * 0.4],
                x: [0, sk.driftX, -sk.driftX * 0.3, 0],
              }}
              transition={{
                opacity: { delay: 0.6 + i * 0.05, duration: 0.35 },
                y: {
                  delay: 0.6 + i * 0.05,
                  duration: sk.driftDuration,
                  repeat: Infinity,
                  ease: "easeInOut",
                },
                x: {
                  delay: 0.6 + i * 0.05 + 0.15,
                  duration: sk.driftDuration * 0.75,
                  repeat: Infinity,
                  ease: "easeInOut",
                },
              }}
              exit={{ opacity: 0, transition: { duration: 0.3 } }}
            >
              {sk.type === "button" && (
                <div className="border border-white/[0.12] bg-white/[0.04] px-6 py-2">
                  <div className="font-mono text-[9px] uppercase tracking-[0.3em] text-white/[0.18]">
                    <GlitchText
                      text={sk.label!}
                      glitchRate={0.45}
                      interval={2500}
                    />
                  </div>
                </div>
              )}
              {sk.type === "card" && (
                <div className="space-y-1.5 border border-white/[0.08] bg-white/[0.03] p-3">
                  <div
                    className="h-1.5 bg-white/[0.12]"
                    style={{ width: sk.bar1 }}
                  />
                  <div
                    className="h-1.5 bg-white/[0.07]"
                    style={{ width: sk.bar2 }}
                  />
                  <div
                    className="h-1.5 bg-white/[0.04]"
                    style={{ width: sk.bar3 }}
                  />
                </div>
              )}
              {sk.type === "panel" && (
                <div className="border border-white/[0.07] bg-white/[0.025] p-2.5">
                  <div className="mb-1.5 h-1 w-10 bg-white/[0.08]" />
                  <div className="flex gap-1.5">
                    <div className="h-3.5 w-3.5 bg-white/[0.05]" />
                    <div className="h-3.5 w-6 bg-white/[0.04]" />
                    <div className="h-3.5 w-3.5 bg-white/[0.03]" />
                  </div>
                </div>
              )}
              {sk.type === "line" && (
                <div
                  className="h-px bg-white/[0.1]"
                  style={{ width: sk.lineWidth }}
                />
              )}
              {sk.type === "input" && (
                <div className="border border-white/[0.1] bg-white/[0.03] px-3 py-1.5">
                  <div className="h-1 w-16 bg-white/[0.06]" />
                </div>
              )}
              {sk.type === "modal" && (
                <div className="border border-white/[0.1] bg-white/[0.025] p-3">
                  <div className="mb-2 h-1 w-14 bg-white/[0.08]" />
                  <div className="mb-1 h-px w-full bg-white/[0.04]" />
                  <div className="flex gap-2">
                    <div className="h-2 w-8 bg-white/[0.06]" />
                    <div className="h-2 w-6 bg-white/[0.04]" />
                  </div>
                </div>
              )}
              {sk.type === "header" && (
                <div className="flex items-center gap-2 border-b border-white/[0.06] pb-1">
                  <div className="h-2 w-2 rounded-full bg-white/[0.06]" />
                  <div className="h-1 w-12 bg-white/[0.07]" />
                  <div className="ml-auto h-1 w-6 bg-white/[0.04]" />
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* ── Fracture shards (persistent) ────────────────── */}
      <div className="pointer-events-none absolute inset-0 z-[9]">
        <AnimatePresence>
          {allShards.map((shard, i) => (
            <motion.div
              key={`shard-${shard.cx.toFixed(1)}-${shard.cy.toFixed(1)}-${i}`}
              className="absolute inset-0"
              style={{
                clipPath: shard.clipPath,
                backdropFilter: `blur(${shard.blur}px)`,
                backgroundColor: `rgba(0,0,0,${shard.opacity})`,
              }}
              initial={{ x: 0, y: 0, scale: 1 }}
              animate={{
                x: shard.dx + "vw",
                y: shard.dy + "vh",
                scale: shard.depth,
                rotate: shard.rot,
              }}
              transition={{
                delay: shard.delay * 0.5,
                duration: 0.55 + Math.random() * 0.2,
                ease: EXPLOSIVE,
              }}
              exit={{
                x: 0,
                y: 0,
                scale: 1,
                rotate: 0,
                transition: { duration: 0.5, ease: EASE },
              }}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* ── Stress aftershock flashes (state 2+) ────────── */}
      {state >= 2 &&
        [0, 1, 2, 3].map((j) => (
          <motion.div
            key={`stress-${j}`}
            className="pointer-events-none absolute inset-0 z-[45] bg-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0, 0, 0, 0, 0, 0, 0, 0.12 + state * 0.04, 0] }}
            transition={{
              delay: 1.5 + j * 1.2 + Math.random() * 0.8,
              duration: 0.1 + state * 0.02,
              repeat: Infinity,
              repeatDelay: 1.5 + Math.random() * (5 - state),
            }}
          />
        ))}

      {/* ── Viewport instability (state 2+) ─────────────── */}
      <motion.div
        className="absolute inset-0 z-[3]"
        animate={viewportInstability}
        transition={{
          duration: 2.5 - state * 0.2,
          repeat: state >= 2 ? Infinity : 0,
          ease: "easeInOut",
        }}
      />

      {/* ── Cursor ghost clones (state 1+) ──────────────── */}
      {state >= 1 &&
        cursorGhosts.map((ghost) => (
          <div
            key={`ghost-${ghost.id}`}
            className="pointer-events-none fixed z-[48] -translate-x-1/2 -translate-y-1/2"
            style={{
              left: `${ghost.x * 100}%`,
              top: `${ghost.y * 100}%`,
              opacity: state === 1 ? 0.12 : state === 2 ? 0.18 : 0.15 - ghost.id * 0.03,
              transform: `translate(-50%, -50%) scale(${1 - ghost.id * 0.08})`,
            }}
          >
            {/* Crosshair-style cursor ghost */}
            <div className="relative h-5 w-5">
              <div
                className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2"
                style={{
                  background: `rgba(255,255,255,${state >= 3 ? 0.4 : 0.25})`,
                }}
              />
              <div
                className="absolute top-1/2 left-0 h-px w-full -translate-y-1/2"
                style={{
                  background: `rgba(255,255,255,${state >= 3 ? 0.4 : 0.25})`,
                }}
              />
              {/* Center dot */}
              <div
                className="absolute left-1/2 top-1/2 h-1 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full"
                style={{
                  background: `rgba(255,255,255,${state >= 3 ? 0.5 : 0.3})`,
                }}
              />
            </div>
          </div>
        ))}

      {/* ── Cursor flicker/disappearance (state 4) ──────── */}
      {state >= 4 && (
        <motion.div
          className="pointer-events-none fixed inset-0 z-[47]"
          style={{ cursor: "none" }}
          animate={{
            opacity: [1, 1, 0, 1, 1, 0, 0, 1, 1],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      )}

      {/* ── Main content ───────────────────────────────── */}
      <motion.div
        className="relative z-10 flex flex-col items-center gap-6 px-6 text-center"
        style={cursorStress}
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.25 } },
        }}
      >
        {/* ── FEIO Title ────────────────────────────────── */}
        <motion.h1
          className="font-sans text-[clamp(4rem,15vw,12rem)] font-bold leading-none tracking-tighter text-white"
          style={{
            clipPath: titleClip,
          }}
          animate={{
            x: titleOffset.x,
            y: titleOffset.y,
          }}
          transition={{ duration: 0.5, ease: EASE }}
          variants={{
            hidden: { opacity: 0, y: 40, filter: "blur(12px)" },
            visible: {
              opacity: 1,
              y: 0,
              filter: "blur(0px)",
              transition: { duration: 1.2, ease: [0.22, 1, 0.36, 1] },
            },
          }}
        >
          <CorruptedTitle state={state} />
        </motion.h1>

        {/* ── Subheadline ───────────────────────────────── */}
        <motion.p
          className="font-mono text-lg uppercase tracking-[0.3em] text-zinc-400"
          animate={
            state >= 3
              ? {
                  opacity: [1, 0.6, 1, 0.7, 1],
                  x: [0, -1, 2, -1, 0],
                }
              : {}
          }
          transition={
            state >= 3
              ? { duration: 3, repeat: Infinity, ease: "easeInOut" }
              : {}
          }
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] },
            },
          }}
        >
          {state >= 4 ? (
            <GlitchText
              text="beauty is unpredictable."
              glitchRate={0.5}
              interval={1200}
            />
          ) : (
            "Beauty is predictable."
          )}
        </motion.p>

        {/* ── Supporting line ───────────────────────────── */}
        <motion.p
          className="max-w-md font-mono text-sm leading-relaxed tracking-wide text-zinc-600"
          animate={
            state >= 2
              ? {
                  x: [0, (state - 1) * 0.5, -(state - 1) * 0.3, 0],
                  opacity: state >= 4 ? [1, 0.4, 0.8, 0.3, 1] : 1,
                }
              : {}
          }
          transition={
            state >= 2
              ? { duration: 4, repeat: Infinity, ease: "easeInOut" }
              : {}
          }
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { duration: 1.2, ease: "easeOut" },
            },
          }}
        >
          {state >= 4 ? (
            <GlitchText
              text="Controlled ugliness has consumed all territory."
              glitchRate={0.45}
              interval={1500}
            />
          ) : (
            "Controlled ugliness still has unexplored territory."
          )}
        </motion.p>

        {/* ── Terminal message (state 4) ────────────────── */}
        {state >= 4 && (
          <motion.p
            className="font-mono text-[10px] tracking-[0.4em] text-zinc-700"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.6, 0.3, 0.7, 0.4] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            <GlitchText
              text={TERMINAL_MESSAGES[terminalIdx]}
              glitchRate={0.6}
              interval={800}
            />
          </motion.p>
        )}

        {/* ── Button ────────────────────────────────────── */}
        <motion.div
          className="mt-8"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { duration: 1.4, ease: "easeOut" },
            },
          }}
        >
          {state < 4 ? (
            <div onClick={handleTrigger}>
              <MeltButton label={buttonLabel} />
            </div>
          ) : (
            <motion.div
              className="font-mono text-[11px] uppercase tracking-[0.5em] text-zinc-800"
              animate={{
                opacity: [0.3, 0.6, 0.2, 0.5, 0.3],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <GlitchText text="BREACH COMPLETE" glitchRate={0.5} interval={1500} />
            </motion.div>
          )}
        </motion.div>
      </motion.div>

      {/* ── State indicator (debug-visible, subtle) ─────── */}
      <div className="pointer-events-none fixed bottom-4 right-4 z-[60] font-mono text-[9px] tracking-[0.3em] text-zinc-800">
        STATE {state}/4
      </div>
    </section>
  );
}
