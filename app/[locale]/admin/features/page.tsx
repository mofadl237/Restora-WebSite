import { prisma } from "@/src/lib/db";
import { FeaturesManager } from "@/src/components/admin/features-manager";

export default async function AdminFeaturesPage() {
  const features = await prisma.feature.findMany({
    orderBy: [{ sortOrder: "asc" }],
    include: { translations: true },
  });

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-2xl font-semibold tracking-tight">Features</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          The global feature catalog. Assign features to plans from each plan&apos;s
          edit page.
        </p>
      </header>

      <FeaturesManager
        features={features.map((f) => ({
          id: f.id,
          key: f.key,
          icon: f.icon,
          category: f.category,
          active: f.active,
          nameEn: f.translations.find((t) => t.locale === "en")?.name ?? null,
          nameAr: f.translations.find((t) => t.locale === "ar")?.name ?? null,
        }))}
      />
    </div>
  );
}
