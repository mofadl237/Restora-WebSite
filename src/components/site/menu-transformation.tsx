"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { useTranslations } from "next-intl";
import { gsap } from "@/src/lib/gsap";
import { PhoneFrame, PhoneMenuScreen } from "@/src/components/mockups/ui";

/**
 * SIGNATURE MOMENT E — Menu Transformation: a tired paper menu gets swept
 * away and a live RESTORA digital menu rises in its place. Desktop is a
 * pinned reversible scrub; mobile/reduced-motion get a stacked before/after.
 */
export function MenuTransformation() {
  const t = useTranslations("Moments");
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: "+=180%",
            scrub: 0.6,
            pin: true,
          },
        });

        // paper menu sits, wobbles, then gets swept away
        tl.from("[data-paper]", { y: 60, opacity: 0, rotate: -4, duration: 0.25, ease: "power2.out" })
          .to("[data-paper]", { rotate: 1.5, duration: 0.15, ease: "sine.inOut" })
          .to("[data-paper]", {
            xPercent: 120,
            yPercent: -18,
            rotate: 14,
            opacity: 0,
            duration: 0.35,
            ease: "power3.in",
          })
          // digital menu rises
          .fromTo(
            "[data-phone]",
            { yPercent: 24, scale: 0.85, opacity: 0 },
            { yPercent: 0, scale: 1, opacity: 1, duration: 0.4, ease: "back.out(1.4)" },
            "-=0.12",
          )
          .fromTo(
            "[data-menu-glow]",
            { scale: 0.6, opacity: 0 },
            { scale: 1, opacity: 0.55, duration: 0.3 },
            "<0.15",
          )
          // captions crossfade
          .fromTo("[data-cap-before]", { opacity: 1 }, { opacity: 0, duration: 0.2 }, 0.5)
          .fromTo("[data-cap-after]", { opacity: 0 }, { opacity: 1, duration: 0.25 }, 0.72);
      });
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      className="relative overflow-hidden bg-secondary/40 py-20 md:flex md:h-screen md:items-center md:py-0"
      aria-label={t("menuTitle")}
    >
      <div className="container-page grid items-center gap-12 md:grid-cols-2">
        {/* copy + captions */}
        <div className="text-center md:text-start">
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.3em] text-primary">
            {t("menuKicker")}
          </p>
          <h2 className="mt-4 font-display font-bold leading-tight tracking-tight text-display-md">
            {t("menuTitle")}
          </h2>
          <div className="mt-8 space-y-3 text-start">
            <p data-cap-before className="rounded-xl border border-border bg-card px-4 py-3 text-sm text-muted-foreground line-through decoration-primary/50">
              {t("menuBefore")}
            </p>
            <p data-cap-after className="rounded-xl border border-primary/40 bg-card px-4 py-3 text-sm font-semibold shadow-card">
              {t("menuAfter")}
            </p>
          </div>
          <p className="mt-4 max-w-sm text-balance text-sm text-muted-foreground max-md:mx-auto">
            {t("menuNote")}
          </p>
        </div>

        {/* stage */}
        <div className="relative mx-auto flex h-80 items-center justify-center sm:h-96 md:h-[26rem] md:w-full">
          <div data-menu-glow className="absolute size-72 rounded-full bg-[var(--brand-accent)] opacity-0 blur-[100px]" aria-hidden />

          {/* paper menu (desktop scrub stage only) */}
          <div
            data-paper
            className="absolute hidden h-64 w-48 rotate-[-3deg] rounded-lg bg-[#faf7f0] p-4 shadow-lift will-change-transform md:block sm:h-72 sm:w-56"
            aria-hidden
          >
            <div className="mx-auto mb-3 h-3 w-28 rounded bg-neutral-300/80" />
            <div className="space-y-2.5">
              {[90, 70, 80, 60, 75].map((w, i) => (
                <div key={i} className="flex items-center justify-between gap-3">
                  <span className="h-2 rounded bg-neutral-300/70" style={{ width: `${w}%` }} />
                  <span className="h-2 w-7 rounded bg-primary/30" />
                </div>
              ))}
            </div>
            <div className="mt-4 border-t border-dashed border-neutral-300 pt-3">
              <div className="flex items-center justify-between">
                <span className="h-2 w-16 rounded bg-neutral-300/70" />
                <span className="text-xs font-bold text-red-400">✗</span>
              </div>
              <div className="mt-2 flex items-center justify-between">
                <span className="h-2 w-20 rounded bg-neutral-200" />
                <span className="text-xs font-bold text-red-400">✗</span>
              </div>
            </div>
            {/* coffee ring */}
            <span className="absolute -end-2 bottom-8 size-10 rounded-full border-[3px] border-amber-700/15" aria-hidden />
          </div>

          {/* digital menu */}
          <div data-phone className="relative will-change-transform">
            <PhoneFrame className="w-44 sm:w-52">
              <PhoneMenuScreen />
            </PhoneFrame>
          </div>
        </div>
      </div>
    </section>
  );
}
