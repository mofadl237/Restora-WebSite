"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import {
  deletePlan,
  hardDeletePlan,
  movePlan,
  setPlanFlags,
} from "@/src/server/actions/plans";
import { Button } from "@/src/components/ui/button";
import { Badge } from "@/src/components/ui/badge";
import { Switch } from "@/src/components/ui/switch";
import { formatDecimal, cn } from "@/src/lib/utils";
import {
  ChevronDown,
  ChevronRight,
  ChevronUp,
  Plus,
  Trash2,
} from "lucide-react";

export type PlanRow = {
  id: number;
  slug: string;
  displayOrder: number;
  active: boolean;
  popular: boolean;
  monthlyPrice: string;
  yearlyPrice: string;
  monthlyCompareAtPrice: string | null;
  yearlyCompareAtPrice: string | null;
  nameEn: string | null;
  nameAr: string | null;
};

export function PlansManager({
  plans,
  currency,
}: {
  plans: PlanRow[];
  currency: string;
}) {
  const [isPending, startTransition] = useTransition();
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  function run(fn: () => Promise<unknown>) {
    startTransition(async () => {
      try {
        await fn();
        setError(null);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed");
      }
    });
  }

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full min-w-[820px] text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50 text-xs uppercase tracking-wide text-muted-foreground">
              <th className="w-20 px-4 py-2.5 text-start font-medium">Order</th>
              <th className="px-4 py-2.5 text-start font-medium">Plan</th>
              <th className="px-4 py-2.5 text-start font-medium">Monthly</th>
              <th className="px-4 py-2.5 text-start font-medium">Yearly</th>
              <th className="px-4 py-2.5 text-start font-medium">Popular</th>
              <th className="px-4 py-2.5 text-start font-medium">Active</th>
              <th className="px-4 py-2.5" aria-label="Actions" />
            </tr>
          </thead>
          <tbody className={cn(isPending && "opacity-60 transition-opacity")}>
            {plans.map((p) => (
              <tr key={p.id} className="border-b border-border/60 last:border-0">
                <td className="px-4 py-2.5">
                  <div className="flex gap-0.5">
                    <Button
                      variant="ghost" size="icon" className="size-7"
                      aria-label={`Move ${p.slug} up`}
                      onClick={() => run(() => movePlan(p.id, -1))}
                    >
                      <ChevronUp className="size-3.5" aria-hidden />
                    </Button>
                    <Button
                      variant="ghost" size="icon" className="size-7"
                      aria-label={`Move ${p.slug} down`}
                      onClick={() => run(() => movePlan(p.id, 1))}
                    >
                      <ChevronDown className="size-3.5" aria-hidden />
                    </Button>
                  </div>
                </td>
                <td className="px-4 py-2.5">
                  <div className="font-medium">{p.nameEn ?? p.slug}</div>
                  <div className="text-xs text-muted-foreground">
                    {p.nameAr ? `${p.nameAr} · ` : ""}/{p.slug}
                  </div>
                </td>
                <td className="px-4 py-2.5 tabular-nums">
                  {formatDecimal(p.monthlyPrice)} {currency}
                  {p.monthlyCompareAtPrice && (
                    <span className="ms-1.5 text-xs text-muted-foreground line-through">
                      {formatDecimal(p.monthlyCompareAtPrice)}
                    </span>
                  )}
                </td>
                <td className="px-4 py-2.5 tabular-nums">
                  {formatDecimal(p.yearlyPrice)} {currency}
                  {p.yearlyCompareAtPrice && (
                    <span className="ms-1.5 text-xs text-muted-foreground line-through">
                      {formatDecimal(p.yearlyCompareAtPrice)}
                    </span>
                  )}
                </td>
                <td className="px-4 py-2.5">
                  {p.popular ? (
                    <Badge>Popular</Badge>
                  ) : (
                    <Button variant="outline" size="sm" onClick={() => run(() => setPlanFlags(p.id, { popular: true }))}>
                      Set
                    </Button>
                  )}
                </td>
                <td className="px-4 py-2.5">
                  <Switch
                    checked={p.active}
                    onCheckedChange={(v) => run(() => setPlanFlags(p.id, { active: v }))}
                    aria-label={`${p.slug} active`}
                  />
                </td>
                <td className="px-4 py-2.5">
                  <div className="flex items-center justify-end gap-1">
                    <Button asChild variant="ghost" size="sm">
                      <Link href={`/admin/plans/${p.id}`}>
                        Edit <ChevronRight className="size-3.5 rtl:-scale-x-100" aria-hidden />
                      </Link>
                    </Button>
                    {confirmDelete === p.id ? (
                      <>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => run(() => hardDeletePlan(p.id))}
                        >
                          Delete forever
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => setConfirmDelete(null)}>
                          Cancel
                        </Button>
                      </>
                    ) : p.active ? (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-muted-foreground hover:text-destructive"
                        aria-label={`Deactivate ${p.slug}`}
                        title="Deactivate"
                        onClick={() => run(() => deletePlan(p.id))}
                      >
                        <Trash2 className="size-4" aria-hidden />
                      </Button>
                    ) : (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-muted-foreground hover:text-destructive"
                        aria-label={`Delete ${p.slug} permanently`}
                        title="Delete permanently"
                        onClick={() => setConfirmDelete(p.id)}
                      >
                        <Trash2 className="size-4" aria-hidden />
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {plans.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-6 text-center text-muted-foreground">
                  No plans yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {error && <p role="alert" className="text-sm text-destructive">{error}</p>}

      <CreatePlanDialog />
    </div>
  );
}

function CreatePlanDialog() {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <Button onClick={() => setOpen((v) => !v)} aria-expanded={open}>
        <Plus className="size-4 rtl:-scale-x-100" aria-hidden />
        New plan
      </Button>
      {open && (
        <form
          action={async (formData) => {
            setOpen(false);
            await createQuickPlan(formData);
          }}
          className="mt-3 grid gap-3 rounded-lg border border-border bg-card p-4 sm:grid-cols-2"
        >
          <div className="space-y-1.5">
            <label htmlFor="np-slug" className="text-sm font-medium">Slug</label>
            <input id="np-slug" name="slug" required pattern="[a-z0-9]+(-[a-z0-9]+)*" className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm" placeholder="premium-plus" />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="np-name" className="text-sm font-medium">Name (EN)</label>
            <input id="np-name" name="name" required className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm" placeholder="Premium Plus" />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="np-monthly" className="text-sm font-medium">Monthly price</label>
            <input id="np-monthly" name="monthlyPrice" required inputMode="decimal" className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm" placeholder="1499" />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="np-yearly" className="text-sm font-medium">Yearly price</label>
            <input id="np-yearly" name="yearlyPrice" required inputMode="decimal" className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm" placeholder="14990" />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <label htmlFor="np-short" className="text-sm font-medium">Short description (EN)</label>
            <input id="np-short" name="shortDescription" required className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm" />
          </div>
          <div className="sm:col-span-2">
            <Button type="submit" variant="secondary">Create plan</Button>
          </div>
        </form>
      )}
    </div>
  );
}

async function createQuickPlan(formData: FormData) {
  const { createPlan } = await import("@/src/server/actions/plans");
  await createPlan(
    {
      slug: String(formData.get("slug") ?? ""),
      displayOrder: 99,
      active: false,
      popular: false,
      monthlyPrice: String(formData.get("monthlyPrice") ?? "0"),
      yearlyPrice: String(formData.get("yearlyPrice") ?? "0"),
    },
    {
      en: {
        name: String(formData.get("name") ?? ""),
        shortDescription: String(formData.get("shortDescription") ?? ""),
        longDescription: "",
      },
    },
  );
}
