"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Reveal, useReplayableInView } from "@/src/components/site/reveal";

export type OutcomeData = { value: string; label: string };

/** Animated number that counts up every time it scrolls into view. */
function CountUp({ value }: { value: string }) {
  const spanRef = useRef<HTMLSpanElement>(null);
  const inView = useReplayableInView(spanRef, 0.6);
  const [display, setDisplay] = useState(value);

  const match = useMemo(() => value.match(/^([^\d-]*)(-?\d+)(.*)$/), [value]);
  const prefix = match?.[1] ?? "";
  const target = match ? Number(match[2]) : 0;
  const suffix = match?.[3] ?? "";

  useEffect(() => {
    if (!match) return;

    // Reset while out of view so the animation replays on every entry.
    if (!inView) {
      const id = requestAnimationFrame(() => setDisplay(`${prefix}0${suffix}`));
      return () => cancelAnimationFrame(id);
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const id = requestAnimationFrame(() => setDisplay(value));
      return () => cancelAnimationFrame(id);
    }

    let raf = 0;
    const t0 = performance.now();
    const dur = 1200;
    const tick = (t: number) => {
      const p = Math.min((t - t0) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(`${prefix}${Math.round(target * eased)}${suffix}`);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, match, prefix, suffix, target, value]);

  return (
    <span
      ref={spanRef}
      className="font-display font-bold tracking-tight text-display-lg text-primary tabular-nums"
    >
      {display}
    </span>
  );
}

/** Outcomes band — big animated stats on a dark brand panel. */
export function Outcomes({
  heading,
  items,
}: {
  heading?: string | null;
  items: OutcomeData[];
}) {
  if (!items.length) return null;
  return (
    <section className="relative overflow-hidden bg-[radial-gradient(100%_140%_at_50%_0%,var(--brand-secondary),color-mix(in_srgb,var(--brand-secondary)_88%,black))] py-20 text-[#f2f0e9] md:py-24">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute -bottom-24 start-[15%] size-80 rounded-full bg-[var(--brand-accent)] opacity-[0.12] blur-[110px]" />
      </div>

      <div className="container-page relative">
        {heading && (
          <Reveal direction="up">
            <h2 className="mx-auto max-w-2xl text-balance text-center font-display font-bold tracking-tight text-display-sm">
              {heading}
            </h2>
          </Reveal>
        )}
        <div className="mt-12 grid gap-10 sm:grid-cols-3">
          {items.map((o, i) => (
            <Reveal key={i} direction="up" delay={i * 0.1} className="text-center">
              <CountUp value={o.value} />
              <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-white/65">{o.label}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
