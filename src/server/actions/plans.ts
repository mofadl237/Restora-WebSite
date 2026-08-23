"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/src/lib/db";
import { assertAdminAllowed } from "@/src/server/admin/access";

const money = z
  .string()
  .trim()
  .regex(/^\d+(\.\d{1,2})?$/, "Use a number like 947 or 947.50")
  .transform((v) => v);

const translationSchema = z.object({
  name: z.string().min(1).max(100),
  shortDescription: z.string().min(1).max(300),
  longDescription: z.string().max(2000).optional().or(z.literal("")),
});

const planSchema = z.object({
  slug: z
    .string()
    .min(2)
    .max(60)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Lowercase letters, numbers and dashes only"),
  displayOrder: z.coerce.number().int().min(0),
  active: z.boolean(),
  popular: z.boolean(),
  monthlyPrice: money,
  yearlyPrice: money,
  monthlyCompareAtPrice: money.optional().or(z.literal("")),
  yearlyCompareAtPrice: money.optional().or(z.literal("")),
});

export type PlanFormInput = {
  slug: string;
  displayOrder: number;
  active: boolean;
  popular: boolean;
  monthlyPrice: string;
  yearlyPrice: string;
  monthlyCompareAtPrice?: string;
  yearlyCompareAtPrice?: string;
};

export async function createPlan(
  input: PlanFormInput,
  translations: Record<string, z.infer<typeof translationSchema>>,
) {
  await assertAdminAllowed();

  const parsed = planSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false as const, error: parsed.error.issues[0]?.message ?? "Invalid data" };
  }

  const en = translations.en ?? Object.values(translations)[0];
  if (!en) return { ok: false as const, error: "At least an English name is required" };

  try {
    await prisma.plan.create({
      data: {
        ...parsed.data,
        monthlyCompareAtPrice: parsed.data.monthlyCompareAtPrice || null,
        yearlyCompareAtPrice: parsed.data.yearlyCompareAtPrice || null,
        ctaKey: "choosePlan",
        translations: {
          create: Object.entries(translations).map(([locale, t]) => ({
            locale,
            name: t.name,
            shortDescription: t.shortDescription,
            longDescription: t.longDescription || null,
          })),
        },
      },
    });
  } catch {
    return { ok: false as const, error: "Slug already exists" };
  }

  revalidatePath("/[locale]/admin/plans", "page");
  revalidatePath("/", "page");
  return { ok: true as const };
}

export async function updatePlan(
  id: number,
  input: PlanFormInput,
  translations: Record<string, z.infer<typeof translationSchema>>,
) {
  await assertAdminAllowed();

  const parsed = planSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false as const, error: parsed.error.issues[0]?.message ?? "Invalid data" };
  }

  await prisma.plan.update({
    where: { id },
    data: {
      ...parsed.data,
      monthlyCompareAtPrice: parsed.data.monthlyCompareAtPrice || null,
      yearlyCompareAtPrice: parsed.data.yearlyCompareAtPrice || null,
    },
  });

  for (const [locale, t] of Object.entries(translations)) {
    if (!t.name || !t.shortDescription) continue;
    const check = translationSchema.safeParse(t);
    if (!check.success) continue;
    await prisma.planTranslation.upsert({
      where: { planId_locale: { planId: id, locale } },
      update: {
        name: check.data.name,
        shortDescription: check.data.shortDescription,
        longDescription: check.data.longDescription || null,
      },
      create: {
        planId: id,
        locale,
        name: check.data.name,
        shortDescription: check.data.shortDescription,
        longDescription: check.data.longDescription || null,
      },
    });
  }

  revalidatePath("/[locale]/admin/plans", "page");
  revalidatePath("/", "page");
  return { ok: true as const };
}

export async function deletePlan(id: number) {
  await assertAdminAllowed();
  // Soft-deactivate to preserve historical data; hard delete available via DB.
  await prisma.plan.update({ where: { id }, data: { active: false } });
  revalidatePath("/[locale]/admin/plans", "page");
  revalidatePath("/", "page");
  return { ok: true as const };
}

