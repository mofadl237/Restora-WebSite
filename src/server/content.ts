import { prisma } from "@/src/lib/db";

export type SectionContent = {
  sectionKey: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  ctaLabel: string | null;
  ctaHref: string | null;
};

function pick<T extends { locale: string }>(rows: T[], locale: string): T | undefined {
  return rows.find((r) => r.locale === locale) ?? rows.find((r) => r.locale === "en") ?? rows[0];
}

export type StoryScene = {
  id: number;
  sceneKey: string;
  kicker: string | null;
  title: string;
  body: string | null;
  visual: string;
};

export async function getStoryScenes(locale: string): Promise<StoryScene[]> {
  const scenes = await prisma.storyScene.findMany({
    where: { active: true },
    orderBy: { sortOrder: "asc" },
    include: { translations: true },
  });
  return scenes.map((s) => ({
    id: s.id,
    sceneKey: s.sceneKey,
    kicker: pick(s.translations, locale)?.kicker ?? null,
    title: pick(s.translations, locale)?.title ?? s.sceneKey,
    body: pick(s.translations, locale)?.body ?? null,
    visual: s.visual,
  }));
}

export async function getSections(
  locale: string,
): Promise<Record<string, SectionContent>> {
  const sections = await prisma.marketingSection.findMany({
    where: { active: true },
    orderBy: { sortOrder: "asc" },
    include: { translations: true },
  });

  return Object.fromEntries(
    sections.map((s) => {
      const t = pick(s.translations, locale);
      return [
        s.sectionKey,
        {
          sectionKey: s.sectionKey,
          title: t?.title ?? "",
          subtitle: t?.subtitle ?? null,
          description: t?.description ?? null,
          ctaLabel: t?.ctaLabel ?? null,
          ctaHref: t?.ctaHref ?? null,
        },
      ];
    }),
  );
}

export type PublicTestimonial = {
  id: number;
  customerName: string;
  restaurantName: string | null;
  rating: number;
  quote: string;
};

export async function getTestimonials(locale: string): Promise<PublicTestimonial[]> {
  const items = await prisma.testimonial.findMany({
    where: { active: true },
    orderBy: { sortOrder: "asc" },
    include: { translations: true },
  });
  return items.map((t) => ({
    id: t.id,
    customerName: t.customerName,
    restaurantName: t.restaurantName,
    rating: t.rating,
    quote: pick(t.translations, locale)?.quote ?? "",
  }));
}

export type PublicFaq = { id: number; question: string; answer: string };

export async function getFaqs(locale: string): Promise<PublicFaq[]> {
  const faqs = await prisma.faq.findMany({
    where: { active: true },
    orderBy: { sortOrder: "asc" },
    include: { translations: true },
  });
  return faqs.map((f) => ({
    id: f.id,
    question: pick(f.translations, locale)?.question ?? "",
    answer: pick(f.translations, locale)?.answer ?? "",
  }));
}
