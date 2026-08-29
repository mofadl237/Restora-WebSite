import type { Metadata } from "next";
import { Geist, Geist_Mono, Fraunces, IBM_Plex_Sans_Arabic } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { routing } from "@/src/i18n/routing";
import { notFound } from "next/navigation";
import { ThemeProvider } from "@/src/components/theme-provider";
import { WhatsappFloat } from "@/src/components/site/whatsapp-float";
import { CustomCursor } from "@/src/components/site/custom-cursor";
import { StickyCta } from "@/src/components/site/sticky-cta";
import { ScrollTop } from "@/src/components/site/scroll-top";
import { prisma } from "@/src/lib/db";
import { SITE_URL, DEFAULT_OG_IMAGE } from "@/src/server/seo";
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

const SITE_TITLE = "Restora — Run your restaurant, beautifully";
const SITE_DESCRIPTION =
  "Restora is the all-in-one operating system for restaurants: digital menus, online ordering, reservations and real-time analytics — in every language your guests speak.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: "%s | Restora",
  },
  description: SITE_DESCRIPTION,
  applicationName: "Restora",
  icons: {
    icon: [
      { url: "/favicon.ico", type: "image/x-icon", sizes: "48x48" },
      { url: "/icon.png", type: "image/png", sizes: "48x48" },
      { url: "/icon.svg", type: "image/svg+xml", sizes: "any" },
    ],
    shortcut: "/icon.png",
    apple: "/apple-icon.png",
  },
  openGraph: {
    type: "website",
    siteName: "Restora",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    locale: "en",
    alternateLocale: routing.locales.filter((l) => l !== "en"),
    images: [
      { url: DEFAULT_OG_IMAGE, width: 1024, height: 1024, alt: "Restora" },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [DEFAULT_OG_IMAGE],
  },
};

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

  // Floating WhatsApp CTA — only when a whatsapp link is configured in CMS
  const whatsappLink = await prisma.socialLink.findFirst({
    where: { platform: "whatsapp", active: true },
    select: { url: true },
  });

  return (
    <html
      lang={locale}
      dir={dir}
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${fraunces.variable} ${plexArabic.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {brandStyle && <style>{brandStyle}</style>}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Restora",
              url: SITE_URL,
              logo: `${SITE_URL}/restora-icon-512.png`,
            }),
          }}
        />
        <NextIntlClientProvider messages={messages}>
          {/* System-aware theme: persists explicit choice, respects OS on first visit. */}
          <ThemeProvider>
            {children}
            <CustomCursor />
            <ScrollTop />
            {whatsappLink && <WhatsappFloat url={whatsappLink.url} />}
            <StickyCta whatsappUrl={whatsappLink?.url ?? null} />
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
