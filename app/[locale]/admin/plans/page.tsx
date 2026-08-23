import { prisma } from "@/src/lib/db";
import { PlansManager } from "@/src/components/admin/plans-manager";
import { Alert, AlertDescription } from "@/src/components/ui/alert";

export default async function AdminPlansPage() {
  const [plans, countries] = await Promise.all([
    prisma.plan.findMany({
      orderBy: { displayOrder: "asc" },
      include: { translations: true },
    }),
    prisma.country.findMany({ where: { active: true }, orderBy: { sortOrder: "asc" } }),
  ]);

  const defaultCurrency = countries[0]?.currencyCode ?? "EGP";

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-2xl font-semibold tracking-tight">Plans</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Commercial plans shown on the pricing page. Prices here are the
          defaults; country-specific overrides live inside each plan.
        </p>
      </header>

      {countries.length === 0 && (
        <Alert>
          <AlertDescription>
            No active countries exist. Country-specific pricing requires at
            least one active country.
          </AlertDescription>
        </Alert>
      )}

      <PlansManager
        currency={defaultCurrency}
        plans={plans.map((p) => ({
          id: p.id,
          slug: p.slug,
          displayOrder: p.displayOrder,
          active: p.active,
          popular: p.popular,
          monthlyPrice: String(p.monthlyPrice),
          yearlyPrice: String(p.yearlyPrice),
          monthlyCompareAtPrice: p.monthlyCompareAtPrice ? String(p.monthlyCompareAtPrice) : null,
          yearlyCompareAtPrice: p.yearlyCompareAtPrice ? String(p.yearlyCompareAtPrice) : null,
          nameEn: p.translations.find((t) => t.locale === "en")?.name ?? null,
          nameAr: p.translations.find((t) => t.locale === "ar")?.name ?? null,
        }))}
      />
    </div>
  );
}
