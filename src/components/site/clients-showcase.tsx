import { getTranslations } from "next-intl/server";
import { Reveal } from "@/src/components/site/reveal";
import { ClientsMarquee } from "@/src/components/site/clients-marquee";
import type { PublicClient } from "@/src/server/content";

/** Premium circular clients showcase — hidden entirely when no active clients. */
export async function ClientsShowcase({ clients }: { clients: PublicClient[] }) {
  if (clients.length === 0) return null;
  const t = await getTranslations("Clients");

  return (
    <section className="container-page py-20 md:py-24" aria-labelledby="clients-heading">
      <Reveal direction="up">
        <p className="text-center font-mono text-xs font-semibold uppercase tracking-[0.3em] text-primary">
          {t("kicker")}
        </p>
        <h2 id="clients-heading" className="mt-4 text-center font-display font-bold tracking-tight text-display-md">
          {t("title")}
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-balance text-center text-muted-foreground">
          {t("subtitle")}
        </p>
      </Reveal>

      <ClientsMarquee clients={clients} />
    </section>
  );
}
