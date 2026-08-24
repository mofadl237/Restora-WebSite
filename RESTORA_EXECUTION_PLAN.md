# RESTORA — Master Execution Plan

> Single source of truth for the remaining implementation of the RESTORA marketing website + CMS.
> Any agent (human or AI) must read this file + `STATUS.md` before changing anything.
> Last updated: 2026-08-24

---

## 1. Project Overview

RESTORA is a restaurant-focused SaaS platform (restaurant digital operating system). The marketing website must sell a **business transformation**, not list software features:

- establish a professional online presence ("افتح فرع على الإنترنت")
- reach more potential customers
- digital menu / QR menu
- receive online orders
- manage operations from one place
- reduce manual work & chaos
- understand the business through analytics
- improve customer experience
- grow sales opportunities

**NOT** positioned as "just a QR menu".

Narrative arc everywhere on the site: **PROBLEM → TRANSFORMATION → RESULT → GROWTH**.
Tone: warm, Egyptian-professional Arabic; natural English elsewhere. Outcome-focused copy ("بدل ما تتابع الطلبات من كذا مكان، خلّي كل حاجة قدامك في مكان واحد") — never tech jargon ("Advanced analytics dashboard" ❌).

Core promises (never overpromise): time saved · less chaos · more control · professional appearance · better customer experience · data-driven decisions → growth opportunities. No invented statistics, no guaranteed % sales increases.

## 2. Existing Architecture (verified in repo)

- Next.js **16.3.0** (`proxy.ts` convention, Turbopack), React 19.2.8, TypeScript strict
- Tailwind CSS v4 (CSS-first tokens in `app/globals.css`), shadcn/ui components in `src/components/ui`
- next-intl v4 — locales `["en","ar","al","fr","it"]`, default `ar` (RTL); messages in `messages/*.json`
- Prisma 7.9.1 — generator output `src/generated/prisma`, `@prisma/adapter-pg`, config in `prisma.config.ts`, singleton `src/lib/db.ts`; PostgreSQL in WSL Docker container `postgres-db` (db `restora`, user `mohamed`) — NEVER touch sibling DB `qrmenu`
- GSAP 3.15 + @gsap/react (`src/lib/gsap.ts`: registers ScrollTrigger, exports gsap/ScrollTrigger/useGSAP/EASE)
- Framer Motion for UI interactions (reveals, carousel, navbar, pricing toggle)
- Motion foundation: `src/components/site/reveal.tsx` (Reveal/RevealGroup/RevealItem/useReplayableInView) — all animations replayable (no `once:true`), reduced-motion honored
- Existing models (21): Branding(+SocialLink), Country, Plan(+Translation,+CountryPricing,+PlanFeatureAssignment,+PlanGift), Feature(+Translation), Gift(+Translation), MarketingSection(+Translation), StoryScene(+Translation), Testimonial(+Translation), Faq(+Translation), SeoEntry
- Migrations applied: `20260823093940_init`, `20260823112657_add_story_scenes`
- Admin CMS routes under `app/[locale]/admin/*`: overview, branding(+socials), countries, plans(+editor), features, gifts, story, sections, testimonials, faqs, seo — gated server-side by env IP allowlist (`src/server/actions/access.ts` via `assertAdminAllowed()`)
- Server actions in `src/server/actions/*.ts` (zod at boundaries, return `{ok:false,error}`)
- Public site: `app/[locale]/page.tsx` (hero → problem → solution bridge → pinned ProductStory → how-it-works → why-restora(chef) → outcomes → pricing → testimonials → faq → final CTA), `/[locale]/pricing`, sitemap.ts, robots.ts
- Components: `site/navbar|footer|hero|product-story|how-it-works|why-restora|outcomes|testimonials-carousel|final-cta|chef|json-ld|reveal`, `mockups/ui.tsx` (DOM/SVG product UI), `pricing/pricing-section.tsx`
- SEO: `src/server/seo.ts` (`buildMetadata(page, locale, fallbackTitle)` reads SeoEntry, hreflang alternates, SITE_URL), JSON-LD (Organization, SoftwareApplication w/ plan offers, FAQPage)
- Branding runtime injection: DB colors → `--brand-*` CSS vars in `[locale]/layout.tsx`

