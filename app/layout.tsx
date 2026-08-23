// Minimal root layout required by Next.js App Router.
// All real layout logic (fonts, providers, html/body attributes) lives in
// app/[locale]/layout.tsx which has access to the locale param.
// This file exists solely to satisfy Next.js' root layout requirement
// for the global not-found.tsx page.
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
