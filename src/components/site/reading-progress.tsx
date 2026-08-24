"use client";

import { motion, useScroll, useSpring } from "framer-motion";

/** Slim reading-progress bar pinned under the navbar edge. RTL-aware origin. */
export function ReadingProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 26, mass: 0.4 });

  return (
    <motion.div
      aria-hidden
      className="fixed inset-x-0 top-0 z-[90] h-[3px] origin-left bg-gradient-to-r from-primary via-[var(--brand-accent)] to-primary rtl:origin-right"
      style={{ scaleX }}
    />
  );
}
