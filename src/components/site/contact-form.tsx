"use client";

import { useMemo, useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { submitContact } from "@/src/server/actions/contact";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Textarea } from "@/src/components/ui/textarea";
import { CheckCircle2, Loader2 } from "lucide-react";

export type ContactCountry = {
  code: string;
  name: string;
  dialCode?: string | null;
};

function flagFromCode(code: string): string {
  if (!/^[A-Za-z]{2}$/.test(code)) return "";
  return String.fromCodePoint(
    ...code
      .toUpperCase()
      .split("")
      .map((c) => 127397 + c.charCodeAt(0)),
  );
}

export function ContactForm({
  countries,
  sourcePage,
}: {
  countries: ContactCountry[];
  sourcePage: string;
}) {
  const t = useTranslations("Contact");
  const [isPending, startTransition] = useTransition();
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [countryCode, setCountryCode] = useState(countries[0]?.code ?? "EG");

  const selected = useMemo(
    () => countries.find((c) => c.code === countryCode),
    [countries, countryCode],
  );

  if (done) {
    return (
      <div
        role="status"
        className="flex flex-col items-center gap-3 rounded-2xl border border-border bg-card p-10 text-center shadow-card"
      >
        <CheckCircle2 className="size-10 text-primary" aria-hidden />
        <p className="font-display text-lg font-semibold">{t("successTitle")}</p>
        <p className="max-w-sm text-sm text-muted-foreground">{t("successBody")}</p>
      </div>
    );
  }

  return (
    <form
      action={(fd) => {
        setError(null);
        startTransition(async () => {
          const res = await submitContact({
            fullName: String(fd.get("fullName") ?? ""),
            countryCode,
            dialCode: selected?.dialCode ?? "",
            phone: String(fd.get("phone") ?? "").replace(/\D/g, ""),
            email: String(fd.get("email") ?? ""),
            businessType: String(fd.get("businessType") ?? ""),
            message: String(fd.get("message") ?? ""),
            sourcePage,
          });
          if (res.ok) {
            setDone(true);
          } else {
            setError(res.error);
          }
        });
      }}
      className="space-y-4 rounded-2xl border border-border bg-card p-6 shadow-card md:p-8"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="ct-name">{t("fullName")}</Label>
          <Input id="ct-name" name="fullName" required minLength={2} maxLength={100} autoComplete="name" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="ct-country">{t("country")}</Label>
          <select
            id="ct-country"
            value={countryCode}
            onChange={(e) => setCountryCode(e.target.value)}
            className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-xs focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
          >
            {countries.map((c) => (
              <option key={c.code} value={c.code}>
                {flagFromCode(c.code)} {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="ct-phone" dir="ltr">
            {t("phone")}
          </Label>
          <div className="flex" dir="ltr">
            <span className="grid place-items-center rounded-s-md border border-input bg-secondary px-3 font-mono text-sm text-muted-foreground">
              {selected?.dialCode ?? ""}
            </span>
            <Input
              id="ct-phone"
              name="phone"
              type="tel"
              inputMode="numeric"
              pattern="\d{7,12}"
              required
              className="rounded-e-md rounded-s-none"
              autoComplete="tel-national"
            />
          </div>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="ct-email">
            {t("email")} <span className="text-muted-foreground">({t("optional")})</span>
          </Label>
          <Input id="ct-email" name="email" type="email" dir="ltr" autoComplete="email" />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="ct-business">
          {t("businessType")} <span className="text-muted-foreground">({t("optional")})</span>
        </Label>
        <Input id="ct-business" name="businessType" maxLength={60} />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="ct-message">{t("message")}</Label>
        <Textarea id="ct-message" name="message" rows={5} required minLength={5} maxLength={2000} />
      </div>

      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}

      <Button type="submit" disabled={isPending} className="w-full rounded-full sm:w-auto">
        {isPending && <Loader2 className="me-1 size-4 animate-spin" aria-hidden />}
        {t("submit")}
      </Button>
    </form>
  );
}
