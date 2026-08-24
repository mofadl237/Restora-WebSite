# RESTORA Marketing Website — Project Status

## Current Phase

**ALL PHASES (8–20) COMPLETE** — roadmap finished; verified via production build + full smoke.

Recent completions:
- P11: chef-hat custom cursor + magnetic CTAs (`use-magnetic.ts`)
- P12: blog polish (reading progress, share row + copy link, Article/Breadcrumb JSON-LD, breadcrumbs, sitemap 35 URLs)
- P13: pricing cumulative ladder ("كل ما في باقة X، بالإضافة إلى:" via newFeatures diff in `resolvePricing`) + SCALE dark escalation
- P14/15: QA sweep + production build PASS
- P16: `/business` page — segments grid, journey timeline, CMS-driven plan recommender (`Plan.recommendedFor` migration), Business ns ×5
- P19: Menu Transformation moment E (paper → digital scrub scene, `menu-transformation.tsx`)
- P20: mobile sticky CTA bar (`sticky-cta.tsx`) with WhatsApp quick contact

Optional polish backlog (not required): dynamic-import below-fold widgets, nav link to /business, admin CRUD for biz-* marketing sections, real client logos.

## Overall Progress

**88%** of original scope · Phase 8 just starting (of extended roadmap Phases 8–20)

---

## Completed

- [x] Repository architecture inspected (Next.js 16.3.0, React 19.2.8, Tailwind v4, next-intl v4)
- [x] Prisma 7 upgrade path (config file, rust-free client, driver adapters); DB `restora` on local Docker Postgres
- [x] Design system tokens — **rebranded to RESTORA orange `#EF6701`** on warm espresso/ivory neutrals (light+dark); brand colors runtime-overridable from DB
- [x] Fonts: Geist Sans/Mono + Fraunces display + IBM Plex Sans Arabic; ThemeProvider
- [x] Prisma schema (21 models incl. translation tables) · migrations applied · idempotent seed
- [x] Full admin CMS: Overview, Branding+Socials, Countries, Plans (+editor), Features, Gifts, Product Story, Marketing Sections, Testimonials, FAQs, SEO — all gated server-side
- [x] Pricing engine: `resolvePricing()` country-override→fallback logic; `getPricingViewModel()` pre-resolves all countries
- [x] Runtime brand-variable injection from DB into `[locale]` layout
- [x] Cinematic hero + pinned product story + chef narrator + DOM/SVG product mockups + full narrative sections (details in Decisions)
- [x] Navbar hide-on-scroll, `/pricing` standalone page, SEO layer (metadata/JSON-LD/sitemap/robots)
- [x] Messages complete for all 5 locales (en/ar/al/fr/it): Nav, Pricing, Testimonials, Hero, Story, FinalCta, Common

### Visual QA + polish pass (this session)

- [x] **Rebrand to RESTORA orange**: DB Branding row → `#EF6701` / espresso `#221812` / accent `#FF8A3D`; seed-data updated to match; globals.css semantic palette rebuilt warm (ivory bg, espresso text, orange primary/accent, orange chart ramp, warm shadows in light+dark). Admin fallback colors updated.
- [x] **Arabic typography fix**: global `[dir="rtl"] * { letter-spacing: normal !important }` — letter-spacing severs connected Arabic script; was breaking kickers/eyebrows/tracked labels on /ar.
- [x] Hardcoded English removed: hero "See how it works" CTA + floating toast/rating labels, story scene-1 chip ("Scan · Browse · Order" / "0 downloads needed"), FinalCta rating chip, homepage FAQ heading — now translated in all 5 locales (new Hero/Story/FinalCta namespaces).
- [x] Pricing clarity: country selector shows country **name** (`Egypt · ج.م EGP`) instead of duplicated code; yearly mode now shows `{price} /yr` + "billed yearly" microcopy (yearlyPrice is the annual total — was ambiguous); compare-at strike shows currency symbol; gift icons use brand primary.
- [x] Story transitions enriched with alternating lateral drift (RTL-mirrored) so the pinned journey glides instead of popping; scene dots switched from CSS-utility toggling to inline styles (cascade-order-proof).
- [x] Kickers unified to `text-primary` (story scenes, solution bridge) — single accent system.
- [x] Mockup fix: GrowthMockup branch icon wasn't vertically centered (block→grid).

## Verified

- TypeScript `tsc --noEmit`: ✅ clean
- ESLint: ✅ 0 errors, 0 warnings
- **Production build** (`yarn build`, Turbopack): ✅ compiles clean, 70/70 static pages generated in ~178s
- Production bundle: lean — largest chunk 224KB (uncompressed), static chunks total ~1MB across all (gsap+framer+react included)
- Production server smoke test (`next start`):
  - `/ar /en /fr /it /al` ✅ · `/ar/pricing /en/pricing` ✅ · `/sitemap.xml /robots.txt` ✅
  - All 11 admin routes tested ✅ (incl. `/admin/story`)
  - 14 content assertions PASS on rendered HTML: runtime `--brand-primary:#EF6701` injected, AR hero/story/FinalCta strings render Arabic, EN equivalents render English, FAQ heading localized, pricing shows country names, 5 story dots present, SoftwareApplication JSON-LD present, zero old-saffron leftovers
  - Server log clean (no errors/hydration warnings)
- Dev server restored after prod build: required `.next` wipe (Windows EPERM lock issue, see Known Issues); all routes re-verified 200 on dev incl. new AR strings.

## Known Issues

- Local Postgres runs inside WSL Docker (`postgres-db`, user `mohamed`); creds in `.env` only.
- **After running `yarn build`, `yarn dev` can fail with EPERM rename errors / 404-500s until `.next` is deleted and dev restarted** (Turbopack dev/prod artifact clash on Windows + zombie node telemetry process holding locks). Recovery: kill port-3000 PIDs + stray `node.exe` for this repo → `rm -rf .next` → `yarn dev`.
- Dashboard/phone mockups intentionally render product UI in English across locales (consistent "software screenshot" metaphor); page copy around them is fully localized.
- Demo values inside product mockups are decorative UI filler, not commercial claims.
- No real browser/screenshot capability in this environment — visual QA was done via code-level inspection + rendered-HTML assertions, not pixel review.

## Optional Polish (not started)

1. Default OG image asset (`public/og.png`) wired into buildMetadata fallback.
2. Contact page rebuild (was removed externally).
3. Real restaurant photography slots if desired (structure ready via next/image remote patterns).
4. Chef `aria-label` localization (currently hardcoded "RESTORA chef").

## Last Updated

2026-08-23 — Visual QA + rebrand-to-orange polish pass completed; production build + route/content verification passed.
