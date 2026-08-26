"use client";

import { motion, useMotionValueEvent, useScroll, useSpring } from "framer-motion";
import { ArrowUp } from "lucide-react";
import { useState } from "react";
import { useTranslations } from "next-intl";

/**
 * Floating scroll-to-top control with a circular progress ring.
 * The ring stroke is driven by the same spring as the visibility
 * transform — one rAF-throttled scroll source, no manual listeners.
 */
export function ScrollTop() {
  const t = useTranslations("Nav");
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 28, mass: 0.4 });
  const [visible, setVisible] = useState(false);

  useMotionValueEvent(progress, "change", (v) => setVisible(v > 0.12));

  return (
    <motion.button
      type="button"
      aria-label={t("scrollTop")}
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      initial={false}
      animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : 16, pointerEvents: visible ? "auto" : "none" }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="fixed bottom-24 end-4 z-40 grid size-12 place-items-center rounded-full border border-border/70 bg-card/90 shadow-lift backdrop-blur md:bottom-6 md:end-6"
    >
      {/* progress ring */}
      <svg viewBox="0 0 48 48" className="absolute inset-0 -rotate-90" aria-hidden focusable="false">
        <circle cx="24" cy="24" r="20" fill="none" strokeWidth="3" className="stroke-border/60" />
        <motion.circle
          cx="24"
          cy="24"
          r="20"
          fill="none"
          strokeWidth="3"
          strokeLinecap="round"
          className="stroke-[var(--brand-accent)]"
          style={{ pathLength: progress }}
        />
      </svg>
      <ArrowUp className="size-5 text-foreground" aria-hidden />
    </motion.button>
  );
}
