import { prisma } from "@/src/lib/db";
import { getPlanRecommendations } from "@/src/server/pricing";
import { ContactInbox } from "@/src/components/admin/contact-inbox";

export default async function AdminContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const [items, plans] = await Promise.all([
    prisma.contactSubmission.findMany({
      orderBy: [{ status: "asc" }, { createdAt: "desc" }],
      take: 200,
    }),
    getPlanRecommendations(locale),
  ]);

  // Resolve plan slugs to their localized DB names (no hardcoding).
  const planNames = Object.fromEntries(plans.map((p) => [p.slug, p.name]));

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-2xl font-semibold tracking-tight">Contact inbox</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Leads submitted from the public contact form, newest first (NEW first).
        </p>
      </header>

      <ContactInbox
        planNames={planNames}
        items={items.map((s) => ({
          id: s.id,
          fullName: s.fullName,
          countryCode: s.countryCode,
          dialCode: s.dialCode,
          phone: s.phone,
          email: s.email,
          businessType: s.businessType,
          selectedPlan: s.selectedPlan,
          locale: s.locale,
          message: s.message,
          status: s.status,
          createdAt: s.createdAt.toLocaleString("en-GB"),
        }))}
      />
    </div>
  );
}
