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
  jobTitle: string | null;
  countryCode: string | null;
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
    jobTitle: t.jobTitle,
    countryCode: t.countryCode,
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

// ---------------------------------------------------------------------------
// Clients
// ---------------------------------------------------------------------------

export type PublicClient = {
  id: number;
  name: string;
  imageUrl: string | null;
  countryCode: string | null;
  websiteUrl: string | null;
  category: string | null;
};

export async function getClients(): Promise<PublicClient[]> {
  const clients = await prisma.client.findMany({
    where: { active: true },
    orderBy: { sortOrder: "asc" },
  });
  return clients.map((c) => ({
    id: c.id,
    name: c.name,
    imageUrl: c.imageUrl,
    countryCode: c.countryCode,
    websiteUrl: c.websiteUrl,
    category: c.category,
  }));
}

// ---------------------------------------------------------------------------
// Blog
// ---------------------------------------------------------------------------

function estimateReadingTime(content: string): number {
  const words = content.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 180));
}

export type PublicBlogPost = {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  tags: string[];
  authorName: string;
  coverImage: string | null;
  featured: boolean;
  readingTime: number;
  publishedAt: Date | null;
  seoTitle: string | null;
  seoDescription: string | null;
  ogImage: string | null;
};

export async function getBlogPosts(locale: string): Promise<PublicBlogPost[]> {
  const posts = await prisma.blogPost.findMany({
    where: { published: true },
    orderBy: [{ displayOrder: "asc" }, { publishedAt: "desc" }],
    include: { translations: true },
  });
  return posts.map((p) => {
    const t = pick(p.translations, locale);
    return {
      id: p.id,
      slug: p.slug,
      title: t?.title ?? p.slug,
      excerpt: t?.excerpt ?? "",
      category: p.category,
      tags: p.tags,
      authorName: p.authorName,
      coverImage: p.coverImage,
      featured: p.featured,
      readingTime: t ? estimateReadingTime(t.content) : 1,
      publishedAt: p.publishedAt,
      seoTitle: p.seoTitle,
      seoDescription: p.seoDescription,
      ogImage: p.ogImage,
    };
  });
}

export type PublicBlogArticle = PublicBlogPost & { content: string };

export async function getBlogPost(
  locale: string,
  slug: string,
): Promise<PublicBlogArticle | null> {
  const post = await prisma.blogPost.findUnique({
    where: { slug },
    include: { translations: true },
  });
  if (!post || !post.published) return null;
  const t = pick(post.translations, locale);
  if (!t) return null;
  return {
    id: post.id,
    slug: post.slug,
    title: t.title,
    excerpt: t.excerpt,
    content: t.content,
    category: post.category,
    tags: post.tags,
    authorName: post.authorName,
    coverImage: post.coverImage,
    featured: post.featured,
    readingTime: estimateReadingTime(t.content),
    publishedAt: post.publishedAt,
    seoTitle: post.seoTitle,
    seoDescription: post.seoDescription,
    ogImage: post.ogImage,
  };
}