## 3. BRAND SYSTEM

Primary: **#EF6701** (RESTORA orange). Primary dark #C94F00. Accent #FF8A3D.
Espresso #221812, Deep espresso #140E0A, Warm ivory #FFF8F1/#FAF8F4, Soft cream #F7EFE7, Warm gray #8B8178, Muted brown #6F6259.
Optional micro-accents only: warm gold #D9A441, olive #68704B.

Dominant language = ESPRESSO + IVORY + ORANGE. Implemented as semantic tokens (`--brand-primary/secondary/accent` overridden at runtime from DB Branding; `.dark` variants mix toward orange). Current defaults live in `app/globals.css` + `prisma/seed-data.ts` + DB row. **Do not hardcode hex in components** (exception: neutral whites/blacks/skin tones inside chef SVG/mockups).

## 4. DESIGN REQUIREMENTS

Art-directed, not template-y: strong typography (Fraunces display / Geist / IBM Plex Sans Arabic), generous spacing, clear hierarchy, premium cards+shadows (`--shadow-card/lift/glow`), strong CTAs, section transitions alternating ivory ↔ espresso panels, full responsive, dark mode supported, RTL intentional (physical properties avoided where possible; `[dir="rtl"] * { letter-spacing: normal !important }` protects Arabic script).

## 5. ANIMATION REQUIREMENTS

GSAP = scroll storytelling (ScrollTrigger, pinning, scrub, parallax, clip-path, timelines, cursor).
Framer Motion = local UI (hover, layout, presence, toggles).
ALL storytelling animations replayable/reversible — scroll down plays, scroll up reverses, re-enter replays. Never `viewport={{once:true}}`. Reduced-motion: elegant static fallbacks. GPU-friendly (transform/opacity/clip-path), contexts cleaned up (useGSAP + matchMedia revert).

## 6. SIGNATURE ANIMATIONS (required moments)

A. **Online Branch** — physical restaurant → node surrounded by Google/Social/Website/QR/Menu/Orders/Customers ("مش لازم تفتح فرع جديد… ممكن تفتح فرعك على الإنترنت").
B. **Chaos → Control** — scattered WhatsApp orders/messages snap into one organized system.
C. **Order Journey** — customer → menu → cart → order → kitchen → completed (exists partially in story scenes; keep enhancing).
D. **Growth** — one restaurant → discovery → activity → branches (exists as growth mockup scene).
E. **Menu Transformation** — food imagery → digital menu cards.
Status: C/D partially exist in pinned Product Story; A/B/E to be added as homepage moments or segment-page storytelling.

## 7. CHEF CHARACTER

Existing hand-built SVG (`site/chef.tsx`, poses wave/present/thumbs, brand-var accents). Keep. Use strategically ONLY (Why-Restora, transitions, growth, final CTA). GSAP loops exist (bob/wave). Future: optional 3D-style chef visual architecture (image slot acceptable substitute).

## 8. TARGET CUSTOMERS — `/[locale]/for-businesses`

Dedicated localized page making every owner think "دي مشكلتي". Signature concept: **"الإنترنت هو الفرع اللي بيدخل له عملاء من كل مكان."**

Segments (15): home food business ⭐ (special emphasis: "مطعمك ممكن يبدأ من مطبخ بيتك... لكن وجودك مش لازم يفضل محدود بالشارع اللي ساكن فيه"), small restaurant, café, bakery, desserts, juice/beverage, cloud kitchen, food truck, catering, fast food, pizzeria, shawarma/grill/oriental, multi-branch chains, established-with-customers, wants-to-grow.

Each segment: who they are / pains / worries / what RESTORA solves / time-money saved / online presence / more customers / recommended plan (DATA-DRIVEN `recommendedPlanSlug` from CMS, never hardcoded) / why start now.

