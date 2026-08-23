import { prisma } from "@/src/lib/db";
import { SectionsManager } from "@/src/components/admin/marketing-managers";

export default async function AdminSectionsPage() {
  const sections = await prisma.marketingSection.findMany({
    orderBy: { sortOrder: "asc" },
    include: { translations: true },
  });

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-2xl font-semibold tracking-tight">Marketing sections</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Copy for the public homepage, looked up by section key. Deactivated
          sections fall back to their default behavior.
        </p>
      </header>

      <SectionsManager
        sections={sections.map((s) => ({
          id: s.id,
          sectionKey: s.sectionKey,
          active: s.active,
          translations: Object.fromEntries(
            s.translations.map((t) => [
              t.locale,
              {
                title: t.title,
                subtitle: t.subtitle ?? "",
                description: t.description ?? "",
                ctaLabel: t.ctaLabel ?? "",
                ctaHref: t.ctaHref ?? "",
              },
            ]),
          ),
        }))}
      />
    </div>
  );
}
