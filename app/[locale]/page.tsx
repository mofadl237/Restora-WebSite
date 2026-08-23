import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import {
  getSections,
  getStoryScenes,
  getTestimonials,
  getFaqs,
} from "@/src/server/content";
import { getPricingViewModel } from "@/src/server/pricing";
import { getBranding, getSocialLinks } from "@/src/server/branding";
import { Navbar } from "@/src/components/site/navbar";
import { Footer } from "@/src/components/site/footer";
import { Hero } from "@/src/components/site/hero";
import { ProductStory } from "@/src/components/site/product-story";
import { HowItWorks } from "@/src/components/site/how-it-works";
import { WhyRestora } from "@/src/components/site/why-restora";
import { Outcomes } from "@/src/components/site/outcomes";
import { PricingSection } from "@/src/components/pricing/pricing-section";
import { TestimonialsCarousel } from "@/src/components/site/testimonials-carousel";
import { FinalCta } from "@/src/components/site/final-cta";
import { Reveal } from "@/src/components/site/reveal";
import { JsonLd, organizationSchema, softwareApplicationSchema, faqSchema } from "@/src/components/site/json-ld";
import { buildMetadata } from "@/src/server/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Pricing" });
  return buildMetadata("home", locale, t("title"));
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Must be called before any async operations — enables static rendering
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "Nav" });

  const [sections, scenes, pricing, branding, testimonials, faqs, socialLinks] =
    await Promise.all([
      getSections(locale),
      getStoryScenes(locale),
      getPricingViewModel(locale),
      getBranding(),
      getTestimonials(locale),
      getFaqs(locale),
      getSocialLinks(),
    ]);

  const stepKeys = ["step-1", "step-2", "step-3"] as const;
  const whyKeys = ["why-1", "why-2", "why-3"] as const;
  const outcomeKeys = ["outcome-1", "outcome-2", "outcome-3"] as const;
  const steps = stepKeys.map((k) => ({
    title: sections[k]?.title ?? "",
    description: sections[k]?.description ?? null,
  }));
  const points = whyKeys.map((k) => ({
    title: sections[k]?.title ?? "",
    description: sections[k]?.description ?? null,
  }));
  const outcomes = outcomeKeys
    .map((k) => ({ value: sections[k]?.title ?? "", label: sections[k]?.description ?? "" }))
    .filter((o) => o.value);

  // Structured data (Organization + SoftwareApplication offers + FAQPage)
  const defaultCountryPricing = pricing.byCountry[pricing.defaultCountryCode] ?? [];
  const jsonLd: Array<Record<string, unknown>> = [
    organizationSchema(branding.brandName, socialLinks.map((s) => s.url), branding.logoUrl),
    ...(defaultCountryPricing.length
      ? [
          softwareApplicationSchema(
            branding.brandName,
            sections.hero?.description || "",
            defaultCountryPricing.map((p) => ({
              name: `${p.name} (yearly)`,
              price: p.yearlyPrice,
              currency: pricing.countries.find((c) => c.code === pricing.defaultCountryCode)?.currencyCode ?? "",
            })),
          ),
        ]
      : []),
    ...(() => {
      const f = faqSchema(faqs);
      return f ? [f] : [];
    })(),
  ];

  return (
    <>
      <JsonLd data={jsonLd} />
      <Navbar brandName={branding.brandName} />

      <main className="flex-1">
        {/* HERO — cinematic entrance + parallax product visual */}
        <Hero
          eyebrow={sections.hero?.subtitle}
          title={sections.hero?.title ?? ""}
          description={sections.hero?.description}
          ctaLabel={sections.hero?.ctaLabel}
          ctaHref={sections.hero?.ctaHref}
        />

        {/* PROBLEM — bold typographic statement */}
        <section className="container-page py-20 text-center md:py-28">
          <Reveal direction="up" amount={0.4}>
            <h2 className="mx-auto max-w-4xl font-display font-bold leading-[1.08] tracking-tight text-display-lg">
              {sections.problem?.title}
            </h2>
          </Reveal>
          <Reveal direction="up" delay={0.12}>
            <p className="mx-auto mt-6 max-w-2xl text-balance text-lg leading-relaxed text-muted-foreground">
              {sections.problem?.description}
            </p>
          </Reveal>
        </section>

        {/* SOLUTION — bridge into the story */}
        <section className="border-y border-border bg-secondary/40 py-16 md:py-20">
          <div className="container-page text-center">
            <Reveal direction="scale" amount={0.5}>
              <p className="font-mono text-xs font-semibold uppercase tracking-[0.3em] text-primary">
                {sections.solution?.subtitle ?? "RESTORA"}
              </p>
              <h2 className="mx-auto mt-4 max-w-3xl font-display font-bold tracking-tight text-display-md">
                {sections.solution?.title}
              </h2>
            </Reveal>
          </div>
        </section>

        {/* PRODUCT STORY — pinned cinematic scroll journey (CMS scenes) */}
        <ProductStory scenes={scenes} />

        {/* HOW IT WORKS */}
        <HowItWorks heading={sections["how-it-works"]?.title ?? ""} steps={steps} />

        {/* WHY RESTORA — chef narrator + differentiators */}
        <div className="bg-secondary/40">
          <WhyRestora
            heading={sections["why-restora"]?.title ?? ""}
            subheading={sections["why-restora"]?.description}
            points={points}
          />
        </div>

        {/* OUTCOMES */}
        <Outcomes heading={sections.outcomes?.title} items={outcomes} />

        {/* PRICING */}
        <section id="pricing" className="container-page py-20 md:py-28">
          <PricingSection data={pricing} />
        </section>

        {/* TESTIMONIALS */}
        <div className="border-y border-border bg-secondary/40">
          <TestimonialsCarousel items={testimonials} />
        </div>

        {/* FAQ */}
        {faqs.length > 0 && (
          <section id="faq" className="container-page py-20 md:py-28" aria-labelledby="faq-title">
            <Reveal direction="up">
              <h2 id="faq-title" className="text-center font-display font-bold tracking-tight text-display-md">
                {t("faq")}
              </h2>
            </Reveal>
            <div className="mx-auto mt-10 max-w-3xl space-y-3">
              {faqs.map((f, i) => (
                <Reveal key={f.id} direction="up" delay={i * 0.05} amount={0.2}>
                  <details className="group rounded-xl border border-border bg-card open:border-primary/30 open:bg-secondary/40">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-sm font-medium [&::-webkit-details-marker]:hidden">
                      {f.question}
                      <span className="grid size-6 shrink-0 place-items-center rounded-full bg-secondary text-muted-foreground transition-transform duration-300 group-open:rotate-45 group-open:bg-primary group-open:text-primary-foreground" aria-hidden>
                        +
                      </span>
                    </summary>
                    <p className="px-5 pb-5 text-sm leading-relaxed text-muted-foreground">{f.answer}</p>
                  </details>
                </Reveal>
              ))}
            </div>
          </section>
        )}

        {/* FINAL CTA */}
        <FinalCta
          title={sections["final-cta"]?.title ?? ""}
          subtitle={sections["final-cta"]?.description}
          ctaLabel={sections["final-cta"]?.ctaLabel}
          ctaHref={sections["final-cta"]?.ctaHref}
        />
      </main>

      <Footer branding={branding} socialLinks={socialLinks} />
    </>
  );
}

