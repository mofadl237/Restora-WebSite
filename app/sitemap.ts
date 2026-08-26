import type { MetadataRoute } from "next";
import { routing } from "@/src/i18n/routing";
import { SITE_URL } from "@/src/server/seo";
import { getBlogPosts } from "@/src/server/content";
import { listSegmentPages } from "@/src/server/segments";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const entries: MetadataRoute.Sitemap = [];

  const staticPaths = ["", "/pricing", "/blog", "/contact", "/business"];
  for (const locale of routing.locales) {
    const [posts, segments] = await Promise.all([getBlogPosts(locale), listSegmentPages(locale)]);
    for (const path of staticPaths) {
      entries.push({
        url: `${SITE_URL}/${locale}${path}`,
        lastModified: now,
        changeFrequency: path === "/blog" ? "daily" : "weekly",
        priority: path === "" ? 1 : 0.8,
        alternates: {
          languages: Object.fromEntries(
            routing.locales.map((l) => [l, `${SITE_URL}/${l}${path}`]),
          ),
        },
      });
    }
    for (const seg of segments) {
      entries.push({
        url: `${SITE_URL}/${locale}/business/${seg.slug}`,
        lastModified: now,
        changeFrequency: "monthly",
        priority: 0.7,
      });
    }
    for (const post of posts) {
      entries.push({
        url: `${SITE_URL}/${locale}/blog/${post.slug}`,
        lastModified: post.publishedAt ?? now,
        changeFrequency: "monthly",
        priority: 0.6,
      });
    }
  }

  return entries;
}
