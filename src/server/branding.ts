import { prisma } from "@/src/lib/db";

export type PublicBranding = {
  brandName: string;
  logoUrl: string | null;
  contactEmail: string | null;
  contactPhone: string | null;
  whatsapp: string | null;
  address: string | null;
};

export async function getBranding(): Promise<PublicBranding> {
  const b = await prisma.branding.findUnique({ where: { id: 1 } });
  return {
    brandName: b?.brandName ?? "RESTORA",
    logoUrl: b?.logoUrl ?? null,
    contactEmail: b?.contactEmail ?? null,
    contactPhone: b?.contactPhone ?? null,
    whatsapp: b?.whatsapp ?? null,
    address: b?.address ?? null,
  };
}

export type PublicSocialLink = { platform: string; url: string };

export async function getSocialLinks(): Promise<PublicSocialLink[]> {
  const links = await prisma.socialLink.findMany({
    where: { active: true },
    orderBy: { sortOrder: "asc" },
  });
  return links.map((l) => ({ platform: l.platform, url: l.url }));
}
