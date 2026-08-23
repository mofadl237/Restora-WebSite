"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { useTranslations } from "next-intl";
import { gsap } from "@/src/lib/gsap";
import {
  PhoneFrame,
  PhoneMenuScreen,
  PhoneOrderScreen,
  DashboardMockup,
  AnalyticsMockup,
  GrowthMockup,
  QrBadge,
} from "@/src/components/mockups/ui";
import { Reveal } from "@/src/components/site/reveal";

export type StorySceneData = {
  id: number;
  sceneKey: string;
  kicker: string | null;
  title: string;
  body: string | null;
  visual: string;
};

function SceneVisual({ scene, phoneIndex }: { scene: StorySceneData; phoneIndex: number }) {
  const t = useTranslations("Story");
  if (scene.visual === "phone") {
    return (
      <div className="relative">
        <PhoneFrame className="mx-auto w-44 md:w-52">
          {phoneIndex === 0 ? <PhoneMenuScreen /> : <PhoneOrderScreen done />}
        </PhoneFrame>
        {phoneIndex === 0 && (
          <QrBadge className="absolute -top-4 -start-2 p-2 text-foreground md:-start-10 [&_svg]:size-12" />
        )}
        {phoneIndex === 0 && (
          <div className="absolute -bottom-4 -end-2 rounded-xl border border-border bg-card px-3 py-2 text-center shadow-lift md:-end-8">
            <p className="text-[10px] font-medium text-muted-foreground">{t("scanBrowseOrder")}</p>
            <p className="text-xs font-semibold text-primary">{t("noDownloads")}</p>
          </div>
        )}
      </div>
    );
  }
  if (scene.visual === "analytics") return <AnalyticsMockup />;
  if (scene.visual === "growth") return <GrowthMockup />;
  return <DashboardMockup compact={scene.visual !== "dashboard"} />;
}

/**
 * Cinematic scroll-driven product story.
 * Desktop (md+): pinned stage — copy and product visual transform through the
 * scenes as the user scrolls (scrubbed, fully reversible).
 * Mobile / reduced-motion: elegant stacked scenes with replayable reveals.
 */
