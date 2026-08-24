import type { MetadataRoute } from "next";
import { routing } from "@/src/i18n/routing";
import { SITE_URL } from "@/src/server/seo";
import { getBlogPosts } from "@/src/server/content";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const entries: MetadataRoute.Sitemap = [];

  const staticPaths = ["", "/pricing", "/blog", "/contact"];
  for (const locale of routing.locales) {
    const posts = await getBlogPosts(locale);
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
