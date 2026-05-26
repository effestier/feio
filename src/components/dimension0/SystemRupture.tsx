"use client";

import { useMemo } from "react";

/* ── Debris content pools ───────────────────────────────── */

const CODE_FRAGMENTS = [
  "</div>", "</span>", "undefined", "null", "NaN", "{...}", "import",
  "return", "function()", "async", "await", "TypeError", "catch(e)",
  "export default", "useState()", "ref.current", "0x00000000",
  "module.exports", "Cannot read", "of undefined", "render()",
  "componentDid", "<Fragment>", "useEffect()", "Promise.reject",
  "new Proxy(", "Symbol(", "Iterator", "ArrayBuffer",
];

const HEX_STRINGS = [
  "0x7F3A", "0xDEAD", "0x0000", "0xFFEE", "0xCAFE", "0xBEEF",
  "0x00FF", "0x7FFF", "0xFFFF", "0x0001", "0x3A2F", "0x9E37",
];

const SYSTEM_ERRORS = [
  "stack overflow", "segmentation fault", "heap corrupted",
  "pointer invalid", "memory access violation", "stack trace:",
  "FATAL:", "abort()", "unreachable code", "type mismatch",
];

/* ── Random helpers ─────────────────────────────────────── */

function rand(min: number, max: number) {
  return min + Math.random() * (max - min);
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

/* ── Props ──────────────────────────────────────────────── */

interface Props {
  visible: boolean;
  originX?: number;
  originY?: number;
}

/* ── System Rupture ─────────────────────────────────────── */

export default function SystemRupture({
  visible,
  originX = 50,
  originY = 50,
}: Props) {
  // Generate all fragments on mount (stable)
  const codeFragments = useMemo(
    () =>
      Array.from({ length: 24 }, (_, i) => ({
        id: `code-${i}`,
        text: pick(CODE_FRAGMENTS),
        angle: Math.random() * Math.PI * 2,
        distance: rand(80, 500),
        delay: rand(0, 400),
        duration: rand(1200, 2200),
        size: rand(9, 13),
        opacity: rand(0.06, 0.18),
      })),
    [],
  );

  const domDebris = useMemo(
    () =>
      Array.from({ length: 10 }, (_, i) => ({
        id: `dom-${i}`,
        width: rand(20, 200),
        height: rand(15, 120),
        angle: Math.random() * Math.PI * 2,
        distance: rand(60, 400),
        delay: rand(50, 300),
        duration: rand(1400, 2400),
        rotation: rand(-180, 180),
      })),
    [],
  );

  const memoryFragments = useMemo(
    () =>
      Array.from({ length: 12 }, (_, i) => ({
        id: `mem-${i}`,
        text: `${pick(HEX_STRINGS)}${Math.random().toString(16).slice(2, 6).toUpperCase()}`,
        angle: Math.random() * Math.PI * 2,
        distance: rand(100, 600),
        delay: rand(100, 600),
        duration: rand(1000, 2000),
      })),
    [],
  );

  const errorFragments = useMemo(
    () =>
      Array.from({ length: 6 }, (_, i) => ({
        id: `err-${i}`,
        text: pick(SYSTEM_ERRORS),
        angle: Math.random() * Math.PI * 2,
        distance: rand(50, 350),
        delay: rand(0, 500),
        duration: rand(800, 1500),
      })),
    [],
  );

  if (!visible) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {/* Code leakage */}
      {codeFragments.map((f) => {
        const x = originX + Math.cos(f.angle) * f.distance * 0.3;
        const y = originY + Math.sin(f.angle) * f.distance * 0.3;
        const tx = Math.cos(f.angle) * f.distance;
        const ty = Math.sin(f.angle) * f.distance;

        return (
          <div
            key={f.id}
            className="absolute font-mono whitespace-nowrap"
            style={{
              left: `${x}%`,
              top: `${y}%`,
              fontSize: `${f.size}px`,
              color: "#ffffff",
              opacity: 0,
              transform: `translate(0px, 0px)`,
              animation: `rupture-scatter ${f.duration}ms ease-out ${f.delay}ms forwards`,
              ["--tx" as string]: `${tx}px`,
              ["--ty" as string]: `${ty}px`,
              ["--target-opacity" as string]: f.opacity,
            }}
          >
            {f.text}
          </div>
        );
      })}

      {/* DOM debris — broken div skeletons */}
      {domDebris.map((d) => {
        const x = originX + Math.cos(d.angle) * d.distance * 0.25;
        const y = originY + Math.sin(d.angle) * d.distance * 0.25;
        const tx = Math.cos(d.angle) * d.distance * 0.8;
        const ty = Math.sin(d.angle) * d.distance * 0.8;

        return (
          <div
            key={d.id}
            className="absolute"
            style={{
              left: `${x}%`,
              top: `${y}%`,
              width: `${d.width}px`,
              height: `${d.height}px`,
              border: "1px solid rgba(255,255,255,0.08)",
              opacity: 0,
              transform: `rotate(0deg)`,
              animation: `rupture-dom ${d.duration}ms ease-out ${d.delay}ms forwards`,
              ["--tx" as string]: `${tx}px`,
              ["--ty" as string]: `${ty}px`,
              ["--rot" as string]: `${d.rotation}deg`,
            }}
          />
        );
      })}

      {/* Memory debris — hex strings */}
      {memoryFragments.map((m) => {
        const x = originX + Math.cos(m.angle) * m.distance * 0.35;
        const y = originY + Math.sin(m.angle) * m.distance * 0.35;
        const tx = Math.cos(m.angle) * m.distance;
        const ty = Math.sin(m.angle) * m.distance;

        return (
          <div
            key={m.id}
            className="absolute font-mono whitespace-nowrap"
            style={{
              left: `${x}%`,
              top: `${y}%`,
              fontSize: "8px",
              color: "#ffffff",
              opacity: 0,
              letterSpacing: "0.1em",
              animation: `rupture-scatter ${m.duration}ms ease-out ${m.delay}ms forwards`,
              ["--tx" as string]: `${tx}px`,
              ["--ty" as string]: `${ty}px`,
              ["--target-opacity" as string]: "0.06",
            }}
          >
            {m.text}
          </div>
        );
      })}

      {/* System error fragments */}
      {errorFragments.map((e) => {
        const x = originX + Math.cos(e.angle) * e.distance * 0.2;
        const y = originY + Math.sin(e.angle) * e.distance * 0.2;
        const tx = Math.cos(e.angle) * e.distance * 0.5;
        const ty = Math.sin(e.angle) * e.distance * 0.5;

        return (
          <div
            key={e.id}
            className="absolute font-mono whitespace-nowrap"
            style={{
              left: `${x}%`,
              top: `${y}%`,
              fontSize: "10px",
              color: "#ffffff",
              opacity: 0,
              fontWeight: 600,
              animation: `rupture-error ${e.duration}ms ease-out ${e.delay}ms forwards`,
              ["--tx" as string]: `${tx}px`,
              ["--ty" as string]: `${ty}px`,
            }}
          >
            {e.text}
          </div>
        );
      })}
    </div>
  );
}
