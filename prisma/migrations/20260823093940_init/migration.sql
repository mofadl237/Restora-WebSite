-- CreateTable
CREATE TABLE "branding" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "brandName" TEXT NOT NULL DEFAULT 'RESTORA',
    "logoUrl" TEXT,
    "faviconUrl" TEXT,
    "primaryColor" TEXT NOT NULL DEFAULT '#0e5f4b',
    "secondaryColor" TEXT NOT NULL DEFAULT '#123c33',
    "accentColor" TEXT NOT NULL DEFAULT '#e2a13c',
    "defaultLocale" TEXT NOT NULL DEFAULT 'ar',
    "contactEmail" TEXT,
    "contactPhone" TEXT,
    "whatsapp" TEXT,
    "address" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "branding_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "social_links" (
    "id" SERIAL NOT NULL,
    "platform" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "brandingId" INTEGER NOT NULL,

    CONSTRAINT "social_links_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "countries" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "currencyCode" TEXT NOT NULL,
    "currencySymbol" TEXT NOT NULL,
    "locale" TEXT,
    "dialCode" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "countries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "plans" (
    "id" SERIAL NOT NULL,
    "slug" TEXT NOT NULL,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "popular" BOOLEAN NOT NULL DEFAULT false,
    "monthlyPrice" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "yearlyPrice" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "monthlyCompareAtPrice" DECIMAL(12,2),
    "yearlyCompareAtPrice" DECIMAL(12,2),
    "ctaKey" TEXT NOT NULL DEFAULT 'choosePlan',
    "ctaUrl" TEXT,
    "badgeKey" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "plans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "plan_translations" (
    "id" SERIAL NOT NULL,
    "locale" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "shortDescription" TEXT NOT NULL,
    "longDescription" TEXT,
    "planId" INTEGER NOT NULL,

    CONSTRAINT "plan_translations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "plan_country_pricing" (
    "id" SERIAL NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "monthlyPrice" DECIMAL(12,2) NOT NULL,
    "yearlyPrice" DECIMAL(12,2) NOT NULL,
    "monthlyCompareAtPrice" DECIMAL(12,2),
    "yearlyCompareAtPrice" DECIMAL(12,2),
    "planId" INTEGER NOT NULL,
    "countryId" INTEGER NOT NULL,

    CONSTRAINT "plan_country_pricing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "features" (
    "id" SERIAL NOT NULL,
    "key" TEXT NOT NULL,
    "icon" TEXT,
    "category" TEXT NOT NULL DEFAULT 'general',
    "active" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "features_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "feature_translations" (
    "id" SERIAL NOT NULL,
    "locale" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "featureId" INTEGER NOT NULL,

    CONSTRAINT "feature_translations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "plan_feature_assignments" (
    "id" SERIAL NOT NULL,
    "included" BOOLEAN NOT NULL DEFAULT true,
    "limitValue" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "planId" INTEGER NOT NULL,
    "featureId" INTEGER NOT NULL,

    CONSTRAINT "plan_feature_assignments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "gifts" (
    "id" SERIAL NOT NULL,
    "slug" TEXT NOT NULL,
    "imageUrl" TEXT,
    "icon" TEXT,
    "yearlyOnly" BOOLEAN NOT NULL DEFAULT true,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "gifts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "gift_translations" (
    "id" SERIAL NOT NULL,
    "locale" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "giftId" INTEGER NOT NULL,

    CONSTRAINT "gift_translations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "plan_gifts" (
    "id" SERIAL NOT NULL,
    "planId" INTEGER NOT NULL,
    "giftId" INTEGER NOT NULL,

    CONSTRAINT "plan_gifts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "marketing_sections" (
    "id" SERIAL NOT NULL,
    "sectionKey" TEXT NOT NULL,
    "imageUrl" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "marketing_sections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "marketing_section_translations" (
    "id" SERIAL NOT NULL,
    "locale" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "subtitle" TEXT,
    "description" TEXT,
    "ctaLabel" TEXT,
    "ctaHref" TEXT,
    "sectionId" INTEGER NOT NULL,

    CONSTRAINT "marketing_section_translations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "testimonials" (
    "id" SERIAL NOT NULL,
    "customerName" TEXT NOT NULL,
    "restaurantName" TEXT,
    "imageUrl" TEXT,
    "rating" INTEGER NOT NULL DEFAULT 5,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "testimonials_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "testimonial_translations" (
    "id" SERIAL NOT NULL,
    "locale" TEXT NOT NULL,
    "quote" TEXT NOT NULL,
    "testimonialId" INTEGER NOT NULL,

    CONSTRAINT "testimonial_translations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "faqs" (
    "id" SERIAL NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "faqs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "faq_translations" (
    "id" SERIAL NOT NULL,
    "locale" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "faqId" INTEGER NOT NULL,

    CONSTRAINT "faq_translations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "seo_entries" (
    "id" SERIAL NOT NULL,
    "page" TEXT NOT NULL,
    "locale" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "keywords" TEXT,
    "canonical" TEXT,
    "robots" TEXT,
    "ogTitle" TEXT,
    "ogDescription" TEXT,
    "ogImage" TEXT,
    "twitterTitle" TEXT,
    "twitterDescription" TEXT,
    "twitterImage" TEXT,

    CONSTRAINT "seo_entries_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "social_links_active_sortOrder_idx" ON "social_links"("active", "sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "countries_code_key" ON "countries"("code");

