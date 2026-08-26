"use client";

import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { useTranslations } from "next-intl";
import { CheckCheck, MessageCircle, PhoneCall, ReceiptText, Mic, Image as ImageIcon } from "lucide-react";
import { gsap } from "@/src/lib/gsap";
import { Reveal } from "@/src/components/site/reveal";

const CHIP_ICONS = [MessageCircle, PhoneCall, ReceiptText, Mic, ImageIcon];

/** Decorative disorder — tickets, notes, badges, prices. Desktop stage only;
 * everything is absorbed into the dashboard during the scrub. */
const FRAGMENTS = [
  { glyph: "🧾", x: -4, y: 30, r: -14, size: "text-5xl" },
  { glyph: "🗒️", x: 88, y: 18, r: 12, size: "text-4xl" },
  { glyph: "⏰", x: 20, y: 78, r: -8, size: "text-4xl" },
  { glyph: "🍔", x: 58, y: 82, r: 10, size: "text-5xl" },
  { glyph: "❗", x: 44, y: 16, r: -6, size: "text-3xl" },
  { glyph: "☎️", x: 8, y: -6, r: 14, size: "text-3xl" },
  { glyph: "💬", x: 76, y: -8, r: -10, size: "text-4xl" },
  { glyph: "#27", x: 94, y: 52, r: 8, size: "text-xl font-mono font-bold" },
  { glyph: "🔥", x: 2, y: 92, r: 0, size: "text-3xl" },
  { glyph: "EGP 120 ✕", x: 66, y: 34, r: -12, size: "text-sm font-bold line-through decoration-destructive" },
  { glyph: "🍽️", x: 30, y: 40, r: 16, size: "text-4xl" },
  { glyph: "🚴", x: 96, y: 84, r: -9, size: "text-4xl" },
  { glyph: "📝", x: -3, y: 68, r: 11, size: "text-4xl" },
  { glyph: "🔔 ×3", x: 50, y: -7, r: 6, size: "text-lg font-semibold" },
];

/**
 * Signature moment B — CHAOS → CONTROL.
 * Scattered order sources (WhatsApp, calls, paper…) fly into one RESTORA
 * dashboard as the user scrolls. Scrubbed + fully reversible on desktop;
 * elegant stacked reveal on mobile / reduced-motion.
 */
