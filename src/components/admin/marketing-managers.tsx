"use client";

import { useState, useTransition } from "react";
import {
  createFaq,
  createTestimonial,
  deleteFaq,
  deleteSeoEntry,
  deleteTestimonial,
  moveSection,
  setFaqActive,
  setSectionActive,
  setTestimonialActive,
  updateSectionTranslation,
  upsertSeoEntry,
} from "@/src/server/actions/marketing";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Textarea } from "@/src/components/ui/textarea";
import { Switch } from "@/src/components/ui/switch";
import { Badge } from "@/src/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import {
  ChevronDown,
  ChevronUp,
  Plus,
  Trash2,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Sections
// ---------------------------------------------------------------------------

export type SectionRow = {
  id: number;
  sectionKey: string;
  active: boolean;
  translations: Record<string, { title: string; subtitle: string; description: string; ctaLabel: string; ctaHref: string }>;
};

export function SectionsManager({ sections }: { sections: SectionRow[] }) {
  const [isPending, startTransition] = useTransition();

  return (
    <ul className={`space-y-4 ${isPending ? "opacity-60" : ""}`}>
      {sections.map((s) => (
        <li key={s.id}>
          <Card>
            <CardHeader className="flex-row items-center gap-3 pb-3">
              <div className="flex flex-col">
                <Button variant="ghost" size="icon" className="size-6" aria-label={`Move ${s.sectionKey} up`} onClick={() => startTransition(async () => { await moveSection(s.id, -1); })}>
                  <ChevronUp className="size-3.5" aria-hidden />
                </Button>
                <Button variant="ghost" size="icon" className="size-6" aria-label={`Move ${s.sectionKey} down`} onClick={() => startTransition(async () => { await moveSection(s.id, 1); })}>
                  <ChevronDown className="size-3.5" aria-hidden />
                </Button>
              </div>
              <CardTitle className="text-base">{s.sectionKey}</CardTitle>
              <Switch checked={s.active} onCheckedChange={(active) => startTransition(async () => { await setSectionActive(s.id, active); })} aria-label={`${s.sectionKey} active`} />
            </CardHeader>
            <CardContent className="grid gap-6 sm:grid-cols-2">
              {(["en", "ar"] as const).map((locale) => (
                <div key={locale} className="space-y-2" dir={locale === "ar" ? "rtl" : undefined}>
                  <Badge variant="outline">{locale === "en" ? "English" : "العربية"}</Badge>
                  <LocalizedFields
                    sectionId={s.id}
                    locale={locale}
                    initial={s.translations[locale]}
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </li>
      ))}
    </ul>
  );
}

function LocalizedFields({
  sectionId,
  locale,
  initial,
}: {
  sectionId: number;
  locale: string;
  initial?: { title: string; subtitle: string; description: string; ctaLabel: string; ctaHref: string };
}) {
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);

  return (
    <form
      action={(fd) =>
        startTransition(async () => {
          await updateSectionTranslation(sectionId, {
            locale,
            title: String(fd.get("title") ?? ""),
            subtitle: String(fd.get("subtitle") ?? ""),
            description: String(fd.get("description") ?? ""),
            ctaLabel: String(fd.get("ctaLabel") ?? ""),
            ctaHref: String(fd.get("ctaHref") ?? ""),
          });
          setSaved(true);
          setTimeout(() => setSaved(false), 2000);
        })
      }
      className="space-y-2"
    >
      <Input name="title" placeholder="Title" defaultValue={initial?.title ?? ""} required className={locale === "ar" ? "text-right" : ""} />
      <Input name="subtitle" placeholder="Subtitle" defaultValue={initial?.subtitle ?? ""} className={locale === "ar" ? "text-right" : ""} />
      <Textarea name="description" placeholder="Description" rows={2} defaultValue={initial?.description ?? ""} className={locale === "ar" ? "text-right" : ""} />
      <div className="grid grid-cols-2 gap-2">
        <Input name="ctaLabel" placeholder="CTA label" defaultValue={initial?.ctaLabel ?? ""} className={locale === "ar" ? "text-right" : ""} />
        <Input name="ctaHref" placeholder="/pricing" defaultValue={initial?.ctaHref ?? ""} dir="ltr" />
      </div>
      <div className="flex items-center gap-2">
        <Button type="submit" variant="secondary" size="sm" disabled={isPending}>
          Save
        </Button>
        {saved && <span role="status" className="text-xs font-medium text-success">Saved ✓</span>}
      </div>
    </form>
  );
}

// ---------------------------------------------------------------------------
// Testimonials
// ---------------------------------------------------------------------------

export type TestimonialRow = {
  id: number;
  customerName: string;
  restaurantName: string | null;
  rating: number;
  active: boolean;
  quoteEn: string | null;
  quoteAr: string | null;
};

export function TestimonialsManager({ items }: { items: TestimonialRow[] }) {
  const [isPending, startTransition] = useTransition();

  return (
    <div className={`space-y-6 ${isPending ? "opacity-60" : ""}`}>
      <ul className="space-y-3">
        {items.map((t) => (
          <li key={t.id} className="rounded-lg border border-border bg-card p-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-medium">{t.customerName}</span>
              {t.restaurantName && <span className="text-sm text-muted-foreground">· {t.restaurantName}</span>}
              <Badge variant="accent">{"★".repeat(t.rating)}</Badge>
              {!t.active && <Badge variant="secondary">Inactive</Badge>}
              <div className="ms-auto flex items-center gap-2">
                <Switch checked={t.active} onCheckedChange={(active) => startTransition(async () => { await setTestimonialActive(t.id, active); })} aria-label={`${t.customerName} active`} />
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive" onClick={() => startTransition(async () => { await deleteTestimonial(t.id); })} aria-label={`Delete ${t.customerName}`}>
                  <Trash2 className="size-4" aria-hidden />
                </Button>
              </div>
            </div>
            {t.quoteEn && <p className="mt-2 text-sm text-muted-foreground">“{t.quoteEn}”</p>}
            {t.quoteAr && <p className="mt-1 text-sm text-muted-foreground" dir="rtl">«{t.quoteAr}»</p>}
          </li>
        ))}
      </ul>

      <details className="rounded-lg border border-border">
        <summary className="cursor-pointer list-none px-4 py-3 text-sm font-medium hover:bg-muted/50">
          <span className="inline-flex items-center gap-2">
            <Plus className="size-4 rtl:-scale-x-100" aria-hidden /> Add testimonial
          </span>
        </summary>
        <form
          action={(fd) => {
            startTransition(async () => {
              await createTestimonial({
                customerName: String(fd.get("customerName") ?? ""),
                restaurantName: String(fd.get("restaurantName") ?? ""),
                rating: Number(fd.get("rating") ?? 5),
                quoteEn: String(fd.get("quoteEn") ?? ""),
                quoteAr: String(fd.get("quoteAr") ?? ""),
              });
            });
          }}
          className="grid gap-3 border-t border-border p-4 sm:grid-cols-2"
        >
          <div className="space-y-1.5"><Label htmlFor="t-name">Customer</Label><Input id="t-name" name="customerName" required /></div>
          <div className="space-y-1.5"><Label htmlFor="t-rest">Restaurant</Label><Input id="t-rest" name="restaurantName" /></div>
          <div className="space-y-1.5"><Label htmlFor="t-rating">Rating (1–5)</Label><Input id="t-rating" name="rating" type="number" min={1} max={5} defaultValue={5} /></div>
          <div className="space-y-1.5 sm:col-span-2"><Label htmlFor="t-quote-en">Quote (EN)</Label><Textarea id="t-quote-en" name="quoteEn" rows={2} required /></div>
          <div className="space-y-1.5 sm:col-span-2"><Label htmlFor="t-quote-ar">Quote (AR)</Label><Textarea id="t-quote-ar" name="quoteAr" rows={2} dir="rtl" /></div>
          <div><Button type="submit" variant="secondary">Create</Button></div>
        </form>
      </details>
    </div>
  );
}

// ---------------------------------------------------------------------------
// FAQs
// ---------------------------------------------------------------------------

export type FaqRow = {
  id: number;
  active: boolean;
  questionEn: string | null;
  questionAr: string | null;
};

export function FaqsManager({ faqs }: { faqs: FaqRow[] }) {
  const [isPending, startTransition] = useTransition();

  return (
    <div className={`space-y-6 ${isPending ? "opacity-60" : ""}`}>
      <ul className="divide-y divide-border/60 rounded-lg border border-border">
        {faqs.map((f) => (
          <li key={f.id} className="flex flex-wrap items-center gap-3 px-4 py-3">
            <div className="min-w-48 flex-1">
              <p className={`text-sm font-medium ${f.active ? "" : "line-through opacity-50"}`}>{f.questionEn ?? f.questionAr}</p>
              {f.questionAr && <p className="text-sm text-muted-foreground" dir="rtl">{f.questionAr}</p>}
            </div>
            <Switch checked={f.active} onCheckedChange={(active) => startTransition(async () => { await setFaqActive(f.id, active); })} aria-label="FAQ active" />
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive" onClick={() => startTransition(async () => { await deleteFaq(f.id); })} aria-label="Delete FAQ">
              <Trash2 className="size-4" aria-hidden />
            </Button>
          </li>
        ))}
      </ul>

      <details className="rounded-lg border border-border">
        <summary className="cursor-pointer list-none px-4 py-3 text-sm font-medium hover:bg-muted/50">
          <span className="inline-flex items-center gap-2">
            <Plus className="size-4 rtl:-scale-x-100" aria-hidden /> Add FAQ
          </span>
        </summary>
        <form
          action={(fd) => {
            startTransition(async () => {
              await createFaq({
                questionEn: String(fd.get("questionEn") ?? ""),
                answerEn: String(fd.get("answerEn") ?? ""),
                questionAr: String(fd.get("questionAr") ?? ""),
                answerAr: String(fd.get("answerAr") ?? ""),
              });
            });
          }}
          className="grid gap-3 border-t border-border p-4 sm:grid-cols-2"
        >
          <div className="space-y-1.5 sm:col-span-2"><Label htmlFor="q-en">Question (EN)</Label><Input id="q-en" name="questionEn" required /></div>
          <div className="space-y-1.5 sm:col-span-2"><Label htmlFor="a-en">Answer (EN)</Label><Textarea id="a-en" name="answerEn" rows={2} required /></div>
          <div className="space-y-1.5 sm:col-span-2"><Label htmlFor="q-ar">Question (AR)</Label><Input id="q-ar" name="questionAr" dir="rtl" /></div>
          <div className="space-y-1.5 sm:col-span-2"><Label htmlFor="a-ar">Answer (AR)</Label><Textarea id="a-ar" name="answerAr" rows={2} dir="rtl" /></div>
          <div><Button type="submit" variant="secondary">Create</Button></div>
        </form>
      </details>
    </div>
  );
}

// ---------------------------------------------------------------------------
// SEO entries
// ---------------------------------------------------------------------------

export type SeoRow = {
  page: string;
  locale: string;
  title: string;
  description: string;
};

export function SeoManager({ entries }: { entries: SeoRow[] }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full min-w-[600px] text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50 text-xs uppercase tracking-wide text-muted-foreground">
              <th className="px-4 py-2.5 text-start font-medium">Page</th>
              <th className="px-4 py-2.5 text-start font-medium">Locale</th>
              <th className="px-4 py-2.5 text-start font-medium">Title</th>
              <th className="px-4 py-2.5 text-start font-medium">Description</th>
              <th aria-label="Actions" />
            </tr>
          </thead>
          <tbody>
            {entries.map((e) => (
              <tr key={`${e.page}-${e.locale}`} className="border-b border-border/60 last:border-0">
                <td className="px-4 py-2.5 font-mono text-xs">{e.page}</td>
                <td className="px-4 py-2.5"><Badge variant="outline">{e.locale}</Badge></td>
                <td className="max-w-56 truncate px-4 py-2.5">{e.title}</td>
                <td className="max-w-72 truncate px-4 py-2.5 text-muted-foreground">{e.description}</td>
                <td className="px-4 py-2.5 text-end">
                  <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive" onClick={() => startTransition(async () => { await deleteSeoEntry(e.page, e.locale); })} aria-label={`Delete SEO for ${e.page}/${e.locale}`}>
                    <Trash2 className="size-4" aria-hidden />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {error && <p role="alert" className="text-sm text-destructive">{error}</p>}

      <Card>
        <CardHeader><CardTitle>Add / update entry</CardTitle></CardHeader>
        <CardContent>
          <form
            action={(fd) => {
              startTransition(async () => {
                const res = await upsertSeoEntry({
                  page: String(fd.get("page") ?? ""),
                  locale: String(fd.get("locale") ?? ""),
                  title: String(fd.get("title") ?? ""),
                  description: String(fd.get("description") ?? ""),
                  keywords: String(fd.get("keywords") ?? ""),
                  canonical: "",
                  robots: String(fd.get("robots") ?? ""),
                  ogTitle: String(fd.get("ogTitle") ?? ""),
                  ogDescription: String(fd.get("ogDescription") ?? ""),
                  ogImage: "",
                });
                if (!res.ok) setError(res.error);
              });
            }}
            className="grid gap-3 sm:grid-cols-2"
          >
            <div className="space-y-1.5"><Label htmlFor="seo-page">Page key</Label><Input id="seo-page" name="page" placeholder="home" required /></div>
            <div className="space-y-1.5"><Label htmlFor="seo-locale">Locale</Label><Input id="seo-locale" name="locale" placeholder="en" required /></div>
            <div className="space-y-1.5 sm:col-span-2"><Label htmlFor="seo-title">Meta title</Label><Input id="seo-title" name="title" maxLength={200} required /></div>
            <div className="space-y-1.5 sm:col-span-2"><Label htmlFor="seo-desc">Meta description</Label><Textarea id="seo-desc" name="description" rows={2} maxLength={400} required /></div>
            <div className="space-y-1.5 sm:col-span-2"><Label htmlFor="seo-kw">Keywords</Label><Input id="seo-kw" name="keywords" /></div>
            <div className="space-y-1.5"><Label htmlFor="seo-robots">Robots directive</Label><Input id="seo-robots" name="robots" placeholder="index,follow" /></div>
            <div className="space-y-1.5"><Label htmlFor="seo-ogt">OG title override</Label><Input id="seo-ogt" name="ogTitle" /></div>
            <div className="space-y-1.5 sm:col-span-2"><Label htmlFor="seo-ogd">OG description override</Label><Input id="seo-ogd" name="ogDescription" /></div>
            <div className="sm:col-span-2"><Button type="submit" variant="secondary" disabled={isPending}>Save entry</Button></div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
