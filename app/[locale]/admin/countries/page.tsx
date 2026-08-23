import { prisma } from "@/src/lib/db";
import { CountriesManager } from "@/src/components/admin/countries-manager";

export default async function AdminCountriesPage() {
  const countries = await prisma.country.findMany({ orderBy: { sortOrder: "asc" } });

  return (
    <div className="space-y-8">
      <header>
        <h1 className="font-display text-2xl font-semibold tracking-tight">Countries</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Markets with country-specific pricing and currencies. Deactivated
          countries disappear from the public pricing selector.
        </p>
      </header>

      <CountriesManager countries={countries.map((c) => ({ ...c }))} />
    </div>
  );
}
