"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/src/lib/db";
import { assertAdminAllowed } from "@/src/server/admin/access";

// ---------------------------------------------------------------------------
// Marketing sections
// ---------------------------------------------------------------------------

export type SectionUpdate = {
  locale: string;
  title: string;
  subtitle?: string | null;
  description?: string | null;
  ctaLabel?: string | null;
  ctaHref?: string | null;
};

export async function updateSectionTranslation(sectionId: number, t: SectionUpdate) {
  await assertAdminAllowed();

  if (!t.title.trim()) return { ok: false as const, error: "Title is required" };

  await prisma.marketingSectionTranslation.upsert({
    where: { sectionId_locale: { sectionId, locale: t.locale } },
    update: {
      title: t.title,
      subtitle: t.subtitle || null,
      description: t.description || null,
      ctaLabel: t.ctaLabel || null,
      ctaHref: t.ctaHref || null,
    },
    create: {
      sectionId,
      locale: t.locale,
      title: t.title,
      subtitle: t.subtitle || null,
      description: t.description || null,
      ctaLabel: t.ctaLabel || null,
      ctaHref: t.ctaHref || null,
    },
  });
  revalidatePath("/", "page");
  return { ok: true as const };
}

export async function setSectionActive(sectionId: number, active: boolean) {
  await assertAdminAllowed();
  await prisma.marketingSection.update({ where: { id: sectionId }, data: { active } });
  revalidatePath("/", "page");
  return { ok: true as const };
}

export async function moveSection(id: number, direction: -1 | 1) {
  await assertAdminAllowed();
  const all = await prisma.marketingSection.findMany({ orderBy: { sortOrder: "asc" } });
  const i = all.findIndex((s) => s.id === id);
  const target = all[i + direction];
  if (!target) return { ok: true as const };
  await prisma.$transaction([
    prisma.marketingSection.update({ where: { id }, data: { sortOrder: target.sortOrder } }),
    prisma.marketingSection.update({ where: { id: target.id }, data: { sortOrder: all[i].sortOrder } }),
  ]);
  revalidatePath("/", "page");
  return { ok: true as const };
}

// ---------------------------------------------------------------------------
// Testimonials
// ---------------------------------------------------------------------------

const testimonialSchema = z.object({
  customerName: z.string().min(1).max(100),
  restaurantName: z.string().max(120).optional().or(z.literal("")),
  rating: z.coerce.number().int().min(1).max(5),
  quoteEn: z.string().min(1).max(600),
  quoteAr: z.string().max(600).optional().or(z.literal("")),
});

export async function createTestimonial(input: unknown) {
  await assertAdminAllowed();
  const parsed = testimonialSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false as const, error: parsed.error.issues[0]?.message ?? "Invalid data" };
  }
  const d = parsed.data;

  const maxOrder = await prisma.testimonial.aggregate({ _max: { sortOrder: true } });
  const testimonial = await prisma.testimonial.create({
    data: {
      customerName: d.customerName,
      restaurantName: d.restaurantName || null,
      rating: d.rating,
      active: true,
      sortOrder: (maxOrder._max.sortOrder ?? -1) + 1,
    },
  });
  await prisma.testimonialTranslation.createMany({
    data: [
      { testimonialId: testimonial.id, locale: "en", quote: d.quoteEn },
      ...(d.quoteAr ? [{ testimonialId: testimonial.id, locale: "ar", quote: d.quoteAr }] : []),
    ],
  });
  revalidatePath("/", "page");
  return { ok: true as const };
}

export async function setTestimonialActive(id: number, active: boolean) {
  await assertAdminAllowed();
  await prisma.testimonial.update({ where: { id }, data: { active } });
  revalidatePath("/", "page");
  return { ok: true as const };
}

export async function deleteTestimonial(id: number) {
  await assertAdminAllowed();
  await prisma.testimonial.delete({ where: { id } });
  revalidatePath("/", "page");
  return { ok: true as const };
}

// ---------------------------------------------------------------------------
// FAQs
// ---------------------------------------------------------------------------

const faqSchema = z.object({
  questionEn: z.string().min(1).max(300),
  answerEn: z.string().min(1).max(2000),
  questionAr: z.string().max(300).optional().or(z.literal("")),
  answerAr: z.string().max(2000).optional().or(z.literal("")),
});

export async function createFaq(input: unknown) {
  await assertAdminAllowed();
  const parsed = faqSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false as const, error: parsed.error.issues[0]?.message ?? "Invalid data" };
  }
  const d = parsed.data;

  const maxOrder = await prisma.faq.aggregate({ _max: { sortOrder: true } });
  const faq = await prisma.faq.create({
    data: { active: true, sortOrder: (maxOrder._max.sortOrder ?? -1) + 1 },
  });
  await prisma.faqTranslation.createMany({
    data: [
      { faqId: faq.id, locale: "en", question: d.questionEn, answer: d.answerEn },
      ...(d.questionAr && d.answerAr
        ? [{ faqId: faq.id, locale: "ar", question: d.questionAr, answer: d.answerAr }]
        : []),
    ],
  });
  revalidatePath("/", "page");
  return { ok: true as const };
}

export async function setFaqActive(id: number, active: boolean) {
  await assertAdminAllowed();
  await prisma.faq.update({ where: { id }, data: { active } });
  revalidatePath("/", "page");
  return { ok: true as const };
}

export async function deleteFaq(id: number) {
  await assertAdminAllowed();
  await prisma.faq.delete({ where: { id } });
  revalidatePath("/", "page");
  return { ok: true as const };
}

// ---------------------------------------------------------------------------
// SEO entries
// ---------------------------------------------------------------------------

const seoSchema = z.object({
  page: z.string().min(1).max(60),
  locale: z.string().min(2).max(5),
  title: z.string().min(1).max(200),
  description: z.string().min(1).max(400),
  keywords: z.string().max(500).optional().or(z.literal("")),
  canonical: z.string().max(300).optional().or(z.literal("")),
  robots: z.string().max(100).optional().or(z.literal("")),
  ogTitle: z.string().max(200).optional().or(z.literal("")),
  ogDescription: z.string().max(400).optional().or(z.literal("")),
  ogImage: z.string().url().optional().or(z.literal("")),
});

export type SeoInput = z.infer<typeof seoSchema>;

export async function upsertSeoEntry(input: unknown) {
  await assertAdminAllowed();
  const parsed = seoSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false as const, error: parsed.error.issues[0]?.message ?? "Invalid data" };
  }
  const d = parsed.data;

  const data = {
    title: d.title,
    description: d.description,
    keywords: d.keywords || null,
    canonical: d.canonical || null,
    robots: d.robots || null,
    ogTitle: d.ogTitle || null,
    ogDescription: d.ogDescription || null,
    ogImage: d.ogImage || null,
  };
  await prisma.seoEntry.upsert({
    where: { page_locale: { page: d.page, locale: d.locale } },
    update: data,
    create: { page: d.page, locale: d.locale, ...data },
  });
  revalidatePath("/", "page");
  return { ok: true as const };
}

export async function deleteSeoEntry(page: string, locale: string) {
  await assertAdminAllowed();
  await prisma.seoEntry.delete({ where: { page_locale: { page, locale } } });
  revalidatePath("/", "page");
  return { ok: true as const };
}
