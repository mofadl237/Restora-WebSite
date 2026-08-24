"use client";

import { useTransition } from "react";
import { createClient, deleteClient, updateClient } from "@/src/server/actions/clients";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Switch } from "@/src/components/ui/switch";
import { Badge } from "@/src/components/ui/badge";
import { Plus, Trash2 } from "lucide-react";

export type ClientRow = {
  id: number;
  name: string;
  imageUrl: string | null;
  countryCode: string | null;
  websiteUrl: string | null;
  category: string | null;
  active: boolean;
};

export function ClientsManager({ items }: { items: ClientRow[] }) {
  const [isPending, startTransition] = useTransition();

  return (
    <div className={`space-y-6 ${isPending ? "opacity-60" : ""}`}>
      <ul className="grid gap-3 sm:grid-cols-2">
        {items.map((c) => (
          <li key={c.id} className="rounded-lg border border-border bg-card p-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-medium">{c.name}</span>
              {c.countryCode && <Badge variant="outline">{c.countryCode}</Badge>}
              {!c.active && <Badge variant="secondary">Inactive</Badge>}
              <div className="ms-auto flex items-center gap-2">
                <Switch
                  checked={c.active}
                  onCheckedChange={(active) =>
                    startTransition(async () => {
                      await updateClient(c.id, { active });
                    })
                  }
                  aria-label={`${c.name} active`}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-destructive"
                  onClick={() =>
                    startTransition(async () => {
                      await deleteClient(c.id);
                    })
                  }
                  aria-label={`Delete ${c.name}`}
                >
                  <Trash2 className="size-4" aria-hidden />
                </Button>
              </div>
            </div>
            {(c.category || c.websiteUrl) && (
              <p className="mt-1 text-sm text-muted-foreground">
                {c.category}
                {c.category && c.websiteUrl ? " · " : ""}
                {c.websiteUrl && (
                  <span dir="ltr" className="font-mono text-xs">
                    {c.websiteUrl}
                  </span>
                )}
              </p>
            )}
          </li>
        ))}
        {items.length === 0 && (
          <li className="text-sm text-muted-foreground">No clients yet.</li>
        )}
      </ul>

      <details className="rounded-lg border border-border">
        <summary className="cursor-pointer list-none px-4 py-3 text-sm font-medium hover:bg-muted/50">
          <span className="inline-flex items-center gap-2">
            <Plus className="size-4 rtl:-scale-x-100" aria-hidden /> Add client
          </span>
        </summary>
        <form
          action={(fd) => {
            startTransition(async () => {
              await createClient({
                name: String(fd.get("name") ?? ""),
                imageUrl: String(fd.get("imageUrl") ?? ""),
                countryCode: String(fd.get("countryCode") ?? "").toUpperCase(),
                websiteUrl: String(fd.get("websiteUrl") ?? ""),
                category: String(fd.get("category") ?? ""),
              });
            });
          }}
          className="grid gap-3 border-t border-border p-4 sm:grid-cols-2"
        >
          <div className="space-y-1.5">
            <Label htmlFor="c-name">Client name</Label>
            <Input id="c-name" name="name" required maxLength={120} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="c-country">Country code</Label>
            <Input id="c-country" name="countryCode" placeholder="EG" maxLength={2} dir="ltr" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="c-image">Image URL (optional)</Label>
            <Input id="c-image" name="imageUrl" dir="ltr" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="c-url">Website URL (optional)</Label>
            <Input id="c-url" name="websiteUrl" placeholder="https://…" dir="ltr" />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="c-category">Category label (optional)</Label>
            <Input id="c-category" name="category" placeholder="Grill · Cairo" maxLength={120} />
          </div>
          <div>
            <Button type="submit" variant="secondary">
              Create
            </Button>
          </div>
        </form>
      </details>
    </div>
  );
}
