"use client";

import { useRef } from "react";
import { Link } from "@/src/i18n/navigation";
import { useGSAP } from "@gsap/react";
import { useTranslations } from "next-intl";
import { gsap } from "@/src/lib/gsap";
import { useMagnetic } from "@/src/lib/use-magnetic";
import { Chef } from "@/src/components/site/chef";
import { QrBadge } from "@/src/components/mockups/ui";

/**
 * Final CTA — cinematic dark band: chef thumbs-up, floating product chips,
 * magnetic CTA button. Entrance is scrub-reversible; magnetism disabled on
 * touch + reduced motion.
 */
export function FinalCta({
  title,
  subtitle,
  ctaLabel,
  ctaHref,
}: {
  title: string;
  subtitle?: string | null;
  ctaLabel?: string | null;
  ctaHref?: string | null;
}) {
  const root = useRef<HTMLElement>(null);
  const btn = useMagnetic<HTMLAnchorElement>(0.25);
  const t = useTranslations("FinalCta");

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      // entrance (reversible)
      gsap.from("[data-cta-copy] > *", {
        y: 34,
        opacity: 0,
        duration: 0.8,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: { trigger: root.current, start: "top 72%", toggleActions: "play none none reverse" },
      });
      gsap.from("[data-cta-chef]", {
        scale: 0.9,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: { trigger: root.current, start: "top 65%", toggleActions: "play none none reverse" },
      });

      // idle bob for chef
      gsap.to("[data-chef='body']", { y: 7, duration: 2.2, yoyo: true, repeat: -1, ease: "sine.inOut" });

      // floating chips parallax
      gsap.utils.toArray<HTMLElement>("[data-cta-float]").forEach((el, i) => {
        gsap.to(el, {
          x: i % 2 ? -14 : 14,
          y: i % 2 ? 10 : -12,
          scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true },
        });
      });
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      className="relative overflow-hidden bg-[radial-gradient(110%_130%_at_50%_100%,var(--brand-secondary),color-mix(in_srgb,var(--brand-secondary)_85%,black))] py-24 text-[#f2f0e9] md:py-32"
    >
      {/* glows */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute -top-20 end-[10%] size-96 rounded-full bg-[var(--brand-accent)] opacity-[0.14] blur-[120px]" />
        <div className="absolute bottom-0 start-[5%] size-80 rounded-full bg-[var(--brand-primary)] opacity-40 blur-[110px]" />
      </div>

      <div className="container-page relative grid items-center gap-10 lg:grid-cols-[1fr_auto]">
        <div data-cta-copy className="text-center lg:text-start">
          <h2 className="font-display font-bold leading-[1.05] tracking-tight text-display-lg">{title}</h2>
          {subtitle && <p className="mx-auto mt-4 max-w-xl text-balance text-white/70 lg:mx-0">{subtitle}</p>}
          {ctaHref && (
            <div className="mt-9 flex justify-center lg:justify-start">
              <Link
                ref={btn}
                href={ctaHref}
                className="group inline-flex items-center gap-2 rounded-full bg-[var(--brand-accent)] px-8 py-3.5 text-sm font-semibold text-accent-foreground shadow-lift transition-shadow hover:shadow-glow"
              >
                {ctaLabel}
                <svg viewBox="0 0 24 24" className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </Link>
            </div>
          )}
        </div>

        {/* Chef */}
        <div className="relative mx-auto w-52 md:w-64">
          <div data-cta-chef className="will-change-transform">
            <Chef pose="thumbs" className="text-white drop-shadow-2xl" />
          </div>
          <div data-cta-float className="absolute -top-2 -start-6 hidden md:block">
            <QrBadge className="p-2 text-white [&_svg]:size-11" />
          </div>
          <div data-cta-float className="absolute top-1/3 -end-8 hidden rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-xs font-medium backdrop-blur md:block">
            ⭐ {t("serviceRating")}
          </div>
        </div>
      </div>
    </section>
  );
}
