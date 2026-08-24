import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getBranding, getSocialLinks } from "@/src/server/branding";
import { getSections } from "@/src/server/content";
import { getPlanRecommendations } from "@/src/server/pricing";
import { buildMetadata } from "@/src/server/seo";
import { Navbar } from "@/src/components/site/navbar";
import { Footer } from "@/src/components/site/footer";
import { Reveal } from "@/src/components/site/reveal";
import { BusinessJourney } from "@/src/components/site/business-journey";
import { PlanRecommender } from "@/src/components/site/plan-recommender";

const SEGMENT_KEYS = [
  "restaurant",
  "cafe",
  "bakery",
  "sweets",
  "juices",
  "cloud-kitchen",
  "food-truck",
  "catering",
  "home-chef",
] as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Business" });
  return buildMetadata("business", locale, t("metaTitle"), { path: "/business" });
}

export default async function BusinessPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [branding, socialLinks, sections, plans] = await Promise.all([
    getBranding(),
    getSocialLinks(),
    getSections(locale),
    getPlanRecommendations(locale),
  ]);
  const t = await getTranslations("Business");
  const bizHero = sections["biz-hero"];
  const bizSegments = sections["biz-segments"];
  const bizJourney = sections["biz-journey"];
  const bizRec = sections["biz-recommender"];

  return (
    <>
      <Navbar brandName={branding.brandName} />
      <main className="flex-1">
        {/* hero */}
        <section className="relative overflow-hidden bg-[radial-gradient(120%_140%_at_50%_0%,color-mix(in_srgb,var(--brand-secondary)_92%,black),var(--brand-secondary))] py-24 text-[#f2f0e9] md:py-32">
          <div className="pointer-events-none absolute inset-0" aria-hidden>
            <div className="absolute -bottom-24 start-[10%] size-96 rounded-full bg-[var(--brand-accent)] opacity-20 blur-[130px]" />
          </div>
          <div className="container-page relative text-center">
            <Reveal direction="up">
              <p className="font-mono text-xs font-semibold uppercase tracking-[0.3em] text-white/60">
                {bizHero?.subtitle ?? t("kicker")}
              </p>
              <h1 className="mx-auto mt-4 max-w-3xl text-balance font-display font-bold leading-[1.08] tracking-tight text-display-lg">
                {bizHero?.title ?? t("title")}
              </h1>
              <p className="mx-auto mt-5 max-w-xl text-balance text-white/70">
                {bizHero?.description ?? t("subtitle")}
              </p>
            </Reveal>
          </div>
        </section>

        {/* segments grid */}
        <section className="container-page py-20 md:py-28">
          <Reveal direction="up">
            <h2 className="text-center font-display font-bold tracking-tight text-display-md">
              {bizSegments?.title ?? ""}
            </h2>
          </Reveal>
          <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3">
            {SEGMENT_KEYS.map((key, i) => (
              <Reveal key={key} direction="up" delay={i * 0.04}>
                <div className="group h-full rounded-2xl border border-border bg-card p-6 text-center shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 motion-reduce:transition-none">
                  <span className="text-3xl" aria-hidden>
                    {t(`segments.${key}.icon`)}
                  </span>
                  <p className="mt-3 font-display font-bold leading-snug group-hover:text-primary">
                    {t(`segments.${key}.label`)}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* journey */}
        <section className="bg-secondary/40 py-20 md:py-28">
          <div className="container-page">
            <Reveal direction="up">
              <p className="text-center font-mono text-xs font-semibold uppercase tracking-[0.3em] text-primary">
                {bizJourney?.subtitle ?? ""}
              </p>
              <h2 className="mt-4 text-center font-display font-bold tracking-tight text-display-md">
                {bizJourney?.title ?? ""}
              </h2>
            </Reveal>
            <div className="mt-14">
              <BusinessJourney />
            </div>
          </div>
        </section>

        {/* recommender */}
        <section className="container-page py-20 md:py-28">
          <Reveal direction="up">
            <h2 className="text-center font-display font-bold tracking-tight text-display-md">
              {bizRec?.title ?? ""}
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-balance text-center text-muted-foreground">
              {bizRec?.description ?? ""}
            </p>
          </Reveal>
          <div className="mt-12">
            <PlanRecommender plans={plans} />
          </div>
        </section>
      </main>
      <Footer branding={branding} socialLinks={socialLinks} />
    </>
  );
}
