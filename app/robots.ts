import type { MetadataRoute } from "next";
import { SITE_URL } from "@/src/server/seo";
import { ADMIN_PATH } from "@/src/server/admin/path";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [`/${ADMIN_PATH}`, "/api/"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
