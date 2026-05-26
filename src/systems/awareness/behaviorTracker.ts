import { useEffect, useRef, useCallback } from "react";
import { useAwarenessEngine } from "./awarenessEngine";

/**
 * Hook that attaches DOM listeners to track user behavior
 * and feeds raw events into the awareness engine.
 *
 * Attach once in the scene's top-level component.
 */
export function useBehaviorTracker() {
  const recordPointerMove = useAwarenessEngine((s) => s.recordPointerMove);
  const recordClick = useAwarenessEngine((s) => s.recordClick);
  const recordHover = useAwarenessEngine((s) => s.recordHover);
  const tick = useAwarenessEngine((s) => s.tick);

  const hoverTargetRef = useRef<EventTarget | null>(null);
  const hoverTimerRef = useRef<ReturnType<typeof setInterval>>(undefined);

  // Pointer movement — always tracking
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      // Normalize to 0-1
      const nx = e.clientX / window.innerWidth;
      const ny = e.clientY / window.innerHeight;
      recordPointerMove(nx, ny);
    };

    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, [recordPointerMove]);

  // Click tracking
  useEffect(() => {
    const onClick = () => recordClick();
    window.addEventListener("click", onClick);
    return () => window.removeEventListener("click", onClick);
  }, [recordClick]);

  // Hover tracking — periodic tick for dwell time
  useEffect(() => {
    const onOver = (e: Event) => {
      const target = e.target as HTMLElement;
      const isInteractive = target.closest(
        'a, button, [role="button"], [data-interactive"], canvas',
      );
      if (isInteractive) {
        hoverTargetRef.current = target;
        recordHover(true);
      }
    };

    const onOut = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target === hoverTargetRef.current || target.contains(hoverTargetRef.current as Node)) {
        hoverTargetRef.current = null;
        recordHover(false);
      }
    };

    document.addEventListener("mouseover", onOver, true);
    document.addEventListener("mouseout", onOut, true);

    return () => {
      document.removeEventListener("mouseover", onOver, true);
      document.removeEventListener("mouseout", onOut, true);
    };
  }, [recordHover]);

  // Per-frame tick via RAF
  useEffect(() => {
    let raf: number;
    const loop = () => {
      tick();
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [tick]);

  // Hover dwell timer
  useEffect(() => {
    hoverTimerRef.current = setInterval(() => {
      if (hoverTargetRef.current) {
        recordHover(true);
      }
    }, 100);
    return () => clearInterval(hoverTimerRef.current);
  }, [recordHover]);

  return null;
}
