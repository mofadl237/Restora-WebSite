"use client";

import { useActionState, useState } from "react";
import { updateBranding } from "@/src/server/actions/branding";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Loader2 } from "lucide-react";

type BrandingValues = {
  brandName: string;
  logoUrl: string;
  faviconUrl: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  defaultLocale: string;
  contactEmail: string;
  contactPhone: string;
  whatsapp: string;
  address: string;
};

const HEX = /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;

function ColorField({
  label,
  name,
  defaultValue,
}: {
  label: string;
  name: keyof BrandingValues;
  defaultValue: string;
}) {
  const [color, setColor] = useState(defaultValue);
  const safeColor = HEX.test(color) ? color : "#000000";

  return (
    <div className="space-y-1.5">
      <Label htmlFor={`${name}-hex`}>{label}</Label>
      <div className="flex items-center gap-2">
        <input
          type="color"
          aria-label={`${label} picker`}
          value={safeColor}
          onChange={(e) => setColor(e.target.value)}
          className="size-9 shrink-0 cursor-pointer rounded-md border border-input bg-card p-1"
        />
        <span
          className="size-6 shrink-0 rounded border border-border"
          style={{ background: safeColor }}
          aria-hidden
        />
        <Input
          id={`${name}-hex`}
          name={name}
          value={color}
          onChange={(e) => setColor(e.target.value)}
          pattern="^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$"
          required
        />
      </div>
    </div>
  );
}

export function BrandingForm({
  values,
  locales,
}: {
  values: BrandingValues;
  locales: readonly string[];
}) {
  const [state, formAction, pending] = useActionState(
    async (_prev: Awaited<ReturnType<typeof updateBranding>> | null, formData: FormData) =>
      updateBranding(formData),
    null,
  );

  return (
    <form action={formAction} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Brand identity</CardTitle>
          <CardDescription>
            Colors are applied across the website via CSS variables. Logo and
            favicon URLs should point to publicly accessible images.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <ColorField label="Primary color" name="primaryColor" defaultValue={values.primaryColor} />
          <ColorField label="Secondary color" name="secondaryColor" defaultValue={values.secondaryColor} />
          <ColorField label="Accent color" name="accentColor" defaultValue={values.accentColor} />
          <div className="space-y-1.5">
            <Label htmlFor="defaultLocale">Default language</Label>
            <Input
              id="defaultLocale"
              name="defaultLocale"
              list="locale-options"
              defaultValue={values.defaultLocale}
              required
            />
            <datalist id="locale-options">
              {locales.map((l) => (
                <option key={l} value={l} />
              ))}
            </datalist>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Assets & contact</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="brandName">Brand name</Label>
            <Input id="brandName" name="brandName" defaultValue={values.brandName} required />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="logoUrl">Logo URL</Label>
            <Input id="logoUrl" name="logoUrl" type="url" placeholder="https://…" defaultValue={values.logoUrl} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="faviconUrl">Favicon URL</Label>
            <Input id="faviconUrl" name="faviconUrl" type="url" placeholder="https://…" defaultValue={values.faviconUrl} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="contactEmail">Contact email</Label>
            <Input id="contactEmail" name="contactEmail" type="email" defaultValue={values.contactEmail} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="contactPhone">Contact phone</Label>
            <Input id="contactPhone" name="contactPhone" defaultValue={values.contactPhone} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="whatsapp">WhatsApp</Label>
            <Input id="whatsapp" name="whatsapp" defaultValue={values.whatsapp} />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="address">Address</Label>
            <Input id="address" name="address" defaultValue={values.address} />
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={pending}>
          {pending && <Loader2 className="size-4 animate-spin" aria-hidden />}
          Save branding
        </Button>
        {state?.ok && (
          <p role="status" className="text-sm font-medium text-success">
            Saved.
          </p>
        )}
        {state && !state.ok && (
          <p role="alert" className="text-sm font-medium text-destructive">
            {state.error}
          </p>
        )}
      </div>
    </form>
  );
}
