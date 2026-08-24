import { prisma } from "@/src/lib/db";
import { BlogPostsManager } from "@/src/components/admin/blog-manager";

export default async function AdminBlogPage() {
  const items = await prisma.blogPost.findMany({
    orderBy: { displayOrder: "asc" },
    include: { translations: true },
  });

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-2xl font-semibold tracking-tight">Blog</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Articles published on the public blog. Provide at least the English version; add
          Arabic when ready.
        </p>
      </header>

      <BlogPostsManager
        items={items.map((p) => ({
          id: p.id,
          slug: p.slug,
          category: p.category,
          featured: p.featured,
          published: p.published,
          titleEn: p.translations.find((t) => t.locale === "en")?.title ?? null,
          titleAr: p.translations.find((t) => t.locale === "ar")?.title ?? null,
        }))}
      />
    </div>
  );
}
