import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getBranding, getSocialLinks } from "@/src/server/branding";
import { listActiveCountries } from "@/src/server/pricing";
import { Navbar } from "@/src/components/site/navbar";
import { Footer } from "@/src/components/site/footer";
import { ContactForm } from "@/src/components/site/contact-form";
import { Reveal } from "@/src/components/site/reveal";
import { buildMetadata } from "@/src/server/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Contact" });
  return buildMetadata("contact", locale, t("title"), { path: "/contact" });
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("Contact");
  const [branding, socialLinks, countries] = await Promise.all([
    getBranding(),
    getSocialLinks(),
    listActiveCountries(),
  ]);

  return (
    <>
      <Navbar brandName={branding.brandName} />
      <main className="flex-1">
        <section className="container-page py-16 md:py-24">
          <div className="mx-auto max-w-2xl">
            <Reveal direction="up">
              <p className="text-center font-mono text-xs font-semibold uppercase tracking-[0.3em] text-primary">
                {t("kicker")}
              </p>
              <h1 className="mt-4 text-center font-display font-bold tracking-tight text-display-md">
                {t("heading")}
              </h1>
              <p className="mx-auto mt-4 max-w-xl text-balance text-center text-muted-foreground">
                {t("subheading")}
              </p>
            </Reveal>

            <Reveal direction="up" delay={0.12} className="mt-10 block">
              <ContactForm
                countries={countries.map((c) => ({ code: c.code, name: c.name, dialCode: c.dialCode }))}
                sourcePage="/contact"
              />
            </Reveal>
          </div>
        </section>
      </main>
      <Footer branding={branding} socialLinks={socialLinks} />
    </>
  );
}
