"use client";

import { useState } from "react";
import { Link } from "@/src/i18n/navigation";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent } from "@/src/components/ui/card";
import { Check, Gift } from "lucide-react";
import type { PricingViewModel } from "@/src/server/pricing";

type Billing = "monthly" | "yearly";

function discountPercent(current: string, compareAt: string | null): number | null {
  if (!compareAt) return null;
  const c = Number(current);
  const a = Number(compareAt);
  if (!(a > c)) return null;
  return Math.round(((a - c) / a) * 100);
}

export function PricingSection({ data, headingLevel = "h2" }: { data: PricingViewModel; /** The standalone /pricing page renders this as the page H1. */ headingLevel?: "h1" | "h2" }) {
  const t = useTranslations("Pricing");
  const HeadingTag = headingLevel;
  const prefersReducedMotion = useReducedMotion();
  const [countryCode, setCountryCode] = useState(data.defaultCountryCode);
  const [billing, setBilling] = useState<Billing>("yearly");

  const country = data.countries.find((c) => c.code === countryCode);
  const plans = data.byCountry[countryCode] ?? [];
  const yearlyGifts = data.gifts;

  return (
    <div className="space-y-10">
      {/* Heading */}
      <header className="mx-auto max-w-2xl text-center">
        <HeadingTag className="font-display text-display-md font-bold tracking-tight">{t("title")}</HeadingTag>
        <p className="mt-3 text-muted-foreground">{t("subtitle")}</p>
      </header>

      {/* Controls */}
      <div className="flex flex-wrap items-center justify-center gap-4">
        <div
          role="group"
          aria-label={t("title")}
          className="relative flex rounded-full border border-border bg-card p-1"
        >
          {(["monthly", "yearly"] as const).map((period) => (
            <button
              key={period}
              type="button"
              onClick={() => setBilling(period)}
              aria-pressed={billing === period}
              className="relative rounded-full px-5 py-2 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-primary"
            >
              {billing === period && (
                <motion.span
                  layoutId="billing-pill"
                  className="absolute inset-0 rounded-full bg-primary"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                  aria-hidden
                />
              )}
              <span className={`relative z-10 ${billing === period ? "text-primary-foreground" : "text-muted-foreground"}`}>
                {t(period)}
              </span>
            </button>
          ))}
        </div>

        <Select value={countryCode} onValueChange={setCountryCode}>
          <SelectTrigger className="w-44" aria-label={t("country")}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {data.countries.map((c) => (
              <SelectItem key={c.code} value={c.code}>
                {c.name} · {c.currencySymbol} {c.currencyCode}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Plan cards — START→BUILD→GROW→SCALE visual escalation */}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {plans.map((plan, index) => {
          const price = billing === "monthly" ? plan.monthlyPrice : plan.yearlyPrice;
          const compareAt =
            billing === "monthly" ? plan.monthlyCompareAtPrice : plan.yearlyCompareAtPrice;
          const pct = discountPercent(price, compareAt);
          const isLast = index === plans.length - 1;

          return (
            <Card
              key={plan.id}
              className={
                plan.popular
                  ? "relative border-primary shadow-glow"
                  : isLast
                    ? "relative overflow-hidden border-primary/40 bg-[color-mix(in_srgb,var(--brand-secondary)_92%,black)] text-[#f2f0e9] shadow-lift"
                    : "relative"
              }
            >
              {plan.popular && (
                <Badge variant="accent" className="absolute -top-3 start-1/2 -translate-x-1/2 rtl:translate-x-1/2">
                  ★ {t("popular")}
                </Badge>
              )}
              <CardContent className="flex h-full flex-col gap-5 p-6">
                <div>
                  <h3 className="font-display text-xl font-semibold">{plan.name}</h3>
                  <p className={`mt-1 min-h-10 text-sm ${isLast ? "text-white/70" : "text-muted-foreground"}`}>{plan.shortDescription}</p>
                </div>

                <div className="min-h-20">
                  <AnimatePresence mode="popLayout" initial={false}>
                    <motion.div
                      key={`${plan.id}-${billing}`}
                      initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: prefersReducedMotion ? 0 : -12 }}
                      transition={{ duration: 0.25 }}
                    >
                      <div className="flex items-baseline gap-1.5">
                        <span className="font-display text-4xl font-bold tracking-tight">
                          {country?.currencySymbol} {price}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {billing === "monthly" ? t("perMonth") : t("perYear")}
                        </span>
                      </div>
                      {billing === "yearly" && (
                        <p className="text-xs text-muted-foreground">{t("billedYearly")}</p>
                      )}
                      {compareAt && (
                        <p className={`mt-0.5 text-sm ${isLast ? "text-white/80" : ""}`}>
                          <s className="text-muted-foreground">{country?.currencySymbol} {compareAt}</s>{" "}
                          {pct !== null && (
                            <span className="ms-1 font-medium text-success">{t("save", { percent: pct })}</span>
                          )}
                        </p>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Cumulative value ladder: "everything in X, plus…" + only NEW features */}
                <ul className="flex-1 space-y-2.5 text-sm" aria-label={t("includedFeatures")}>
                  {plan.previousPlanName && (
                    <li
                      className={`flex items-start gap-2.5 rounded-lg px-2 py-1.5 font-semibold ${
                        isLast ? "bg-white/10" : "bg-primary/10 text-primary"
                      }`}
                    >
                      <Check className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
                      {t("everythingInPrevious", { plan: plan.previousPlanName })}
                    </li>
                  )}
                  {(plan.previousPlanName ? plan.newFeatures : plan.features).map((f) => (
                    <li key={f.key} className="flex items-start gap-2.5">
                      <Check className={`mt-0.5 size-4 shrink-0 ${isLast ? "text-[var(--brand-accent)]" : "text-primary"}`} aria-hidden />
                      <span>
                        {f.name}
                        {f.limitValue && (
                          <span className="ms-1 font-medium text-muted-foreground">({f.limitValue})</span>
                        )}
                      </span>
                    </li>
                  ))}
                </ul>

                <Link href={`/contact?plan=${plan.slug}`} className="block">
                  <Button variant={plan.popular ? "default" : "secondary"} className="w-full">
                    {t("choosePlan", { plan: plan.name })}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <p className="text-center text-xs text-muted-foreground">
        {t("currencyDisclaimer", { currency: country?.currencyCode ?? "" })}
      </p>

      {/* Yearly gifts */}
      <div className="rounded-2xl border border-border bg-secondary/40 p-8 text-center">
        <h3 className="font-display text-lg font-semibold">{t("giftsTitle")}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{t("giftsSubtitle")}</p>
        <ul className="mt-5 flex flex-wrap justify-center gap-3">
          {yearlyGifts.map((g) => (
            <li
              key={g.id}
              className="flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-sm"
            >
              <Gift className="size-4 text-primary" aria-hidden />
              {g.name}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
