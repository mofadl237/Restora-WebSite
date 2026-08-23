"use client";

import { useState, useTransition } from "react";
import {
  createCountry,
  deleteCountry,
  updateCountry,
} from "@/src/server/actions/countries";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Switch } from "@/src/components/ui/switch";
import { Badge } from "@/src/components/ui/badge";
import { Trash2, Plus } from "lucide-react";

export type CountryRow = {
  id: number;
  code: string;
  name: string;
  currencyCode: string;
  currencySymbol: string;
  locale: string | null;
  dialCode: string | null;
  active: boolean;
};

export function CountriesManager({ countries }: { countries: CountryRow[] }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  function toggle(country: CountryRow, active: boolean) {
    startTransition(async () => {
      const res = await updateCountry(country.id, { active });
      if (!res.ok) setError(res.error ?? "Failed");
    });
  }

  function remove(id: number) {
    startTransition(async () => {
      await deleteCountry(id);
    });
  }

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full min-w-[640px] text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50 text-start text-xs uppercase tracking-wide text-muted-foreground">
              <th className="px-4 py-2.5 text-start font-medium">Country</th>
              <th className="px-4 py-2.5 text-start font-medium">Currency</th>
              <th className="px-4 py-2.5 text-start font-medium">Locale</th>
              <th className="px-4 py-2.5 text-start font-medium">Active</th>
              <th className="px-4 py-2.5" aria-label="Actions" />
            </tr>
          </thead>
          <tbody>
            {countries.map((c) => (
              <tr key={c.id} className="border-b border-border/60 last:border-0">
                <td className="px-4 py-2.5">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{c.code}</Badge>
                    <span className="font-medium">{c.name}</span>
                  </div>
                </td>
                <td className="px-4 py-2.5 tabular-nums">
                  {c.currencySymbol} {c.currencyCode}
                </td>
                <td className="px-4 py-2.5">{c.locale ?? "—"}</td>
                <td className="px-4 py-2.5">
                  <Switch
                    checked={c.active}
                    disabled={isPending}
                    onCheckedChange={(v) => toggle(c, v)}
                    aria-label={`${c.name} active`}
                  />
                </td>
                <td className="px-4 py-2.5 text-end">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => remove(c.id)}
                    disabled={isPending}
                    aria-label={`Delete ${c.name}`}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="size-4" aria-hidden />
                  </Button>
                </td>
              </tr>
            ))}
            {countries.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-muted-foreground">
                  No countries yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}

      <div>
        <Button variant="secondary" onClick={() => setShowForm((v) => !v)} aria-expanded={showForm}>
          <Plus className="size-4 rtl:-scale-x-100" aria-hidden />
          {showForm ? "Cancel" : "Add country"}
        </Button>

        {showForm && (
          <form
            action={async (formData) => {
              const res = await createCountry(formData);
              if (res.ok) {
                setShowForm(false);
                setError(null);
              } else {
                setError(res.error);
              }
            }}
            className="mt-3 grid gap-3 rounded-lg border border-border bg-card p-4 sm:grid-cols-3 lg:grid-cols-6"
          >
            <div className="space-y-1.5">
              <Label htmlFor="code">Code</Label>
              <Input id="code" name="code" placeholder="EG" maxLength={2} required />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" placeholder="Egypt" required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="currencyCode">Currency</Label>
              <Input id="currencyCode" name="currencyCode" placeholder="EGP" maxLength={3} required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="currencySymbol">Symbol</Label>
              <Input id="currencySymbol" name="currencySymbol" placeholder="ج.م" required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="locale">Locale</Label>
              <Input id="locale" name="locale" placeholder="ar" />
            </div>
            <div className="sm:col-span-3 lg:col-span-6">
              <Button type="submit">Create country</Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
