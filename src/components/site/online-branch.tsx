"use client";

import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { useTranslations } from "next-intl";
import { Globe, MapPin, QrCode, Share2, ShoppingBag, Users, UtensilsCrossed } from "lucide-react";
import { gsap } from "@/src/lib/gsap";
import { Reveal } from "@/src/components/site/reveal";

const NODE_ICONS = [MapPin, Share2, Globe, QrCode, ShoppingBag, Users];
// Node positions on a circle (percent of stage) — 6 nodes evenly spread.
const NODE_POS = [
  { x: 50, y: 4 },
  { x: 88, y: 26 },
  { x: 96, y: 70 },
  { x: 50, y: 94 },
  { x: 4, y: 70 },
  { x: 12, y: 26 },
];

/**
 * Signature moment A — ONLINE BRANCH.
 * The physical restaurant becomes a node surrounded by Google / social /
 * website / QR menu / orders / customers. Scrubbed + reversible on desktop;
 * static reveal on mobile / reduced-motion.
 */
export function OnlineBranch() {
  const t = useTranslations("Moments");
  const wrapRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [isStatic, setIsStatic] = useState(false);

  const nodes = t("branchNodes").split("|");

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) setIsStatic(true);
    });
    return () => cancelAnimationFrame(id);
  }, []);

  useGSAP(
    () => {
      if (isStatic) return;
      const mm = gsap.matchMedia();

      mm.add("(min-width: 768px)", () => {
        const root = wrapRef.current;
        const stage = stageRef.current;
        if (!root || !stage) return;

        const core = stage.querySelector<HTMLElement>("[data-branch-core]");
        const nodeEls = Array.from(stage.querySelectorAll<HTMLElement>("[data-branch-node]"));
        const lines = Array.from(stage.querySelectorAll<SVGPathElement>("[data-branch-line]"));

        // Line geometry from the actual rendered positions (viewBox 1000×1000)
        const stageRect = stage.getBoundingClientRect();
        lines.forEach((line, i) => {
          const el = nodeEls[i];
          const r = el.getBoundingClientRect();
          const nx = ((r.left + r.width / 2 - stageRect.left) / stageRect.width) * 1000;
          const ny = ((r.top + r.height / 2 - stageRect.top) / stageRect.height) * 1000;
          line.setAttribute("d", `M500 500 L ${nx} ${ny}`);
          const len = Math.hypot(nx - 500, ny - 500);
          line.style.strokeDasharray = `${len}`;
          line.style.strokeDashoffset = `${len}`;
        });

        gsap.set(core, { scale: 0.6, autoAlpha: 0 });
        gsap.set(nodeEls, { scale: 0, autoAlpha: 0 });

        const tl = gsap.timeline({
          defaults: { ease: "power2.inOut" },
          scrollTrigger: {
            trigger: root,
            start: "top top",
            end: "+=150%",
            scrub: 0.7,
          },
        });

        tl.fromTo(core, { scale: 0.6, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.8, ease: "back.out(1.5)" })
          .to(core, { scale: 1.06, duration: 0.4 }, ">")
          .to(lines, { strokeDashoffset: 0, duration: 0.5, stagger: 0.08 }, "<")
          .to(
            nodeEls,
            { scale: 1, autoAlpha: 1, duration: 0.55, ease: "back.out(2)", stagger: 0.09 },
            "<",
          );
      });

      return () => mm.revert();
    },
    { scope: wrapRef, dependencies: [isStatic, nodes.length] },
  );

  return (
    <section className="relative overflow-hidden bg-secondary/40" aria-label={t("branchTitle")}>
      <div className="container-page py-20 md:py-28">
        {/* headline */}
        <div className="text-center">
          <Reveal direction="up">
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.3em] text-primary">
              {t("branchKicker")}
            </p>
            <h2 className="mx-auto mt-4 max-w-3xl font-display font-bold leading-tight tracking-tight text-display-lg">
              {t("branchTitle")}
            </h2>
            <p className="mt-3 font-display text-xl font-bold text-primary md:text-2xl">
              {t("branchAccent")}
            </p>
          </Reveal>
        </div>

        {/* static fallback */}
        {isStatic ? (
          <ul className="mx-auto mt-12 flex max-w-2xl flex-wrap items-center justify-center gap-3">
            {nodes.map((label, i) => {
              const Icon = NODE_ICONS[i % NODE_ICONS.length];
              return (
                <li
                  key={label}
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm shadow-card"
                >
                  <Icon className="size-4 text-primary" aria-hidden />
                  {label}
                </li>
              );
            })}
          </ul>
        ) : (
          <>
            {/* mobile reveal grid */}
            <ul className="mx-auto mt-10 grid max-w-md grid-cols-2 gap-3 md:hidden">
              {nodes.map((label, i) => {
                const Icon = NODE_ICONS[i % NODE_ICONS.length];
                return (
                  <Reveal key={label} direction="scale" delay={i * 0.07} amount={0.3} as="li">
                    <span className="flex items-center gap-2 rounded-2xl border border-border bg-card px-4 py-3 text-sm shadow-card">
                      <Icon className="size-4 shrink-0 text-primary" aria-hidden />
                      {label}
                    </span>
                  </Reveal>
                );
              })}
            </ul>

            {/* desktop pinned scrub orbit */}
            <div ref={wrapRef} className="relative hidden h-[250vh] md:block">
              <div className="sticky top-0 flex h-screen items-center">
                <div
                  ref={stageRef}
                  className="relative mx-auto aspect-square w-full max-w-[38rem]"
                >
                  {/* connecting lines */}
                  <svg
                    className="absolute inset-0 size-full"
                    viewBox="0 0 1000 1000"
                    fill="none"
                    aria-hidden
                  >
                    {nodes.map((_, i) => (
                      <path
                        key={i}
                        data-branch-line
                        d=""
                        stroke="var(--primary)"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        opacity="0.45"
                      />
                    ))}
                  </svg>

                  {/* core — the restaurant */}
                  <div
                    data-branch-core
                    className="absolute left-1/2 top-1/2 z-10 grid size-28 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-primary/30 bg-card shadow-lift will-change-transform lg:size-32"
                  >
                    <UtensilsCrossed className="size-9 text-primary" aria-hidden />
                    <span className="sr-only">{t("branchTitle")}</span>
                  </div>

                  {/* orbit nodes */}
                  {nodes.map((label, i) => {
                    const Icon = NODE_ICONS[i % NODE_ICONS.length];
                    return (
                      <div
                        key={label}
                        data-branch-node
                        style={{ left: `${NODE_POS[i].x}%`, top: `${NODE_POS[i].y}%` }}
                        className="absolute z-10 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1.5 will-change-transform"
                      >
                        <span className="grid size-14 place-items-center rounded-full border border-border bg-card shadow-card">
                          <Icon className="size-6 text-primary" aria-hidden />
                        </span>
                        <span className="whitespace-nowrap rounded-full bg-background/90 px-2.5 py-1 text-xs font-medium text-muted-foreground">
                          {label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
