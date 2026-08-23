"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/src/lib/db";
import { assertAdminAllowed } from "@/src/server/admin/access";

const VISUALS = ["phone", "dashboard", "analytics", "growth"] as const;

const createSchema = z.object({
  sceneKey: z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/),
  visual: z.enum(VISUALS).default("phone"),
  icon: z.string().optional().or(z.literal("")),
  en: z.object({ kicker: z.string().optional().or(z.literal("")), title: z.string().min(1), body: z.string().optional().or(z.literal("")) }),
  ar: z.object({ kicker: z.string().optional().or(z.literal("")), title: z.string().min(1), body: z.string().optional().or(z.literal("")) }),
});

export async function createStoryScene(input: unknown) {
  await assertAdminAllowed();
  const parsed = createSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false as const, error: parsed.error.issues[0]?.message ?? "Invalid data" };
  }
  const d = parsed.data;
  const maxOrder = await prisma.storyScene.aggregate({ _max: { sortOrder: true } });
  const scene = await prisma.storyScene.create({
    data: {
      sceneKey: d.sceneKey,
      visual: d.visual,
      icon: d.icon || null,
      active: true,
      sortOrder: (maxOrder._max.sortOrder ?? -1) + 1,
    },
  });
  await prisma.storySceneTranslation.createMany({
    data: [
      { sceneId: scene.id, locale: "en", kicker: d.en.kicker || null, title: d.en.title, body: d.en.body || null },
      { sceneId: scene.id, locale: "ar", kicker: d.ar.kicker || null, title: d.ar.title, body: d.ar.body || null },
    ],
  });
  revalidatePath("/", "page");
  return { ok: true as const };
}

const updateSchema = z.object({
  visual: z.enum(VISUALS).optional(),
  active: z.boolean().optional(),
});

export async function updateStoryScene(
  id: number,
  patch?: { visual?: string; active?: boolean },
  translations?: Array<{ locale: string; kicker: string; title: string; body: string }>,
) {
  await assertAdminAllowed();
  const parsed = updateSchema.safeParse(patch ?? {});
  if (!parsed.success) {
    return { ok: false as const, error: "Invalid data" };
  }
  if (Object.keys(parsed.data).length > 0) {
    await prisma.storyScene.update({ where: { id }, data: parsed.data });
  }
  for (const t of translations ?? []) {
    await prisma.storySceneTranslation.upsert({
      where: { sceneId_locale: { sceneId: id, locale: t.locale } },
      update: { kicker: t.kicker || null, title: t.title, body: t.body || null },
      create: { sceneId: id, locale: t.locale, kicker: t.kicker || null, title: t.title, body: t.body || null },
    });
  }
  revalidatePath("/", "page");
  return { ok: true as const };
}

export async function moveStoryScene(id: number, direction: -1 | 1) {
  await assertAdminAllowed();
  const all = await prisma.storyScene.findMany({ orderBy: { sortOrder: "asc" } });
  const i = all.findIndex((s) => s.id === id);
  const target = all[i + direction];
  if (!target) return { ok: true as const };
  await prisma.$transaction([
    prisma.storyScene.update({ where: { id }, data: { sortOrder: target.sortOrder } }),
    prisma.storyScene.update({ where: { id: target.id }, data: { sortOrder: all[i].sortOrder } }),
  ]);
  revalidatePath("/", "page");
  return { ok: true as const };
}

export async function deleteStoryScene(id: number) {
  await assertAdminAllowed();
  await prisma.storyScene.delete({ where: { id } });
  revalidatePath("/", "page");
  return { ok: true as const };
}
