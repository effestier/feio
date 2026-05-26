"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";
import { useTemporalEngine } from "@/systems/temporal/temporalEngine";

const INTERACTIVE_SELECTOR =
  'a, button, [role="button"], input, textarea, select, [data-interactive]';

export default function CursorSystem() {
  const [visible, setVisible] = useState(false);
  const [hovering, setHovering] = useState(false);

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  // Temporal desync — ring lags inconsistently
  const temporalActive = useTemporalEngine((s) => s.isActive);
  const desyncedX = useMotionValue(-100);
  const desyncedY = useMotionValue(-100);
  const jitterRef = useRef({ x: 0, y: 0 });
  const desyncRef = useRef(false);
  const desyncEndRef = useRef(0);
  const nextDesyncCheckRef = useRef(0);

  // Normal spring for dot
  const springConfig = { damping: 25, stiffness: 300, mass: 0.4 };
  const smoothX = useSpring(cursorX, springConfig);
  const smoothY = useSpring(cursorY, springConfig);

  // Ring spring — changes when temporal desync is active
  const ringSpringConfig = temporalActive && desyncRef.current
    ? { damping: 40, stiffness: 60, mass: 0.8 } // Laggy, heavy
    : { damping: 25, stiffness: 200, mass: 0.4 };
  const ringX = useSpring(desyncedX, ringSpringConfig);
  const ringY = useSpring(desyncedY, ringSpringConfig);

  const rafRef = useRef(0);
  const targetRef = useRef({ x: 0, y: 0 });
  const currentRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const isTouchDevice =
      "ontouchstart" in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) return;

    document.documentElement.style.cursor = "none";

    const onMouseMove = (e: MouseEvent) => {
      targetRef.current = { x: e.clientX, y: e.clientY };
      if (!visible) setVisible(true);
    };

    const onMouseEnter = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.closest(INTERACTIVE_SELECTOR)) {
        setHovering(true);
      }
    };

    const onMouseLeave = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.closest(INTERACTIVE_SELECTOR)) {
        setHovering(false);
      }
    };

    const onMouseOut = () => {
      setVisible(false);
    };

    const tick = () => {
      currentRef.current.x += (targetRef.current.x - currentRef.current.x) * 0.15;
      currentRef.current.y += (targetRef.current.y - currentRef.current.y) * 0.15;
      cursorX.set(currentRef.current.x);
      cursorY.set(currentRef.current.y);

      // Temporal desync logic for outer ring
      const now = performance.now();

      if (!desyncRef.current && now > nextDesyncCheckRef.current) {
        if (Math.random() < 0.25) {
          desyncRef.current = true;
          desyncEndRef.current = now + 1500 + Math.random() * 2500;
        }
        nextDesyncCheckRef.current = now + 5000 + Math.random() * 10000;
      }

      if (desyncRef.current && now > desyncEndRef.current) {
        desyncRef.current = false;
        jitterRef.current = { x: 0, y: 0 };
      }

      if (desyncRef.current) {
        // Micro-jitter on the ring during desync
        jitterRef.current.x += ((Math.random() - 0.5) * 4 - jitterRef.current.x) * 0.1;
        jitterRef.current.y += ((Math.random() - 0.5) * 4 - jitterRef.current.y) * 0.1;
        desyncedX.set(currentRef.current.x + jitterRef.current.x);
        desyncedY.set(currentRef.current.y + jitterRef.current.y);
      } else {
        desyncedX.set(currentRef.current.x);
        desyncedY.set(currentRef.current.y);
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseover", onMouseEnter, true);
    document.addEventListener("mouseout", onMouseLeave, true);
    document.addEventListener("mouseleave", onMouseOut);

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      document.documentElement.style.cursor = "";
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseover", onMouseEnter, true);
      document.removeEventListener("mouseout", onMouseLeave, true);
      document.removeEventListener("mouseleave", onMouseOut);
      cancelAnimationFrame(rafRef.current);
    };
  }, [cursorX, cursorY, desyncedX, desyncedY, visible]);

  if (!visible) return null;

  return (
    <>
      {/* Main dot — always tracks real position */}
      <motion.div
        className="pointer-events-none fixed top-0 left-0 z-[9999]"
        style={{
          x: smoothX,
          y: smoothY,
          translateX: "-50%",
          translateY: "-50%",
        }}
      >
        <motion.div
          className="rounded-full bg-white"
          animate={{
            width: hovering ? 8 : 5,
            height: hovering ? 8 : 5,
            opacity: hovering ? 1 : 0.85,
          }}
          transition={{ type: "spring", damping: 20, stiffness: 400 }}
        />
      </motion.div>

      {/* Distortion aura ring — uses desynced position during temporal failure */}
      <motion.div
        className="pointer-events-none fixed top-0 left-0 z-[9998]"
        style={{
          x: ringX,
          y: ringY,
          translateX: "-50%",
          translateY: "-50%",
        }}
      >
        <motion.div
          className="rounded-full border border-white/[0.08]"
          animate={{
            width: hovering ? 48 : 36,
            height: hovering ? 48 : 36,
            opacity: hovering ? 0.5 : 0.2,
            borderColor: temporalActive && desyncRef.current
              ? "rgba(255,255,255,0.12)"
              : "rgba(255,255,255,0.08)",
          }}
          transition={{ type: "spring", damping: 20, stiffness: 200 }}
        />
      </motion.div>
    </>
  );
}
