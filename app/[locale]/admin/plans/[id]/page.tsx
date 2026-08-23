import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/src/lib/db";
import { PlanEditor } from "@/src/components/admin/plan-editor";
import { Button } from "@/src/components/ui/button";
import { ChevronLeft } from "lucide-react";

export default async function AdminPlanEditPage({
  params,
}: {
  params: Promise<{ id: string; locale: string }>;
}) {
  const { id } = await params;
  const planId = Number(id);
  if (!Number.isInteger(planId)) notFound();

  const plan = await prisma.plan.findUnique({
    where: { id: planId },
    include: {
      translations: true,
      features: { include: { feature: { include: { translations: true } } } },
      countryPrices: true,
    },
  });
  if (!plan) notFound();

  const [allFeatures, activeCountries] = await Promise.all([
    prisma.feature.findMany({
      where: { active: true },
      orderBy: [{ category: "asc" }, { sortOrder: "asc" }],
      include: { translations: true },
    }),
    prisma.country.findMany({ where: { active: true }, orderBy: { sortOrder: "asc" } }),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button asChild variant="ghost" size="icon" aria-label="Back to plans">
          <Link href="/admin/plans">
            <ChevronLeft className="size-4 rtl:-scale-x-100" aria-hidden />
          </Link>
        </Button>
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight">
            {plan.translations.find((t) => t.locale === "en")?.name ?? plan.slug}
          </h1>
          <p className="text-sm text-muted-foreground">/{plan.slug}</p>
        </div>
      </div>

      <PlanEditor
        plan={{
          id: plan.id,
          slug: plan.slug,
          displayOrder: plan.displayOrder,
          active: plan.active,
          popular: plan.popular,
          monthlyPrice: String(plan.monthlyPrice),
          yearlyPrice: String(plan.yearlyPrice),
          monthlyCompareAtPrice: plan.monthlyCompareAtPrice ? String(plan.monthlyCompareAtPrice) : "",
          yearlyCompareAtPrice: plan.yearlyCompareAtPrice ? String(plan.yearlyCompareAtPrice) : "",
          translations: Object.fromEntries(
            plan.translations.map((t) => [
              t.locale,
              {
                name: t.name,
                shortDescription: t.shortDescription,
                longDescription: t.longDescription ?? "",
              },
            ]),
          ),
        }}
        features={allFeatures.map((f) => {
          const assignment = plan.features.find((pf) => pf.featureId === f.id);
          return {
            id: f.id,
            key: f.key,
            nameEn: f.translations.find((t) => t.locale === "en")?.name ?? null,
            category: f.category,
            included: assignment?.included ?? false,
            limitValue: assignment?.limitValue ?? null,
          };
        })}
        countryPricings={activeCountries.map((c) => {
          const override = plan.countryPrices.find((p) => p.countryId === c.id);
          return {
            countryId: c.id,
            countryName: c.name,
            currencyCode: c.currencyCode,
            hasOverride: !!override,
            monthlyPrice: override ? String(override.monthlyPrice) : "",
            yearlyPrice: override ? String(override.yearlyPrice) : "",
            monthlyCompareAtPrice: override?.monthlyCompareAtPrice ? String(override.monthlyCompareAtPrice) : "",
            yearlyCompareAtPrice: override?.yearlyCompareAtPrice ? String(override.yearlyCompareAtPrice) : "",
          };
        })}
      />
    </div>
  );
}
