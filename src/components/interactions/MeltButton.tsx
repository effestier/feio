"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useCallback, useState } from "react";

const EASE = [0.22, 1, 0.36, 1] as const;

const CHANNELS: Array<[string, string]> = [
  ["R", "G"],
  ["G", "B"],
  ["B", "R"],
  ["R", "B"],
  ["G", "R"],
  ["B", "G"],
];

interface MeltProfile {
  seed: number;
  freqX: number;
  freqY: number;
  channels: [string, string];
  offsetX: number;
  offsetY: number;
  strength: number;
  blur: number;
  driftX: number;
  driftY: number;
}

function createProfile(nx: number, ny: number): MeltProfile {
  const base = 0.006 + Math.random() * 0.009;
  return {
    seed: Math.floor(Math.random() * 10000),
    freqX: base,
    freqY: base * (0.6 + Math.random() * 0.8),
    channels: CHANNELS[Math.floor(Math.random() * CHANNELS.length)],
    offsetX: nx * 25 + (Math.random() - 0.5) * 15,
    offsetY: ny * 25 + (Math.random() - 0.5) * 15,
    strength: 14 + Math.random() * 10,
    blur: 0.8 + Math.random() * 1.2,
    driftX: 0.2 + Math.random() * 0.5,
    driftY: 0.15 + Math.random() * 0.5,
  };
}

function randomJitter(count: number, amp: number): number[] {
  const vals = Array.from({ length: count }, () =>
    +(Math.random() * amp * 2 - amp).toFixed(2),
  );
  vals[vals.length - 1] = 0;
  return vals;
}

