import type { Metadata } from "next";
import { Link } from "@/src/i18n/navigation";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getBranding, getSocialLinks } from "@/src/server/branding";
import { getBlogPost, getBlogPosts } from "@/src/server/content";
import { Navbar } from "@/src/components/site/navbar";
import { Footer } from "@/src/components/site/footer";
import { RichText } from "@/src/components/site/rich-text";
import { Reveal } from "@/src/components/site/reveal";
import { ReadingProgress } from "@/src/components/site/reading-progress";
import { ShareRow } from "@/src/components/site/share-row";
import { ArticleCta } from "@/src/components/site/article-cta";
import { buildMetadata, SITE_URL } from "@/src/server/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = await getBlogPost(locale, slug);
  if (!post) return {};
  // Per-post CMS SEO fields win, then SeoEntry, then safe content fallbacks.
  return buildMetadata(`blog:${slug}`, locale, post.seoTitle ?? post.title, {
    path: `/blog/${slug}`,
    description: post.seoDescription ?? post.excerpt,
    image: post.ogImage ?? post.coverImage,
  });
}

function formatDate(date: Date | null, locale: string): string {
  if (!date) return "";
  try {
    return new Intl.DateTimeFormat(locale, { dateStyle: "long" }).format(date);
  } catch {
    return date.toISOString().slice(0, 10);
  }
}

export default async function BlogArticlePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const [branding, socialLinks, post] = await Promise.all([
    getBranding(),
    getSocialLinks(),
    getBlogPost(locale, slug),
  ]);
  if (!post) notFound();

  const t = await getTranslations("Blog");
  const all = await getBlogPosts(locale);
  // Related = same category first, then shared tags, then most recent others.
  const scored = all
    .filter((p) => p.slug !== slug)
    .map((p) => ({
      post: p,
      score:
        (p.category === post.category ? 2 : 0) +
        p.tags.filter((tag) => post.tags.includes(tag)).length,
    }))
    .sort((a, b) => b.score - a.score);
  const related = scored.slice(0, 2).map((s) => s.post);
  const articleUrl = `${SITE_URL}/${locale}/blog/${post.slug}`;

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    url: articleUrl,
    inLanguage: locale,
    datePublished: post.publishedAt?.toISOString(),
    author: { "@type": "Person", name: post.authorName },
    publisher: { "@type": "Organization", name: branding.brandName },
  };
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: t("home"), item: `${SITE_URL}/${locale}` },
      { "@type": "ListItem", position: 2, name: t("title"), item: `${SITE_URL}/${locale}/blog` },
      { "@type": "ListItem", position: 3, name: post.title, item: articleUrl },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <ReadingProgress />
      <Navbar brandName={branding.brandName} />
      <main className="flex-1">
        <article className="container-page py-16 md:py-24">
          <div className="mx-auto max-w-2xl">
            <Reveal direction="up">
              <nav aria-label="breadcrumb" className="flex items-center gap-2 text-sm text-muted-foreground">
                <Link href="/" className="transition-colors hover:text-foreground">
                  {t("home")}
                </Link>
                <span aria-hidden>/</span>
                <Link href="/blog" className="transition-colors hover:text-foreground">
                  {t("title")}
                </Link>
                <span aria-hidden>/</span>
                <span className="truncate text-foreground">{post.title}</span>
              </nav>
              <p className="mt-8 font-mono text-xs font-semibold uppercase tracking-[0.25em] text-primary">
                {post.category}
              </p>
              <h1 className="mt-3 font-display font-bold leading-tight tracking-tight text-display-md">
                {post.title}
              </h1>
              <p className="mt-5 text-xs text-muted-foreground">
                {post.authorName} · {formatDate(post.publishedAt, locale)} ·{" "}
                {t("readingTime", { minutes: post.readingTime })}
              </p>
              <hr className="mt-8 border-border/60" />
            </Reveal>

            <Reveal direction="up" delay={0.08}>
              <p className="mt-8 border-s-2 border-primary/50 ps-4 text-lg italic leading-relaxed text-muted-foreground">
                {post.excerpt}
              </p>
              <div className="mt-8 [&>p]:!text-base">
                <RichText content={post.content} />
              </div>
              <ShareRow url={articleUrl} title={post.title} />
              <ArticleCta />
            </Reveal>

            {related.length > 0 && (
              <Reveal direction="up" amount={0.1}>
                <h2 className="mt-16 font-display text-xl font-bold tracking-tight">
                  {t("related")}
                </h2>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  {related.map((r) => (
                    <Link
                      key={r.id}
                      href={`/blog/${r.slug}`}
                      className="group rounded-2xl border border-border bg-card p-5 shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/40 motion-reduce:transition-none"
                    >
                      <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.25em] text-primary">
                        {r.category}
                      </p>
                      <p className="mt-2 font-display font-bold leading-snug group-hover:text-primary">
                        {r.title}
                      </p>
                      <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{r.excerpt}</p>
                    </Link>
                  ))}
                </div>
              </Reveal>
            )}
          </div>
        </article>
      </main>
      <Footer branding={branding} socialLinks={socialLinks} />
    </>
  );
}
