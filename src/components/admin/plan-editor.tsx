"use client";

import { useState, useTransition } from "react";
import {
  setPlanCountryPricing,
  setPlanFeature,
  updatePlan,
} from "@/src/server/actions/plans";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Textarea } from "@/src/components/ui/textarea";
import { Switch } from "@/src/components/ui/switch";
import { Badge } from "@/src/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Loader2, Save } from "lucide-react";

export type PlanEditData = {
  id: number;
  slug: string;
  displayOrder: number;
  active: boolean;
  popular: boolean;
  monthlyPrice: string;
  yearlyPrice: string;
  monthlyCompareAtPrice: string;
  yearlyCompareAtPrice: string;
  translations: Record<string, { name: string; shortDescription: string; longDescription: string }>;
};

export type FeatureAssignmentRow = {
  id: number;
  key: string;
  nameEn: string | null;
  category: string;
  included: boolean;
  limitValue: string | null;
};

export type CountryPricingRow = {
  countryId: number;
  countryName: string;
  currencyCode: string;
  hasOverride: boolean;
  monthlyPrice: string;
  yearlyPrice: string;
  monthlyCompareAtPrice: string;
  yearlyCompareAtPrice: string;
};

export function PlanEditor({
  plan,
  features,
  countryPricings,
}: {
  plan: PlanEditData;
  features: FeatureAssignmentRow[];
  countryPricings: CountryPricingRow[];
}) {
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);

  const [enName, setEnName] = useState(plan.translations.en?.name ?? "");
  const [enShort, setEnShort] = useState(plan.translations.en?.shortDescription ?? "");
  const [enLong, setEnLong] = useState(plan.translations.en?.longDescription ?? "");
  const [arName, setArName] = useState(plan.translations.ar?.name ?? "");
  const [arShort, setArShort] = useState(plan.translations.ar?.shortDescription ?? "");
  const [arLong, setArLong] = useState(plan.translations.ar?.longDescription ?? "");

  const [monthlyPrice, setMonthlyPrice] = useState(plan.monthlyPrice);
  const [yearlyPrice, setYearlyPrice] = useState(plan.yearlyPrice);
  const [monthlyCompare, setMonthlyCompare] = useState(plan.monthlyCompareAtPrice);
  const [yearlyCompare, setYearlyCompare] = useState(plan.yearlyCompareAtPrice);

  function saveCore(formData: FormData) {
    startTransition(async () => {
      const res = await updatePlan(
        plan.id,
        {
          slug: String(formData.get("slug") ?? plan.slug),
          displayOrder: Number(formData.get("displayOrder") ?? 0),
          active: formData.get("active") === "on",
          popular: formData.get("popular") === "on",
          monthlyPrice: String(formData.get("monthlyPrice") ?? ""),
          yearlyPrice: String(formData.get("yearlyPrice") ?? ""),
          monthlyCompareAtPrice: String(formData.get("monthlyCompareAtPrice") ?? ""),
          yearlyCompareAtPrice: String(formData.get("yearlyCompareAtPrice") ?? ""),
        },
        {
          en: { name: enName, shortDescription: enShort, longDescription: enLong },
          ar: { name: arName, shortDescription: arShort, longDescription: arLong },
        },
      );
      setMessage(
        res.ok
          ? { ok: true, text: "Saved." }
          : { ok: false, text: res.error ?? "Failed to save" },
      );
    });
  }

  return (
    <div className="space-y-6">
      <form action={saveCore} className="space-y-6">
        {/* Pricing & status */}
        <Card>
          <CardHeader>
            <CardTitle>Pricing</CardTitle>
            <CardDescription>
              Default prices. Leave compare-at empty when there is no discount.
              Yearly price is independent — it is never calculated automatically.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="monthlyPrice">Monthly price</Label>
              <Input id="monthlyPrice" name="monthlyPrice" inputMode="decimal" value={monthlyPrice} onChange={(e) => setMonthlyPrice(e.target.value)} required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="yearlyPrice">Yearly price</Label>
              <Input id="yearlyPrice" name="yearlyPrice" inputMode="decimal" value={yearlyPrice} onChange={(e) => setYearlyPrice(e.target.value)} required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="monthlyCompareAtPrice">Original monthly price (strikethrough)</Label>
              <Input id="monthlyCompareAtPrice" name="monthlyCompareAtPrice" inputMode="decimal" placeholder="e.g. 1894 for 50% OFF" value={monthlyCompare} onChange={(e) => setMonthlyCompare(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="yearlyCompareAtPrice">Original yearly price</Label>
              <Input id="yearlyCompareAtPrice" name="yearlyCompareAtPrice" inputMode="decimal" value={yearlyCompare} onChange={(e) => setYearlyCompare(e.target.value)} />
            </div>

            {(monthlyCompare || yearlyCompare) && Number(monthlyPrice) > 0 && (
              <p className="text-xs text-muted-foreground sm:col-span-2">
                Monthly discount shown:{" "}
                <strong className="text-foreground">
                  {Math.round((1 - Number(monthlyPrice) / Number(monthlyCompare || monthlyPrice)) * 100)}%
                </strong>{" "}
                · Yearly discount shown:{" "}
                <strong className="text-foreground">
                  {Math.round((1 - Number(yearlyPrice) / Number(yearlyCompare || yearlyPrice)) * 100)}%
                </strong>
              </p>
            )}
          </CardContent>
        </Card>

        {/* Translations */}
        <Card>
          <CardHeader>
            <CardTitle>Content</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-3">
              <Badge variant="outline">English</Badge>
              <div className="space-y-1.5">
                <Label htmlFor="en-name">Name</Label>
                <Input id="en-name" value={enName} onChange={(e) => setEnName(e.target.value)} required />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="en-short">Short description</Label>
                <Textarea id="en-short" value={enShort} onChange={(e) => setEnShort(e.target.value)} required rows={2} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="en-long">Long description</Label>
                <Textarea id="en-long" value={enLong} onChange={(e) => setEnLong(e.target.value)} rows={3} />
              </div>
            </div>
            <div className="space-y-3" dir="rtl">
              <Badge variant="outline">العربية</Badge>
              <div className="space-y-1.5">
                <Label htmlFor="ar-name">الاسم</Label>
                <Input id="ar-name" value={arName} onChange={(e) => setArName(e.target.value)} dir="rtl" required />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="ar-short">وصف مختصر</Label>
                <Textarea id="ar-short" value={arShort} onChange={(e) => setArShort(e.target.value)} dir="rtl" rows={2} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="ar-long">وصف كامل</Label>
                <Textarea id="ar-long" value={arLong} onChange={(e) => setArLong(e.target.value)} dir="rtl" rows={3} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Status */}
        <Card>
          <CardHeader>
            <CardTitle>Status</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap items-center gap-8">
            <div className="space-y-1.5">
              <Label htmlFor="slug">Slug</Label>
              <Input id="slug" name="slug" defaultValue={plan.slug} pattern="[a-z0-9]+(-[a-z0-9]+)*" required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="displayOrder">Display order</Label>
              <Input id="displayOrder" name="displayOrder" type="number" min={0} defaultValue={String(plan.displayOrder ?? 0)} className="w-24" />
            </div>
            <input type="hidden" name="active" value={plan.active ? "on" : ""} />
            <input type="hidden" name="popular" value={plan.popular ? "on" : ""} />
          </CardContent>
        </Card>

        <div className="flex items-center gap-3">
          <Button type="submit" disabled={pending}>
            {pending ? <Loader2 className="size-4 animate-spin" aria-hidden /> : <Save className="size-4" aria-hidden />}
            Save changes
          </Button>
          {message && (
            <p role={message.ok ? "status" : "alert"} className={`text-sm font-medium ${message.ok ? "text-success" : "text-destructive"}`}>
              {message.text}
            </p>
          )}
        </div>
      </form>

      {/* Features */}
      <FeatureAssignments planId={plan.id} features={features} />

      {/* Country pricing */}
      <CountryPricingEditor planId={plan.id} rows={countryPricings} />
    </div>
  );
}

