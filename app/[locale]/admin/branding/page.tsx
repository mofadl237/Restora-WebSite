import { prisma } from "@/src/lib/db";
import { routing } from "@/src/i18n/routing";
import { BrandingForm } from "@/src/components/admin/branding-form";
import { SocialLinksManager } from "@/src/components/admin/social-links-manager";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";

export default async function AdminBrandingPage() {
  const [branding, links] = await Promise.all([
    prisma.branding.findUnique({ where: { id: 1 } }),
    prisma.socialLink.findMany({ orderBy: { sortOrder: "asc" } }),
  ]);

  return (
    <div className="space-y-8">
      <header>
        <h1 className="font-display text-2xl font-semibold tracking-tight">Branding</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Platform identity and contact details. Changes go live immediately.
        </p>
      </header>

      <BrandingForm
        values={{
          brandName: branding?.brandName ?? "RESTORA",
          logoUrl: branding?.logoUrl ?? "",
          faviconUrl: branding?.faviconUrl ?? "",
          primaryColor: branding?.primaryColor ?? "#EF6701",
          secondaryColor: branding?.secondaryColor ?? "#221812",
          accentColor: branding?.accentColor ?? "#FF8A3D",
          defaultLocale: branding?.defaultLocale ?? routing.defaultLocale,
          contactEmail: branding?.contactEmail ?? "",
          contactPhone: branding?.contactPhone ?? "",
          whatsapp: branding?.whatsapp ?? "",
          address: branding?.address ?? "",
        }}
        locales={routing.locales}
      />

      <Card>
        <CardHeader>
          <CardTitle>Social links</CardTitle>
          <CardDescription>Shown in the website footer.</CardDescription>
        </CardHeader>
        <CardContent>
          <SocialLinksManager
            links={links.map(({ id, platform, url, active }) => ({ id, platform, url, active }))}
          />
        </CardContent>
      </Card>
    </div>
  );
}
