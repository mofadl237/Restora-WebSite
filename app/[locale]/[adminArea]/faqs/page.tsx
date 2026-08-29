import { prisma } from "@/src/lib/db";
import { FaqsManager } from "@/src/components/admin/marketing-managers";

export default async function AdminFaqsPage() {
  const faqs = await prisma.faq.findMany({
    orderBy: { sortOrder: "asc" },
    include: { translations: true },
  });

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-2xl font-semibold tracking-tight">FAQs</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Questions rendered on the public FAQ section (and used for FAQ structured data).
        </p>
      </header>

      <FaqsManager
        faqs={faqs.map((f) => ({
          id: f.id,
          active: f.active,
          questionEn: f.translations.find((x) => x.locale === "en")?.question ?? null,
          questionAr: f.translations.find((x) => x.locale === "ar")?.question ?? null,
        }))}
      />
    </div>
  );
}
