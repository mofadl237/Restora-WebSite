"use client";

import { useEffect, useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/src/lib/gsap";
import type { PublicClient } from "@/src/server/content";

function flagFromCode(code: string): string {
  if (!/^[A-Za-z]{2}$/.test(code)) return "";
  return String.fromCodePoint(
    ...code
      .toUpperCase()
      .split("")
      .map((c) => 127397 + c.charCodeAt(0)),
  );
}

function initials(name: string): string {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

/**
 * Premium circular clients showcase (§14):
 * continuous GSAP drift (not a plain CSS marquee) + 3D-ish depth — each card
 * scales/fades by proximity to the viewport center. Hover pauses the drift and
 * focuses the card. Fully reversible & reduced-motion aware.
 */
export function ClientsMarquee({ clients }: { clients: PublicClient[] }) {
  const reducedRef = useRef(false);

  useEffect(() => {
    reducedRef.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  useGSAP(
    () => {
      if (reducedRef.current) return;
      const track = document.querySelector<HTMLElement>("[data-clients-track]");
      if (!track || !clients.length) return;

      const rtl = document.documentElement.dir === "rtl";
      const loopDuration = Math.max(18, clients.length * 4.5);

      // Seamless loop: track holds two copies; shift exactly one copy width.
      const tween = gsap.to(track, {
        xPercent: rtl ? 50 : -50,
        ease: "none",
        duration: loopDuration,
        repeat: -1,
      });
      (track as HTMLElement & { _marquee?: gsap.core.Tween })._marquee = tween;

      const section = track.closest("section");
      const pause = () => gsap.to(tween, { timeScale: 0, duration: 0.4, overwrite: true });
      const resume = () => gsap.to(tween, { timeScale: 1, duration: 0.4, overwrite: true });
      section?.addEventListener("mouseenter", pause);
      section?.addEventListener("mouseleave", resume);
      section?.addEventListener("focusin", pause);
      section?.addEventListener("focusout", resume);

      // Depth pass — scale/opacity by distance to viewport center
      const cards = Array.from(track.querySelectorAll<HTMLElement>("[data-client-card]"));
      const setters = cards.map((card) => ({
        el: card,
        scale: gsap.quickSetter(card, "scale") as (v: number) => void,
        opacity: gsap.quickSetter(card, "opacity") as (v: number) => void,
      }));
      let raf = 0;
      const tick = () => {
        const cx = window.innerWidth / 2;
        for (const s of setters) {
          const r = s.el.getBoundingClientRect();
          if (r.right < -80 || r.left > window.innerWidth + 80) continue;
          const d = Math.abs(r.left + r.width / 2 - cx);
          const norm = Math.min(d / (window.innerWidth * 0.5), 1);
          s.scale(1 - norm * 0.28);
          s.opacity(1 - norm * 0.55);
        }
        raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);

      return () => {
        cancelAnimationFrame(raf);
        section?.removeEventListener("mouseenter", pause);
        section?.removeEventListener("mouseleave", resume);
        section?.removeEventListener("focusin", pause);
        section?.removeEventListener("focusout", resume);
        tween.kill();
      };
    },
    { dependencies: [clients.length] },
  );

  if (clients.length === 0) return null;

  const Card = ({ c }: { c: PublicClient }) => (
    <span className="relative mx-5 block size-28 shrink-0 md:size-32" data-client-card>
      <span className="grid size-full place-items-center overflow-hidden rounded-full border border-border bg-card shadow-card transition-colors duration-300 group-hover:border-primary/50">
        {c.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element -- CMS-provided arbitrary URL
          <img src={c.imageUrl} alt="" className="size-full object-cover" loading="lazy" />
        ) : (
          <span aria-hidden className="font-display text-2xl font-bold text-primary/70">
            {initials(c.name)}
          </span>
        )}
      </span>
      {c.countryCode && (
        <span
          className="absolute -bottom-0.5 -end-0.5 grid size-8 place-items-center rounded-full border border-border bg-background text-base shadow-card"
          aria-label={c.countryCode}
        >
          {flagFromCode(c.countryCode)}
        </span>
      )}
    </span>
  );

  const Labelled = ({ c }: { c: PublicClient }) => (
    <div className="flex w-36 shrink-0 flex-col items-center">
      <Card c={c} />
      <span className="mt-3 max-w-full truncate text-sm font-semibold">{c.name}</span>
      {c.category && (
        <span className="max-w-full truncate text-xs text-muted-foreground">{c.category}</span>
      )}
    </div>
  );

  return (
    <div
      className="group relative mt-12 overflow-hidden py-4 [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]"
      role="list"
      aria-label="clients"
    >
      <div data-clients-track className="flex w-max will-change-transform rtl:flex-row-reverse">
        {[...clients, ...clients].map((c, i) =>
          c.websiteUrl ? (
            <a
              key={`${c.id}-${i}`}
              href={c.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              role="listitem"
              aria-label={c.name}
              className="group/item"
            >
              <Labelled c={c} />
            </a>
          ) : (
            <div key={`${c.id}-${i}`} role="listitem" className="group/item">
              <Labelled c={c} />
            </div>
          ),
        )}
      </div>
    </div>
  );
}