Visual grouping (not 15 boring cards): STARTING FROM HOME · FOOD & BEVERAGE · MODERN MODELS (cloud kitchen/truck/catering) · GROWING BUSINESS. Tabs/horizontal storytelling/scroll sections + GSAP customer-journey transformation animation (WhatsApp chaos → RESTORA order).

## 9. HOME BUSINESS STORY

See segment 01 above — highest-emphasis block with its own transformation visual.

## 10–13. PLAN SYSTEM / POSITIONING / GIFTS / COUNTRY PRICING

Current prices (DB-driven, DO NOT hardcode/invent): 447 / 947 / 1447 / 2997 EGP (yearly totals stored independently; compare-at = 2× → Save 50%).
Positioning ladder: Plan1 presence+menu+ordering foundation → Plan2 +reservations/offers/homepage control/multi-language/employees/roles → Plan3 +activity logs/customer visibility/table QR/dine-in → Plan4 +custom domain/SEO/priority support.
UI MUST show "كل ما في الباقة السابقة +" then only NEW features (cumulative value ladder) — implement via feature assignment diff between consecutive active plans (displayOrder).
Visual escalation START→BUILD→GROW→SCALE, one coherent system, popular state.
Gifts (QR Website, Google Review QR, Google Maps setup) CMS-controlled ✓ (exists).
Country selector ✓ (exists; country overrides fall back to plan defaults).

## 14. CLIENT SHOWCASE (NEW)

Model `Client`: name, imageUrl/logo, countryCode (FK-ish string), websiteUrl, category?, description?, active, sortOrder + translations if needed (name/category can stay single-locale strings initially — decide: keep simple non-translated name/logo; category translated later if needed).
Public: premium horizontal circular showcase — continuous elegant movement (NOT plain marquee): GSAP x-scrub or velocity marquee with 3D depth (scale/opacity by proximity to center), hover pauses/focuses, click opens client URL (target _blank rel noopener). Flag emoji from country code. Empty state → section hidden entirely.
Admin: CRUD manager `/admin/clients`.

## 15. TESTIMONIALS (ENHANCE EXISTING)

Add to model: `jobTitle?`, `countryCode?`, keep imageUrl (customer photo), rating, active, sortOrder, quote translations.
Public slider upgrade: cinematic depth slider — central card scaled up, side cards visible w/ scale/opacity/blur falloff, drag + arrows + dots + progress, autoplay pause-on-hover, keyboard accessible, RTL-aware, reduced-motion static. NOT plain slide-left Swiper.
Demo seed content clearly placeholder names/businesses.

## 16. SOCIAL MEDIA

Platforms registry: whatsapp, facebook, instagram, tiktok, youtube, linkedin, x, telegram. Icon renders ONLY if a SocialLink row exists && active && url non-empty (existing footer logic filters active rows — extend icon map + admin platform options).
RESTORA WhatsApp: **01554491132** (intl format for wa.me: +201554491132 — confirm format; store `wa.me/201554491132`). Special treatment: floating WhatsApp CTA component (desktop+mobile, subtle entrance after scroll, aria-label, opens wa.me link, hidden if branding.whatsapp empty, respects reduced-motion).

## 17. CONTACT SYSTEM

Model `ContactSubmission`: fullName, countryCode, dialCode, phone, email?, businessType?, message, status enum NEW|CONTACTED|QUALIFIED|CLOSED (default NEW), sourcePage?, createdAt. 
Public form (on `/[locale]/contact` page + reachable from nav/footer CTAs): name*, country select (name+flag+dial code from Countries CMS)*, mobile* (validated digits), email optional, message*. Server action stores row. Success state inline.
Admin `/admin/contact`: table view (newest first), status change, delete. Simple. No email sending required yet.

## 18. BLOG / CONTENT MARKETING

