"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { useTranslations } from "next-intl";
import { gsap } from "@/src/lib/gsap";
import { Reveal } from "@/src/components/site/reveal";

const STEPS = [
  { icon: "💡", key: "idea" },
  { icon: "📱", key: "menu" },
  { icon: "🛵", key: "orders" },
  { icon: "📈", key: "growth" },
] as const;

/**
 * Business journey — vertical timeline with a scrub-drawn connector line and
 * step cards popping in as you scroll. Fully reversible; static fallback for
 * reduced motion.
 */
export function BusinessJourney() {
  const t = useTranslations("Business");
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      gsap.fromTo(
        "[data-journey-line]",
        { scaleY: 0, transformOrigin: "top center" },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: { trigger: "[data-journey-steps]", start: "top 70%", end: "bottom 55%", scrub: 0.6 },
        },
      );

      gsap.utils.toArray<HTMLElement>("[data-journey-step]").forEach((step) => {
        gsap.from(step, {
          x: document.documentElement.dir === "rtl" ? 48 : -48,
          opacity: 0,
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: { trigger: step, start: "top 82%", toggleActions: "play none none reverse" },
        });
        const dot = step.querySelector("[data-journey-dot]");
        if (dot) {
          gsap.from(dot, {
            scale: 0,
            duration: 0.5,
            ease: "back.out(2.5)",
            scrollTrigger: { trigger: step, start: "top 78%", toggleActions: "play none none reverse" },
          });
        }
      });
    },
    { scope: root },
  );

  return (
    <div ref={root} className="mx-auto max-w-2xl">
      <div data-journey-steps className="relative space-y-10 ps-10 md:ps-14">
        {/* connector */}
        <span
          data-journey-line
          className="absolute inset-y-2 start-[13px] w-0.5 bg-gradient-to-b from-primary via-[var(--brand-accent)] to-primary md:start-[21px]"
          aria-hidden
        />
        {STEPS.map((step, i) => (
          <Reveal key={step.key} direction="up" delay={i * 0.05}>
            <div data-journey-step className="relative">
              <span
                data-journey-dot
                className="absolute -start-10 top-1 grid size-7 place-items-center rounded-full border border-primary/40 bg-background text-sm shadow-card md:-start-14"
                aria-hidden
              >
                {step.icon}
              </span>
              <h3 className="font-display text-lg font-bold tracking-tight md:text-xl">
                {t(`steps.${step.key}.title`)}
              </h3>
              <p className="mt-1.5 leading-relaxed text-muted-foreground">
                {t(`steps.${step.key}.desc`)}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
