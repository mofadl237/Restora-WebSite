import { prisma } from "@/src/lib/db";

export type BillingPeriod = "monthly" | "yearly";

export type ResolvedPlan = {
  id: number;
  slug: string;
  popular: boolean;
  badgeKey: string | null;
  ctaKey: string;
  ctaUrl: string | null;
  name: string;
  shortDescription: string;
  longDescription: string | null;
  monthlyPrice: string;
  yearlyPrice: string;
  monthlyCompareAtPrice: string | null;
  yearlyCompareAtPrice: string | null;
  /** Name of the previous plan in the ladder (null for the first plan). */
  previousPlanName: string | null;
  /** Full cumulative feature list assigned in the DB. */
  features: Array<{
    key: string;
    name: string;
    limitValue: string | null;
  }>;
  /**
   * Features NEW to this tier (not present in any earlier active plan by
   * displayOrder) — powers the "everything in X, plus…" cumulative ladder.
   */
  newFeatures: Array<{
    key: string;
    name: string;
    limitValue: string | null;
  }>;
};

export type ResolvedGift = {
  id: number;
  slug: string;
  icon: string | null;
  yearlyOnly: boolean;
  name: string;
  description: string | null;
};

export type PricingResult = {
  currencyCode: string;
  currencySymbol: string;
  plans: ResolvedPlan[];
  gifts: ResolvedGift[];
};

function pickTranslation<T extends { locale: string }>(
  translations: T[],
  locale: string,
): T | undefined {
  return (
    translations.find((t) => t.locale === locale) ??
    translations.find((t) => t.locale === "en") ??
    translations[0]
  );
}

/**
 * Resolve display-ready pricing for a country + locale.
 * Country-specific overrides win over plan defaults; unknown/inactive
 * countries fall back to plan defaults with the first active country's
 * currency as a safe display default (callers may override).
 */
export async function resolvePricing(
  countryCode: string | undefined,
  locale: string,
): Promise<PricingResult> {
  const country = countryCode
    ? await prisma.country.findFirst({
        where: { code: countryCode.toUpperCase(), active: true },
      })
    : null;

  const [plans, gifts, fallbackCountry] = await Promise.all([
    prisma.plan.findMany({
      where: { active: true },
      orderBy: { displayOrder: "asc" },
      include: {
        translations: true,
        countryPrices: country
          ? { where: { countryId: country.id, active: true } }
          : false,
        features: {
          where: { included: true },
          orderBy: { sortOrder: "asc" },
          include: { feature: { include: { translations: true } } },
        },
      },
    }),
    prisma.gift.findMany({
      where: { active: true },
      orderBy: { sortOrder: "asc" },
      include: { translations: true },
    }),
    prisma.country.findFirst({
      where: { active: true },
      orderBy: { sortOrder: "asc" },
    }),
  ]);

  const currencyCode = country?.currencyCode ?? fallbackCountry?.currencyCode ?? "";
  const currencySymbol = country?.currencySymbol ?? fallbackCountry?.currencySymbol ?? "";

  const resolvedPlans: ResolvedPlan[] = plans.map((plan) => {
    const t = pickTranslation(plan.translations, locale);
    const override = "countryPrices" in plan ? plan.countryPrices[0] : undefined;

    return {
      id: plan.id,
      slug: plan.slug,
      popular: plan.popular,
      badgeKey: plan.badgeKey,
      ctaKey: plan.ctaKey,
      ctaUrl: plan.ctaUrl,
      name: t?.name ?? plan.slug,
      shortDescription: t?.shortDescription ?? "",
      longDescription: t?.longDescription ?? null,
      monthlyPrice: String(override?.monthlyPrice ?? plan.monthlyPrice),
      yearlyPrice: String(override?.yearlyPrice ?? plan.yearlyPrice),
      monthlyCompareAtPrice:
        override && override.monthlyCompareAtPrice !== null
          ? String(override.monthlyCompareAtPrice)
          : plan.monthlyCompareAtPrice !== null
            ? String(plan.monthlyCompareAtPrice)
            : null,
      yearlyCompareAtPrice:
        override && override.yearlyCompareAtPrice !== null
          ? String(override.yearlyCompareAtPrice)
          : plan.yearlyCompareAtPrice !== null
            ? String(plan.yearlyCompareAtPrice)
            : null,
      features: plan.features.map(({ feature, limitValue }) => ({
        key: feature.key,
        name: pickTranslation(feature.translations, locale)?.name ?? feature.key,
        limitValue,
      })),
      previousPlanName: null,
      newFeatures: [],
    };
  });

  // Cumulative value ladder: mark which features are genuinely NEW per tier
  // (not inherited from any earlier active plan) and link each tier to the
  // previous plan's display name.
  const seenFeatureKeys = new Set<string>();
  resolvedPlans.forEach((plan, index) => {
    plan.previousPlanName = index > 0 ? resolvedPlans[index - 1].name : null;
    plan.newFeatures = plan.features.filter((f) => !seenFeatureKeys.has(f.key));
    for (const f of plan.features) seenFeatureKeys.add(f.key);
  });

  const resolvedGifts: ResolvedGift[] = gifts.map((gift) => ({
    id: gift.id,
    slug: gift.slug,
    icon: gift.icon,
    yearlyOnly: gift.yearlyOnly,
    name: pickTranslation(gift.translations, locale)?.name ?? gift.slug,
    description: pickTranslation(gift.translations, locale)?.description ?? null,
  }));

  return { currencyCode, currencySymbol, plans: resolvedPlans, gifts: resolvedGifts };
}

