"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/src/lib/db";
import { assertAdminAllowed } from "@/src/server/admin/access";

const clientSchema = z.object({
  name: z.string().min(1).max(120),
  imageUrl: z.string().max(500).optional().or(z.literal("")),
  countryCode: z.string().length(2).optional().or(z.literal("")),
  websiteUrl: z.string().max(500).optional().or(z.literal("")),
  category: z.string().max(120).optional().or(z.literal("")),
});

export type ClientInput = z.infer<typeof clientSchema>;

export async function createClient(input: unknown) {
  await assertAdminAllowed();
  const parsed = clientSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false as const, error: parsed.error.issues[0]?.message ?? "Invalid data" };
  }
  const d = parsed.data;

  const maxOrder = await prisma.client.aggregate({ _max: { sortOrder: true } });
  await prisma.client.create({
    data: {
      name: d.name,
      imageUrl: d.imageUrl || null,
      countryCode: d.countryCode ? d.countryCode.toUpperCase() : null,
      websiteUrl: d.websiteUrl || null,
      category: d.category || null,
      active: true,
      sortOrder: (maxOrder._max.sortOrder ?? -1) + 1,
    },
  });
  revalidatePath("/", "page");
  return { ok: true as const };
}

export async function updateClient(
  id: number,
  input: Partial<ClientInput> & { active?: boolean },
) {
  await assertAdminAllowed();
  const parsed = clientSchema.partial().safeParse(input);
  if (!parsed.success) {
    return { ok: false as const, error: parsed.error.issues[0]?.message ?? "Invalid data" };
  }
  const d = parsed.data;
  await prisma.client.update({
    where: { id },
    data: {
      ...(d.name !== undefined ? { name: d.name } : {}),
      ...(d.imageUrl !== undefined ? { imageUrl: d.imageUrl || null } : {}),
      ...(d.countryCode !== undefined
        ? { countryCode: d.countryCode ? d.countryCode.toUpperCase() : null }
        : {}),
      ...(d.websiteUrl !== undefined ? { websiteUrl: d.websiteUrl || null } : {}),
      ...(d.category !== undefined ? { category: d.category || null } : {}),
      ...(input.active !== undefined ? { active: input.active } : {}),
    },
  });
  revalidatePath("/", "page");
  return { ok: true as const };
}

export async function deleteClient(id: number) {
  await assertAdminAllowed();
  await prisma.client.delete({ where: { id } });
  revalidatePath("/", "page");
  return { ok: true as const };
}
