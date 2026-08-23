import { prisma } from "@/src/lib/db";
import { StoryManager } from "@/src/components/admin/story-manager";

export default async function AdminStoryPage() {
  const scenes = await prisma.storyScene.findMany({
    orderBy: { sortOrder: "asc" },
    include: { translations: true },
  });

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-2xl font-semibold tracking-tight">Product story</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Scenes for the cinematic scroll-driven product story on the homepage.
          Each scene pairs copy with a product visual.
        </p>
      </header>

      <StoryManager
        scenes={scenes.map((s) => ({
          id: s.id,
          sceneKey: s.sceneKey,
          visual: s.visual,
          active: s.active,
          en: {
            kicker: s.translations.find((t) => t.locale === "en")?.kicker ?? "",
            title: s.translations.find((t) => t.locale === "en")?.title ?? "",
            body: s.translations.find((t) => t.locale === "en")?.body ?? "",
          },
          ar: {
            kicker: s.translations.find((t) => t.locale === "ar")?.kicker ?? "",
            title: s.translations.find((t) => t.locale === "ar")?.title ?? "",
            body: s.translations.find((t) => t.locale === "ar")?.body ?? "",
          },
        }))}
      />
    </div>
  );
}