export function ChaosControl() {
  const t = useTranslations("Moments");
  const wrapRef = useRef<HTMLDivElement>(null);
  const [isStatic, setIsStatic] = useState(false);

  const items = t("chaosItems").split("|");
  // Scattered start positions (% of stage) + rotation per chip
  const scattered = [
    { x: 4, y: 8, r: -9 },
    { x: 66, y: 2, r: 7 },
    { x: 0, y: 62, r: 6 },
    { x: 72, y: 58, r: -8 },
    { x: 34, y: -4, r: 4 },
  ];

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
        if (!root) return;
        const chips = Array.from(root.querySelectorAll<HTMLElement>("[data-chip]"));
        const frags = Array.from(root.querySelectorAll<HTMLElement>("[data-frag]"));
        const card = root.querySelector<HTMLElement>("[data-result-card]");
        const ring = root.querySelector<SVGGeometryElement>("[data-draw-line]");

        // Precompute landing deltas (stage center) so the scrubbed timeline
        // contains pure transform tweens — fully reversible.
        const rootRect = root.getBoundingClientRect();
        const targets = chips.map((chip) => {
          const c = chip.getBoundingClientRect();
          return {
            x: rootRect.left + rootRect.width * 0.5 - (c.left + c.width / 2),
            y: rootRect.top + rootRect.height * 0.52 - (c.top + c.height / 2),
          };
        });

        gsap.set(card, { autoAlpha: 0, scale: 0.7 });
        if (ring) gsap.set(ring, { strokeDasharray: 320, strokeDashoffset: 320 });

        const tl = gsap.timeline({
          defaults: { ease: "power2.inOut" },
          scrollTrigger: {
            trigger: root,
            start: "top top",
            end: "+=160%",
            scrub: 0.7,
          },
        });

        // Phase 1 — fragments wobble then dissolve first (noise dies early)
        frags.forEach((f, i) => {
          tl.to(
            f,
            { rotate: `+=${i % 2 ? 8 : -8}`, yPercent: -4, duration: 0.5 },
            i * 0.05,
          );
        });
        tl.to(frags, { autoAlpha: 0, scale: 0.5, duration: 0.5, ease: "power2.in" }, 0.55);
        // Phase 2 — chips converge toward the center (staggered)
        chips.forEach((chip, i) => {
          tl.to(
            chip,
            { x: targets[i].x, y: targets[i].y, rotate: 0, duration: 1 },
            i * 0.18,
          );
        });
        // Phase 2 — absorbed into the card
        tl.to(chips, { autoAlpha: 0, scale: 0.4, duration: 0.35, ease: "power2.in" }, items.length * 0.18 - 0.15);
        // Phase 3 — the RESTORA card takes over
        tl.fromTo(
          card,
          { autoAlpha: 0, scale: 0.7 },
          { autoAlpha: 1, scale: 1, duration: 0.9, ease: "back.out(1.6)" },
          items.length * 0.18 - 0.1,
        );
        if (ring) tl.to(ring, { strokeDashoffset: 0, duration: 0.7 }, "<0.2");
      });

      return () => mm.revert();
    },
    { scope: wrapRef, dependencies: [isStatic, items.length] },
  );

  return (
    <section className="border-y border-border bg-background" aria-label={t("chaosTitle")}>
      <div className="container-page py-20 md:py-24">
        <Reveal direction="up">
          <p className="text-center font-mono text-xs font-semibold uppercase tracking-[0.3em] text-primary">
            {t("chaosKicker")}
          </p>
          <h2 className="mx-auto mt-4 max-w-3xl text-center font-display font-bold tracking-tight text-display-md">
            {t("chaosTitle")}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-balance text-center text-muted-foreground">
            {t("chaosSubtitle")}
          </p>
        </Reveal>

        {/* ---------- static fallback (mobile + reduced motion) ---------- */}
        {isStatic ? (
          <div className="mx-auto mt-12 flex max-w-md flex-col items-center gap-4">
            <div className="flex flex-wrap justify-center gap-2">
              {items.map((label) => (
                <span
                  key={label}
                  className="rounded-full border border-border bg-card px-3 py-1.5 text-xs text-muted-foreground"
                >
                  {label}
                </span>
              ))}
            </div>
            <ResultCard label={t("chaosResult")} />
          </div>
        ) : (
          <>
            {/* mobile stacked reveal */}
            <div className="mt-12 flex flex-col items-center gap-5 md:hidden">
              <div className="flex flex-wrap justify-center gap-2">
                {items.map((label, i) => (
                  <Reveal key={label} direction="scale" delay={i * 0.07} amount={0.4}>
                    <span className="inline-block rounded-full border border-border bg-card px-3 py-1.5 text-xs text-muted-foreground shadow-card">
                      {label}
                    </span>
                  </Reveal>
                ))}
              </div>
              <Reveal direction="up" delay={0.25}>
                <ResultCard label={t("chaosResult")} />
              </Reveal>
            </div>

            {/* desktop pinned scrub stage */}
            <div ref={wrapRef} className="relative hidden h-[260vh] md:block">
              <div className="sticky top-0 flex h-screen items-center overflow-hidden">
                <div className="relative mx-auto aspect-[16/10] w-full max-w-4xl" style={{ containerType: "size" }}>
                  {/* merge lines */}
                  <svg className="absolute inset-0 size-full" viewBox="0 0 1600 1000" fill="none" aria-hidden preserveAspectRatio="none">
                    <path
                      data-draw-line
                      d="M800 520 C 700 480, 900 460, 800 500"
                      stroke="var(--primary)"
                      strokeWidth="2"
                      opacity="0.5"
                    />
                  </svg>

                  {items.map((label, i) => {
                    const Icon = CHIP_ICONS[i % CHIP_ICONS.length];
                    return (
                      <span
                        key={label}
                        data-chip
                        style={{ left: `${scattered[i].x}%`, top: `${scattered[i].y}%`, rotate: `${scattered[i].r}deg` }}
                        className="absolute inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border border-border bg-card px-3.5 py-2 text-xs font-medium text-muted-foreground shadow-card will-change-transform"
                      >
                        <Icon className="size-3.5 opacity-60 rtl:-scale-x-100" aria-hidden />
                        {label}
                      </span>
                    );
                  })}

                  {FRAGMENTS.map((f, i) => (
                    <span
                      key={i}
                      data-frag
                      aria-hidden
                      style={{ left: `${f.x}%`, top: `${f.y}%`, rotate: `${f.r}deg` }}
                      className={`absolute select-none opacity-80 will-change-transform ${f.size}`}
                    >
                      {f.glyph}
                    </span>
                  ))}

                  <div data-result-card className="absolute left-1/2 top-[52%] -translate-x-1/2 -translate-y-1/2 will-change-transform">
                    <ResultCard big label={t("chaosResult")} />
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}

function ResultCard({ label, big }: { label: string; big?: boolean }) {
  return (
    <div
      className={`flex items-center gap-3 rounded-2xl border border-primary/30 bg-secondary/60 shadow-lift ${
        big ? "px-6 py-5" : "px-5 py-4"
      }`}
    >
      <span className={`grid place-items-center rounded-full bg-primary text-primary-foreground ${big ? "size-11" : "size-9"}`}>
        <CheckCheck className={big ? "size-5" : "size-4"} aria-hidden />
      </span>
      <span className={`font-display font-bold tracking-tight ${big ? "text-xl" : "text-base"}`}>{label}</span>
    </div>
  );
}
