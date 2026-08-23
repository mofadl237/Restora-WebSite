import Link from "next/link";
import { prisma } from "@/src/lib/db";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";
import { ArrowRight } from "lucide-react";

export default async function AdminOverviewPage() {
  const [branding, countryCount, planCount, featureCount, giftCount, sectionCount, testimonialCount, faqCount, seoCount] =
    await Promise.all([
      prisma.branding.findUnique({ where: { id: 1 } }),
      prisma.country.count(),
      prisma.plan.count(),
      prisma.feature.count(),
      prisma.gift.count(),
      prisma.marketingSection.count(),
      prisma.testimonial.count(),
      prisma.faq.count(),
      prisma.seoEntry.count(),
    ]);

  const stats = [
    { label: "Countries", value: countryCount, href: "/admin/countries" },
    { label: "Plans", value: planCount, href: "/admin/plans" },
    { label: "Features", value: featureCount, href: "/admin/features" },
    { label: "Gifts", value: giftCount, href: "/admin/gifts" },
    { label: "Marketing Sections", value: sectionCount, href: "/admin/sections" },
    { label: "Testimonials", value: testimonialCount, href: "/admin/testimonials" },
    { label: "FAQs", value: faqCount, href: "/admin/faqs" },
    { label: "SEO Entries", value: seoCount, href: "/admin/seo" },
  ];

  return (
    <div className="space-y-8">
      <header>
        <h1 className="font-display text-2xl font-semibold tracking-tight">Overview</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Platform content at a glance. Everything here is served live to the public website.
        </p>
      </header>

      <Card className="overflow-hidden">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <CardTitle>Branding</CardTitle>
              <CardDescription className="mt-1">
                Active identity used across the website.
              </CardDescription>
            </div>
            <Badge variant={branding ? "success" : "destructive"}>
              {branding ? "Configured" : "Missing"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="flex flex-wrap items-center gap-4">
          <span
            className="size-10 rounded-lg border border-border shadow-xs"
            style={{ background: branding?.primaryColor ?? "#EF6701" }}
            title={`Primary ${branding?.primaryColor ?? ""}`}
          />
          <span
            className="size-10 rounded-lg border border-border shadow-xs"
            style={{ background: branding?.secondaryColor ?? "#221812" }}
            title={`Secondary ${branding?.secondaryColor ?? ""}`}
          />
          <span
            className="size-10 rounded-lg border border-border shadow-xs"
            style={{ background: branding?.accentColor ?? "#FF8A3D" }}
            title={`Accent ${branding?.accentColor ?? ""}`}
          />
          <div className="ms-auto">
            <Link
              href="/admin/branding"
              className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
            >
              Edit branding <ArrowRight className="size-3.5 rtl:-scale-x-100" aria-hidden />
            </Link>
          </div>
        </CardContent>
      </Card>

      <section aria-label="Content statistics">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Content
        </h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {stats.map((s) => (
            <Link key={s.label} href={s.href} className="group">
              <Card className="transition-all group-hover:-translate-y-0.5 group-hover:shadow-lift">
                <CardContent className="p-4">
                  <p className="font-display text-2xl font-semibold tabular-nums">{s.value}</p>
                  <p className="mt-0.5 truncate text-xs text-muted-foreground">{s.label}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
