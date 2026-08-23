"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/src/lib/gsap";
import { Chef } from "@/src/components/site/chef";
import { Reveal, RevealGroup, RevealItem } from "@/src/components/site/reveal";
import { Check } from "lucide-react";

export type PointData = { title: string; description: string | null };

/**
 * Why RESTORA — split layout with the chef narrator beside the differentiators.
 * Chef gets a gentle idle bob + occasional wave (transform-only, yoyo).
 */
export function WhyRestora({
  heading,
  subheading,
  points,
}: {
  heading: string;
  subheading?: string | null;
  points: PointData[];
}) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      // entrance
      gsap.from("[data-chef]", {
        x: document.documentElement.dir === "rtl" ? -60 : 60,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: { trigger: root.current, start: "top 65%", toggleActions: "play none none reverse" },
      });

      // idle bob
      gsap.to("[data-chef='body']", {
        y: 8,
        duration: 2.4,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut",
      });
      gsap.to("[data-chef='head']", {
        rotation: 1.6,
        transformOrigin: "50% 90%",
        duration: 3.2,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut",
      });
      // periodic wave
      const arm = root.current?.querySelector("[data-chef='arm-wave']");
      if (arm) {
        const wave = gsap.timeline({ repeat: -1, repeatDelay: 3.4, paused: false });
        wave.to(arm, { rotation: "-=18", duration: 0.22, yoyo: true, repeat: 3, ease: "sine.inOut", transformOrigin: "20% 20%" })
          .to(arm, { rotation: 0, duration: 0.4, ease: "power2.inOut" });
      }
    },
    { scope: root },
  );

  return (
    <section ref={root} className="container-page py-20 md:py-28">
      <div className="grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr]">
        {/* Chef */}
        <div data-chef className="relative mx-auto w-full max-w-sm will-change-transform">
          <div
            className="absolute inset-x-8 bottom-6 aspect-square rounded-full bg-[radial-gradient(circle,color-mix(in_srgb,var(--brand-accent)_22%,transparent),transparent_70%)] blur-xl"
            aria-hidden
          />
          <Chef pose="wave" className="relative text-foreground drop-shadow-xl" />
        </div>

        {/* Points */}
        <div>
          <Reveal direction="up">
            <h2 className="font-display font-bold tracking-tight text-display-md">{heading}</h2>
            {subheading && <p className="mt-3 max-w-lg text-muted-foreground">{subheading}</p>}
          </Reveal>

          <RevealGroup className="mt-8 space-y-4" stagger={0.12}>
            {points.map((p, i) => (
              <RevealItem key={i}>
                <div className="flex gap-4 rounded-2xl border border-border bg-card p-5 transition-shadow duration-300 hover:shadow-lift">
                  <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-full bg-primary/10 text-primary">
                    <Check className="size-4" aria-hidden />
                  </span>
                  <div>
                    <h3 className="font-semibold">{p.title}</h3>
                    {p.description && (
                      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{p.description}</p>
                    )}
                  </div>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </div>
    </section>
  );
}
