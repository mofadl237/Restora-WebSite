import type { Metadata } from "next";
import { Link } from "@/src/i18n/navigation";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Check } from "lucide-react";
import { getBranding, getSocialLinks } from "@/src/server/branding";
import { buildMetadata, SITE_URL } from "@/src/server/seo";
import { getSegmentPage, listSegmentPages } from "@/src/server/segments";
import { getPlanRecommendations } from "@/src/server/pricing";
import { getBlogPosts } from "@/src/server/content";
import { Navbar } from "@/src/components/site/navbar";
import { Footer } from "@/src/components/site/footer";
import { Reveal } from "@/src/components/site/reveal";

export const dynamic = "force-dynamic";


/** Which blog topic cluster relates to which segment (internal linking). */
const SEGMENT_CATEGORY: Record<string, string> = {
  restaurants: "operations",
  "cloud-kitchens": "operations",
  catering: "operations",
  "food-trucks": "operations",
  cafes: "digital-menu",
  bakeries: "digital-menu",
  desserts: "digital-menu",
  "juice-shops": "digital-menu",
  "home-food-businesses": "growth",
};

export async function generateStaticParams() {
  const segments = await listSegmentPages("en");
  return segments.map((s) => ({ segment: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; segment: string }>;
}): Promise<Metadata> {
  const { locale, segment } = await params;
  const page = await getSegmentPage(locale, segment);
  if (!page) return {};
  return buildMetadata(`segment:${segment}`, locale, page.seoTitle ?? page.title, {
    path: `/business/${segment}`,
    description: page.seoDescription ?? page.description,
  });
}

export default async function SegmentPage({
  params,
}: {
  params: Promise<{ locale: string; segment: string }>;
}) {
  const { locale, segment } = await params;
  setRequestLocale(locale);

  const [branding, socialLinks, page, plans, allPosts] = await Promise.all([
    getBranding(),
    getSocialLinks(),
    getSegmentPage(locale, segment),
    getPlanRecommendations(locale),
    getBlogPosts(locale),
  ]);
  if (!page) notFound();

  const t = await getTranslations("Business");
  const recommended = plans.find((p) => p.slug === page.planSlug);
  const canonicalPath = `/business/${segment}`;

  // Internal links: same-cluster articles first, then most recent.
  const category = SEGMENT_CATEGORY[segment];
  const articles = [
    ...allPosts.filter((p) => p.category === category && p.slug),
    ...allPosts.filter((p) => p.category !== category),
  ]
    .filter((p, i, arr) => arr.findIndex((x) => x.slug === p.slug) === i)
    .slice(0, 2);

  const others = (await listSegmentPages(locale)).filter((s) => s.slug !== segment);

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: page.faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: t("home"), item: `${SITE_URL}/${locale}` },
      { "@type": "ListItem", position: 2, name: t("metaTitle"), item: `${SITE_URL}/${locale}/business` },
      { "@type": "ListItem", position: 3, name: page.title, item: `${SITE_URL}/${locale}${canonicalPath}` },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <Navbar brandName={branding.brandName} />
      <main className="flex-1">
        {/* hero */}
        <section className="relative overflow-hidden bg-[radial-gradient(120%_140%_at_50%_0%,color-mix(in_srgb,var(--brand-secondary)_92%,black),var(--brand-secondary))] py-20 text-[#f2f0e9] md:py-28">
          <div className="pointer-events-none absolute inset-0" aria-hidden>
            <div className="absolute -bottom-24 start-[10%] size-96 rounded-full bg-[var(--brand-accent)] opacity-20 blur-[130px]" />
          </div>
          <div className="container-page relative max-w-3xl text-center">
            <Reveal direction="up">
              <p className="font-mono text-xs font-semibold uppercase tracking-[0.3em] text-white/60">
                {page.subtitle}
              </p>
              <h1 className="mt-4 text-balance font-display font-bold leading-tight tracking-tight text-display-lg">
                {page.title}
              </h1>
              <p className="mx-auto mt-5 max-w-xl text-balance text-white/70">{page.description}</p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Link
                  href="/pricing"
                  className="inline-flex items-center gap-2 rounded-full bg-[var(--brand-accent)] px-7 py-3 text-sm font-semibold text-accent-foreground shadow-lift transition-shadow hover:shadow-glow"
                >
                  {t("segCta")}
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center rounded-full border border-white/25 px-7 py-3 text-sm font-semibold text-white/85 backdrop-blur transition-colors hover:bg-white/10"
                >
                  {t("segCtaSecondary")}
                </Link>
              </div>
            </Reveal>
          </div>
        </section>

        {/* problems */}
        <section className="container-page py-16 md:py-20">
          <div className="grid gap-10 md:grid-cols-2">
            <Reveal direction="up">
              <h2 className="font-display font-bold tracking-tight text-display-sm">
                {t("segProblemsTitle")}
              </h2>
              <ul className="mt-6 space-y-4">
                {page.problems.map((p) => (
                  <li key={p} className="flex items-start gap-3 leading-relaxed">
                    <span aria-hidden className="mt-1 font-bold text-red-400">✗</span>
                    {p}
                  </li>
                ))}
              </ul>
            </Reveal>
            <Reveal direction="up" delay={0.08}>
              <h2 className="font-display font-bold tracking-tight text-display-sm">
                {t("segUseCasesTitle")}
              </h2>
              <ul className="mt-6 space-y-4">
                {page.useCases.map((u) => (
                  <li key={u} className="flex items-start gap-3 leading-relaxed">
                    <Check className="mt-1 size-4 shrink-0 text-primary" aria-hidden />
                    {u}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </section>

        {/* features + plan recommendation */}
        <section className="bg-secondary/40 py-16 md:py-20">
          <div className="container-page grid items-start gap-10 md:grid-cols-[1fr_auto]">
            <Reveal direction="up">
              <h2 className="font-display font-bold tracking-tight text-display-sm">
                {t("segFeaturesTitle")}
              </h2>
              <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                {page.features.map((f) => (
                  <li key={f} className="flex items-start gap-3 rounded-xl border border-border bg-card p-4 leading-snug shadow-card">
                    <Check className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
                    {f}
                  </li>
                ))}
              </ul>
            </Reveal>
            {recommended && (
              <Reveal direction="up" delay={0.1}>
                <aside className="w-full max-w-xs rounded-3xl border border-primary/40 bg-card p-6 text-center shadow-glow md:w-72">
                  <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.25em] text-primary">
                    {t("segPlanKicker")}
                  </p>
                  <p className="mt-2 font-display text-xl font-bold">{recommended.name}</p>
                  <p className="mt-1 min-h-10 text-sm text-muted-foreground">{recommended.shortDescription}</p>
                  <p className="mt-3 flex items-baseline justify-center gap-1">
                    <span className="font-display text-2xl font-bold">EGP {recommended.monthlyPrice}</span>
                    <span className="text-xs text-muted-foreground">{t("perMonth")}</span>
                  </p>
                  <Link href={`/contact?plan=${recommended.slug}`} className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[var(--brand-accent)] px-6 py-3 text-sm font-semibold text-accent-foreground shadow-lift transition-shadow hover:shadow-glow">
                    {t("segPlanCta")}
                  </Link>
                </aside>
              </Reveal>
            )}
          </div>
        </section>

        {/* FAQs */}
        {page.faqs.length > 0 && (
          <section id="faq" className="container-page py-16 md:py-20">
            <Reveal direction="up">
              <h2 className="text-center font-display font-bold tracking-tight text-display-md">
                {t("segFaqTitle")}
              </h2>
              <div className="mx-auto mt-8 max-w-2xl space-y-3">
                {page.faqs.map((f) => (
                  <details key={f.question} className="group rounded-xl border border-border bg-card px-5 py-4 [&_summary::-webkit-details-marker]:hidden">
                    <summary className="flex cursor-pointer items-center justify-between gap-4 font-semibold">
                      {f.question}
                      <svg viewBox="0 0 24 24" className="size-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                        <path d="M6 9l6 6 6-6" />
                      </svg>
                    </summary>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{f.answer}</p>
                  </details>
                ))}
              </div>
            </Reveal>
          </section>
        )}

        {/* internal links — segments + related reading + conversion paths */}
        <section className="border-t border-border bg-secondary/30 py-14">
          <div className="container-page space-y-10">
            <div>
              <h2 className="text-center font-display text-lg font-bold tracking-tight">{t("segOtherTitle")}</h2>
              <div className="mt-5 flex flex-wrap justify-center gap-2">
                {others.map((s) => (
                  <Link
                    key={s.slug}
                    href={`/business/${s.slug}`}
                    className="rounded-full border border-border bg-background px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
                  >
                    {s.icon} {s.subtitle ?? s.title}
                  </Link>
                ))}
              </div>
            </div>
            {articles.length > 0 && (
              <div>
                <h2 className="text-center font-display text-lg font-bold tracking-tight">{t("segReadTitle")}</h2>
                <div className="mx-auto mt-5 grid max-w-2xl gap-3 sm:grid-cols-2">
                  {articles.map((a) => (
                    <Link key={a.slug} href={`/blog/${a.slug}`} className="group rounded-2xl border border-border bg-card p-4 shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/40 motion-reduce:transition-none">
                      <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">{a.category}</p>
                      <p className="mt-1.5 font-display text-sm font-bold leading-snug group-hover:text-primary">{a.title}</p>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer branding={branding} socialLinks={socialLinks} />
    </>
  );
}
