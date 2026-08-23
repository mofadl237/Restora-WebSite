"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/src/lib/db";
import { assertAdminAllowed } from "@/src/server/admin/access";

const hexColor = /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;

const socialLinkSchema = z.object({
  platform: z.string().min(1).max(50),
  url: z.string().url().max(500),
  active: z.boolean().default(true),
});

const brandingSchema = z.object({
  brandName: z.string().min(1).max(100),
  logoUrl: z.string().url().max(500).optional().or(z.literal("")),
  faviconUrl: z.string().url().max(500).optional().or(z.literal("")),
  primaryColor: z.string().regex(hexColor, "Invalid color"),
  secondaryColor: z.string().regex(hexColor, "Invalid color"),
  accentColor: z.string().regex(hexColor, "Invalid color"),
  defaultLocale: z.string().min(2).max(5),
  contactEmail: z.string().email().optional().or(z.literal("")),
  contactPhone: z.string().max(30).optional().or(z.literal("")),
  whatsapp: z.string().max(30).optional().or(z.literal("")),
  address: z.string().max(300).optional().or(z.literal("")),
});

export type BrandingInput = z.infer<typeof brandingSchema>;

export async function updateBranding(formData: FormData) {
  await assertAdminAllowed();

  const parsed = brandingSchema.safeParse({
    brandName: formData.get("brandName"),
    logoUrl: formData.get("logoUrl") || undefined,
    faviconUrl: formData.get("faviconUrl") || undefined,
    primaryColor: formData.get("primaryColor"),
    secondaryColor: formData.get("secondaryColor"),
    accentColor: formData.get("accentColor"),
    defaultLocale: formData.get("defaultLocale"),
    contactEmail: formData.get("contactEmail") || undefined,
    contactPhone: formData.get("contactPhone") || undefined,
    whatsapp: formData.get("whatsapp") || undefined,
    address: formData.get("address") || undefined,
  });

  if (!parsed.success) {
    return { ok: false as const, error: parsed.error.issues[0]?.message ?? "Invalid data" };
  }

  const d = parsed.data;
  await prisma.branding.upsert({
    where: { id: 1 },
    update: {
      brandName: d.brandName,
      logoUrl: d.logoUrl || null,
      faviconUrl: d.faviconUrl || null,
      primaryColor: d.primaryColor,
      secondaryColor: d.secondaryColor,
      accentColor: d.accentColor,
      defaultLocale: d.defaultLocale,
      contactEmail: d.contactEmail || null,
      contactPhone: d.contactPhone || null,
      whatsapp: d.whatsapp || null,
      address: d.address || null,
    },
    create: {
      id: 1,
      brandName: d.brandName,
      logoUrl: d.logoUrl || null,
      faviconUrl: d.faviconUrl || null,
      primaryColor: d.primaryColor,
      secondaryColor: d.secondaryColor,
      accentColor: d.accentColor,
      defaultLocale: d.defaultLocale,
      contactEmail: d.contactEmail || null,
      contactPhone: d.contactPhone || null,
      whatsapp: d.whatsapp || null,
      address: d.address || null,
    },
  });

  revalidatePath("/", "layout");
  return { ok: true as const };
}

// ---------------------------------------------------------------------------
// Social links
// ---------------------------------------------------------------------------

export async function addSocialLink(formData: FormData) {
  await assertAdminAllowed();

  const parsed = socialLinkSchema.safeParse({
    platform: formData.get("platform"),
    url: formData.get("url"),
    active: formData.get("active") === "on",
  });
  if (!parsed.success) {
    return { ok: false as const, error: "Invalid social link" };
  }

  const maxOrder = await prisma.socialLink.aggregate({ _max: { sortOrder: true } });
  await prisma.socialLink.create({
    data: { ...parsed.data, brandingId: 1, sortOrder: (maxOrder._max.sortOrder ?? -1) + 1 },
  });

  revalidatePath("/[locale]/admin/branding", "page");
  return { ok: true as const };
}

export async function updateSocialLink(id: number, data: { url?: string; active?: boolean }) {
  await assertAdminAllowed();

  if (data.url !== undefined && !z.string().url().safeParse(data.url).success) {
    return { ok: false as const, error: "Invalid URL" };
  }
  await prisma.socialLink.update({ where: { id }, data });
  revalidatePath("/[locale]/admin/branding", "page");
  return { ok: true as const };
}

export async function deleteSocialLink(id: number) {
  await assertAdminAllowed();
  await prisma.socialLink.delete({ where: { id } });
  revalidatePath("/[locale]/admin/branding", "page");
  return { ok: true as const };
}