export function ProductStory({ scenes }: { scenes: StorySceneData[] }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [isStatic, setIsStatic] = useState(false);

  // Stable phone-screen index per scene (1st phone scene = menu, 2nd = order)
  const phoneIndexOf = useMemo(() => {
    const map = new Map<number, number>();
    let c = 0;
    scenes.forEach((s) => {
      if (s.visual === "phone") map.set(s.id, c++);
    });
    return map;
  }, [scenes]);

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        setIsStatic(true);
      }
    });
    return () => cancelAnimationFrame(id);
  }, []);

  useGSAP(
    () => {
      if (isStatic || !scenes.length) return;
      const mm = gsap.matchMedia();

      mm.add("(min-width: 768px)", () => {
        const root = wrapRef.current;
        if (!root) return;
        const copies = Array.from(root.querySelectorAll<HTMLElement>("[data-story-copy]"));
        const visuals = Array.from(root.querySelectorAll<HTMLElement>("[data-story-visual]"));
        const dots = Array.from(root.querySelectorAll<HTMLElement>("[data-story-dot]"));
        const rail = root.querySelector<HTMLElement>("[data-story-rail]");
        let current = 0;

        gsap.set(copies.slice(1), { autoAlpha: 0, y: 48 });
        gsap.set(visuals.slice(1), { autoAlpha: 0, scale: 0.93 });

        const setActive = (i: number) => {
          if (i === current) return;
          dots.forEach((d, di) => {
            d.style.width = di === i ? "1.25rem" : "";
            d.style.backgroundColor = di === i ? "var(--primary)" : "";
          });
          current = i;
        };

        const tl = gsap.timeline({
          defaults: { ease: "power2.inOut" },
          scrollTrigger: {
            trigger: root,
            start: "top top",
            end: () => `+=${Math.max(scenes.length - 1, 1) * 85}%`,
            scrub: 0.75,
            onUpdate: (self) => {
              setActive(Math.round(self.progress * (scenes.length - 1)));
              if (rail) rail.style.transform = `scaleY(${self.progress})`;
            },
          },
        });

        const rtl = document.documentElement.dir === "rtl";
        for (let i = 1; i < scenes.length; i++) {
          // alternate lateral drift per scene so the journey glides instead of popping
          const drift = (i % 2 ? 1 : -1) * (rtl ? -1 : 1);
          tl.to(copies[i - 1], { autoAlpha: 0, y: -48, duration: 1 }, i)
            .fromTo(copies[i], { autoAlpha: 0, y: 48 }, { autoAlpha: 1, y: 0, duration: 1 }, i)
            .to(visuals[i - 1], { autoAlpha: 0, scale: 0.95, xPercent: -3.5 * drift, duration: 1 }, i)
            .fromTo(
              visuals[i],
              { autoAlpha: 0, scale: 0.92, xPercent: 3.5 * drift },
              { autoAlpha: 1, scale: 1, xPercent: 0, duration: 1 },
              i,
            );
        }
      });

      return () => mm.revert();
    },
    { scope: wrapRef, dependencies: [isStatic, scenes.length] },
  );

  if (!scenes.length) return null;

  /* ---------------- reduced-motion / static fallback ---------------- */
  if (isStatic) {
    return (
      <section id="story" className="bg-secondary/40" aria-label="Product story">
        <div className="container-page space-y-16 py-20">
          {scenes.map((s) => (
            <div key={s.id} className="grid items-center gap-8 md:grid-cols-2 md:gap-14">
              <StoryCopy scene={s} />
              <SceneVisual scene={s} phoneIndex={phoneIndexOf.get(s.id) ?? -1} />
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section id="story" className="relative bg-secondary/40" aria-label="Product story">
      {/* Mobile: stacked reveal cards */}
      <div className="container-page space-y-16 py-20 md:hidden">
        {scenes.map((s) => (
          <Reveal key={s.id} direction="up" className="space-y-6">
            <StoryCopy scene={s} />
            <SceneVisual scene={s} phoneIndex={phoneIndexOf.get(s.id) ?? -1} />
          </Reveal>
        ))}
      </div>

      {/* Desktop: pinned scrub stage */}
      <div
        ref={wrapRef}
        className="relative hidden md:block"
        style={{ height: `${Math.max(scenes.length - 1, 1) * 85 + 100}vh` }}
      >
        <div className="sticky top-0 flex h-screen items-center overflow-hidden">
          <div className="container-page relative grid w-full grid-cols-[0.9fr_1.1fr] items-center gap-14">
            {/* Progress rail */}
            <div className="pointer-events-none absolute start-6 top-1/2 hidden h-44 -translate-y-1/2 lg:block" aria-hidden>
              <span className="block h-full w-px bg-border" />
              <span
                data-story-rail
                className="absolute inset-x-0 top-0 block h-full w-px origin-top bg-primary"
                style={{ transform: "scaleY(0)" }}
              />
            </div>

            {/* Copy stack */}
            <div className="relative grid">
              {scenes.map((s) => (
                <div key={s.id} data-story-copy className="col-start-1 row-start-1 will-change-transform">
                  <StoryCopy scene={s} />
                </div>
              ))}
            </div>

            {/* Visual stage */}
            <div className="relative aspect-[4/3]">
              {scenes.map((s) => (
                <div
                  key={s.id}
                  data-story-visual
                  className="absolute inset-0 flex items-center justify-center will-change-transform"
                >
                  <SceneVisual scene={s} phoneIndex={phoneIndexOf.get(s.id) ?? -1} />
                </div>
              ))}
            </div>
          </div>

          {/* Scene dots */}
          <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 gap-2" aria-hidden>
            {scenes.map((_, i) => (
              <span
                key={i}
                data-story-dot
                style={i === 0 ? { width: "1.25rem", backgroundColor: "var(--primary)" } : undefined}
                className="h-1.5 w-1.5 rounded-full bg-muted-foreground/30 transition-all duration-300"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function StoryCopy({ scene: s }: { scene: StorySceneData }) {
  return (
    <div>
      {s.kicker && (
        <p className="font-mono text-xs font-semibold uppercase tracking-[0.25em] text-primary">
          {s.kicker}
        </p>
      )}
      <h3 className="mt-3 font-display font-bold tracking-tight text-display-md">{s.title}</h3>
      {s.body && <p className="mt-4 max-w-lg text-pretty leading-relaxed text-muted-foreground">{s.body}</p>}
    </div>
  );
}
