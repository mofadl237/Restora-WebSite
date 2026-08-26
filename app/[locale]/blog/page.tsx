import type { Metadata } from "next";
import { Link } from "@/src/i18n/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getBranding, getSocialLinks } from "@/src/server/branding";
import { getBlogPosts } from "@/src/server/content";
import { Navbar } from "@/src/components/site/navbar";
import { Footer } from "@/src/components/site/footer";
import { Reveal } from "@/src/components/site/reveal";
import { buildMetadata } from "@/src/server/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Blog" });
  return buildMetadata("blog", locale, t("title"), { path: "/blog" });
}

function formatDate(date: Date | null, locale: string): string {
  if (!date) return "";
  try {
    return new Intl.DateTimeFormat(locale, { dateStyle: "long" }).format(date);
  } catch {
    return date.toISOString().slice(0, 10);
  }
}

export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("Blog");
  const [branding, socialLinks, posts] = await Promise.all([
    getBranding(),
    getSocialLinks(),
    getBlogPosts(locale),
  ]);

  const featured = posts.find((p) => p.featured) ?? posts[0];
  const rest = posts.filter((p) => p !== featured);

  return (
    <>
      <Navbar brandName={branding.brandName} />
      <main className="flex-1">
        <section className="container-page py-16 md:py-24">
          <Reveal direction="up">
            <p className="text-center font-mono text-xs font-semibold uppercase tracking-[0.3em] text-primary">
              {t("kicker")}
            </p>
            <h1 className="mt-4 text-center font-display font-bold tracking-tight text-display-md">
              {t("title")}
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-balance text-center text-muted-foreground">
              {t("subtitle")}
            </p>
          </Reveal>

          {featured && (
            <Reveal direction="up" delay={0.1}>
              <Link
                href={`/blog/${featured.slug}`}
                className="group mx-auto mt-12 block max-w-3xl rounded-3xl border border-border bg-card p-8 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lift md:p-10 motion-reduce:transition-none"
              >
                <p className="font-mono text-xs font-semibold uppercase tracking-[0.25em] text-primary">
                  {featured.category}
                </p>
                <h2 className="mt-3 font-display font-bold tracking-tight text-display-sm group-hover:text-primary">
                  {featured.title}
                </h2>
                <p className="mt-3 line-clamp-2 text-muted-foreground">{featured.excerpt}</p>
                <p className="mt-5 text-xs text-muted-foreground">
                  {featured.authorName} · {formatDate(featured.publishedAt, locale)} ·{" "}
                  {t("readingTime", { minutes: featured.readingTime })}
                </p>
              </Link>
            </Reveal>
          )}

          <div className="mx-auto mt-8 grid max-w-4xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((post, i) => (
              <Reveal key={post.id} direction="up" delay={i * 0.06} amount={0.2}>
                <Link
                  href={`/blog/${post.slug}`}
                  className="group flex h-full flex-col rounded-2xl border border-border bg-card p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lift motion-reduce:transition-none"
                >
                  <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.25em] text-primary">
                    {post.category}
                  </p>
                  <h2 className="mt-2.5 font-display text-lg font-bold leading-snug tracking-tight group-hover:text-primary">
                    {post.title}
                  </h2>
                  <p className="mt-2 line-clamp-3 flex-1 text-sm text-muted-foreground">
                    {post.excerpt}
                  </p>
                  <p className="mt-4 text-xs text-muted-foreground">
                    {formatDate(post.publishedAt, locale)} ·{" "}
                    {t("readingTime", { minutes: post.readingTime })}
                  </p>
                </Link>
              </Reveal>
            ))}
          </div>

          {posts.length === 0 && (
            <p className="mt-16 text-center text-muted-foreground">{t("empty")}</p>
          )}
        </section>
      </main>
      <Footer branding={branding} socialLinks={socialLinks} />
    </>
  );
}
