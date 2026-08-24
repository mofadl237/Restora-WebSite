-- CreateTable
CREATE TABLE "segment_pages" (
    "id" SERIAL NOT NULL,
    "slug" TEXT NOT NULL,
    "planSlug" TEXT,
    "icon" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "segment_pages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "segment_page_translations" (
    "id" SERIAL NOT NULL,
    "locale" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "subtitle" TEXT,
    "description" TEXT NOT NULL,
    "problems" TEXT NOT NULL,
    "useCases" TEXT NOT NULL,
    "features" TEXT NOT NULL,
    "faqs" TEXT NOT NULL,
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "segmentId" INTEGER NOT NULL,

    CONSTRAINT "segment_page_translations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "segment_pages_slug_key" ON "segment_pages"("slug");

-- CreateIndex
CREATE INDEX "segment_page_translations_locale_idx" ON "segment_page_translations"("locale");

-- CreateIndex
CREATE UNIQUE INDEX "segment_page_translations_segmentId_locale_key" ON "segment_page_translations"("segmentId", "locale");

-- AddForeignKey
ALTER TABLE "segment_page_translations" ADD CONSTRAINT "segment_page_translations_segmentId_fkey" FOREIGN KEY ("segmentId") REFERENCES "segment_pages"("id") ON DELETE CASCADE ON UPDATE CASCADE;
