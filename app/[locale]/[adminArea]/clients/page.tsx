import { prisma } from "@/src/lib/db";
import { ClientsManager } from "@/src/components/admin/clients-manager";

export default async function AdminClientsPage() {
  const items = await prisma.client.findMany({
    orderBy: { sortOrder: "asc" },
  });

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-2xl font-semibold tracking-tight">Clients</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Restaurants shown in the public clients showcase. Hidden when the list is empty.
        </p>
      </header>

      <ClientsManager
        items={items.map((c) => ({
          id: c.id,
          name: c.name,
          imageUrl: c.imageUrl,
          countryCode: c.countryCode,
          websiteUrl: c.websiteUrl,
          category: c.category,
          active: c.active,
        }))}
      />
    </div>
  );
}
