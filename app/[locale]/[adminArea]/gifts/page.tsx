import { prisma } from "@/src/lib/db";
import { GiftsManager } from "@/src/components/admin/gifts-manager";

export default async function AdminGiftsPage() {
  const [gifts, plans] = await Promise.all([
    prisma.gift.findMany({
      orderBy: { sortOrder: "asc" },
      include: { translations: true, plans: true },
    }),
    prisma.plan.findMany({ orderBy: { displayOrder: "asc" }, include: { translations: true } }),
  ]);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-2xl font-semibold tracking-tight">Annual gifts</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Free extras offered with subscription periods. Yearly-only gifts appear
          on the pricing page when the visitor selects yearly billing.
        </p>
      </header>

      <GiftsManager
        gifts={gifts.map((g) => ({
          id: g.id,
          slug: g.slug,
          icon: g.icon,
          yearlyOnly: g.yearlyOnly,
          active: g.active,
          nameEn: g.translations.find((t) => t.locale === "en")?.name ?? null,
          nameAr: g.translations.find((t) => t.locale === "ar")?.name ?? null,
          planIds: g.plans.map((pg) => pg.planId),
        }))}
        plans={plans.map((p) => ({
          id: p.id,
          label: p.translations.find((t) => t.locale === "en")?.name ?? p.slug,
        }))}
      />
    </div>
  );
}