Model `BlogPost`: slug unique, coverImage?, authorName, category, tags String[] (or comma string), featured bool, published bool, publishedAt DateTime?, displayOrder?, seoTitle?, seoDescription?, ogImage? + `BlogPostTranslation`: locale, title, excerpt, contentMarkdown (render with simple markdown-ish renderer or paragraphs), readingTime computed.
Public: `/[locale]/blog` (editorial listing: featured hero article + cards, category chips, reading time, dates) and `/[locale]/blog/[slug]` (article: reading-progress bar GSAP, cover, beautiful typography, Article/BlogPosting JSON-LD, breadcrumbs, related posts (same category), share buttons (X/FB/WhatsApp/copy-link), CTA band to RESTORA, generateMetadata + generateStaticParams).
Admin `/admin/blog`: list + editor (all fields above, publish toggle).
Seed 3 genuinely useful original articles (restaurant sales tips, QR menu guide, reducing order mistakes) EN+AR. Content quality > filler.

## 19. SEO

First-class. Keep existing buildMetadata/JSON-LD/sitemap/robots. Extend:
- sitemap: add blog posts + /for-businesses + /contact
- JSON-LD additions: WebSite, BreadcrumbList (article + segment pages), Article/BlogPosting, FAQPage on segment pages where FAQs exist
- hreflang alternates maintained for every new route
- Target keywords naturally (AR: منيو إلكتروني، منيو QR للمطاعم، برنامج إدارة المطاعم، نظام طلبات المطاعم، منيو إلكتروني للكافيهات/المخابز/الحلويات… EN: digital menu, QR menu, restaurant management software, restaurant ordering system…). No stuffing; no unimplemented-feature claims.
- Segment sub-pages (/for-businesses/restaurants etc.) ONLY if unique content written — prefer one strong hub page first; add sub-pages when content exists.

## 20–24. PERFORMANCE / A11Y / RESPONSIVE / CURSOR

- next/image everywhere for raster images (fill+sizes, lazy below fold, priority only LCP); reserve space (no CLS)
- GSAP transform/opacity only; ScrollTrigger cleanup via useGSAP; heavy sections simplify <md
- Keyboard accessible everything; focus states; alt text; aria labels; forms labeled
- Custom cursor: desktop-only chef-hat branded cursor following pointer (lerp/quickTo), states default/link/button/drag, native cursor hidden only while active, disabled touch + reduced-motion, NEVER breaks clicks/usability. Component `site/custom-cursor.tsx`.
- Magnetic buttons exist in FinalCta — reuse pattern for primary CTAs (pointer:fine only).

## 25. CONTENT STRATEGY

Original RESTORA copy only. Competitor material (Menux/6lb/MyMenu) = research for structure/framing only, zero text copying. Focus TIME/MONEY/ORDERS/CUSTOMERS/STAFF/CONTROL/GROWTH. Psychology: answer "هكسب إيه؟ هيوفر عليا وقت؟ هيسهل شغلي؟ مناسب لو صغير؟ لو عندي فروع؟ يستاهل الفلوس؟"

## 26. CMS PRINCIPLE

Everything marketing-changeable is CMS-driven: branding, socials, countries, plans, features, gifts, clients, testimonials, faqs, blog, seo entries, story scenes, marketing sections, business segments (via MarketingSection rows keyed `segment-*`), contact submissions (view). Images are URL fields (upload pipeline later — placeholders until real assets provided).

## 27–28. EXECUTION & HANDOFF PROTOCOL

Phased execution; verify (tsc/lint/routes/build) after every phase; update STATUS.md continuously; this file's CURRENT STATE section kept fresh. If context runs low: stop safely after updating both docs with exact remaining work + next file.

## 29. NEVER FORGET

Objective: high-converting premium marketing platform → owner thinks "ده هيوفر عليا وقت وفوضى / عاوز أجرب RESTORA".
Priority: 1 Brand identity · 2 Marketing story · 3 Conversion · 4 Visual quality · 5 Animation · 6 CMS control · 7 Performance · 8 SEO.
PRESERVE: existing GSAP/Framer work, Prisma, CMS, i18n, StoryScene, Chef, mockups, SEO, pricing engine, design system. EXTEND, don't rebuild.

---

# ROADMAP (phases)

