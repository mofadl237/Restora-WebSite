"use client";

import { useState, useTransition } from "react";
import { createFeature, moveFeature, updateFeature } from "@/src/server/actions/features";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Switch } from "@/src/components/ui/switch";
import { Badge } from "@/src/components/ui/badge";
import {
  ChevronDown,
  ChevronUp,
  Plus,
} from "lucide-react";

export type FeatureRow = {
  id: number;
  key: string;
  icon: string | null;
  category: string;
  active: boolean;
  nameEn: string | null;
  nameAr: string | null;
};

export function FeaturesManager({ features }: { features: FeatureRow[] }) {
  const [isPending, startTransition] = useTransition();
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      <ul className={`divide-y divide-border/60 rounded-lg border border-border ${isPending ? "opacity-60" : ""}`}>
        {features.map((f) => (
          <li key={f.id} className="flex flex-wrap items-center gap-3 px-4 py-2.5">
            <div className="flex flex-col">
              <Button variant="ghost" size="icon" className="size-6" aria-label={`Move ${f.key} up`} onClick={() => startTransition(async () => { await moveFeature(f.id, -1); })}>
                <ChevronUp className="size-3.5" aria-hidden />
              </Button>
              <Button variant="ghost" size="icon" className="size-6" aria-label={`Move ${f.key} down`} onClick={() => startTransition(async () => { await moveFeature(f.id, 1); })}>
                <ChevronDown className="size-3.5" aria-hidden />
              </Button>
            </div>
            <div className="min-w-48 flex-1">
              <span className={`text-sm font-medium ${f.active ? "" : "line-through opacity-50"}`}>
                {f.nameEn ?? f.key}
              </span>
              {f.nameAr && <span className="ms-2 text-sm text-muted-foreground">{f.nameAr}</span>}
            </div>
            <Badge variant="secondary">{f.category}</Badge>
            <code className="text-xs text-muted-foreground">{f.key}</code>
            <Switch
              checked={f.active}
              onCheckedChange={(active) =>
                startTransition(async () => {
                  await updateFeature(f.id, { active });
                })
              }
              aria-label={`${f.key} active`}
            />
          </li>
        ))}
      </ul>

      {error && <p role="alert" className="text-sm text-destructive">{error}</p>}

      <div>
        <Button onClick={() => setShowForm((v) => !v)} aria-expanded={showForm}>
          <Plus className="size-4 rtl:-scale-x-100" aria-hidden />
          {showForm ? "Cancel" : "Add feature"}
        </Button>
        {showForm && (
          <form
            action={async (fd) => {
              const res = await createFeature({
                key: String(fd.get("key") ?? ""),
                icon: String(fd.get("icon") ?? ""),
                category: String(fd.get("category") || "general"),
                en: { name: String(fd.get("nameEn") ?? ""), description: String(fd.get("descEn") ?? "") },
                ar: { name: String(fd.get("nameAr") ?? ""), description: String(fd.get("descAr") ?? "") },
              });
              if (res.ok) {
                setShowForm(false);
                setError(null);
              } else setError(res.error);
            }}
            className="mt-3 grid gap-3 rounded-lg border border-border bg-card p-4 sm:grid-cols-3"
          >
            <div className="space-y-1.5">
              <Label htmlFor="f-key">Key</Label>
              <Input id="f-key" name="key" placeholder="loyalty-program" required pattern="[a-z0-9]+(-[a-z0-9]+)*" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="f-category">Category</Label>
              <Input id="f-category" name="category" placeholder="marketing" defaultValue="general" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="f-icon">Icon</Label>
              <Input id="f-icon" name="icon" placeholder="star" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="f-name-en">Name (EN)</Label>
              <Input id="f-name-en" name="nameEn" placeholder="Loyalty program" />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="f-desc-en">Description (EN)</Label>
              <Input id="f-desc-en" name="descEn" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="f-name-ar">Name (AR)</Label>
              <Input id="f-name-ar" name="nameAr" dir="rtl" />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="f-desc-ar">Description (AR)</Label>
              <Input id="f-desc-ar" name="descAr" dir="rtl" />
            </div>
            <div className="sm:col-span-3">
              <Button type="submit" variant="secondary">Create feature</Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
