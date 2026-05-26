import { useState, useRef, useCallback, useEffect, useId } from "react";
import { useTemporalEngine } from "./temporalEngine";

/* ── Configuration ──────────────────────────────────────── */

export interface DelayedReactionConfig {
  /** Delay before hover reaction fires (ms) — fires AFTER cursor leaves */
  hoverDelay: number;
  /** How long reaction persists after hover-out (ms) */
  leaveDelay: number;
  /** Delay before click consequence fires (ms) */
  clickDelay: number;
  /** Random jitter range added to all delays (±ms) */
  jitterRange: number;
  /** Unique id prefix for scheduling (auto-generated if omitted) */
  id: string;
}

const DEFAULT_CONFIG: Omit<DelayedReactionConfig, "id"> = {
  hoverDelay: 500,
  leaveDelay: 600,
  clickDelay: 800,
  jitterRange: 200,
};

/* ── Hook ───────────────────────────────────────────────── */

export function useDelayedReaction(
  config: Partial<Omit<DelayedReactionConfig, "id">> & { id?: string } = {},
) {
  const autoId = useId();
  const full = { ...DEFAULT_CONFIG, id: config.id ?? autoId, ...config };
  const scheduleDelayed = useTemporalEngine((s) => s.scheduleDelayed);
  const cancelDelayed = useTemporalEngine((s) => s.cancelDelayed);

  const [isHovered, setIsHovered] = useState(false);
  const [isReacting, setIsReacting] = useState(false);
  const [clickFired, setClickFired] = useState(false);

  // Refs for useFrame access
  const isHoveredRef = useRef(false);
  const isReactingRef = useRef(false);
  const clickFiredRef = useRef(false);

  useEffect(() => {
    return () => {
      cancelDelayed(`${full.id}-hover`);
      cancelDelayed(`${full.id}-leave`);
      cancelDelayed(`${full.id}-click`);
    };
  }, [full.id, cancelDelayed]);

  const jitter = useCallback(
    () => (Math.random() - 0.5) * full.jitterRange * 2,
    [full.jitterRange],
  );

  const onHoverStart = useCallback(() => {
    setIsHovered(true);
    isHoveredRef.current = true;
    cancelDelayed(`${full.id}-leave`);
  }, [full.id, cancelDelayed]);

  const onHoverEnd = useCallback(() => {
    setIsHovered(false);
    isHoveredRef.current = false;
    const delay = full.hoverDelay + jitter();
    scheduleDelayed(`${full.id}-hover`, () => {
      setIsReacting(true);
      isReactingRef.current = true;
      scheduleDelayed(`${full.id}-leave`, () => {
        setIsReacting(false);
        isReactingRef.current = false;
      }, full.leaveDelay + jitter());
    }, Math.max(100, delay));
  }, [full.id, full.hoverDelay, full.leaveDelay, jitter, scheduleDelayed]);

  const onClick = useCallback(() => {
    setClickFired(false);
    clickFiredRef.current = false;
    const delay = full.clickDelay + jitter();
    scheduleDelayed(`${full.id}-click`, () => {
      setClickFired(true);
      clickFiredRef.current = true;
      setTimeout(() => {
        setClickFired(false);
        clickFiredRef.current = false;
      }, 400);
    }, Math.max(200, delay));
  }, [full.id, full.clickDelay, jitter, scheduleDelayed]);

  return {
    isHovered,
    isReacting,
    clickFired,
    isHoveredRef,
    isReactingRef,
    clickFiredRef,
    onHoverStart,
    onHoverEnd,
    onClick,
  };
}