- PHASE 8 — CONTENT + CMS EXPANSION ← current
  Clients CMS+model · testimonial enhancements · social platforms registry+WhatsApp float · ContactSubmission+form+admin · BlogPost model+admin · image slots (MarketingSection.imageUrl exists; use it) · seeds · validation
- PHASE 9 — MARKETING STORY + COPY: rewrite homepage messaging problem→result, owner-focused AR copy, cumulative pricing presentation ("كل ما في الباقة السابقة +"), conversion CTAs
- PHASE 10 — CINEMATIC VISUAL STORYTELLING: client circular showcase, premium testimonial depth slider, signature moments A (Online Branch) + B (Chaos→Control) + E (Menu Transformation), founder image slots, chef strategic moments
- PHASE 11 — INTERACTION LAYER: custom chef-hat cursor (desktop), magnetic buttons rollout, hover polish
- PHASE 12 — BLOG + SEO: public blog listing/article, reading progress, related, share, Article JSON-LD, sitemap extension
- PHASE 13 — PRICING + CONVERSION: cumulative features display, START→BUILD→GROW→SCALE escalation styling, verify prices untouched
- PHASE 14 — VISUAL QA: every section, RTL/mobile/tablet/desktop, overflow, forms, empty states
- PHASE 15 — FINAL VERIFICATION: tsc/eslint/build/smoke/all locales/admin CRUD/forms/SEO
- PHASE 16 — FOR-BUSINESSES page (segments, journey animation, plan recommender w/ CMS recommendedPlanSlug, online-branch signature animation)
- PHASE 17 — SEO EXPANSION (keywords landing, structured data completion, internal linking graph)
- PHASE 18 — PERFORMANCE + LAZY LOADING audit
- PHASE 19 — ADVANCED MOTION + remaining signature animations
- PHASE 20 — CONVERSION OPTIMIZATION pass

---

# CURRENT STATE

