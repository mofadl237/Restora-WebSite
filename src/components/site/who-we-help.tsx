"use client";

import { Link } from "@/src/i18n/navigation";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import type { PublicSegmentPage } from "@/src/server/segments";

export type PlanLite = { slug: string; name: string; monthlyPrice: number };

/**
 * Interactive "who do we help" storytelling section — fully CMS-driven via
 * SegmentPage rows. Selecting a business type reveals its pain, what it
 * costs, how RESTORA helps and the recommended plan.
 */
export function WhoWeHelp({
  segments,
  plans,
}: {
  segments: PublicSegmentPage[];
  plans: PlanLite[];
}) {
  const t = useTranslations("Segments");
  const [activeSlug, setActiveSlug] = useState(segments[0]?.slug ?? "");
  const active = segments.find((s) => s.slug === activeSlug) ?? segments[0];
  if (!active) return null;

  const plan = plans.find((p) => p.slug === active.planSlug);

  return (
    <section className="overflow-hidden py-24 md:py-32">
      <div className="container-page">
        <Reveal>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">{t("kicker")}</p>
          <h2 className="mt-3 max-w-2xl font-display text-display-sm font-bold tracking-tight md:text-display-md">
            {t("title")}
          </h2>
          <p className="mt-4 max-w-xl text-balance leading-relaxed text-muted-foreground">{t("subtitle")}</p>
        </Reveal>

        {/* Selector chips */}
        <div
          role="tablist"
          aria-label={t("kicker")}
          className="-mx-4 mt-10 flex gap-2 overflow-x-auto px-4 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:flex-wrap md:mx-0 md:px-0"
        >
          {segments.map((s) => (
            <button
              key={s.slug}
              role="tab"
              aria-selected={s.slug === active.slug}
              onClick={() => setActiveSlug(s.slug)}
              className={`flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-all duration-300 ${
                s.slug === active.slug
                  ? "border-primary bg-[var(--brand-accent)]/15 text-primary shadow-card"
                  : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground"
              }`}
            >
              <span aria-hidden>{s.icon}</span>
              {(s.subtitle ?? s.title).slice(0, 26)}
            </button>
          ))}
        </div>

        {/* Story panel */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active.slug}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="mt-8 grid gap-6 lg:grid-cols-[1fr_360px]"
          >
            <div className="rounded-3xl border border-border bg-card p-7 shadow-card md:p-9">
              <h3 className="font-display text-xl font-bold tracking-tight md:text-2xl">{active.subtitle ?? active.title}</h3>

              <div className="mt-6 grid gap-6 sm:grid-cols-2">
                <div>
                  <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-destructive">
                    ✗ {t("losingLabel")}
                  </p>
                  <ul className="mt-3 space-y-2.5">
                    {active.problems.slice(0, 3).map((p, i) => (
                      <li key={i} className="flex gap-2 text-sm leading-relaxed text-muted-foreground">
                        <span className="mt-2 size-1.5 shrink-0 rounded-full bg-destructive/70" aria-hidden />
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-success">
                    ✓ {t("helpLabel")}
                  </p>
                  <ul className="mt-3 space-y-2.5">
                    {active.useCases.slice(0, 3).map((u, i) => (
                      <li key={i} className="flex gap-2 text-sm leading-relaxed text-muted-foreground">
                        <Check className="mt-0.5 size-4 shrink-0 text-success" aria-hidden />
                        {u}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <Link
                href={`/business/${active.slug}`}
                className="group mt-7 inline-flex items-center gap-1.5 text-sm font-semibold text-primary"
              >
                {t("segmentLink")}
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" aria-hidden />
              </Link>
            </div>

            {/* Plan recommendation */}
            {plan && (
              <aside className="relative flex flex-col overflow-hidden rounded-3xl border border-primary/25 bg-secondary/60 p-7 shadow-card">
                <div
                  aria-hidden
                  className="pointer-events-none absolute -end-16 -top-16 size-44 rounded-full bg-[var(--brand-accent)]/20 blur-3xl"
                />
                <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-primary">{t("planKicker")}</p>
                <p className="mt-3 font-display text-2xl font-bold tracking-tight">{plan.name}</p>
                <p className="mt-1 flex items-baseline gap-1">
                  <span className="font-display text-3xl font-extrabold">{plan.monthlyPrice}</span>
                  <span className="text-sm text-muted-foreground">EGP {t("perMonth")}</span>
                </p>
                <Link
                  href={`/contact?plan=${plan.slug}`}
                  className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-[var(--brand-accent)] px-5 py-3 text-sm font-semibold text-accent-foreground shadow-lift transition-shadow hover:shadow-glow"
                >
                  {t("planCta", { plan: plan.name })}
                </Link>
              </aside>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}

// Local lightweight reveal to avoid importing server-only helpers.
import { useRef, useEffect, useState as useRState } from "react";
function Reveal({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useRState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return setShown(true);
    const io = new IntersectionObserver(
      ([e]) => e.isIntersecting && (setShown(true), io.disconnect()),
      { threshold: 0.2 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [setShown]);
  return (
    <div
      ref={ref}
      style={{
        opacity: shown ? 1 : 0,
        transform: shown ? "none" : "translateY(20px)",
        transition: "opacity .6s cubic-bezier(.22,1,.36,1), transform .6s cubic-bezier(.22,1,.36,1)",
      }}
    >
      {children}
    </div>
  );
}
