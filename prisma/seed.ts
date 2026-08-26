/**
 * RESTORA database seed.
 * Run: yarn prisma db seed
 *
 * Seeds the CURRENT commercial data (4 plans, features, gifts, countries)
 * plus initial CMS content (branding, marketing sections, testimonials,
 * FAQs, SEO). All values remain editable from the Admin dashboard afterwards.
 */
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import {
  LOCALES,
  brandingSeed,
  socialLinksSeed,
  countriesSeed,
  featuresSeed,
  plansSeed,
  giftsSeed,
  countryPricingOverrides,
  clientsSeed,
} from "./seed-data";
import {
  sectionsSeed,
  extraSectionsSeed,
  storyScenesSeed,
  testimonialsSeed,
  faqsSeed,
  seoEntriesSeed,
} from "./seed-content";
import { blogPostsSeed } from "./seed-blog";
import { moreBlogPostsSeed } from "./seed-blog-more";
import { seedSegmentPages } from "./seed-segments";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function seedBranding() {
  await prisma.branding.upsert({
    where: { id: brandingSeed.id },
    update: {},
    create: brandingSeed,
  });
  const count = await prisma.socialLink.count();
  if (count === 0) {
    await prisma.socialLink.createMany({
      data: socialLinksSeed.map((link) => ({ ...link, brandingId: brandingSeed.id })),
    });
  }
}

async function seedCountries() {
  for (const c of countriesSeed) {
    await prisma.country.upsert({
      where: { code: c.code },
      update: c,
      create: { ...c, active: true },
    });
  }
}

async function seedFeatures() {
  for (const f of featuresSeed) {
    const feature = await prisma.feature.upsert({
      where: { key: f.key },
      update: { icon: f.icon, category: f.category, sortOrder: f.sortOrder },
      create: { key: f.key, icon: f.icon, category: f.category, sortOrder: f.sortOrder, active: true },
    });
    for (const locale of LOCALES) {
      await prisma.featureTranslation.upsert({
        where: { featureId_locale: { featureId: feature.id, locale } },
        update: { name: f[locale].name, description: f[locale].description ?? null },
        create: { featureId: feature.id, locale, name: f[locale].name, description: f[locale].description ?? null },
      });
    }
  }
}

async function seedPlansAndPricing() {
  const countries = await prisma.country.findMany();
  const byCode = Object.fromEntries(countries.map((c) => [c.code, c]));

  for (const p of plansSeed) {
    const planData = {
      displayOrder: p.displayOrder,
      popular: !!p.popular,
      monthlyPrice: p.monthlyPrice,
      yearlyPrice: p.yearlyPrice,
      monthlyCompareAtPrice: p.monthlyCompareAtPrice ?? null,
      yearlyCompareAtPrice: p.yearlyCompareAtPrice ?? null,
      badgeKey: p.badgeKey ?? null,
      recommendedFor: p.recommendedFor ?? [],
    };
    const plan = await prisma.plan.upsert({
      where: { slug: p.slug },
      update: planData,
      create: { ...planData, slug: p.slug, active: true, ctaKey: "choosePlan" },
    });

    for (const locale of LOCALES) {
      await prisma.planTranslation.upsert({
        where: { planId_locale: { planId: plan.id, locale } },
        update: { ...p[locale] },
        create: { planId: plan.id, locale, ...p[locale] },
      });
    }

    let order = 0;
    for (const featureKey of p.features) {
      const feature = await prisma.feature.findUnique({ where: { key: featureKey } });
      if (!feature) continue;
      const limitValue = featureKey === "employees" && p.slug === "starter" ? "1" : null;
      await prisma.planFeatureAssignment.upsert({
        where: { planId_featureId: { planId: plan.id, featureId: feature.id } },
        update: { included: true, sortOrder: order, limitValue },
        create: { planId: plan.id, featureId: feature.id, included: true, sortOrder: order, limitValue },
      });
      order++;
    }

    // Country pricing rows — Egypt mirrors defaults, SA/AE use overrides.
    for (const country of countries) {
      if (country.code === "EG") continue; // falls back to plan defaults
      const override = countryPricingOverrides[country.code]?.find((o) => o.planSlug === p.slug);
      if (!override) continue;
      const data = {
        monthlyPrice: override.monthlyPrice,
        yearlyPrice: override.yearlyPrice,
        monthlyCompareAtPrice: override.monthlyCompareAtPrice ?? null,
        yearlyCompareAtPrice: override.yearlyCompareAtPrice ?? null,
      };
      await prisma.planCountryPricing.upsert({
        where: { planId_countryId: { planId: plan.id, countryId: byCode[country.code].id } },
        update: data,
        create: { planId: plan.id, countryId: byCode[country.code].id, ...data },
      });
    }
  }
}

