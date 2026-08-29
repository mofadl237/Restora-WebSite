"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/src/lib/db";
import { assertAdminAllowed } from "@/src/server/admin/access";
import { adminRoutePattern } from "@/src/server/admin/path";

const giftSchema = z.object({
  slug: z
    .string()
    .min(2)
    .max(60)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Lowercase letters, numbers and dashes only"),
  icon: z.string().max(50).optional().or(z.literal("")),
  yearlyOnly: z.boolean(),
});

export type GiftFormInput = z.infer<typeof giftSchema> & {
  en: { name: string; description?: string };
  ar: { name: string; description?: string };
  planIds: number[];
};

export async function createGift(input: GiftFormInput) {
  await assertAdminAllowed();

  const parsed = giftSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false as const, error: parsed.error.issues[0]?.message ?? "Invalid data" };
  }
  if (!input.en.name && !input.ar.name) {
    return { ok: false as const, error: "A name (EN or AR) is required" };
  }

  try {
    const maxOrder = await prisma.gift.aggregate({ _max: { sortOrder: true } });
    const gift = await prisma.gift.create({
      data: {
        slug: parsed.data.slug,
        icon: parsed.data.icon || null,
        yearlyOnly: parsed.data.yearlyOnly,
        active: true,
        sortOrder: (maxOrder._max.sortOrder ?? -1) + 1,
      },
    });

    for (const locale of ["en", "ar"] as const) {
      const t = input[locale];
      if (!t?.name) continue;
      await prisma.giftTranslation.create({
        data: { giftId: gift.id, locale, name: t.name, description: t.description || null },
      });
    }

    if (input.planIds.length > 0) {
      await prisma.planGift.createMany({
        data: input.planIds.map((planId) => ({ planId, giftId: gift.id })),
        skipDuplicates: true,
      });
    }
  } catch {
    return { ok: false as const, error: "Gift slug already exists" };
  }

  revalidatePath(adminRoutePattern("gifts"), "page");
  revalidatePath("/", "page");
  return { ok: true as const };
}

export async function updateGift(
  id: number,
  input: Partial<{ icon: string | null; yearlyOnly: boolean; active: boolean }>,
  translations?: Record<string, { name?: string; description?: string }>,
  planIds?: number[],
) {
  await assertAdminAllowed();

  const data: { icon?: string | null; yearlyOnly?: boolean; active?: boolean } = {};
  if (input.icon !== undefined) data.icon = input.icon;
  if (input.yearlyOnly !== undefined) data.yearlyOnly = input.yearlyOnly;
  if (input.active !== undefined) data.active = input.active;

  if (Object.keys(data).length > 0) {
    await prisma.gift.update({ where: { id }, data });
  }
  if (translations) {
    for (const [locale, t] of Object.entries(translations)) {
      if (!t?.name) continue;
      await prisma.giftTranslation.upsert({
        where: { giftId_locale: { giftId: id, locale } },
        update: { name: t.name, description: t.description || null },
        create: { giftId: id, locale, name: t.name, description: t.description || null },
      });
    }
  }
  if (planIds) {
    await prisma.planGift.deleteMany({ where: { giftId: id, planId: { notIn: planIds } } });
    if (planIds.length > 0) {
      await prisma.planGift.createMany({
        data: planIds.map((planId) => ({ planId, giftId: id })),
        skipDuplicates: true,
      });
    }
  }
  revalidatePath(adminRoutePattern("gifts"), "page");
  revalidatePath("/", "page");
  return { ok: true as const };
}

async function swap(idA: number, idB: number) {
  const [a, b] = await Promise.all([
    prisma.gift.findUnique({ where: { id: idA } }),
    prisma.gift.findUnique({ where: { id: idB } }),
  ]);
  if (!a || !b) return;
  await prisma.$transaction([
    prisma.gift.update({ where: { id: a.id }, data: { sortOrder: b.sortOrder } }),
    prisma.gift.update({ where: { id: b.id }, data: { sortOrder: a.sortOrder } }),
  ]);
}

export async function moveGift(id: number, direction: -1 | 1) {
  await assertAdminAllowed();

  const all = await prisma.gift.findMany({ orderBy: { sortOrder: "asc" } });
  const index = all.findIndex((g) => g.id === id);
  const target = all[index + direction];
  if (target) await swap(id, target.id);
  revalidatePath(adminRoutePattern("gifts"), "page");
  revalidatePath("/", "page");
  return { ok: true as const };
}

export async function deleteGift(id: number) {
  await assertAdminAllowed();
  await prisma.gift.delete({ where: { id } });
  revalidatePath(adminRoutePattern("gifts"), "page");
  revalidatePath("/", "page");
  return { ok: true as const };
}