export async function listActiveCountries() {
  return prisma.country.findMany({
    where: { active: true },
    orderBy: { sortOrder: "asc" },
    select: { code: true, name: true, currencyCode: true, currencySymbol: true, dialCode: true },
  });
}

export type RecommendedPlan = {
  slug: string;
  name: string;
  shortDescription: string;
  monthlyPrice: string;
  yearlyPrice: string;
  popular: boolean;
  recommendedFor: string[];
};

/** Active plans (displayOrder) with their segment recommendations — /business. */
export async function getPlanRecommendations(locale: string): Promise<RecommendedPlan[]> {
  const plans = await prisma.plan.findMany({
    where: { active: true },
    orderBy: { displayOrder: "asc" },
    include: { translations: true },
  });
  return plans.map((plan) => {
    const t = pickTranslation(plan.translations, locale);
    return {
      slug: plan.slug,
      name: t?.name ?? plan.slug,
      shortDescription: t?.shortDescription ?? "",
      monthlyPrice: String(plan.monthlyPrice),
      yearlyPrice: String(plan.yearlyPrice),
      popular: plan.popular,
      recommendedFor: plan.recommendedFor,
    };
  });
}

export type PricingCountry = {
  code: string;
  name: string;
  currencyCode: string;
  currencySymbol: string;
  dialCode?: string | null;
};

export type PricingViewModel = {
  countries: PricingCountry[];
  defaultCountryCode: string;
  gifts: ResolvedGift[];
  byCountry: Record<string, ResolvedPlan[]>;
};

/**
 * Pre-resolve pricing for every active country so the public pricing UI can
 * switch country/billing instantly without server round-trips.
 */
export async function getPricingViewModel(locale: string): Promise<PricingViewModel> {
  const countries = await listActiveCountries();
  const gifts: ResolvedGift[] = [];
  const byCountry: Record<string, ResolvedPlan[]> = {};

  await Promise.all(
    countries.map(async (country) => {
      const result = await resolvePricing(country.code, locale);
      byCountry[country.code] = result.plans;
      if (gifts.length === 0) gifts.push(...result.gifts);
    }),
  );

  return {
    countries,
    defaultCountryCode: countries[0]?.code ?? "",
    gifts,
    byCountry,
  };
}
