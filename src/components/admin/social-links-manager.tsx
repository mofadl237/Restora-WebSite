"use client";

import { useActionState, useState, useTransition } from "react";
import {
  addSocialLink,
  deleteSocialLink,
  updateSocialLink,
} from "@/src/server/actions/branding";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Switch } from "@/src/components/ui/switch";
import { Badge } from "@/src/components/ui/badge";
import { Trash2 } from "lucide-react";

export type SocialLinkRow = {
  id: number;
  platform: string;
  url: string;
  active: boolean;
};

export function SocialLinksManager({ links }: { links: SocialLinkRow[] }) {
  const [state, formAction, pending] = useActionState(
    async (_prev: { ok: boolean; error?: string } | null, formData: FormData) =>
      addSocialLink(formData),
    null,
  );
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function toggle(link: SocialLinkRow, active: boolean) {
    startTransition(async () => {
      const res = await updateSocialLink(link.id, { active });
      if (!res.ok) setError(res.error ?? "Failed");
    });
  }

  function remove(id: number) {
    startTransition(async () => {
      await deleteSocialLink(id);
    });
  }

  return (
    <div className="space-y-4">
      <ul className="space-y-2">
        {links.length === 0 && (
          <li className="rounded-lg border border-dashed border-border p-4 text-sm text-muted-foreground">
            No social links yet.
          </li>
        )}
        {links.map((link) => (
          <li
            key={link.id}
            className="flex items-center gap-3 rounded-lg border border-border bg-card px-3 py-2"
          >
            <Badge variant="secondary" className="capitalize">
              {link.platform}
            </Badge>
            <a
              href={link.url}
              target="_blank"
              rel="noreferrer noopener"
              className="min-w-0 flex-1 truncate text-sm text-muted-foreground hover:text-foreground hover:underline"
            >
              {link.url}
            </a>
            <div className="flex items-center gap-2">
              <Label className="sr-only" htmlFor={`active-${link.id}`}>
                Active
              </Label>
              <Switch
                id={`active-${link.id}`}
                checked={link.active}
                disabled={isPending}
                onCheckedChange={(v) => toggle(link, v)}
                aria-label={`${link.platform} active`}
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => remove(link.id)}
                disabled={isPending}
                aria-label={`Delete ${link.platform}`}
                className="text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="size-4" aria-hidden />
              </Button>
            </div>
          </li>
        ))}
      </ul>

      <form action={formAction} className="flex flex-wrap items-end gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="platform">Platform</Label>
          <Input id="platform" name="platform" placeholder="tiktok" required className="w-36" />
        </div>
        <div className="min-w-52 flex-1 space-y-1.5">
          <Label htmlFor="url">URL</Label>
          <Input id="url" name="url" type="url" placeholder="https://…" required />
        </div>
        <input type="checkbox" name="active" defaultChecked className="sr-only" aria-hidden tabIndex={-1} />
        <Button type="submit" variant="secondary" disabled={pending}>
          Add link
        </Button>
      </form>
      {(state && !state.ok && <p role="alert" className="text-sm text-destructive">{state.error}</p>) ??
        (error && <p role="alert" className="text-sm text-destructive">{error}</p>)}
    </div>
  );
}
