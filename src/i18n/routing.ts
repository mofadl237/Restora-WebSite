import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  // Exactly 8 supported locales: Arabic (default, RTL) + 7 LTR languages
  // chosen for the Egyptian market + international tourists.
  locales: ["ar", "en", "de", "ru", "uk", "tr", "it", "fr"] as const,

  // Used when no locale matches
  defaultLocale: "ar",
});

// Provides strict type safety to locales across the app
export type Locale = (typeof routing.locales)[number];
