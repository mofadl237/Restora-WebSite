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

## SEO-First Audit + Implementation (2026-08-24)

Full rendered-site audit (curl HTML) then implementation of the organic-search platform:

**Fixed (was broken):**
- Canonicals: every subpage pointed at `/{locale}` home → `src/server/seo.ts` rewritten with path-aware `buildMetadata(page, locale, fallbackTitle, {path?, image?, description?})`; all callers pass explicit paths; metadataBase + x-default added. VERIFIED on article + segment pages.
- Hreflang clusters: were home-only → now per-path ×5 locales + x-default.
- Articles had NO meta description → stored seoTitle/seoDescription/ogImage surfaced via content.ts mappers + article generateMetadata (excerpt/cover fallbacks).
- /pricing had no H1 → PricingSection `headingLevel` prop (h1 standalone, h2 homepage).
- No WebSite JSON-LD → `websiteSchema()` on homepage; Organization logo absolute.

**New — segment SEO landing pages (CMS-driven, EN+AR):**
- Prisma `SegmentPage`/`SegmentPageTranslation` (migration `add_segment_pages`) + `prisma/seed-segments.ts`: 9 differentiated segments w/ problems/useCases/features/faqs/seoTitle/seoDescription; DB seeded (9 active).
- `app/[locale]/business/[segment]/page.tsx`: SSG from CMS, FAQPage+BreadcrumbList JSON-LD, hero H1, pain/solution split, plan recommendation card (real EGP prices), FAQs accordion, internal links (segments + category-matched articles). Hub grid links to all 9.
- Homepage for-whom strip → 9 segment Links. Sitemap → 80 URLs (45 segment). VERIFIED rendered.

**Content engine:** `prisma/seed-blog-more.ts` adds 6 substantial intent-targeted EN+AR articles (digital menu how-to, commissions-free ordering, Google visibility, home food business, software buying guide) → blog = 8 articles; related posts scored by shared category/tags; new end-of-article `ArticleCta` (→ /pricing + /business; Blog.cta* keys ×5).

**Product safety:** theme pinned to light (`forcedTheme="light"` in [locale]/layout) until a real dark palette is designed (backlog).

Verification: tsc clean · ESLint 0/0 · production build PASS (~135s) · rendered assertions: article canonical/description/hreflang ✓, /ar/business/restaurants title/canonical/h1=1/FAQPage ✓, homepage 9 segment hrefs + WebSite JSON-LD ✓, /ar/pricing h1 ✓, sitemap 45 business URLs ✓, blog index lists all articles ✓, article CTA + related-by-category render ✓.

Backlog: SegmentPage admin CRUD · nav link to /business · dark-mode design pass + toggle · dynamic-import below-fold widgets · real OG image asset · reviews schema markup.

Known Issues additions: docker CLI only inside WSL this session (`wsl.exe sh -c "docker exec postgres-db psql …"`, pipe through `tr -d '\0'`); psql needs camelCase quoted identifiers ("segmentId", "seoTitle").

## Last Updated

2026-08-25 — 8-locale international platform, premium navbar (lang+theme), plan→contact lead flow, tourism segment; tsc/lint/build green, all locales smoke-tested.


2026-08-24 — SEO-first audit + acquisition-platform implementation completed; build + rendered verification passed.

## Premium UX + International Platform (2026-08-25, post-interruption completion)

Directive: premium navbar, 8 locales, lead flow, tourism segment — implemented & verified:

**i18n (exactly 8 locales):** `routing.ts`/`proxy.ts` → ar(default,RTL)/en/de/ru/uk/tr/it/fr; `messages/al.json` deleted (old /al/* → middleware redirect → 404 by design). Native de/ru/uk/tr message files authored; en/ar/fr/it patched; all namespaces aligned ×8. DB translations backfilled to all 8 via idempotent `prisma/backfill-locales.sql` (verified: segments 10/locale, plans 4/locale).

**Premium navbar:** rewritten minimal links (Home/Business/Pricing/Blog/Contact) + LanguageSwitcher (popover/mobile sheet, deep-link preserving, NEXT_LOCALE cookie persistence) + ThemeToggle + "ابدأ الآن" CTA → /contact. Mobile sheet embeds all controls.

**Dark mode:** forcedTheme="light" REMOVED (supersedes earlier decision); system-aware ThemeProvider + `.dark` tokens already in globals.css; html theme transition; CSS-only sun/moon toggle icons (no hydration mismatch). Fixed mangled globals.css html block that broke dev compile.

**Lead flow (plan → contact):** ContactSubmission += selectedPlan + locale (migrations add_selected_plan/add_submission_locale; prisma client regenerated). submitContact persists both. Pricing cards + segment-page plan CTAs + WhoWeHelp aside → `/contact?plan={slug}`. Contact page resolves ?plan= against DB plans (byCountry flatten); form shows non-editable plan card; success screen offers WhatsApp handoff pre-filled with name/phone/plan/message/locale. VERIFIED: /ar/contact?plan=growth renders "الباقة المختارة" card with DB Arabic plan name.

**Admin inbox:** status+plan filters (options derived from actual submissions), plan badge resolved to localized DB plan names via new `planNames` map (getPlanRecommendations(locale)), locale badge. VERIFIED rendered with QA row (de/growth → "★ جروث").

**Who we help + tourism:** CMS-driven interactive segment selector on homepage (chips→problems/useCases + recommended plan w/ real price); tourism greeting-cycle band → /business/tourist-restaurants. 10th segment tourist-restaurants seeded EN+AR (+ backfilled ×6), sitemap now lists it ×8 locales.

**Chaos moment enriched:** per-chip channel icons + 14 decorative fragments dissolving in scrub timeline before chips converge (desktop only).

**CRITICAL FIX — locale-aware links:** public components used plain next/link → non-Arabic pages emitted unprefixed hrefs and middleware bounced users to Arabic. Switched navbar/footer/final-cta/sticky-cta/pricing-section/who-we-help/tourism-band/article-cta/plan-recommender/homepage/blog/business pages to i18n navigation Link. VERIFIED: /de/pricing emits /de/contact?plan=* etc.

Verification: tsc clean · ESLint 0 errors · production build PASS · hero entrance confirmed mount-once · smoke: de/ru/fr/uk/tr/it business|blog|pricing|contact?plan all 200; hreflang = 8 locales + x-default per page; /al redirects then 404.

Backlog remaining from directive: branch-on-internet cinematic scrub upgrade · global typography audit · imagery pass (needs manual asset sourcing/admin upload) · per-locale long-form keyword content · seo_entries rows for the 6 new locales (currently fall back to page-level titles/descriptions).
