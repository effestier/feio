"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useDimensionStore } from "@/systems/progression/dimensionStore";

const EASE = [0.22, 1, 0.36, 1] as const;

export default function PortalButton() {
  const [hovered, setHovered] = useState(false);
  const advanceDimension = useDimensionStore((s) => s.advanceDimension);

  return (
    <motion.button
      type="button"
      data-interactive
      className="relative cursor-pointer overflow-hidden border border-white/[0.14] bg-white/[0.03] px-14 py-5 font-mono text-[11px] font-light uppercase tracking-[0.5em] text-white"
      onClick={advanceDimension}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      animate={{
        borderColor: hovered
          ? "rgba(255,255,255,0.25)"
          : "rgba(255,255,255,0.14)",
      }}
      transition={{ duration: 0.4, ease: EASE }}
      whileTap={{ scale: 0.97 }}
    >
      {/* Sheen sweep */}
      <motion.span
        className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.04] to-transparent"
        initial={{ x: "-100%" }}
        animate={{ x: hovered ? "200%" : "-100%" }}
        transition={{ duration: 1.2, ease: "easeInOut" }}
      />

      {/* Label */}
      <span className="relative z-10">ENTER</span>
    </motion.button>
  );
}
