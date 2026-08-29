"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/src/lib/db";
import { assertAdminAllowed } from "@/src/server/admin/access";
import { adminRoutePattern } from "@/src/server/admin/path";

const countrySchema = z.object({
  code: z.string().regex(/^[A-Z]{2}$/, "Use 2-letter ISO code").max(2),
  name: z.string().min(1).max(100),
  currencyCode: z.string().min(3).max(3),
  currencySymbol: z.string().min(1).max(10),
  locale: z.string().min(2).max(5).optional().or(z.literal("")),
  dialCode: z.string().max(8).optional().or(z.literal("")),
});

export async function createCountry(formData: FormData) {
  await assertAdminAllowed();

  const parsed = countrySchema.safeParse({
    code: formData.get("code"),
    name: formData.get("name"),
    currencyCode: formData.get("currencyCode"),
    currencySymbol: formData.get("currencySymbol"),
    locale: formData.get("locale") || undefined,
    dialCode: formData.get("dialCode") || undefined,
  });
  if (!parsed.success) {
    return { ok: false as const, error: parsed.error.issues[0]?.message ?? "Invalid data" };
  }

  const d = parsed.data;
  try {
    const maxOrder = await prisma.country.aggregate({ _max: { sortOrder: true } });
    await prisma.country.create({
      data: {
        code: d.code,
        name: d.name,
        currencyCode: d.currencyCode.toUpperCase(),
        currencySymbol: d.currencySymbol,
        locale: d.locale || null,
        dialCode: d.dialCode || null,
        active: true,
        sortOrder: (maxOrder._max.sortOrder ?? -1) + 1,
      },
    });
  } catch {
    return { ok: false as const, error: "Country code already exists" };
  }

  revalidatePath(adminRoutePattern("countries"), "page");
  revalidatePath("/pricing", "page");
  return { ok: true as const };
}

export async function updateCountry(
  id: number,
  data: Partial<{ name: string; currencyCode: string; currencySymbol: string; locale: string | null; dialCode: string | null; active: boolean }>,
) {
  await assertAdminAllowed();

  if (data.currencyCode && !/^[A-Za-z]{3}$/.test(data.currencyCode)) {
    return { ok: false as const, error: "Currency code must be 3 letters" };
  }
  await prisma.country.update({ where: { id }, data });
  revalidatePath(adminRoutePattern("countries"), "page");
  revalidatePath("/pricing", "page");
  return { ok: true as const };
}

export async function deleteCountry(id: number) {
  await assertAdminAllowed();
  // Cascades plan-country pricing rows only; plan defaults remain intact.
  await prisma.country.delete({ where: { id } });
  revalidatePath(adminRoutePattern("countries"), "page");
  revalidatePath("/pricing", "page");
  return { ok: true as const };
}
