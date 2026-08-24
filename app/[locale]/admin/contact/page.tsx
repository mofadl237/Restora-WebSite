import { prisma } from "@/src/lib/db";
import { ContactInbox } from "@/src/components/admin/contact-inbox";

export default async function AdminContactPage() {
  const items = await prisma.contactSubmission.findMany({
    orderBy: [{ status: "asc" }, { createdAt: "desc" }],
    take: 200,
  });

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-2xl font-semibold tracking-tight">Contact inbox</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Leads submitted from the public contact form, newest first (NEW first).
        </p>
      </header>

      <ContactInbox
        items={items.map((s) => ({
          id: s.id,
          fullName: s.fullName,
          countryCode: s.countryCode,
          dialCode: s.dialCode,
          phone: s.phone,
          email: s.email,
          businessType: s.businessType,
          message: s.message,
          status: s.status,
          createdAt: s.createdAt.toLocaleString("en-GB"),
        }))}
      />
    </div>
  );
}
