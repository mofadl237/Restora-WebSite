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
  features: Array<{
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
    };
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
    select: { code: true, name: true, currencyCode: true, currencySymbol: true },
  });
}

export type PricingCountry = {
  code: string;
  name: string;
  currencyCode: string;
  currencySymbol: string;
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
