"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { useTranslations } from "next-intl";
import { gsap, EASE } from "@/src/lib/gsap";
import { useMagnetic } from "@/src/lib/use-magnetic";
import { DashboardMockup } from "@/src/components/mockups/ui";
import { QrBadge } from "@/src/components/mockups/ui";

type HeroProps = {
  eyebrow?: string | null;
  title: string;
  description?: string | null;
  ctaLabel?: string | null;
  ctaHref?: string | null;
};

/**
 * Cinematic hero: staggered headline reveal, dashboard rising into view,
 * floating UI cards with idle motion + scroll parallax.
 * Mobile/reduced-motion get simplified movement.
 */
export function Hero({ eyebrow, title, description, ctaLabel, ctaHref }: HeroProps) {
  const root = useRef<HTMLDivElement>(null);
  const magneticCta = useMagnetic<HTMLAnchorElement>(0.22);
  const t = useTranslations("Hero");

  const words = title.split(" ");

  useGSAP(
    () => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const rtl = document.documentElement.dir === "rtl";
      const mm = gsap.matchMedia();

      if (reduce) {
        gsap.set("[data-hero]", { opacity: 1 });
        return;
      }

      // ---- entrance timeline ----
      const tl = gsap.timeline({ defaults: { ease: EASE.expo }, delay: 0.15 });
      tl.set("[data-hero]", { opacity: 1 })
        .from("[data-hero-eyebrow]", { y: 18, opacity: 0, duration: 0.6 })
        .from(
          "[data-hero-word]",
          { yPercent: 110, rotate: 4, duration: 0.9, stagger: 0.055 },
          "-=0.35",
        )
        .from("[data-hero-desc]", { y: 22, opacity: 0, duration: 0.7 }, "-=0.5")
        .from("[data-hero-cta]", { y: 16, opacity: 0, duration: 0.55, stagger: 0.08 }, "-=0.45")
        .fromTo(
          "[data-hero-dash]",
          { y: 90, opacity: 0, scale: 0.96 },
          { y: 0, opacity: 1, scale: 1, duration: 1.1 },
          "-=0.8",
        )
        .from(
          "[data-hero-float]",
          { y: 40, opacity: 0, duration: 0.7, stagger: 0.12 },
          "-=0.7",
        );

      // bars grow after dashboard lands
      tl.from(
        "[data-hero-dash] .mock-bar",
        { scaleY: 0, transformOrigin: "bottom", duration: 0.6, stagger: 0.06, ease: EASE.out },
        "-=0.5",
      );

      // ---- idle float on decorative cards (transform-only) ----
      gsap.utils.toArray<HTMLElement>("[data-hero-float]").forEach((el, i) => {
        gsap.to(el, {
          y: `+=${10 + i * 3}`,
          rotation: i % 2 ? 1.2 : -1.2,
          duration: 2.6 + i * 0.5,
          yoyo: true,
          repeat: -1,
          ease: "sine.inOut",
          delay: 2 + i * 0.2,
        });
      });

      // ---- scroll parallax (replayable both directions) ----
      mm.add("(min-width: 768px)", () => {
        gsap.to("[data-hero-copy]", {
          y: -60,
          opacity: 0.25,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top top", end: "75% top", scrub: true },
        });
        const signs = rtl ? [-1, 1, -1] : [1, -1, 1];
        gsap.utils.toArray<HTMLElement>("[data-hero-float]").forEach((el, i) => {
          gsap.to(el, {
            x: `${signs[i % 3] * (26 + i * 14)}px`,
            y: -40 - i * 12,
            ease: "none",
            scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
          });
        });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} className="relative overflow-hidden bg-[radial-gradient(120%_120%_at_50%_0%,var(--brand-secondary)_0%,color-mix(in_srgb,var(--brand-secondary)_86%,black)_100%)] text-[#f2f0e9]">
      {/* ambient glows */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute -top-32 start-[8%] size-96 rounded-full bg-[var(--brand-primary)] opacity-30 blur-[110px]" />
        <div className="absolute top-1/3 end-[4%] size-80 rounded-full bg-[var(--brand-accent)] opacity-[0.16] blur-[120px]" />
        <div
          className="absolute inset-0 opacity-[0.13] mix-blend-overlay"
          style={{
            backgroundImage:
              "linear-gradient(color-mix(in srgb, white 12%, transparent) 1px, transparent 1px), linear-gradient(90deg, color-mix(in srgb, white 12%, transparent) 1px, transparent 1px)",
            backgroundSize: "72px 72px",
          }}
        />
      </div>

      <div className="container-page relative py-20 md:py-28">
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8">
          {/* Copy */}
          <div data-hero-copy data-hero className="opacity-0 text-center lg:text-start">
            {eyebrow && (
              <span data-hero-eyebrow className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-medium tracking-wide backdrop-blur">
                <span className="size-1.5 animate-pulse-dot rounded-full bg-[var(--brand-accent)]" aria-hidden />
                {eyebrow}
              </span>
            )}

            <h1 className="mt-6 font-display font-bold leading-[1.04] tracking-tight text-display-lg" aria-label={title}>
              {words.map((w, i) => (
                <span key={i} className="inline-block overflow-hidden pb-1 align-bottom">
                  <span data-hero-word className="inline-block will-change-transform">{w}{"\u00A0"}</span>
                </span>
              ))}
            </h1>

            {description && (
              <p data-hero-desc className="mx-auto mt-5 max-w-xl text-balance text-base text-white/70 md:text-lg lg:mx-0">
                {description}
              </p>
            )}

            {(ctaHref || ctaLabel) && (
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
                {ctaHref && (
                  <a
                    ref={magneticCta}
                    data-hero-cta
                    href={ctaHref}
                    className="group inline-flex items-center gap-2 rounded-full bg-[var(--brand-accent)] px-7 py-3 text-sm font-semibold text-accent-foreground shadow-lift transition-transform duration-300 hover:scale-[1.03] active:scale-[0.98]"
                  >
                    {ctaLabel}
                    <svg viewBox="0 0 24 24" className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                      <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                  </a>
                )}
                <a
                  data-hero-cta
                  href="#story"
                  className="inline-flex items-center gap-2 rounded-full border border-white/20 px-7 py-3 text-sm font-semibold text-white/85 backdrop-blur transition-colors duration-300 hover:bg-white/10"
                >
                  {t("seeStory")}
                </a>
              </div>
            )}
          </div>

          {/* Visual */}
          <div data-hero className="relative mx-auto w-full max-w-xl opacity-0 lg:max-w-none">
            <div data-hero-dash className="will-change-transform">
              <DashboardMockup />
            </div>

            {/* floating cards */}
            <div data-hero-float className="absolute -top-8 end-2 md:-end-6">
              <QrBadge className="text-foreground" />
            </div>
            <div data-hero-float className="absolute -bottom-5 start-0 md:-start-8">
              <div className="flex items-center gap-2 rounded-2xl border border-border bg-card p-3 shadow-lift">
                <span className="relative grid size-9 place-items-center rounded-full bg-success/15 text-success">
                  <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <path d="M4 12.5l5 5L20 6.5" />
                  </svg>
                </span>
                <div>
                  <p className="text-xs font-semibold">#1287 · {t("newOrder")}</p>
                  <p className="text-[10px] text-muted-foreground">Table 4 · {t("justNow")}</p>
                </div>
              </div>
            </div>
            <div data-hero-float className="absolute -bottom-8 end-6 hidden md:block">
              <div className="rounded-2xl border border-border bg-card p-3 shadow-lift">
                <p className="text-sm font-semibold text-warning">★ 4.9</p>
                <p className="text-[10px] text-muted-foreground">{t("guestRating")}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* bottom fade into page background */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-background" aria-hidden />
    </section>
  );
}
