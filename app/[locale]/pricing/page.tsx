import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getPricingViewModel } from "@/src/server/pricing";
import { getBranding, getSocialLinks } from "@/src/server/branding";
import { Navbar } from "@/src/components/site/navbar";
import { Footer } from "@/src/components/site/footer";
import { PricingSection } from "@/src/components/pricing/pricing-section";
import { buildMetadata } from "@/src/server/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Pricing" });
  return buildMetadata("pricing", locale, t("title"), { path: "/pricing" });
}

export default async function PricingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [pricing, branding, socialLinks] = await Promise.all([
    getPricingViewModel(locale),
    getBranding(),
    getSocialLinks(),
  ]);

  return (
    <>
      <Navbar brandName={branding.brandName} />
      <main className="flex-1">
        <section className="container-page py-16 md:py-24">
          <PricingSection data={pricing} />
        </section>
        <div className="h-10" aria-hidden />
      </main>
      <Footer branding={branding} socialLinks={socialLinks} />
    </>
  );
}
