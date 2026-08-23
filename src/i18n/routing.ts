import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: ["en", "ar", "al", "fr", "it"] as const,

  // Used when no locale matches
  defaultLocale: "ar",
});

// Provides strict type safety to locales across the app
export type Locale = (typeof routing.locales)[number];
