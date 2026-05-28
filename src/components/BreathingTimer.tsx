"use client";

import { useState, useEffect, useCallback } from "react";

const PHASES = [
  { label: "Breathe In", duration: 4000, scale: 1.3 },
  { label: "Hold", duration: 4000, scale: 1.3 },
  { label: "Breathe Out", duration: 4000, scale: 1 },
] as const;

export default function BreathingTimer() {
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [cycles, setCycles] = useState(0);

  const advance = useCallback(() => {
    setPhaseIndex((prev) => {
      const next = (prev + 1) % PHASES.length;
      if (next === 0) setCycles((c) => c + 1);
      return next;
    });
  }, []);

  useEffect(() => {
    if (!isActive) return;
    const timer = setTimeout(advance, PHASES[phaseIndex].duration);
    return () => clearTimeout(timer);
  }, [isActive, phaseIndex, advance]);

  const phase = PHASES[phaseIndex];

  return (
    <div className="flex flex-col items-center gap-8">
      {/* Circle */}
      <div className="relative w-48 h-48 sm:w-56 sm:h-56 flex items-center justify-center">
        {/* Outer glow */}
        <div
          className="absolute inset-0 rounded-full transition-transform ease-in-out"
          style={{
            transform: `scale(${phase.scale})`,
            transitionDuration: `${phase.duration}ms`,
            background: "radial-gradient(circle, rgba(196,163,90,0.15) 0%, transparent 70%)",
          }}
        />
        {/* Main circle */}
        <div
          className="w-32 h-32 sm:w-40 sm:h-40 rounded-full border-2 border-gold/50 bg-paper flex items-center justify-center transition-transform ease-in-out"
          style={{
            transform: `scale(${phase.scale})`,
            transitionDuration: `${phase.duration}ms`,
            boxShadow: isActive
              ? "0 0 40px rgba(196,163,90,0.2), inset 0 0 30px rgba(196,163,90,0.05)"
              : "none",
          }}
        >
          <span
            className="text-gold font-serif text-base sm:text-lg transition-opacity duration-500"
            style={{ opacity: isActive ? 1 : 0.5 }}
          >
            {isActive ? phase.label : "Start"}
          </span>
        </div>
      </div>

      {/* Cycle count */}
      {cycles > 0 && (
        <p className="text-xs text-muted/60">
          {cycles} {cycles === 1 ? "cycle" : "cycles"} completed
        </p>
      )}

      {/* Controls */}
      <button
        onClick={() => {
          setIsActive((a) => !a);
          setPhaseIndex(0);
        }}
        className="px-6 py-2.5 text-sm font-medium rounded-full border border-gold/30 text-gold hover:bg-gold/10 transition-colors"
      >
        {isActive ? "Pause" : "Begin"}
      </button>
    </div>
  );
}
