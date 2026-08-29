import type { Metadata } from "next";
import { prisma } from "@/src/lib/db";
import { routing } from "@/src/i18n/routing";

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "http://localhost:3000";
export const DEFAULT_LOCALE = routing.defaultLocale;

/** Brand image served from /public — used for OG/Twitter cards site-wide. */
export const DEFAULT_OG_IMAGE = `${SITE_URL}/restora.jpg`;
const DEFAULT_OG_IMAGE_DIMS = { width: 1024, height: 1024 };

/** Look up a CMS-managed SEO entry for a page + locale. */
export async function getSeoEntry(page: string, locale: string) {
  return prisma.seoEntry.findUnique({
    where: { page_locale: { page, locale } },
  });
}

type MetadataOptions = {
  /**
   * Locale-relative pathname of this page, e.g. "/pricing" or "/blog/my-post".
   * Drives the canonical URL and per-locale hreflang alternates. Defaults
   * to "/" so callers SHOULD always pass it explicitly.
   */
  path?: string;
  /** Absolute or root-relative OG/Twitter image override. */
  image?: string | null;
  /** Meta description fallback when no SeoEntry provides one. */
  description?: string | null;
};

/**
 * Build Next.js metadata from a SeoEntry with safe fallbacks.
 * Canonical + hreflang (+x-default) are derived from the page's actual path,
 * so every locale variant of every page cross-references its equivalents.
 */
export async function buildMetadata(
  page: string,
  locale: string,
  fallbackTitle: string,
  options: MetadataOptions = {},
): Promise<Metadata> {
  const entry = await getSeoEntry(page, locale);
  // Normalize path: keep trailing slash off, ensure leading slash.
  const path = options.path !== undefined
    ? (options.path === "" ? "" : `/${options.path.replace(/^\/+|\/+$/g, "")}`)
    : "";

  const canonical = `${SITE_URL}/${locale}${path}`;

  const languages: Record<string, string> = {};
  for (const l of routing.locales) {
    languages[l] = `${SITE_URL}/${l}${path}`;
  }
  languages["x-default"] = `${SITE_URL}/${DEFAULT_LOCALE}${path}`;

  const description = entry?.description ?? options.description ?? undefined;
  const image = options.image ?? entry?.ogImage ?? DEFAULT_OG_IMAGE;

  return {
    // Absolute base for OG images and other protocol-relative resolutions.
    metadataBase: new URL(SITE_URL),
    title: entry?.title ?? fallbackTitle,
    description,
    keywords: entry?.keywords ? entry.keywords.split(",").map((k) => k.trim()) : undefined,
    alternates: {
      canonical,
      languages,
    },
    robots: entry?.robots
      ? entry.robots
      : { index: true, follow: true },
    openGraph: {
      title: entry?.ogTitle ?? entry?.title ?? fallbackTitle,
      description: entry?.ogDescription ?? description,
      url: canonical,
      siteName: "RESTORA",
      locale,
      alternateLocale: routing.locales.filter((l) => l !== locale),
      images: image
        ? [
            {
              url: image,
              ...(image === DEFAULT_OG_IMAGE ? DEFAULT_OG_IMAGE_DIMS : {}),
              alt: "RESTORA",
            },
          ]
        : undefined,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: entry?.twitterTitle ?? entry?.ogTitle ?? entry?.title ?? fallbackTitle,
      description: entry?.twitterDescription ?? description,
      images: image ? [image] : undefined,
    },
  };
}
