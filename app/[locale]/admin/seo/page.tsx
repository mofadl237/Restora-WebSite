import { prisma } from "@/src/lib/db";
import { SeoManager } from "@/src/components/admin/marketing-managers";

export default async function AdminSeoPage() {
  const entries = await prisma.seoEntry.findMany({
    orderBy: [{ page: "asc" }, { locale: "asc" }],
  });

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-2xl font-semibold tracking-tight">SEO</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Per-page metadata consumed by the public website&apos;s dynamic
          metadata generation.
        </p>
      </header>

      <SeoManager
        entries={entries.map((e) => ({
          page: e.page,
          locale: e.locale,
          title: e.title,
          description: e.description,
        }))}
      />
    </div>
  );
}