function FeatureAssignments({
  planId,
  features,
}: {
  planId: number;
  features: FeatureAssignmentRow[];
}) {
  const [, startTransition] = useTransition();
  const [rows, setRows] = useState(features);

  function toggle(featureId: number, included: boolean) {
    setRows((rs) => rs.map((r) => (r.id === featureId ? { ...r, included } : r)));
    startTransition(async () => {
      await setPlanFeature(planId, featureId, included);
    });
  }

  function saveLimit(featureId: number, limitValue: string) {
    setRows((rs) => rs.map((r) => (r.id === featureId ? { ...r, limitValue } : r)));
    startTransition(async () => {
      await setPlanFeature(planId, featureId, true, limitValue);
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Features</CardTitle>
        <CardDescription>Toggle what this plan includes; add limits like “1” employee.</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="divide-y divide-border/60 rounded-lg border border-border">
          {rows.map((f) => (
            <li key={f.id} className="flex flex-wrap items-center gap-3 px-4 py-2.5">
              <Switch checked={f.included} onCheckedChange={(v) => toggle(f.id, v)} aria-label={`Include ${f.nameEn ?? f.key}`} />
              <div className="min-w-40 flex-1">
                <span className="text-sm font-medium">{f.nameEn ?? f.key}</span>
                <span className="ms-2 text-xs text-muted-foreground">{f.category}</span>
              </div>
              {f.included && (
                <Input
                  placeholder="Limit (optional)"
                  defaultValue={f.limitValue ?? ""}
                  onBlur={(e) => saveLimit(f.id, e.target.value)}
                  className="h-8 w-44"
                  aria-label={`Limit for ${f.nameEn ?? f.key}`}
                />
              )}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

function CountryPricingEditor({
  planId,
  rows,
}: {
  planId: number;
  rows: CountryPricingRow[];
}) {
  const [, startTransition] = useTransition();
  const [saved, setSaved] = useState<number | null>(null);

  function save(countryId: number, formData: FormData) {
    startTransition(async () => {
      const res = await setPlanCountryPricing(planId, countryId, {
        monthlyPrice: String(formData.get(`m-${countryId}`) ?? ""),
        yearlyPrice: String(formData.get(`y-${countryId}`) ?? ""),
        monthlyCompareAtPrice: String(formData.get(`mc-${countryId}`) ?? ""),
        yearlyCompareAtPrice: String(formData.get(`yc-${countryId}`) ?? ""),
      });
      if (res.ok) setSaved(countryId);
    });
  }

  if (rows.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Country pricing</CardTitle>
        <CardDescription>
          Overrides per market. The public pricing page uses these when the
          visitor selects the matching country.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {rows.map((row) => (
          <form
            key={row.countryId}
            action={(fd) => save(row.countryId, fd)}
            className="grid items-end gap-3 rounded-lg border border-border p-4 sm:grid-cols-[repeat(4,minmax(0,1fr))_auto]"
          >
            <div className="sm:col-span-4 lg:col-span-5 -mb-1 flex items-center gap-2">
              <span className="text-sm font-semibold">{row.countryName}</span>
              <Badge variant="secondary">{row.currencyCode}</Badge>
              {!row.hasOverride && <Badge variant="warning">No override yet</Badge>}
              {saved === row.countryId && (
                <span role="status" className="text-xs font-medium text-success">Saved ✓</span>
              )}
            </div>
            <div className="space-y-1">
              <Label htmlFor={`m-${row.countryId}`} className="text-xs">Monthly</Label>
              <Input id={`m-${row.countryId}`} name={`m-${row.countryId}`} defaultValue={row.monthlyPrice} inputMode="decimal" required />
            </div>
            <div className="space-y-1">
              <Label htmlFor={`y-${row.countryId}`} className="text-xs">Yearly</Label>
              <Input id={`y-${row.countryId}`} name={`y-${row.countryId}`} defaultValue={row.yearlyPrice} inputMode="decimal" required />
            </div>
            <div className="space-y-1">
              <Label htmlFor={`mc-${row.countryId}`} className="text-xs">Orig. monthly</Label>
              <Input id={`mc-${row.countryId}`} name={`mc-${row.countryId}`} defaultValue={row.monthlyCompareAtPrice} inputMode="decimal" />
            </div>
            <div className="space-y-1">
              <Label htmlFor={`yc-${row.countryId}`} className="text-xs">Orig. yearly</Label>
              <Input id={`yc-${row.countryId}`} name={`yc-${row.countryId}`} defaultValue={row.yearlyCompareAtPrice} inputMode="decimal" />
            </div>
            <Button type="submit" variant="secondary" size="sm" className="mb-0.5">Save</Button>
          </form>
        ))}
      </CardContent>
    </Card>
  );
}
