import type { Metadata } from "next";
import { Geist, Geist_Mono, Fraunces, IBM_Plex_Sans_Arabic } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { routing } from "@/src/i18n/routing";
import { notFound } from "next/navigation";
import { ThemeProvider } from "@/src/components/theme-provider";
import { prisma } from "@/src/lib/db";
import "../globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Editorial display serif for headlines (latin).
const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  axes: ["opsz", "SOFT", "WONK"],
});

// Arabic body/display font — falls through the font stack after latin fonts.
const plexArabic = IBM_Plex_Sans_Arabic({
  variable: "--font-arabic",
  subsets: ["arabic"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Restora",
  description: "Restora — Premium Restaurant Experience",
};

// Pre-generate all locale variants at build time (SSG)
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Validate locale — triggers Next.js not-found boundary if invalid
  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    notFound();
  }

  // Must be called before any async operations — enables static rendering
  setRequestLocale(locale);

  // Only load messages for the active locale (performance: no extra bundles)
  const messages = await getMessages();

  // Automatic RTL/LTR based on locale
  const dir = locale === "ar" ? "rtl" : "ltr";

  // DB-driven brand colors override the CSS defaults at runtime
  const branding = await prisma.branding.findUnique({ where: { id: 1 } });
  const brandStyle = branding
    ? `:root{--brand-primary:${branding.primaryColor};--brand-secondary:${branding.secondaryColor};--brand-accent:${branding.accentColor};}`
    : undefined;

  return (
    <html
      lang={locale}
      dir={dir}
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${fraunces.variable} ${plexArabic.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {brandStyle && <style>{brandStyle}</style>}
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider>{children}</ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