export default function MeltButton({ label = "ENTER" }: { label?: string }) {
  const [active, setActive] = useState(false);
  const [textJitter, setTextJitter] = useState({ x: [0], y: [0] });
  const wrapRef = useRef<HTMLDivElement>(null);

  // SVG filter refs
  const turbRef = useRef<SVGFETurbulenceElement>(null);
  const offsetRef = useRef<SVGFEOffsetElement>(null);
  const dispRef = useRef<SVGFEDisplacementMapElement>(null);
  const blurElRef = useRef<SVGFEGaussianBlurElement>(null);

  // Animation state
  const raf = useRef(0);
  const time = useRef(0);
  const sNow = useRef(0);
  const bNow = useRef(0);
  const sTarget = useRef(0);
  const bTarget = useRef(0);
  const prof = useRef<MeltProfile | null>(null);
  const cursorNow = useRef({ x: 0, y: 0 });
  const cursorTarget = useRef({ x: 0, y: 0 });

  // Touch state
  const isTouching = useRef(false);
  const longPressTimer = useRef(0);

  // Render loop — runs once
  useEffect(() => {
    const tick = () => {
      time.current += 0.003;
      const t = time.current;
      const p = prof.current;

      sNow.current += (sTarget.current - sNow.current) * 0.032;
      bNow.current += (bTarget.current - bNow.current) * 0.038;
      cursorNow.current.x +=
        (cursorTarget.current.x - cursorNow.current.x) * 0.04;
      cursorNow.current.y +=
        (cursorTarget.current.y - cursorNow.current.y) * 0.04;

      if (p) {
        const fx = p.freqX + Math.sin(t * p.driftX) * 0.003;
        const fy = p.freqY + Math.cos(t * p.driftY) * 0.003;

        if (turbRef.current) {
          turbRef.current.setAttribute("seed", String(p.seed));
          turbRef.current.setAttribute(
            "baseFrequency",
            `${fx.toFixed(5)} ${fy.toFixed(5)}`,
          );
        }

        if (offsetRef.current) {
          const ox =
            p.offsetX +
            cursorNow.current.x * 18 +
            Math.sin(t * 0.35) * 8;
          const oy =
            p.offsetY +
            cursorNow.current.y * 18 +
            Math.cos(t * 0.28) * 8;
          offsetRef.current.setAttribute("dx", ox.toFixed(1));
          offsetRef.current.setAttribute("dy", oy.toFixed(1));
        }

        if (dispRef.current) {
          dispRef.current.setAttribute("scale", sNow.current.toFixed(2));
          dispRef.current.setAttribute("xChannelSelector", p.channels[0]);
          dispRef.current.setAttribute("yChannelSelector", p.channels[1]);
        }

        if (blurElRef.current) {
          blurElRef.current.setAttribute(
            "stdDeviation",
            bNow.current.toFixed(2),
          );
        }
      }

      raf.current = requestAnimationFrame(tick);
    };

    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, []);

  // ── helpers ──────────────────────────────────────────────

  const normPointer = useCallback((e: React.PointerEvent) => {
    const el = wrapRef.current;
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return {
      x: ((e.clientX - r.left) / r.width) * 2 - 1,
      y: ((e.clientY - r.top) / r.height) * 2 - 1,
    };
  }, []);

  const activate = useCallback((nx: number, ny: number) => {
    const p = createProfile(nx, ny);
    prof.current = p;
    sTarget.current = p.strength;
    bTarget.current = p.blur;
    cursorTarget.current = { x: nx, y: ny };
    setTextJitter({ x: randomJitter(7, 0.6), y: randomJitter(7, 0.4) });
    setActive(true);
  }, []);

  const deactivate = useCallback(() => {
    sTarget.current = 0;
    bTarget.current = 0;
    cursorTarget.current = { x: 0, y: 0 };
    setActive(false);
    isTouching.current = false;
    clearTimeout(longPressTimer.current);
  }, []);

  // ── desktop: hover ───────────────────────────────────────

  const onPointerEnter = useCallback(
    (e: React.PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const p = normPointer(e);
      if (p) activate(p.x, p.y);
    },
    [activate, normPointer],
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      const p = normPointer(e);
      if (p) cursorTarget.current = { x: p.x, y: p.y };
    },
    [normPointer],
  );

  const onPointerLeave = useCallback(
    (e: React.PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      deactivate();
    },
    [deactivate],
  );

  // ── mobile: touch ────────────────────────────────────────

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (e.pointerType !== "touch") return;
      isTouching.current = true;

      const p = normPointer(e);
      if (!p) return;

      // Initial pulse — moderate strength
      activate(p.x, p.y);

      // Long press → deeper melt after 400ms hold
      longPressTimer.current = window.setTimeout(() => {
        if (isTouching.current && prof.current) {
          sTarget.current = prof.current.strength * 1.4;
          bTarget.current = prof.current.blur * 1.6;
        }
      }, 400);
    },
    [activate, normPointer],
  );

  const onPointerUp = useCallback(
    (e: React.PointerEvent) => {
      if (e.pointerType !== "touch") return;
      deactivate();
    },
    [deactivate],
  );

  const onPointerCancel = useCallback(
    (e: React.PointerEvent) => {
      if (e.pointerType !== "touch") return;
      deactivate();
    },
    [deactivate],
  );

  // ── render ───────────────────────────────────────────────

  return (
    <div ref={wrapRef} className="relative inline-flex">
      <svg className="absolute h-0 w-0" aria-hidden="true">
        <defs>
          <filter id="feio-melt" x="-20%" y="-20%" width="140%" height="160%">
            <feTurbulence
              ref={turbRef}
              type="turbulence"
              baseFrequency="0.008 0.012"
              numOctaves="4"
              seed="0"
              result="turb"
            />
            <feOffset
              ref={offsetRef}
              in="turb"
              dx="0"
              dy="0"
              result="shifted"
            />
            <feDisplacementMap
              ref={dispRef}
              in="SourceGraphic"
              in2="shifted"
              scale="0"
              xChannelSelector="R"
              yChannelSelector="G"
              result="warped"
            />
            <feGaussianBlur ref={blurElRef} in="warped" stdDeviation="0" />
          </filter>
        </defs>
      </svg>

      <motion.div
        className="relative inline-flex cursor-pointer select-none"
        style={{ filter: "url(#feio-melt)", touchAction: "none" }}
        onPointerEnter={onPointerEnter}
        onPointerMove={onPointerMove}
        onPointerLeave={onPointerLeave}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerCancel}
      >
        <div className="relative overflow-hidden border border-white/[0.18] bg-white/[0.04] px-14 py-5">
          <motion.span
            className="relative z-10 block font-mono text-[11px] font-light uppercase tracking-[0.5em] text-white"
            animate={
              active
                ? { x: textJitter.x, y: textJitter.y }
                : { x: 0, y: 0 }
            }
            transition={
              active
                ? { duration: 3, repeat: Infinity, ease: "easeInOut" }
                : { duration: 0.6, ease: EASE }
            }
          >
            {label}
          </motion.span>
        </div>
      </motion.div>
    </div>
  );
}
