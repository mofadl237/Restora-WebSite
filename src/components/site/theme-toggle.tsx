"use client";

import { useTheme } from "next-themes";
import { useTranslations } from "next-intl";
import { Moon, Sun } from "lucide-react";

/**
 * Light/dark switch. Icons swap via Tailwind's dark: variants so there is
 * no mounted-state, no hydration mismatch and no setState-in-effect.
 * Preference persists via next-themes (localStorage) and respects the
 * system preference on first visit.
 */
export function ThemeToggle() {
  const t = useTranslations("Nav");
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <button
      type="button"
      aria-label={t("theme")}
      title={t("theme")}
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      className="relative grid size-9 place-items-center overflow-hidden rounded-full border border-border/70 bg-card/60 text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground motion-reduce:transition-none"
    >
      <span className="grid place-items-center transition-transform duration-300 rotate-0 dark:-rotate-90 dark:scale-0 motion-reduce:transition-none">
        <Sun className="size-4 aria-hidden" aria-hidden />
      </span>
      <span className="absolute grid place-items-center transition-transform duration-300 rotate-90 scale-0 dark:rotate-0 dark:scale-100 motion-reduce:transition-none">
        <Moon className="size-4" aria-hidden />
      </span>
    </button>
  );
}