async function seedGifts() {
  const plans = await prisma.plan.findMany();
  for (const g of giftsSeed) {
    const gift = await prisma.gift.upsert({
      where: { slug: g.slug },
      update: { icon: g.icon, sortOrder: g.sortOrder, yearlyOnly: true },
      create: { slug: g.slug, icon: g.icon, sortOrder: g.sortOrder, yearlyOnly: true, active: true },
    });
    for (const locale of LOCALES) {
      await prisma.giftTranslation.upsert({
        where: { giftId_locale: { giftId: gift.id, locale } },
        update: { name: g[locale].name, description: g[locale].description },
        create: { giftId: gift.id, locale, name: g[locale].name, description: g[locale].description },
      });
    }
    // Assigned to every plan initially — Admin changes assignments later.
    for (const plan of plans) {
      await prisma.planGift.upsert({
        where: { planId_giftId: { planId: plan.id, giftId: gift.id } },
        update: {},
        create: { planId: plan.id, giftId: gift.id },
      });
    }
  }
}

async function seedSections() {
  for (const s of [...sectionsSeed, ...extraSectionsSeed]) {
    const section = await prisma.marketingSection.upsert({
      where: { sectionKey: s.sectionKey },
      update: { sortOrder: s.sortOrder },
      create: { sectionKey: s.sectionKey, sortOrder: s.sortOrder, active: true },
    });
    for (const locale of LOCALES) {
      const t = s[locale];
      const data = {
        title: t.title,
        subtitle: t.subtitle ?? null,
        description: t.description ?? null,
        ctaLabel: t.ctaLabel ?? null,
        ctaHref: t.ctaHref ?? null,
      };
      await prisma.marketingSectionTranslation.upsert({
        where: { sectionId_locale: { sectionId: section.id, locale } },
        // Seed is the source of truth for EN/AR marketing copy — admin can
        // override afterwards per environment.
        update: data,
        create: { sectionId: section.id, locale, ...data },
      });
    }
  }
}

async function seedClients() {
  for (const c of clientsSeed) {
    const found = await prisma.client.findFirst({ where: { name: c.name } });
    if (found) {
      await prisma.client.update({
        where: { id: found.id },
        data: { countryCode: c.countryCode, websiteUrl: c.websiteUrl, category: c.category, sortOrder: c.sortOrder },
      });
    } else {
      await prisma.client.create({ data: { ...c, active: true } });
    }
  }
}

async function seedBlogPosts() {
  for (const p of [...blogPostsSeed, ...moreBlogPostsSeed]) {
    const publishedAt = new Date(Date.now() - p.publishedDaysAgo * 24 * 60 * 60 * 1000);
    const data = {
      authorName: p.authorName,
      category: p.category,
      tags: p.tags,
      featured: !!p.featured,
      displayOrder: p.publishedDaysAgo,
      seoTitle: p.seoTitle ?? null,
      seoDescription: p.seoDescription ?? null,
    };
    const post = await prisma.blogPost.upsert({
      where: { slug: p.slug },
      update: data,
      create: { ...data, slug: p.slug, published: true, publishedAt },
    });
    for (const locale of LOCALES) {
      const t = p[locale as "en" | "ar"];
      if (!t) continue;
      const tData = { title: t.title, excerpt: t.excerpt, content: t.content };
      await prisma.blogPostTranslation.upsert({
        where: { postId_locale: { postId: post.id, locale } },
        update: tData,
        create: { postId: post.id, locale, ...tData },
      });
    }
  }
}

