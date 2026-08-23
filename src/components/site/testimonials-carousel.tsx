"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Reveal } from "@/src/components/site/reveal";
import { cn } from "@/src/lib/utils";

export type TestimonialItem = {
  id: number;
  customerName: string;
  restaurantName: string | null;
  rating: number;
  quote: string;
};

const AUTOPLAY_MS = 6000;

/** Auto-advancing, swipeable testimonial spotlight. Pauses on hover/focus. */
export function TestimonialsCarousel({ items }: { items: TestimonialItem[] }) {
  const t = useTranslations("Testimonials");
  const reduced = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [dir, setDir] = useState(1);
  const [paused, setPaused] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const go = useCallback(
    (next: number, direction: number) => {
      setDir(direction);
      setIndex(((next % items.length) + items.length) % items.length);
    },
    [items.length],
  );

  useEffect(() => {
    if (paused || reduced || items.length < 2) return;
    timer.current = setInterval(() => go(index + 1, 1), AUTOPLAY_MS);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [index, paused, reduced, items.length, go]);

  if (!items.length) return null;
  const current = items[index];
  const rtl = dir < 0;

  return (
    <section className="container-page py-20 md:py-28" aria-labelledby="testimonials-heading">
      <Reveal direction="up">
        <h2 id="testimonials-heading" className="text-center font-display font-bold tracking-tight text-display-md">
          {t("title")}
        </h2>
      </Reveal>

      <div
        className="relative mx-auto mt-12 max-w-3xl"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocus={() => setPaused(true)}
        onBlur={() => setPaused(false)}
      >
        {/* quote mark */}
        <span
          className="pointer-events-none absolute -top-8 start-1/2 -translate-x-1/2 select-none font-display text-[7rem] leading-none text-primary/15 rtl:translate-x-1/2"
          aria-hidden
        >
          ”
        </span>

        <div className="relative min-h-56 overflow-hidden rounded-3xl border border-border bg-card p-8 shadow-card md:p-10">
          <AnimatePresence mode="wait" initial={false} custom={rtl}>
            <motion.figure
              key={current.id}
              custom={rtl}
              initial={reduced ? false : { opacity: 0, x: rtl ? -48 : 48 }}
              animate={{ opacity: 1, x: 0 }}
              exit={reduced ? undefined : { opacity: 0, x: rtl ? 48 : -48 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="text-center"
            >
              <div className="text-lg tracking-wide text-warning" aria-label={`${current.rating}/5`}>
                {"★".repeat(current.rating)}
              </div>
              <blockquote className="mx-auto mt-4 max-w-xl text-balance text-lg leading-relaxed md:text-xl">
                “{current.quote}”
              </blockquote>
              <figcaption className="mt-5">
                <span className="font-semibold">{current.customerName}</span>
                {current.restaurantName && (
                  <span className="text-muted-foreground"> · {current.restaurantName}</span>
                )}
              </figcaption>
            </motion.figure>
          </AnimatePresence>
        </div>

        {/* controls */}
        <div className="mt-6 flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => go(index - 1, -1)}
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
                onClick={() => go(i, i > index ? 1 : -1)}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-300",
                  i === index ? "w-6 bg-primary" : "w-1.5 bg-muted-foreground/30 hover:bg-muted-foreground/50",
                )}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={() => go(index + 1, 1)}
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
