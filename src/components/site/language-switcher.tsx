"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ChevronDown, Globe } from "lucide-react";

/** Native name + short English tag; flags hint at the region, names carry the meaning. */
const LANGUAGES: { code: string; native: string }[] = [
  { code: "ar", native: "العربية" },
  { code: "en", native: "English" },
  { code: "de", native: "Deutsch" },
  { code: "ru", native: "Русский" },
  { code: "uk", native: "Українська" },
  { code: "tr", native: "Türkçe" },
  { code: "it", native: "Italiano" },
  { code: "fr", native: "Français" },
];

/**
 * Premium language switcher. Swaps the first path segment of the current
 * route so every deep link keeps its page. The explicit choice is persisted
 * by the next-intl middleware cookie (NEXT_LOCALE) — direct locale URLs
 * always win over detection.
 */
export function LanguageSwitcher({ variant = "desktop" }: { variant?: "desktop" | "mobile" }) {
  const t = useTranslations("Nav");
  const locale = useLocale();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDocClick = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("click", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("click", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const hrefFor = (code: string) => {
    const segments = pathname.split("/");
    if (segments.length > 1) segments[1] = code;
    return segments.join("/") || `/${code}`;
  };

  const trigger = (
    <button
      type="button"
      aria-label={t("lang")}
      aria-haspopup="listbox"
      aria-expanded={open}
      onClick={() => setOpen((v) => !v)}
      className={
        variant === "desktop"
          ? "flex h-9 items-center gap-1.5 rounded-full border border-border/70 bg-card/60 px-3 text-xs font-semibold text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
          : "flex w-full items-center justify-between rounded-xl px-3 py-3 text-sm font-medium hover:bg-secondary"
      }
    >
      <span className="flex items-center gap-2">
        <Globe className="size-4" aria-hidden />
        {variant === "mobile" && <span>{t("lang")}</span>}
        {variant === "desktop" && <span className="uppercase tracking-wide">{locale}</span>}
      </span>
      <ChevronDown className={`size-3.5 transition-transform duration-200 ${open ? "rotate-180" : ""}`} aria-hidden />
    </button>
  );

  if (variant === "mobile") {
    return (
      <div>
        {trigger}
        <AnimatePresence initial={false}>
          {open && (
            <motion.ul
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden"
              role="listbox"
              aria-label={t("lang")}
            >
              {LANGUAGES.map((l) => (
                <li key={l.code}>
                  <Link
                    href={hrefFor(l.code)}
                    hrefLang={l.code}
                    onClick={() => setOpen(false)}
                    role="option"
                    aria-selected={l.code === locale}
                    className={`flex items-center justify-between rounded-xl px-4 py-2.5 text-sm ${
                      l.code === locale ? "bg-secondary font-semibold text-primary" : "text-muted-foreground hover:bg-secondary/60"
                    }`}
                  >
                    <span>{l.native}</span>
                    {l.code === locale && <Check className="size-4" aria-hidden />}
                  </Link>
                </li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div ref={rootRef} className="relative">
      {trigger}
      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            role="listbox"
            aria-label={t("lang")}
            className="absolute end-0 top-full z-50 mt-2 w-44 overflow-hidden rounded-2xl border border-border bg-popover p-1.5 shadow-lift"
          >
            {LANGUAGES.map((l) => (
              <li key={l.code}>
                <Link
                  href={hrefFor(l.code)}
                  hrefLang={l.code}
                  onClick={() => setOpen(false)}
                  role="option"
                  aria-selected={l.code === locale}
                  className={`flex items-center justify-between rounded-xl px-3 py-2 text-sm transition-colors ${
                    l.code === locale ? "bg-secondary font-semibold text-primary" : "text-popover-foreground hover:bg-secondary"
                  }`}
                >
                  <span>{l.native}</span>
                  {l.code === locale && <Check className="size-4" aria-hidden />}
                </Link>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