-- CreateIndex
CREATE INDEX "countries_active_sortOrder_idx" ON "countries"("active", "sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "plans_slug_key" ON "plans"("slug");

-- CreateIndex
CREATE INDEX "plans_active_displayOrder_idx" ON "plans"("active", "displayOrder");

-- CreateIndex
CREATE INDEX "plan_translations_locale_idx" ON "plan_translations"("locale");

-- CreateIndex
CREATE UNIQUE INDEX "plan_translations_planId_locale_key" ON "plan_translations"("planId", "locale");

-- CreateIndex
CREATE UNIQUE INDEX "plan_country_pricing_planId_countryId_key" ON "plan_country_pricing"("planId", "countryId");

-- CreateIndex
CREATE UNIQUE INDEX "features_key_key" ON "features"("key");

-- CreateIndex
CREATE INDEX "features_category_sortOrder_idx" ON "features"("category", "sortOrder");

-- CreateIndex
CREATE INDEX "feature_translations_locale_idx" ON "feature_translations"("locale");

-- CreateIndex
CREATE UNIQUE INDEX "feature_translations_featureId_locale_key" ON "feature_translations"("featureId", "locale");

-- CreateIndex
CREATE INDEX "plan_feature_assignments_planId_sortOrder_idx" ON "plan_feature_assignments"("planId", "sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "plan_feature_assignments_planId_featureId_key" ON "plan_feature_assignments"("planId", "featureId");

-- CreateIndex
CREATE UNIQUE INDEX "gifts_slug_key" ON "gifts"("slug");

-- CreateIndex
CREATE INDEX "gifts_active_sortOrder_idx" ON "gifts"("active", "sortOrder");

-- CreateIndex
CREATE INDEX "gift_translations_locale_idx" ON "gift_translations"("locale");

-- CreateIndex
CREATE UNIQUE INDEX "gift_translations_giftId_locale_key" ON "gift_translations"("giftId", "locale");

-- CreateIndex
CREATE UNIQUE INDEX "plan_gifts_planId_giftId_key" ON "plan_gifts"("planId", "giftId");

-- CreateIndex
CREATE UNIQUE INDEX "marketing_sections_sectionKey_key" ON "marketing_sections"("sectionKey");

-- CreateIndex
CREATE INDEX "marketing_section_translations_locale_idx" ON "marketing_section_translations"("locale");

-- CreateIndex
CREATE UNIQUE INDEX "marketing_section_translations_sectionId_locale_key" ON "marketing_section_translations"("sectionId", "locale");

-- CreateIndex
CREATE INDEX "testimonials_active_sortOrder_idx" ON "testimonials"("active", "sortOrder");

-- CreateIndex
CREATE INDEX "testimonial_translations_locale_idx" ON "testimonial_translations"("locale");

-- CreateIndex
CREATE UNIQUE INDEX "testimonial_translations_testimonialId_locale_key" ON "testimonial_translations"("testimonialId", "locale");

-- CreateIndex
CREATE INDEX "faqs_active_sortOrder_idx" ON "faqs"("active", "sortOrder");

-- CreateIndex
CREATE INDEX "faq_translations_locale_idx" ON "faq_translations"("locale");

-- CreateIndex
CREATE UNIQUE INDEX "faq_translations_faqId_locale_key" ON "faq_translations"("faqId", "locale");

-- CreateIndex
CREATE INDEX "seo_entries_page_idx" ON "seo_entries"("page");

-- CreateIndex
CREATE UNIQUE INDEX "seo_entries_page_locale_key" ON "seo_entries"("page", "locale");

-- AddForeignKey
ALTER TABLE "social_links" ADD CONSTRAINT "social_links_brandingId_fkey" FOREIGN KEY ("brandingId") REFERENCES "branding"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "plan_translations" ADD CONSTRAINT "plan_translations_planId_fkey" FOREIGN KEY ("planId") REFERENCES "plans"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "plan_country_pricing" ADD CONSTRAINT "plan_country_pricing_planId_fkey" FOREIGN KEY ("planId") REFERENCES "plans"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "plan_country_pricing" ADD CONSTRAINT "plan_country_pricing_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "countries"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "feature_translations" ADD CONSTRAINT "feature_translations_featureId_fkey" FOREIGN KEY ("featureId") REFERENCES "features"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "plan_feature_assignments" ADD CONSTRAINT "plan_feature_assignments_planId_fkey" FOREIGN KEY ("planId") REFERENCES "plans"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "plan_feature_assignments" ADD CONSTRAINT "plan_feature_assignments_featureId_fkey" FOREIGN KEY ("featureId") REFERENCES "features"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gift_translations" ADD CONSTRAINT "gift_translations_giftId_fkey" FOREIGN KEY ("giftId") REFERENCES "gifts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "plan_gifts" ADD CONSTRAINT "plan_gifts_planId_fkey" FOREIGN KEY ("planId") REFERENCES "plans"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "plan_gifts" ADD CONSTRAINT "plan_gifts_giftId_fkey" FOREIGN KEY ("giftId") REFERENCES "gifts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "marketing_section_translations" ADD CONSTRAINT "marketing_section_translations_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "marketing_sections"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "testimonial_translations" ADD CONSTRAINT "testimonial_translations_testimonialId_fkey" FOREIGN KEY ("testimonialId") REFERENCES "testimonials"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "faq_translations" ADD CONSTRAINT "faq_translations_faqId_fkey" FOREIGN KEY ("faqId") REFERENCES "faqs"("id") ON DELETE CASCADE ON UPDATE CASCADE;
