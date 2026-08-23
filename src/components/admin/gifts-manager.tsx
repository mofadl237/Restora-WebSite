"use client";

import { useState, useTransition } from "react";
import { createGift, deleteGift, moveGift, updateGift } from "@/src/server/actions/gifts";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Switch } from "@/src/components/ui/switch";
import { Badge } from "@/src/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { ChevronDown, ChevronUp, Plus, Trash2 } from "lucide-react";

export type GiftRow = {
  id: number;
  slug: string;
  icon: string | null;
  yearlyOnly: boolean;
  active: boolean;
  nameEn: string | null;
  nameAr: string | null;
  planIds: number[];
};

export type PlanOption = { id: number; label: string };

export function GiftsManager({
  gifts,
  plans,
}: {
  gifts: GiftRow[];
  plans: PlanOption[];
}) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  function update(row: GiftRow, patch: Partial<GiftRow>) {
    startTransition(async () => {
      try {
        await updateGift(row.id, {
          yearlyOnly: patch.yearlyOnly ?? row.yearlyOnly,
          active: patch.active ?? row.active,
        }, undefined, patch.planIds ?? row.planIds);
        setError(null);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed");
      }
    });
  }

  return (
    <div className="space-y-6">
      <ul className={`space-y-3 ${isPending ? "opacity-60" : ""}`}>
        {gifts.map((g) => (
          <li key={g.id}>
            <Card className={g.active ? "" : "opacity-60"}>
              <CardHeader className="pb-3">
                <div className="flex flex-wrap items-center gap-2">
                  <div className="flex flex-col">
                    <Button variant="ghost" size="icon" className="size-6" aria-label={`Move ${g.slug} up`} onClick={() => startTransition(async () => { await moveGift(g.id, -1); })}>
                      <ChevronUp className="size-3.5" aria-hidden />
                    </Button>
                    <Button variant="ghost" size="icon" className="size-6" aria-label={`Move ${g.slug} down`} onClick={() => startTransition(async () => { await moveGift(g.id, 1); })}>
                      <ChevronDown className="size-3.5" aria-hidden />
                    </Button>
                  </div>
                  <CardTitle className="text-base">{g.nameEn ?? g.slug}</CardTitle>
                  {g.nameAr && <span className="text-sm text-muted-foreground" dir="rtl">{g.nameAr}</span>}
                  {g.yearlyOnly && <Badge variant="accent">Yearly only</Badge>}
                  {!g.active && <Badge variant="secondary">Inactive</Badge>}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-x-8 gap-y-3">
                  <div className="flex items-center gap-2">
                    <Switch
                      id={`active-${g.id}`}
                      checked={g.active}
                      onCheckedChange={(active) => update(g, { active })}
                      aria-label={`${g.slug} active`}
                    />
                    <Label htmlFor={`active-${g.id}`}>Active</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      id={`yearly-${g.id}`}
                      checked={g.yearlyOnly}
                      onCheckedChange={(yearlyOnly) => update(g, { yearlyOnly })}
                      aria-label={`${g.slug} yearly only`}
                    />
                    <Label htmlFor={`yearly-${g.id}`}>Yearly-only gift</Label>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="ms-auto text-muted-foreground hover:text-destructive"
                    onClick={() => startTransition(async () => { await deleteGift(g.id); })}
                    aria-label={`Delete ${g.slug}`}
                  >
                    <Trash2 className="size-4" aria-hidden />
                  </Button>
                </div>

                <fieldset className="space-y-2">
                  <legend className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Assigned to plans
                  </legend>
                  <div className="flex flex-wrap gap-x-5 gap-y-2">
                    {plans.map((p) => (
                      <label key={p.id} className="flex cursor-pointer items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          className="size-4 rounded border-input accent-[var(--primary)]"
                          checked={g.planIds.includes(p.id)}
                          onChange={(e) => {
                            const planIds = e.target.checked
                              ? [...g.planIds, p.id]
                              : g.planIds.filter((id) => id !== p.id);
                            update(g, { planIds });
                          }}
                        />
                        {p.label}
                      </label>
                    ))}
                  </div>
                </fieldset>
              </CardContent>
            </Card>
          </li>
        ))}
      </ul>

      {error && <p role="alert" className="text-sm text-destructive">{error}</p>}

      <div>
        <Button onClick={() => setShowForm((v) => !v)} aria-expanded={showForm}>
          <Plus className="size-4 rtl:-scale-x-100" aria-hidden />
          {showForm ? "Cancel" : "Add gift"}
        </Button>
        {showForm && (
          <form
            action={async (fd) => {
              const res = await createGift({
                slug: String(fd.get("slug") ?? ""),
                icon: String(fd.get("icon") ?? ""),
                yearlyOnly: true,
                en: { name: String(fd.get("nameEn") ?? ""), description: String(fd.get("descEn") ?? "") },
                ar: { name: String(fd.get("nameAr") ?? ""), description: String(fd.get("descAr") ?? "") },
                planIds: fd.getAll("planIds").map(Number),
              });
              if (res.ok) {
                setShowForm(false);
                setError(null);
              } else setError(res.error);
            }}
            className="mt-3 grid gap-3 rounded-lg border border-border bg-card p-4 sm:grid-cols-2"
          >
            <div className="space-y-1.5">
              <Label htmlFor="g-slug">Key</Label>
              <Input id="g-slug" name="slug" placeholder="free-onboarding" required pattern="[a-z0-9]+(-[a-z0-9]+)*" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="g-icon">Icon</Label>
              <Input id="g-icon" name="icon" placeholder="gift" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="g-name-en">Name (EN)</Label>
              <Input id="g-name-en" name="nameEn" required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="g-name-ar">Name (AR)</Label>
              <Input id="g-name-ar" name="nameAr" dir="rtl" required />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="g-desc-en">Description (EN)</Label>
              <Input id="g-desc-en" name="descEn" />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="g-desc-ar">Description (AR)</Label>
              <Input id="g-desc-ar" name="descAr" dir="rtl" />
            </div>
            <fieldset className="space-y-2 sm:col-span-2">
              <legend className="text-sm font-medium">Assign to plans</legend>
              <div className="flex flex-wrap gap-x-5 gap-y-2">
                {plans.map((p) => (
                  <label key={p.id} className="flex cursor-pointer items-center gap-2 text-sm">
                    <input type="checkbox" name="planIds" value={p.id} className="size-4 rounded border-input accent-[var(--primary)]" defaultChecked />
                    {p.label}
                  </label>
                ))}
              </div>
            </fieldset>
            <div className="sm:col-span-2">
              <Button type="submit" variant="secondary">Create gift</Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
