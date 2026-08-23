import type { Metadata } from "next";
import { prisma } from "@/src/lib/db";
import { routing } from "@/src/i18n/routing";

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "http://localhost:3000";

/** Look up a CMS-managed SEO entry for a page + locale. */
export async function getSeoEntry(page: string, locale: string) {
  return prisma.seoEntry.findUnique({
    where: { page_locale: { page, locale } },
  });
}

/**
 * Build Next.js metadata from a SeoEntry with safe fallbacks, including
 * hreflang alternates for every supported locale.
 */
export async function buildMetadata(
  page: string,
  locale: string,
  fallbackTitle: string,
): Promise<Metadata> {
  const entry = await getSeoEntry(page, locale);

  const languages: Record<string, string> = {};
  for (const l of routing.locales) {
    languages[l] = `${SITE_URL}/${l}`;
  }

  return {
    title: entry?.title ?? fallbackTitle,
    description: entry?.description ?? undefined,
    keywords: entry?.keywords ? entry.keywords.split(",").map((k) => k.trim()) : undefined,
    alternates: {
      canonical: `${SITE_URL}/${locale}`,
      languages,
    },
    robots: entry?.robots
      ? entry.robots
      : { index: true, follow: true },
    openGraph: {
      title: entry?.ogTitle ?? entry?.title ?? fallbackTitle,
      description: entry?.ogDescription ?? entry?.description ?? undefined,
      url: `${SITE_URL}/${locale}`,
      siteName: "RESTORA",
      locale,
      alternateLocale: routing.locales.filter((l) => l !== locale),
      images: entry?.ogImage ? [entry.ogImage] : undefined,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: entry?.twitterTitle ?? entry?.ogTitle ?? entry?.title ?? fallbackTitle,
      description: entry?.twitterDescription ?? entry?.description ?? undefined,
      images: entry?.twitterImage ? [entry.twitterImage] : undefined,
    },
  };
}
