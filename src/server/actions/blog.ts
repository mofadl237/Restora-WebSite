"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/src/lib/db";
import { assertAdminAllowed } from "@/src/server/admin/access";

const LOCALES = ["en", "ar"] as const;

const postSchema = z.object({
  slug: z
    .string()
    .min(1)
    .max(120)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be kebab-case"),
  authorName: z.string().min(1).max(100),
  category: z.string().min(1).max(60),
  tags: z.array(z.string().max(40)).max(10).default([]),
  featured: z.boolean().default(false),
  published: z.boolean().default(false),
  seoTitle: z.string().max(200).optional().or(z.literal("")),
  seoDescription: z.string().max(400).optional().or(z.literal("")),
  translations: z
    .array(
      z.object({
        locale: z.enum(LOCALES),
        title: z.string().min(1).max(200),
        excerpt: z.string().min(1).max(500),
        content: z.string().min(1).max(50000),
      }),
    )
    .min(1, "At least one translation is required"),
});

export type BlogPostInput = z.infer<typeof postSchema>;

function revalidateBlog(slug?: string) {
  revalidatePath("/", "page");
  try {
    revalidatePath("/blog");
  } catch {
    // route may not be mounted yet in fresh DBs
  }
  if (slug) {
    try {
      revalidatePath(`/blog/${slug}`);
    } catch {
      // same as above
    }
  }
}

export async function createBlogPost(input: unknown) {
  await assertAdminAllowed();
  const parsed = postSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false as const, error: parsed.error.issues[0]?.message ?? "Invalid data" };
  }
  const d = parsed.data;

  const existing = await prisma.blogPost.findUnique({ where: { slug: d.slug } });
  if (existing) return { ok: false as const, error: "Slug already exists" };

  const maxOrder = await prisma.blogPost.aggregate({ _max: { displayOrder: true } });
  const post = await prisma.blogPost.create({
    data: {
      slug: d.slug,
      authorName: d.authorName,
      category: d.category,
      tags: d.tags,
      featured: d.featured,
      published: d.published,
      publishedAt: d.published ? new Date() : null,
      displayOrder: (maxOrder._max.displayOrder ?? -1) + 1,
      seoTitle: d.seoTitle || null,
      seoDescription: d.seoDescription || null,
    },
  });
  await prisma.blogPostTranslation.createMany({
    data: d.translations.map((t) => ({
      postId: post.id,
      locale: t.locale,
      title: t.title,
      excerpt: t.excerpt,
      content: t.content,
    })),
  });
  revalidateBlog(d.slug);
  return { ok: true as const, id: post.id };
}

export async function updateBlogPost(id: number, input: unknown) {
  await assertAdminAllowed();
  const parsed = postSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false as const, error: parsed.error.issues[0]?.message ?? "Invalid data" };
  }
  const d = parsed.data;

  const current = await prisma.blogPost.findUnique({ where: { id } });
  if (!current) return { ok: false as const, error: "Post not found" };

  const clash = await prisma.blogPost.findUnique({ where: { slug: d.slug } });
  if (clash && clash.id !== id) return { ok: false as const, error: "Slug already exists" };

  await prisma.blogPost.update({
    where: { id },
    data: {
      slug: d.slug,
      authorName: d.authorName,
      category: d.category,
      tags: d.tags,
      featured: d.featured,
      published: d.published,
      publishedAt:
        d.published ? (current.publishedAt ?? new Date()) : null,
      seoTitle: d.seoTitle || null,
      seoDescription: d.seoDescription || null,
    },
  });
  for (const t of d.translations) {
    await prisma.blogPostTranslation.upsert({
      where: { postId_locale: { postId: id, locale: t.locale } },
      update: { title: t.title, excerpt: t.excerpt, content: t.content },
      create: { postId: id, locale: t.locale, title: t.title, excerpt: t.excerpt, content: t.content },
    });
  }
  revalidateBlog(current.slug);
  revalidateBlog(d.slug);
  return { ok: true as const };
}

export async function setBlogPostPublished(id: number, published: boolean) {
  await assertAdminAllowed();
  const current = await prisma.blogPost.findUnique({ where: { id } });
  if (!current) return { ok: false as const, error: "Post not found" };
  await prisma.blogPost.update({
    where: { id },
    data: { published, publishedAt: published ? (current.publishedAt ?? new Date()) : null },
  });
  revalidateBlog(current.slug);
  return { ok: true as const };
}

export async function deleteBlogPost(id: number) {
  await assertAdminAllowed();
  const current = await prisma.blogPost.findUnique({ where: { id } });
  await prisma.blogPost.delete({ where: { id } });
  revalidateBlog(current?.slug);
  return { ok: true as const };
}
