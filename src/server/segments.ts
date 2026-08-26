import { prisma } from "@/src/lib/db";

export type PublicSegmentFaq = { question: string; answer: string };

export type PublicSegmentPage = {
  id: number;
  slug: string;
  icon: string | null;
  planSlug: string | null;
  title: string;
  subtitle: string | null;
  description: string;
  problems: string[];
  useCases: string[];
  features: string[];
  faqs: PublicSegmentFaq[];
  seoTitle: string | null;
  seoDescription: string | null;
};

function splitPipe(value: string): string[] {
  return value
    .split("|")
    .map((s) => s.trim())
    .filter(Boolean);
}

function parseFaqs(value: string): PublicSegmentFaq[] {
  return value
    .split("||")
    .map((pair) => {
      const idx = pair.indexOf("::");
      if (idx < 0) return null;
      const question = pair.slice(0, idx).trim();
      const answer = pair.slice(idx + 2).trim();
      return question && answer ? { question, answer } : null;
    })
    .filter((f): f is PublicSegmentFaq => f !== null);
}

/** All active segment pages for listing/hub navigation. */
export async function listSegmentPages(locale: string): Promise<PublicSegmentPage[]> {
  const pages = await prisma.segmentPage.findMany({
    where: { active: true },
    orderBy: { sortOrder: "asc" },
    include: { translations: true },
  });
  return pages.map((p) => {
    const t =
      p.translations.find((x) => x.locale === locale) ??
      p.translations.find((x) => x.locale === "en") ??
      p.translations[0];
    return {
      id: p.id,
      slug: p.slug,
      icon: p.icon,
      planSlug: p.planSlug,
      title: t?.title ?? p.slug,
      subtitle: t?.subtitle ?? null,
      description: t?.description ?? "",
      problems: t ? splitPipe(t.problems) : [],
      useCases: t ? splitPipe(t.useCases) : [],
      features: t ? splitPipe(t.features) : [],
      faqs: t ? parseFaqs(t.faqs) : [],
      seoTitle: t?.seoTitle ?? null,
      seoDescription: t?.seoDescription ?? null,
    };
  });
}

export async function getSegmentPage(
  locale: string,
  slug: string,
): Promise<PublicSegmentPage | null> {
  const all = await listSegmentPages(locale);
  return all.find((s) => s.slug === slug) ?? null;
}
