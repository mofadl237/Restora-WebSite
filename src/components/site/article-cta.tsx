import { Link } from "@/src/i18n/navigation";
import { getTranslations } from "next-intl/server";

/**
 * Contextual end-of-article CTA — one natural next step per intent type.
 * Server component; links into the commercial funnel (business hub/pricing).
 */
export async function ArticleCta() {
  const t = await getTranslations("Blog");
  return (
    <aside className="mt-12 rounded-3xl border border-primary/30 bg-secondary/50 p-7 text-center md:p-9">
      <h2 className="font-display text-xl font-bold tracking-tight">{t("ctaTitle")}</h2>
      <p className="mx-auto mt-2 max-w-md text-balance text-sm leading-relaxed text-muted-foreground">
        {t("ctaBody")}
      </p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/pricing"
          className="inline-flex items-center gap-2 rounded-full bg-[var(--brand-accent)] px-6 py-3 text-sm font-semibold text-accent-foreground shadow-lift transition-shadow hover:shadow-glow"
        >
          {t("ctaPricing")}
        </Link>
        <Link
          href="/business"
          className="inline-flex items-center rounded-full border border-border bg-card px-6 py-3 text-sm font-semibold transition-colors hover:border-primary/40 hover:text-primary"
        >
          {t("ctaBusiness")}
        </Link>
      </div>
    </aside>
  );
}