async function seedTestimonials() {
  let order = 0;
  for (const t of testimonialsSeed) {
    const found = await prisma.testimonial.findFirst({
      where: { customerName: t.customerName, restaurantName: t.restaurantName },
    });
    const testimonial = found
      ? await prisma.testimonial.update({
          where: { id: found.id },
          data: { rating: t.rating, sortOrder: order, jobTitle: t.jobTitle ?? null, countryCode: t.countryCode ?? null },
        })
      : await prisma.testimonial.create({
          data: {
            customerName: t.customerName,
            restaurantName: t.restaurantName,
            rating: t.rating,
            sortOrder: order,
            jobTitle: t.jobTitle ?? null,
            countryCode: t.countryCode ?? null,
            active: true,
          },
        });
    for (const locale of LOCALES) {
      await prisma.testimonialTranslation.upsert({
        where: { testimonialId_locale: { testimonialId: testimonial.id, locale } },
        update: { quote: t[locale].quote },
        create: { testimonialId: testimonial.id, locale, quote: t[locale].quote },
      });
    }
    order++;
  }
}

async function seedFaqs() {
  let order = 0;
  for (const f of faqsSeed) {
    const found = await prisma.faq.findFirst({
      where: { translations: { some: { question: f.en.question } } },
    });
    const faq = found
      ? await prisma.faq.update({ where: { id: found.id }, data: { sortOrder: order } })
      : await prisma.faq.create({ data: { sortOrder: order, active: true } });
    for (const locale of LOCALES) {
      await prisma.faqTranslation.upsert({
        where: { faqId_locale: { faqId: faq.id, locale } },
        update: { question: f[locale].question, answer: f[locale].answer },
        create: { faqId: faq.id, locale, question: f[locale].question, answer: f[locale].answer },
      });
    }
    order++;
  }
}

async function seedStoryScenes() {
  for (const s of storyScenesSeed) {
    const scene = await prisma.storyScene.upsert({
      where: { sceneKey: s.sceneKey },
      update: { visual: s.visual, icon: s.icon ?? null, sortOrder: s.sortOrder },
      create: { sceneKey: s.sceneKey, visual: s.visual, icon: s.icon ?? null, sortOrder: s.sortOrder, active: true },
    });
    for (const locale of LOCALES) {
      const t = s[locale];
      const data = { kicker: t.kicker ?? null, title: t.title, body: t.body ?? null };
      await prisma.storySceneTranslation.upsert({
        where: { sceneId_locale: { sceneId: scene.id, locale } },
        update: data,
        create: { sceneId: scene.id, locale, ...data },
      });
    }
  }
}

async function seedSeo() {
  for (const e of seoEntriesSeed) {
    await prisma.seoEntry.upsert({
      where: { page_locale: { page: e.page, locale: e.locale } },
      update: e,
      create: e,
    });
  }
}

async function main() {
  console.log("Seeding RESTORA database…");
  await seedBranding();
  await seedCountries();
  await seedFeatures();
  await seedPlansAndPricing();
  await seedGifts();
  await seedSections();
  await seedStoryScenes();
  await seedTestimonials();
  await seedFaqs();
  await seedSeo();
  await seedClients();
  await seedBlogPosts();
  await seedSegmentPages();

  const counts = {
    countries: await prisma.country.count(),
    features: await prisma.feature.count(),
    plans: await prisma.plan.count(),
    gifts: await prisma.gift.count(),
    sections: await prisma.marketingSection.count(),
    storyScenes: await prisma.storyScene.count(),
    testimonials: await prisma.testimonial.count(),
    faqs: await prisma.faq.count(),
    seoEntries: await prisma.seoEntry.count(),
    countryPrices: await prisma.planCountryPricing.count(),
    clients: await prisma.client.count(),
    blogPosts: await prisma.blogPost.count(),
  };
  console.log("Seed complete:", counts);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
