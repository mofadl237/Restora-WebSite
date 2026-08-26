"use client";

import { useMemo, useState } from "react";
import { Link } from "@/src/i18n/navigation";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "@/src/lib/utils";
import type { RecommendedPlan } from "@/src/server/pricing";

const SEGMENT_KEYS = [
  "restaurant",
  "cafe",
  "bakery",
  "sweets",
  "juices",
  "cloud-kitchen",
  "food-truck",
  "catering",
  "home-chef",
] as const;

type SizeKey = "small" | "growing" | "multi";

/**
 * CMS-driven plan recommender: segment → plan via Plan.recommendedFor,
 * business size nudges one tier up/down the active displayOrder ladder.
 */
export function PlanRecommender({ plans }: { plans: RecommendedPlan[] }) {
  const t = useTranslations("Business");
  const reduced = useReducedMotion();
  const [segment, setSegment] = useState<string | null>(null);
  const [size, setSize] = useState<SizeKey>("small");

  const recommended = useMemo(() => {
    if (!segment) return null;
    const matches = plans.filter((p) => p.recommendedFor.includes(segment));
    if (matches.length === 0) return null;
    let index = plans.findIndex((p) => p.slug === matches[0].slug);
    if (size === "multi" && index < plans.length - 1) index += 1;
    return plans[index];
  }, [segment, size, plans]);

  return (
    <div className="mx-auto max-w-3xl">
      {/* step 1 — business type */}
      <p className="text-center text-sm font-semibold text-muted-foreground">{t("recType")}</p>
      <div className="mt-4 flex flex-wrap justify-center gap-2">
        {SEGMENT_KEYS.map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => setSegment(key)}
            aria-pressed={segment === key}
            className={cn(
              "rounded-full border px-4 py-2 text-sm font-medium transition-all duration-300 motion-reduce:transition-none",
              segment === key
                ? "border-primary bg-primary text-primary-foreground shadow-card"
                : "border-border bg-card hover:border-primary/40 hover:text-primary",
            )}
          >
            {t(`segments.${key}.label`)}
          </button>
        ))}
      </div>

      {/* step 2 — size */}
      <p className="mt-8 text-center text-sm font-semibold text-muted-foreground">{t("recSize")}</p>
      <div className="mt-4 flex flex-wrap justify-center gap-2">
        {(["small", "growing", "multi"] as const).map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setSize(s)}
            aria-pressed={size === s}
            className={cn(
              "rounded-full border px-5 py-2 text-sm font-medium transition-colors",
              size === s
                ? "border-primary bg-primary/10 text-primary"
                : "border-border bg-card text-muted-foreground hover:text-foreground",
            )}
          >
            {t(`size.${s}`)}
          </button>
        ))}
      </div>

      {/* result */}
      <div className="mt-10 min-h-40" aria-live="polite">
        <AnimatePresence mode="wait" initial={false}>
          {recommended ? (
            <motion.div
              key={`${recommended.slug}-${size}`}
              initial={{ opacity: 0, y: reduced ? 0 : 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: reduced ? 0 : -12 }}
              transition={{ duration: 0.3 }}
              className="mx-auto max-w-md rounded-3xl border border-primary/40 bg-card p-7 text-center shadow-glow"
            >
              <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.25em] text-primary">
                {t("recResult")}
              </p>
              <h3 className="mt-2 font-display text-2xl font-bold tracking-tight">{recommended.name}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{recommended.shortDescription}</p>
              <p className="mt-4 flex items-baseline justify-center gap-1.5">
                <span className="font-display text-3xl font-bold">EGP {recommended.monthlyPrice}</span>
                <span className="text-sm text-muted-foreground">{t("perMonth")}</span>
              </p>
              <Link
                href="/pricing"
                className="group mt-6 inline-flex items-center gap-2 rounded-full bg-[var(--brand-accent)] px-7 py-3 text-sm font-semibold text-accent-foreground shadow-lift transition-shadow hover:shadow-glow"
              >
                {t("recCta")}
                <Check className="size-4" aria-hidden />
              </Link>
            </motion.div>
          ) : (
            <motion.p
              key="hint"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center text-sm text-muted-foreground"
            >
              {t("recHint")}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
