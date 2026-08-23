-- CreateTable
CREATE TABLE "story_scenes" (
    "id" SERIAL NOT NULL,
    "sceneKey" TEXT NOT NULL,
    "icon" TEXT,
    "visual" TEXT NOT NULL DEFAULT 'phone',
    "active" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "story_scenes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "story_scene_translations" (
    "id" SERIAL NOT NULL,
    "locale" TEXT NOT NULL,
    "kicker" TEXT,
    "title" TEXT NOT NULL,
    "body" TEXT,
    "sceneId" INTEGER NOT NULL,

    CONSTRAINT "story_scene_translations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "story_scenes_sceneKey_key" ON "story_scenes"("sceneKey");

-- CreateIndex
CREATE INDEX "story_scene_translations_locale_idx" ON "story_scene_translations"("locale");

-- CreateIndex
CREATE UNIQUE INDEX "story_scene_translations_sceneId_locale_key" ON "story_scene_translations"("sceneId", "locale");

-- AddForeignKey
ALTER TABLE "story_scene_translations" ADD CONSTRAINT "story_scene_translations_sceneId_fkey" FOREIGN KEY ("sceneId") REFERENCES "story_scenes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