**Phase 8 COMPLETE (implemented + verified).** All items below are DONE:
1. ✅ schema.prisma: Client, ContactSubmission, BlogPost(+Translation) models; Testimonial.jobTitle/countryCode. Migration `20260824072805_add_clients_contact_blog` applied; `yarn prisma generate` run.
2. ✅ Seeds: clientsSeed ×6 (seed-data.ts), socialLinksSeed now whatsapp-first (`https://wa.me/201554491132`) + facebook/instagram/tiktok/linkedin, blogPostsSeed ×3 original EN+AR articles (prisma/seed-blog.ts: why-restaurants-lose-orders / qr-menu-guide-for-restaurants / restaurant-decisions-from-real-numbers), testimonials jobTitle/countryCode filled. DB seeded; social_links table also fixed via SQL (had stale typo'd row "Faceboock").
3. ✅ Server actions: `src/server/actions/clients.ts` (create/update/delete), `blog.ts` (create/update/setPublished/delete, kebab-case slug check, EN+AR translations), `contact.ts` (**public** `submitContact` — no admin gate — + admin setSubmissionStatus/deleteSubmission).
4. ✅ Readers in content.ts: getClients, getBlogPosts(locale), getBlogPost(locale, slug); PublicTestimonial += jobTitle/countryCode; listActiveCountries() now selects dialCode.
5. ✅ Admin: managers clients-manager.tsx / blog-manager.tsx / contact-inbox.tsx; pages /admin/clients /admin/blog /admin/contact; sidebar entries (Building2/Newspaper/Inbox).
6. ✅ Public: site/clients-showcase.tsx (circular initials/flag showcase after Testimonials, hidden when empty, links websiteUrl), site/whatsapp-float.tsx (fixed bottom-end ping pulse, rendered from [locale]/layout when whatsapp SocialLink active), testimonials-carousel upgraded (jobTitle + flag), app/[locale]/contact/page.tsx + site/contact-form.tsx (country select w/ flags+dial codes, phone digits, email optional), app/[locale]/blog/page.tsx (featured card + grid) + blog/[slug]/page.tsx (RichText mini-markdown renderer in site/rich-text.tsx, related posts). Navbar LINKS += /blog /contact via new NavLink wrapper.
7. ✅ Messages ×5: Clients, WhatsApp, Contact, Blog namespaces + Nav.blog.
8. ✅ Verified: tsc clean · ESLint 0/0 · dev server up (.next wiped first) · 200s on all 5 locale homes + /ar|en/pricing + /ar|en/blog + article + /ar|en/contact + sitemap · HTML assertions PASS (Zayn Grill showcase, wa.me float, Restaurant Owner jobTitle, AR blog title, EG country option, nav blog link).

**Phase 9 COMPLETE.** Copy overhaul shipped: hero/problem/solution/outcomes/final-cta rewritten outcome-first (EN+AR); invented statistics (+38%/-70%) REMOVED from outcomes (remaining "+38%" string is decorative mockup filler — allowed); new `for-whom` segment strip section rendered under hero (restaurants·cafés·home chefs·cloud kitchens…); final CTA carries the online-branch narrative ("افتح فرع مطعمك على الإنترنت"); 2 conversion FAQs added (home-business ⭐ + multi-branch) → faqs=8; SEO keywords extended (cafe/cloud-kitchen/home-business terms); seedSections now REFRESHES EN/AR translations on re-run (seed = source of truth for marketing copy; admin overrides still win at runtime until next seed). Verified: tsc/lint clean · seed applied to live DB · HTML assertions pass (strip, online-branch CTA, new outcomes, both FAQs, en strip).

**Phase 9 + Phase 10 COMPLETE.**

P9 copy overhaul: hero/problem/solution/outcomes/final-cta rewritten outcome-first (EN+AR); invented stats (+38%/-70%) REMOVED (remaining "+38%" = decorative mockup filler, allowed); `for-whom` segment strip under hero; final CTA = online-branch narrative ("افتح فرع مطعمك على الإنترنت"); FAQs +2 (home-business ⭐, multi-branch) → 8; SEO keywords extended; seedSections now refreshes EN/AR translations on re-run.

**Phases 9–13 COMPLETE** (P12 blog polish: `reading-progress.tsx` framer useScroll bar, `share-row.tsx` WhatsApp/X/Telegram/Facebook + `copy-link.tsx` clipboard w/ copied state, Article + BreadcrumbList JSON-LD on `/blog/[slug]`, breadcrumb nav, sitemap extended → 5 locales × {home,pricing,blog,contact} + 15 article URLs = 35 entries; P13 pricing conversion: `resolvePricing` now computes `previousPlanName` + `newFeatures` via feature-key diff across consecutive active plans by displayOrder → UI renders "كل ما في باقة X، بالإضافة إلى:" banner then only NEW features; SCALE tier dark escalation card; prices untouched).

P11 interaction layer:
- `site/chaos-control.tsx` — signature moment B after Problem section: scattered order chips converge into one RESTORA card, desktop pinned scrub (`h-[260vh]` sticky stage), precomputed pixel-delta tweens (fully reversible), mobile/reduced static reveal. Copy from new `Moments` messages ns ×5.
- `site/online-branch.tsx` — signature moment A before FinalCta: restaurant core node + 6 orbit nodes (Google/social/website/QR/orders/customers) with SVG lines drawing in via strokeDashoffset scrub; mobile reveal grid.
- `site/clients-marquee.tsx` — replaces static grid inside ClientsShowcase: continuous GSAP xPercent loop (RTL-aware direction flip), hover/focus pauses via timeScale tween, rAF depth pass (scale/opacity by distance to viewport center), edge mask fade.
- `testimonials-carousel.tsx` rewritten as depth slider: prev/active/next cards visible with spring transitions, scale .86 / opacity .4 / blur falloff, drag-to-switch (RTL-flipped threshold), arrows/dots/autoplay preserved, reduced-motion quiet crossfade; RTL derived from useLocale (SSR-safe — do NOT read document.dir during render).

Verified: tsc clean · lint 0/0 · all locale homes 200 · HTML assertions pass (chaos chips/result, branch nodes, marquee track/cards, depth cards, cursor mount). NOTE: Turbopack stale-cache pitfall hit again — after adding component files a failed compile left ghost state; fix = kill dev PID + rm -rf .next + restart. SSR pitfall: never read `document.*` during component render (testimonials rtl now via useLocale).

**Phases 14–15 COMPLETE** (P14 static QA sweep: no physical left/right props outside symmetric centering transforms, contact form fully labeled, blog/testimonials empty-state guarded, body overflow-x clip; P15 final verification: `yarn build` production PASS (228s) · tsc clean · ESLint 0/0 · smoke all-green post-warmup — 5 locale homes + sitemap(35 URLs) + pricing/blog/article/contact × locales + admin 307 gate).

**Phases 16–18 status**: P16 `/[locale]/business` DONE — schema `Plan.recommendedFor String[]` (migration `add_plan_recommended_for`; seeded starter→home-chef/food-truck, growth→cafe/bakery/sweets/juices, professional→restaurant/cloud-kitchen, enterprise→catering/franchise); `getPlanRecommendations()` reader; DB-driven sections `biz-hero/biz-segments/biz-journey/biz-recommender` seeded; `business-journey.tsx` scrub-drawn timeline (4 steps, RTL-aware, reversible); `plan-recommender.tsx` quiz (9 segments + size radio nudges one tier up the displayOrder ladder) → recommended card w/ price + CTA; Business ns ×5 (segments icons/labels, metaTitle); business SEO entries en+ar; footer Nav.business link. Verified /ar|en/business 200 + content assertions.
P17 SEO: sitemap(35 URLs) + hreflang + Organization/SoftwareApplication/FAQPage/Article/BreadcrumbList JSON-LD + keyword entries — SATISFIED. P18 perf: lazy imgs, DOM/SVG mockups, no heavy deps — PASS (optional polish left: dynamic-import below-fold widgets).

**Phases 8–20 ALL COMPLETE** 🎉

P19 Menu Transformation (moment E): `site/menu-transformation.tsx` — pinned reversible scrub: paper menu (scribble rows, ✗ marks, coffee ring) wobbles then sweeps away → PhoneFrame+PhoneMenuScreen rises w/ glow pop; before/after captions crossfade; mobile shows phone + crossed-out caption statically; `Moments.menu*` keys ×5. Wired between Why-Restora and Outcomes.

P20 conversion pass: `site/sticky-cta.tsx` — mobile-only bottom bar (appears after hero, translate-y transition, safe-area padding): WhatsApp quick-contact + full-width "ابدأ الآن" → /pricing; standalone WhatsApp float now `hidden md:block` (no overlap); `StickyCta` ns ×5. Desktop UX unchanged.

FINAL VERIFICATION: tsc clean · ESLint 0/0 · production build PASS (242s) · smoke all 5 locale homes + /ar/business 200 · zero MISSING_MESSAGE · menu transformation + sticky CTA render assertions pass.

Roadmap complete — remaining ideas are optional polish only: dynamic-import below-fold widgets (P18 extra), nav link to /business, admin CRUD for MarketingSection biz-* copy (currently seed-managed), real client logos/photos via admin Clients manager.

Known pitfalls: Windows .next locks after prod build AND at dev boot (EPERM rename races — wipe .next + restart dev; routes still serve 200 after warmup); FIRST hit of a NEW route can take ~60s Turbopack compile → use curl --max-time then re-hit; stale Turbopack caches after adding files/models/messages — RESTART DEV after editing messages/*.json (next-intl module-caches messages); Prisma client regenerated into src/generated/prisma (rerun `yarn prisma generate` if client lags schema); docker container dies with WSL VM idle between tool calls → run docker start + pg_isready poll + command in ONE bash call, or connect via WSL IP (`hostname -I`, saved at /tmp/wslip) bypassing broken localhost forwarding; tables snake_case-mapped, columns camelCase quoted; MSYS path mangling — prefix curl loops with MSYS_NO_PATHCONV=1; git-bash fork storms under load — retry simple commands.
