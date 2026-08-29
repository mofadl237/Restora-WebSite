import { prisma } from "@/src/lib/db";
import { TestimonialsManager } from "@/src/components/admin/marketing-managers";

export default async function AdminTestimonialsPage() {
  const items = await prisma.testimonial.findMany({
    orderBy: { sortOrder: "asc" },
    include: { translations: true },
  });

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-2xl font-semibold tracking-tight">Testimonials</h1>
        <p className="mt-1 text-sm text-muted-foreground">Social proof shown on the public website.</p>
      </header>

      <TestimonialsManager
        items={items.map((t) => ({
          id: t.id,
          customerName: t.customerName,
          restaurantName: t.restaurantName,
          rating: t.rating,
          active: t.active,
          quoteEn: t.translations.find((x) => x.locale === "en")?.quote ?? null,
          quoteAr: t.translations.find((x) => x.locale === "ar")?.quote ?? null,
        }))}
      />
    </div>
  );
}
