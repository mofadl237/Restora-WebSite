"use client";

import { useState, useTransition } from "react";
import {
  createBlogPost,
  deleteBlogPost,
  setBlogPostPublished,
} from "@/src/server/actions/blog";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Textarea } from "@/src/components/ui/textarea";
import { Switch } from "@/src/components/ui/switch";
import { Badge } from "@/src/components/ui/badge";
import { Plus, Trash2 } from "lucide-react";

export type BlogPostRow = {
  id: number;
  slug: string;
  category: string;
  featured: boolean;
  published: boolean;
  titleEn: string | null;
  titleAr: string | null;
};

export function BlogPostsManager({ items }: { items: BlogPostRow[] }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  return (
    <div className={`space-y-6 ${isPending ? "opacity-60" : ""}`}>
      <ul className="divide-y divide-border/60 rounded-lg border border-border">
        {items.map((p) => (
          <li key={p.id} className="flex flex-wrap items-center gap-3 px-4 py-3">
            <div className="min-w-48 flex-1">
              <p className={`text-sm font-medium ${p.published ? "" : "opacity-60"}`}>
                {p.titleEn ?? p.slug}
              </p>
              <p className="text-sm text-muted-foreground" dir={p.titleAr ? "rtl" : undefined}>
                {p.titleAr}
              </p>
            </div>
            <Badge variant="outline">{p.category}</Badge>
            {p.featured && <Badge variant="accent">Featured</Badge>}
            {!p.published && <Badge variant="secondary">Draft</Badge>}
            <Switch
              checked={p.published}
              onCheckedChange={(published) =>
                startTransition(async () => {
                  await setBlogPostPublished(p.id, published);
                })
              }
              aria-label={`${p.slug} published`}
            />
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-destructive"
              onClick={() =>
                startTransition(async () => {
                  await deleteBlogPost(p.id);
                })
              }
              aria-label={`Delete ${p.slug}`}
            >
              <Trash2 className="size-4" aria-hidden />
            </Button>
          </li>
        ))}
        {items.length === 0 && (
          <li className="px-4 py-3 text-sm text-muted-foreground">No posts yet.</li>
        )}
      </ul>

      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}

      <details className="rounded-lg border border-border">
        <summary className="cursor-pointer list-none px-4 py-3 text-sm font-medium hover:bg-muted/50">
          <span className="inline-flex items-center gap-2">
            <Plus className="size-4 rtl:-scale-x-100" aria-hidden /> Add blog post
          </span>
        </summary>
        <form
          action={(fd) => {
            startTransition(async () => {
              const res = await createBlogPost({
                slug: String(fd.get("slug") ?? ""),
                authorName: String(fd.get("authorName") ?? ""),
                category: String(fd.get("category") ?? "general"),
                tags: String(fd.get("tags") ?? "")
                  .split(",")
                  .map((t) => t.trim())
                  .filter(Boolean),
                featured: fd.get("featured") === "on",
                published: fd.get("published") === "on",
                seoTitle: String(fd.get("seoTitle") ?? ""),
                seoDescription: String(fd.get("seoDescription") ?? ""),
                translations: [
                  {
                    locale: "en" as const,
                    title: String(fd.get("titleEn") ?? ""),
                    excerpt: String(fd.get("excerptEn") ?? ""),
                    content: String(fd.get("contentEn") ?? ""),
                  },
                  ...(String(fd.get("titleAr") ?? "")
                    ? [
                        {
                          locale: "ar" as const,
                          title: String(fd.get("titleAr") ?? ""),
                          excerpt: String(fd.get("excerptAr") ?? ""),
                          content: String(fd.get("contentAr") ?? ""),
                        },
                      ]
                    : []),
                ],
              });
              if (!res.ok) setError(res.error);
            });
          }}
          className="grid gap-3 border-t border-border p-4 sm:grid-cols-2"
        >
          <div className="space-y-1.5">
            <Label htmlFor="b-slug">Slug (kebab-case)</Label>
            <Input id="b-slug" name="slug" placeholder="my-new-article" required dir="ltr" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="b-author">Author</Label>
            <Input id="b-author" name="authorName" defaultValue="RESTORA Team" required />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="b-category">Category</Label>
            <Input id="b-category" name="category" placeholder="operations" required />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="b-tags">Tags (comma separated)</Label>
            <Input id="b-tags" name="tags" placeholder="orders, growth" />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="b-seo-title">SEO title override</Label>
            <Input id="b-seo-title" name="seoTitle" />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="b-seo-desc">SEO description override</Label>
            <Textarea id="b-seo-desc" name="seoDescription" rows={2} />
          </div>

          <div className="space-y-2 rounded-md border border-border p-3 sm:col-span-2" dir="ltr">
            <Badge variant="outline">English</Badge>
            <div className="grid gap-2">
              <Input name="titleEn" placeholder="Title (EN)" required />
              <Textarea name="excerptEn" placeholder="Excerpt (EN)" rows={2} required />
              <Textarea name="contentEn" placeholder="Body (EN) — markdown-ish" rows={8} required />
            </div>
          </div>

          <div className="space-y-2 rounded-md border border-border p-3 sm:col-span-2" dir="rtl">
            <Badge variant="outline">العربية</Badge>
            <div className="grid gap-2">
              <Input name="titleAr" placeholder="العنوان (AR)" className="text-right" />
              <Textarea name="excerptAr" placeholder="المقدمة (AR)" rows={2} className="text-right" />
              <Textarea name="contentAr" placeholder="المحتوى (AR)" rows={8} className="text-right" />
            </div>
          </div>

          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="featured" className="size-4 accent-[var(--brand-primary)]" />
            Featured
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="published" defaultChecked className="size-4 accent-[var(--brand-primary)]" />
            Publish immediately
          </label>

          <div className="sm:col-span-2">
            <Button type="submit" variant="secondary" disabled={isPending}>
              Create post
            </Button>
          </div>
        </form>
      </details>
    </div>
  );
}