export async function hardDeletePlan(id: number) {
  await assertAdminAllowed();
  await prisma.plan.delete({ where: { id } });
  revalidatePath("/[locale]/admin/plans", "page");
  revalidatePath("/", "page");
  return { ok: true as const };
}

async function swapOrder(idA: number, idB: number) {
  const [a, b] = await Promise.all([
    prisma.plan.findUnique({ where: { id: idA } }),
    prisma.plan.findUnique({ where: { id: idB } }),
  ]);
  if (!a || !b) return;
  await prisma.$transaction([
    prisma.plan.update({ where: { id: a.id }, data: { displayOrder: b.displayOrder } }),
    prisma.plan.update({ where: { id: b.id }, data: { displayOrder: a.displayOrder } }),
  ]);
}

export async function movePlan(id: number, direction: -1 | 1) {
  await assertAdminAllowed();

  const plan = await prisma.plan.findUnique({ where: { id } });
  if (!plan) return { ok: true as const };

  const neighbors = await prisma.plan.findMany({
    orderBy: { displayOrder: "asc" },
  });
  const index = neighbors.findIndex((p) => p.id === id);
  const target = neighbors[index + direction];
  if (target) {
    await swapOrder(plan.id, target.id);
  }
  revalidatePath("/[locale]/admin/plans", "page");
  revalidatePath("/", "page");
  return { ok: true as const };
}

export async function setPlanFlags(
  id: number,
  flags: Partial<{ active: boolean; popular: boolean }>,
) {
  await assertAdminAllowed();

  if (flags.popular === true) {
    // Only one popular plan at a time.
    await prisma.plan.updateMany({ data: { popular: false } });
  }
  await prisma.plan.update({ where: { id }, data: flags });
  revalidatePath("/[locale]/admin/plans", "page");
  revalidatePath("/", "page");
  return { ok: true as const };
}

// ---------------------------------------------------------------------------
// Feature assignments per plan
// ---------------------------------------------------------------------------

export async function setPlanFeature(
  planId: number,
  featureId: number,
  included: boolean,
  limitValue?: string | null,
) {
  await assertAdminAllowed();

  if (included) {
    await prisma.planFeatureAssignment.upsert({
      where: { planId_featureId: { planId, featureId } },
      update: { included: true, ...(limitValue !== undefined ? { limitValue: limitValue || null } : {}) },
      create: {
        planId,
        featureId,
        included: true,
        limitValue: limitValue || null,
        sortOrder: 999,
      },
    });
  } else {
    await prisma.planFeatureAssignment.deleteMany({
      where: { planId, featureId },
    });
  }
  revalidatePath(`/[locale]/admin/plans/${planId}`, "page");
  revalidatePath("/", "page");
  return { ok: true as const };
}

// ---------------------------------------------------------------------------
// Country-specific pricing per plan
// ---------------------------------------------------------------------------

const countryPricingSchema = z.object({
  monthlyPrice: money,
  yearlyPrice: money,
  monthlyCompareAtPrice: money.optional().or(z.literal("")),
  yearlyCompareAtPrice: money.optional().or(z.literal("")),
});

export async function setPlanCountryPricing(
  planId: number,
  countryId: number,
  input: z.infer<typeof countryPricingSchema> & { active?: boolean },
) {
  await assertAdminAllowed();

  const parsed = countryPricingSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false as const, error: parsed.error.issues[0]?.message ?? "Invalid pricing" };
  }

  const data = {
    monthlyPrice: parsed.data.monthlyPrice,
    yearlyPrice: parsed.data.yearlyPrice,
    monthlyCompareAtPrice: parsed.data.monthlyCompareAtPrice || null,
    yearlyCompareAtPrice: parsed.data.yearlyCompareAtPrice || null,
    active: input.active ?? true,
  };

  await prisma.planCountryPricing.upsert({
    where: { planId_countryId: { planId, countryId } },
    update: data,
    create: { planId, countryId, ...data },
  });

  revalidatePath(`/[locale]/admin/plans/${planId}`, "page");
  revalidatePath("/pricing", "page");
  return { ok: true as const };
}
