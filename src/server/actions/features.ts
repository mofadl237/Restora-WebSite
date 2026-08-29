"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/src/lib/db";
import { assertAdminAllowed } from "@/src/server/admin/access";
import { adminRoutePattern } from "@/src/server/admin/path";

const featureSchema = z.object({
  key: z
    .string()
    .min(2)
    .max(60)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Lowercase letters, numbers and dashes only"),
  icon: z.string().max(50).optional().or(z.literal("")),
  category: z.string().min(1).max(40),
});

export type FeatureFormInput = z.infer<typeof featureSchema> & {
  en: { name: string; description?: string };
  ar: { name: string; description?: string };
};

async function upsertTranslations(
  featureId: number,
  translations: Record<string, { name?: string; description?: string }>,
) {
  for (const [locale, t] of Object.entries(translations)) {
    if (!t.name) continue;
    await prisma.featureTranslation.upsert({
      where: { featureId_locale: { featureId, locale } },
      update: { name: t.name, description: t.description || null },
      create: { featureId, locale, name: t.name, description: t.description || null },
    });
  }
}

export async function createFeature(input: FeatureFormInput) {
  await assertAdminAllowed();

  const parsed = featureSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false as const, error: parsed.error.issues[0]?.message ?? "Invalid data" };
  }
  if (!input.en.name && !input.ar.name) {
    return { ok: false as const, error: "A name (EN or AR) is required" };
  }

  try {
    const maxOrder = await prisma.feature.aggregate({ _max: { sortOrder: true } });
    const feature = await prisma.feature.create({
      data: {
        key: parsed.data.key,
        icon: parsed.data.icon || null,
        category: parsed.data.category,
        active: true,
        sortOrder: (maxOrder._max.sortOrder ?? -1) + 1,
      },
    });
    await upsertTranslations(feature.id, { en: input.en, ar: input.ar });
  } catch {
    return { ok: false as const, error: "Feature key already exists" };
  }

  revalidatePath(adminRoutePattern("features"), "page");
  revalidatePath("/", "page");
  return { ok: true as const };
}

export async function updateFeature(
  id: number,
  input: Partial<Omit<FeatureFormInput, "key">> & { active?: boolean },
  translations?: Record<string, { name?: string; description?: string }>,
) {
  await assertAdminAllowed();

  const data: { icon?: string | null; category?: string; active?: boolean } = {};
  if (input.icon !== undefined) data.icon = input.icon || null;
  if (input.category !== undefined) data.category = input.category;
  if (input.active !== undefined) data.active = input.active;

  if (Object.keys(data).length > 0) {
    await prisma.feature.update({ where: { id }, data });
  }
  if (translations) {
    for (const [locale, t] of Object.entries(translations)) {
      if (!t.name) continue;
      await prisma.featureTranslation.upsert({
        where: { featureId_locale: { featureId: id, locale } },
        update: { name: t.name, description: t.description || null },
        create: { featureId: id, locale, name: t.name, description: t.description || null },
      });
    }
  }
  revalidatePath(adminRoutePattern("features"), "page");
  revalidatePath("/", "page");
  return { ok: true as const };
}

async function swap(idA: number, idB: number) {
  const [a, b] = await Promise.all([
    prisma.feature.findUnique({ where: { id: idA } }),
    prisma.feature.findUnique({ where: { id: idB } }),
  ]);
  if (!a || !b) return;
  await prisma.$transaction([
    prisma.feature.update({ where: { id: a.id }, data: { sortOrder: b.sortOrder } }),
    prisma.feature.update({ where: { id: b.id }, data: { sortOrder: a.sortOrder } }),
  ]);
}

export async function moveFeature(id: number, direction: -1 | 1) {
  await assertAdminAllowed();

  const all = await prisma.feature.findMany({ orderBy: { sortOrder: "asc" } });
  const index = all.findIndex((f) => f.id === id);
  const target = all[index + direction];
  if (target) await swap(id, target.id);
  revalidatePath(adminRoutePattern("features"), "page");
  revalidatePath("/", "page");
  return { ok: true as const };
}
