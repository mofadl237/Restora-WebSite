"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/src/lib/gsap";

/**
 * Branded chef-hat cursor (§20–24): desktop pointer:fine only.
 * - hat follows with a soft lag; ring trails further behind
 * - grows over interactive elements (a/button/inputs/…)
 * - native cursor hidden ONLY while active & inside the window
 * - disabled on touch devices and for reduced-motion users
 * - never blocks clicks (pointer-events-none) and restores the native
 *   cursor when keyboard navigation starts
 */
export function CustomCursor() {
  const rootRef = useRef<HTMLDivElement>(null);
  const enabledRef = useRef(false);

  useGSAP(
    () => {
      const fine = window.matchMedia("(pointer: fine)").matches;
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (!fine || reduced) return;

      const root = rootRef.current;
      if (!root) return;
      enabledRef.current = true;
      document.documentElement.classList.add("has-chef-cursor");

      const hat = root.querySelector<HTMLElement>("[data-cursor-hat]");
      const ring = root.querySelector<HTMLElement>("[data-cursor-ring]");

      gsap.set([hat, ring], { xPercent: -50, yPercent: -50, autoAlpha: 0 });

      const hatX = gsap.quickTo(hat, "x", { duration: 0.28, ease: "power3" });
      const hatY = gsap.quickTo(hat, "y", { duration: 0.28, ease: "power3" });
      const ringX = gsap.quickTo(ring, "x", { duration: 0.5, ease: "power3" });
      const ringY = gsap.quickTo(ring, "y", { duration: 0.5, ease: "power3" });

      let shown = false;
      const show = () => {
        if (!shown) {
          shown = true;
          gsap.to([hat, ring], { autoAlpha: 1, duration: 0.25 });
        }
      };
      const hide = () => {
        shown = false;
        gsap.to([hat, ring], { autoAlpha: 0, duration: 0.25 });
      };

      const INTERACTIVE = "a, button, [role='button'], input, select, textarea, label, summary, details";
      let isOverInteractive = false;

      const onMove = (e: MouseEvent) => {
        show();
        hatX(e.clientX);
        hatY(e.clientY);
        ringX(e.clientX);
        ringY(e.clientY);

        const target = e.target as Element | null;
        const hit = !!target?.closest?.(INTERACTIVE);
        if (hit !== isOverInteractive) {
          isOverInteractive = hit;
          gsap.to(hat, { scale: hit ? 1.45 : 1, rotate: hit ? -8 : -4, duration: 0.3, ease: "back.out(2)" });
          gsap.to(ring, { scale: hit ? 1.7 : 1, opacity: hit ? 0.9 : 0.5, duration: 0.3 });
        }
      };

      const onLeaveWindow = () => hide();
      const onEnterWindow = () => show();
      // Keyboard users must always see the native caret/cursor affordances.
      const onKey = (e: KeyboardEvent) => {
        if (e.key === "Tab") {
          hide();
          document.documentElement.classList.remove("has-chef-cursor");
        }
      };

      window.addEventListener("mousemove", onMove, { passive: true });
      document.documentElement.addEventListener("mouseleave", onLeaveWindow);
      document.documentElement.addEventListener("mouseenter", onEnterWindow);
      window.addEventListener("keydown", onKey);

      return () => {
        enabledRef.current = false;
        document.documentElement.classList.remove("has-chef-cursor");
        window.removeEventListener("mousemove", onMove);
        document.documentElement.removeEventListener("mouseleave", onLeaveWindow);
        document.documentElement.removeEventListener("mouseenter", onEnterWindow);
        window.removeEventListener("keydown", onKey);
      };
    },
    { dependencies: [] },
  );

  return (
    <div ref={rootRef} aria-hidden className="pointer-events-none fixed inset-0 z-[100] hidden md:block">
      <span data-cursor-ring className="absolute left-0 top-0 block size-10 rounded-full border-2 border-primary/50 opacity-50" />
      <span data-cursor-hat className="absolute left-0 top-0 block text-primary drop-shadow-md will-change-transform" style={{ rotate: "-4deg" }}>
        {/* chef toque */}
        <svg viewBox="0 0 24 24" className="size-6" fill="currentColor" aria-hidden>
          <path d="M12 2.2c-1.6 0-2.9.8-3.5 2A3.9 3.9 0 0 0 4 8a3.8 3.8 0 0 0 2.2 3.5V15a1 1 0 0 0 1 1h9.6a1 1 0 0 0 1-1v-3.5A3.8 3.8 0 0 0 20 8a3.9 3.9 0 0 0-4.5-3.8C14.9 3 13.6 2.2 12 2.2Z" />
          <rect x="7" y="17.2" width="10" height="3.4" rx="1.1" />
        </svg>
      </span>
    </div>
  );
}
