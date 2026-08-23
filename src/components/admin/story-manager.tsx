"use client";

import { useState, useTransition } from "react";
import {
  createStoryScene,
  deleteStoryScene,
  moveStoryScene,
  updateStoryScene,
} from "@/src/server/actions/story";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Textarea } from "@/src/components/ui/textarea";
import { Switch } from "@/src/components/ui/switch";
import { Badge } from "@/src/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { ChevronDown, ChevronUp, Plus, Trash2 } from "lucide-react";

export type StorySceneRow = {
  id: number;
  sceneKey: string;
  visual: string;
  active: boolean;
  en: { kicker: string; title: string; body: string };
  ar: { kicker: string; title: string; body: string };
};

const VISUALS = ["phone", "dashboard", "analytics", "growth"] as const;

export function StoryManager({ scenes }: { scenes: StorySceneRow[] }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  return (
    <div className={`space-y-6 ${isPending ? "opacity-60" : ""}`}>
      <ul className="space-y-3">
        {scenes.map((s) => (
          <li key={s.id}>
            <Card>
              <CardHeader className="flex-row items-center gap-3 pb-3">
                <div className="flex flex-col">
                  <Button variant="ghost" size="icon" className="size-6" aria-label={`Move ${s.sceneKey} up`} onClick={() => startTransition(async () => { await moveStoryScene(s.id, -1); })}>
                    <ChevronUp className="size-3.5" aria-hidden />
                  </Button>
                  <Button variant="ghost" size="icon" className="size-6" aria-label={`Move ${s.sceneKey} down`} onClick={() => startTransition(async () => { await moveStoryScene(s.id, 1); })}>
                    <ChevronDown className="size-3.5" aria-hidden />
                  </Button>
                </div>
                <CardTitle className="font-mono text-sm">{s.sceneKey}</CardTitle>
                <Badge variant="accent">{s.visual}</Badge>
                {!s.active && <Badge variant="secondary">Inactive</Badge>}
                <div className="ms-auto flex items-center gap-2">
                  <Switch checked={s.active} onCheckedChange={(active) => startTransition(async () => { await updateStoryScene(s.id, { active }); })} aria-label={`${s.sceneKey} active`} />
                  <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive" onClick={() => startTransition(async () => { await deleteStoryScene(s.id); })} aria-label={`Delete ${s.sceneKey}`}>
                    <Trash2 className="size-4" aria-hidden />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="grid gap-4 sm:grid-cols-2">
                {(["en", "ar"] as const).map((locale) => (
                  <form
                    key={locale}
                    action={(fd) =>
                      startTransition(async () => {
                        await updateStoryScene(s.id, undefined, [{
                          locale,
                          kicker: String(fd.get("kicker") ?? ""),
                          title: String(fd.get("title") ?? ""),
                          body: String(fd.get("body") ?? ""),
                        }]);
                      })
                    }
                    className="space-y-2"
                    dir={locale === "ar" ? "rtl" : undefined}
                  >
                    <Badge variant="outline">{locale === "en" ? "English" : "العربية"}</Badge>
                    <div className="grid grid-cols-[7rem_1fr] gap-2">
                      <Input name="kicker" placeholder="SCENE 01" defaultValue={s[locale].kicker} />
                      <Input name="title" placeholder="Title" defaultValue={s[locale].title} required className={locale === "ar" ? "text-right" : ""} />
                    </div>
                    <Textarea name="body" rows={2} placeholder="Body copy" defaultValue={s[locale].body} className={locale === "ar" ? "text-right" : ""} />
                    <div className="flex items-center gap-2">
                      <select
                        name="visual"
                        defaultValue={s.visual}
                        className="h-9 rounded-md border border-input bg-card px-2 text-sm"
                        aria-label="Visual"
                      >
                        {VISUALS.map((v) => (
                          <option key={v} value={v}>{v}</option>
                        ))}
                      </select>
                      <Button type="submit" variant="secondary" size="sm">Save</Button>
                    </div>
                  </form>
                ))}
              </CardContent>
            </Card>
          </li>
        ))}
      </ul>

      {error && <p role="alert" className="text-sm text-destructive">{error}</p>}

      <div>
        <Button onClick={() => setShowForm((v) => !v)} aria-expanded={showForm}>
          <Plus className="size-4 rtl:-scale-x-100" aria-hidden />
          {showForm ? "Cancel" : "Add scene"}
        </Button>
        {showForm && (
          <form
            action={(fd) => {
              startTransition(async () => {
                const res = await createStoryScene({
                  sceneKey: String(fd.get("sceneKey") ?? ""),
                  visual: String(fd.get("visual") ?? "phone"),
                  icon: String(fd.get("icon") ?? ""),
                  en: {
                    kicker: String(fd.get("kickerEn") ?? ""),
                    title: String(fd.get("titleEn") ?? ""),
                    body: String(fd.get("bodyEn") ?? ""),
                  },
                  ar: {
                    kicker: String(fd.get("kickerAr") ?? ""),
                    title: String(fd.get("titleAr") ?? ""),
                    body: String(fd.get("bodyAr") ?? ""),
                  },
                });
                if (res.ok) { setShowForm(false); setError(null); }
                else setError(res.error);
              });
            }}
            className="mt-3 grid gap-3 rounded-lg border border-border bg-card p-4 sm:grid-cols-2"
          >
            <div className="space-y-1.5"><Label htmlFor="sc-key">Key</Label><Input id="sc-key" name="sceneKey" placeholder="new-scene" required pattern="[a-z0-9]+(-[a-z0-9]+)*" /></div>
            <div className="space-y-1.5"><Label htmlFor="sc-icon">Icon (optional)</Label><Input id="sc-icon" name="icon" /></div>
            <div className="space-y-1.5"><Label htmlFor="sc-kicker-en">Kicker (EN)</Label><Input id="sc-kicker-en" name="kickerEn" placeholder="SCENE 01" /></div>
            <div className="space-y-1.5"><Label htmlFor="sc-kicker-ar">Kicker (AR)</Label><Input id="sc-kicker-ar" name="kickerAr" dir="rtl" /></div>
            <div className="space-y-1.5"><Label htmlFor="sc-title-en">Title (EN)</Label><Input id="sc-title-en" name="titleEn" required /></div>
            <div className="space-y-1.5"><Label htmlFor="sc-title-ar">Title (AR)</Label><Input id="sc-title-ar" name="titleAr" dir="rtl" required /></div>
            <div className="space-y-1.5 sm:col-span-2"><Label htmlFor="sc-body-en">Body (EN)</Label><Textarea id="sc-body-en" name="bodyEn" rows={2} /></div>
            <div className="space-y-1.5 sm:col-span-2"><Label htmlFor="sc-body-ar">Body (AR)</Label><Textarea id="sc-body-ar" name="bodyAr" rows={2} dir="rtl" /></div>
            <div className="space-y-1.5">
              <Label htmlFor="sc-visual">Visual</Label>
              <select id="sc-visual" name="visual" className="flex h-9 w-full rounded-md border border-input bg-card px-2 text-sm" defaultValue="phone">
                {VISUALS.map((v) => (
                  <option key={v} value={v}>{v}</option>
                ))}
              </select>
            </div>
            <div className="flex items-end"><Button type="submit" variant="secondary">Create scene</Button></div>
          </form>
        )}
      </div>
    </div>
  );
}
