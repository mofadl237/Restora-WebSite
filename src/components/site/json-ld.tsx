/**
 * Server-rendered JSON-LD structured data.
 * Renders one <script type="application/ld+json"> per graph passed in.
 */
export function JsonLd({ data }: { data: Array<Record<string, unknown>> }) {
  return (
    <>
      {data.map((obj, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(obj).replace(/</g, "\\u003c") }}
        />
      ))}
    </>
  );
}

export function organizationSchema(brandName: string, socialUrls: string[], logoUrl?: string | null) {
  const base = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "http://localhost:3000";
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: brandName,
    url: base,
    ...(logoUrl ? { logo: logoUrl } : {}),
    ...(socialUrls.length ? { sameAs: socialUrls } : {}),
  };
}

const APP_CATEGORY = "BusinessApplication";

export function softwareApplicationSchema(
  name: string,
  description: string,
  offers: Array<{ name: string; price: string; currency: string }>,
) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name,
    applicationCategory: APP_CATEGORY,
    operatingSystem: "Web",
    description,
    offers: offers.map((o) => ({
      "@type": "Offer",
      name: o.name,
      price: o.price,
      priceCurrency: o.currency,
    })),
  };
}

export function faqSchema(faqs: Array<{ question: string; answer: string }>) {
  if (!faqs.length) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}
