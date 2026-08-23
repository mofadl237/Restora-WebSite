"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/src/lib/gsap";
import { Reveal, RevealGroup, RevealItem } from "@/src/components/site/reveal";

export type StepData = { title: string; description: string | null };

/**
 * How-it-works: three steps with a connector line that draws itself as you
 * scroll through (scrubbed + reversible), staggered card reveals.
 */
export function HowItWorks({ heading, steps }: { heading: string; steps: StepData[] }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduce) return;

      gsap.fromTo(
        "[data-hiw-line]",
        { scaleX: 0 },
        {
          scaleX: 1,
          ease: "none",
          transformOrigin: document.documentElement.dir === "rtl" ? "right center" : "left center",
          scrollTrigger: {
            trigger: root.current,
            start: "top 70%",
            end: "bottom 60%",
            scrub: 0.6,
          },
        },
      );
    },
    { scope: root },
  );

  return (
    <section id="how-it-works" ref={root} className="container-page py-20 md:py-28">
      <Reveal>
        <h2 className="text-center font-display font-bold tracking-tight text-display-md">{heading}</h2>
      </Reveal>

      <div className="relative mt-14">
        {/* connector line (desktop) */}
        <div className="absolute inset-x-24 top-7 hidden h-0.5 bg-border lg:block" aria-hidden>
          <span data-hiw-line className="block h-full w-full bg-gradient-to-r from-primary to-[var(--brand-accent)] rtl:bg-gradient-to-l" />
        </div>

        <RevealGroup className="grid gap-8 sm:grid-cols-3 lg:gap-6" stagger={0.14}>
          {steps.map((s, i) => (
            <RevealItem key={i}>
              <div className="relative flex flex-col items-center text-center">
                <span className="z-10 grid size-14 place-items-center rounded-2xl border border-primary/25 bg-card font-display text-lg font-bold text-primary shadow-card">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-5 font-display text-xl font-semibold">{s.title}</h3>
                {s.description && (
                  <p className="mt-2 max-w-xs text-sm leading-relaxed text-muted-foreground">{s.description}</p>
                )}
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
