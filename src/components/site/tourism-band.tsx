"use client";

import { Link } from "@/src/i18n/navigation";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Languages } from "lucide-react";

const GREETINGS = [
  { code: "ar", text: "أهلاً وسهلاً" },
  { code: "en", text: "Welcome" },
  { code: "de", text: "Willkommen" },
  { code: "ru", text: "Добро пожаловать" },
  { code: "uk", text: "Ласкаво просимо" },
  { code: "tr", text: "Hoş geldiniz" },
  { code: "it", text: "Benvenuti" },
  { code: "fr", text: "Bienvenue" },
];

/**
 * Tourism positioning band: the world walks past your door — your menu
 * should greet every guest in their language. Lightweight ambient cycle
 * (no scroll-jacking), pauses for reduced motion.
 */
export function TourismBand() {
  const t = useTranslations("Tourism");
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % GREETINGS.length), 1800);
    return () => clearInterval(id);
  }, []);

  const greeting = GREETINGS[index];

  return (
    <section className="relative overflow-hidden border-y border-border/60 bg-secondary/40 py-20 md:py-24">
      {/* soft brand glow */}
      <div aria-hidden className="pointer-events-none absolute -top-24 start-1/4 size-72 rounded-full bg-[var(--brand-primary)]/10 blur-3xl" />
      <div className="container-page relative grid items-center gap-10 lg:grid-cols-[1.2fr_1fr]">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">{t("kicker")}</p>
          <h2 className="mt-3 max-w-xl font-display text-display-sm font-bold tracking-tight md:text-display-md">{t("title")}</h2>
          <p className="mt-4 max-w-xl text-balance leading-relaxed text-muted-foreground">{t("subtitle")}</p>
          <Link
            href="/business/tourist-restaurants"
            className="group mt-7 inline-flex items-center gap-2 rounded-full border border-primary/40 bg-card px-6 py-3 text-sm font-semibold text-primary transition-shadow hover:shadow-glow"
          >
            {t("cta")}
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" aria-hidden />
          </Link>
        </div>

        {/* Greeting cycle card */}
        <div className="relative mx-auto w-full max-w-sm rounded-3xl border border-border bg-card p-8 shadow-lift" dir="ltr">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            <Languages className="size-4 text-primary" aria-hidden />
            {t("langsLine")}
          </div>
          <div className="mt-6 grid min-h-16 place-items-center overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.p
                key={greeting.code}
                initial={{ opacity: 0, y: 14, filter: "blur(4px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -14, filter: "blur(4px)" }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                dir={greeting.code === "ar" ? "rtl" : "ltr"}
                className="font-display text-3xl font-bold tracking-tight"
              >
                {greeting.text}
              </motion.p>
            </AnimatePresence>
          </div>
          <div className="mt-6 flex justify-center gap-1.5">
            {GREETINGS.map((g, i) => (
              <span
                key={g.code}
                aria-hidden
                className={`h-1 rounded-full transition-all duration-300 ${
                  i === index ? "w-5 bg-[var(--brand-accent)]" : "w-1.5 bg-border"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
