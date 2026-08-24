"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Reveal } from "@/src/components/site/reveal";
import { cn } from "@/src/lib/utils";

export type TestimonialItem = {
  id: number;
  customerName: string;
  restaurantName: string | null;
  jobTitle: string | null;
  countryCode: string | null;
  rating: number;
  quote: string;
};

const AUTOPLAY_MS = 6500;

function flagFromCode(code: string): string {
  if (!/^[A-Za-z]{2}$/.test(code)) return "";
  return String.fromCodePoint(
    ...code
      .toUpperCase()
      .split("")
      .map((c) => 127397 + c.charCodeAt(0)),
  );
}

/**
 * Cinematic depth slider — central card full size, neighbours visible at the
 * sides with scale/opacity falloff. Drag, arrows, dots, autoplay
 * (pause-on-hover/focus), keyboard accessible, RTL-aware, reduced-motion
 * falls back to a quiet crossfade.
 */
export function TestimonialsCarousel({ items }: { items: TestimonialItem[] }) {
  const t = useTranslations("Testimonials");
  const locale = useLocale();
  const reduced = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const n = items.length;

  const go = useCallback(
    (next: number) => {
      setIndex(((next % n) + n) % n);
    },
    [n],
  );

  useEffect(() => {
    if (paused || reduced || n < 2) return;
    timer.current = setInterval(() => go(index + 1), AUTOPLAY_MS);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [index, paused, reduced, n, go]);

  if (!n) return null;

  // Wrapped offset of each card relative to the active one (-1 side, 0 center, 1 other side)
  const offsetOf = (i: number) => {
    let o = (((i - index) % n) + n) % n;
    if (o > n / 2) o -= n;
    return o;
  };
  const rtl = locale === "ar";

  const current = items[index];

  return (
    <section className="container-page py-20 md:py-28" aria-labelledby="testimonials-heading">
      <Reveal direction="up">
        <h2 id="testimonials-heading" className="text-center font-display font-bold tracking-tight text-display-md">
          {t("title")}
        </h2>
      </Reveal>

      <div
        className="relative mx-auto mt-12 max-w-4xl"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocus={() => setPaused(true)}
        onBlur={() => setPaused(false)}
      >
        {/* quote mark */}
        <span
          className="pointer-events-none absolute -top-10 start-1/2 z-20 -translate-x-1/2 select-none font-display text-[7rem] leading-none text-primary/15 rtl:translate-x-1/2"
          aria-hidden
        >
          ”
        </span>

        {/* ---------- reduced motion: quiet crossfade ---------- */}
        {reduced ? (
          <div className="relative min-h-56 overflow-hidden rounded-3xl border border-border bg-card p-8 shadow-card md:p-10">
            <AnimatePresence mode="wait" initial={false}>
              <motion.figure
                key={current.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35 }}
                className="text-center"
              >
                <QuoteBody item={current} />
              </motion.figure>
            </AnimatePresence>
          </div>
        ) : (
          /* ---------- depth stage ---------- */
          <div className="relative flex h-[24rem] items-center justify-center md:h-[22rem]">
            {items.map((item, i) => {
              const o = offsetOf(i);
              if (Math.abs(o) > 1) return null;
              const side = o === 0 ? 0 : o < 0 ? -1 : 1;
              const xPos = side * (rtl ? -58 : 58); // % of own width
              const isActive = o === 0;
              return (
                <motion.figure
                  key={item.id}
                  className="absolute w-[min(38rem,88%)] cursor-grab rounded-3xl border border-border bg-card p-8 shadow-card will-change-transform active:cursor-grabbing md:p-10"
                  initial={false}
                  animate={{
                    x: `${xPos}%`,
                    scale: isActive ? 1 : 0.86,
                    opacity: isActive ? 1 : Math.abs(o) > 0 ? 0.4 : 1,
                    zIndex: isActive ? 10 : 5,
                    filter: isActive ? "blur(0px)" : "blur(1px)",
                  }}
                  transition={{ type: "spring", stiffness: 210, damping: 28 }}
                  drag={isActive && n > 1 ? "x" : false}
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.6}
                  onDragEnd={(_, info) => {
                    const swipe = rtl ? -info.offset.x : info.offset.x;
                    if (swipe < -60) go(index + 1);
                    else if (swipe > 60) go(index - 1);
                  }}
                  aria-hidden={!isActive}
                >
                  <QuoteBody item={item} muted={!isActive} />
                </motion.figure>
              );
            })}
          </div>
        )}

        {/* controls */}
        <div className="mt-6 flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => go(index - 1)}
            aria-label={t("previous")}
            className="grid size-9 place-items-center rounded-full border border-border bg-card transition-colors hover:bg-secondary"
          >
            <svg viewBox="0 0 24 24" className="size-4 rtl:rotate-180" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M15 6l-6 6 6 6" />
            </svg>
          </button>
          <div className="flex gap-1.5" role="tablist" aria-label={t("title")}>
            {items.map((it, i) => (
              <button
                key={it.id}
                type="button"
                role="tab"
                aria-selected={i === index}
                aria-label={`${i + 1}`}
                onClick={() => go(i)}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-300",
                  i === index ? "w-6 bg-primary" : "w-1.5 bg-muted-foreground/30 hover:bg-muted-foreground/50",
                )}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={() => go(index + 1)}
            aria-label={t("next")}
            className="grid size-9 place-items-center rounded-full border border-border bg-card transition-colors hover:bg-secondary"
          >
            <svg viewBox="0 0 24 24" className="size-4 rtl:rotate-180" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M9 6l6 6-6 6" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}

function QuoteBody({ item, muted }: { item: TestimonialItem; muted?: boolean }) {
  return (
    <>
      <div className={`text-lg tracking-wide ${muted ? "opacity-70" : ""}`} aria-label={`${item.rating}/5`}>
        {"★".repeat(item.rating)}
      </div>
      <blockquote className={cn("mx-auto mt-4 max-w-xl text-balance leading-relaxed md:text-xl", muted && "text-sm")}>
        “{item.quote}”
      </blockquote>
      <figcaption className="mt-5">
        <span className="font-semibold">{item.customerName}</span>
        {item.jobTitle && <span className="text-muted-foreground"> · {item.jobTitle}</span>}
        {item.restaurantName && (
          <span className="text-muted-foreground"> · {item.restaurantName}</span>
        )}
        {item.countryCode && (
          <span className="ms-1" aria-label={item.countryCode}>
            {flagFromCode(item.countryCode)}
          </span>
        )}
      </figcaption>
    </>
  );
}
