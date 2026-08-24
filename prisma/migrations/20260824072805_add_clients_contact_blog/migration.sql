-- AlterTable
ALTER TABLE "testimonials" ADD COLUMN     "countryCode" TEXT,
ADD COLUMN     "jobTitle" TEXT;

-- CreateTable
CREATE TABLE "clients" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "imageUrl" TEXT,
    "countryCode" TEXT,
    "websiteUrl" TEXT,
    "category" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "clients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contact_submissions" (
    "id" SERIAL NOT NULL,
    "fullName" TEXT NOT NULL,
    "countryCode" TEXT NOT NULL,
    "dialCode" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "businessType" TEXT,
    "message" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'NEW',
    "sourcePage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "contact_submissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "blog_posts" (
    "id" SERIAL NOT NULL,
    "slug" TEXT NOT NULL,
    "coverImage" TEXT,
    "authorName" TEXT NOT NULL,
    "category" TEXT NOT NULL DEFAULT 'general',
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "publishedAt" TIMESTAMP(3),
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "ogImage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "blog_posts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "blog_post_translations" (
    "id" SERIAL NOT NULL,
    "locale" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "excerpt" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "readingTime" INTEGER NOT NULL DEFAULT 1,
    "postId" INTEGER NOT NULL,

    CONSTRAINT "blog_post_translations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "clients_active_sortOrder_idx" ON "clients"("active", "sortOrder");

-- CreateIndex
CREATE INDEX "contact_submissions_status_createdAt_idx" ON "contact_submissions"("status", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "blog_posts_slug_key" ON "blog_posts"("slug");

-- CreateIndex
CREATE INDEX "blog_posts_published_publishedAt_idx" ON "blog_posts"("published", "publishedAt");

-- CreateIndex
CREATE INDEX "blog_post_translations_locale_idx" ON "blog_post_translations"("locale");

-- CreateIndex
CREATE UNIQUE INDEX "blog_post_translations_postId_locale_key" ON "blog_post_translations"("postId", "locale");

-- AddForeignKey
ALTER TABLE "blog_post_translations" ADD CONSTRAINT "blog_post_translations_postId_fkey" FOREIGN KEY ("postId") REFERENCES "blog_posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
