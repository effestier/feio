"use client";

import { motion } from "framer-motion";
import PortalButton from "@/components/shared/PortalButton";

const EASE = [0.22, 1, 0.36, 1] as const;

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.2 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 1, ease: EASE },
  },
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 1.2, ease: "easeOut" as const },
  },
};

export default function SurfaceHero() {
  return (
    <section className="relative flex h-dvh w-full items-center justify-center overflow-hidden bg-black">
      {/* Radial ambient */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(25,25,25,1)_0%,_rgba(0,0,0,1)_70%)]" />

      <motion.div
        className="relative z-10 flex flex-col items-center gap-8 px-6 text-center"
        initial="hidden"
        animate="visible"
        variants={stagger}
      >
        {/* Title — subtle drift */}
        <motion.h1
          className="font-sans text-[clamp(4rem,15vw,12rem)] font-bold leading-none tracking-tighter text-white"
          variants={fadeUp}
          animate={{
            x: [0, 0.5, -0.3, 0.4, 0],
            y: [0, -0.3, 0.4, -0.2, 0],
          }}
          transition={{
            x: { duration: 8, repeat: Infinity, ease: "easeInOut" },
            y: { duration: 7, repeat: Infinity, ease: "easeInOut" },
          }}
        >
          FEIO
        </motion.h1>

        {/* Subtext */}
        <motion.p
          className="font-mono text-sm uppercase tracking-[0.3em] text-zinc-500"
          variants={fadeUp}
        >
          Beauty is predictable.
        </motion.p>

        {/* Supporting line */}
        <motion.p
          className="max-w-sm font-mono text-xs leading-relaxed tracking-wide text-zinc-700"
          variants={fadeUp}
        >
          Controlled ugliness still has unexplored territory.
        </motion.p>

        {/* CTA */}
        <motion.div className="mt-6" variants={fadeIn}>
          <PortalButton />
        </motion.div>
      </motion.div>
    </section>
  );
}
