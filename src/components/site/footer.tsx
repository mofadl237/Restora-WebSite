import { Link } from "@/src/i18n/navigation";
import { useTranslations } from "next-intl";
import type { PublicBranding, PublicSocialLink } from "@/src/server/branding";

const PLATFORM_ICONS: Record<string, string> = {
  facebook: "M13.5 9H16l.5-3h-3V4.5c0-.9.3-1.5 1.6-1.5H16.6V.2C16.3.2 15.3 0 14.1 0 11.6 0 10 1.5 10 4.2V6H7v3h3v9h3.5V9z",
  instagram: "M12 8.8A3.2 3.2 0 1 0 12 15.2 3.2 3.2 0 0 0 12 8.8zM12 6.8a5.2 5.2 0 1 1 0 10.4 5.2 5.2 0 0 1 0-10.4zm6.6-.2a1.2 1.2 0 1 1-2.4 0 1.2 1.2 0 0 1 2.4 0zM12 4c-2.2 0-2.5 0-3.3.05a4.6 4.6 0 0 0-3 1.1 4.6 4.6 0 0 0-1.1 3C4.5 9 4.5 9.3 4.5 12s0 3 .05 3.85a4.6 4.6 0 0 0 1.1 3 4.6 4.6 0 0 0 3 1.1C9.5 20 9.8 20 12 20s2.5 0 3.35-.05a4.6 4.6 0 0 0 3-1.1 4.6 4.6 0 0 0 1.1-3C19.5 15 19.5 14.7 19.5 12s0-3-.05-3.85a4.6 4.6 0 0 0-1.1-3 4.6 4.6 0 0 0-3-1.1C14.5 4 14.2 4 12 4z",
  x: "M17.8 3h3l-6.6 7.6L22 21h-6.1l-4.8-6.3L5.6 21h-3l7.1-8.1L2 3h6.3l4.3 5.7L17.8 3zm-1 16h1.7L7.4 4.7H5.6L16.8 19z",
  tiktok: "M19.6 7.3a5 5 0 0 1-3.4-1.3 5 5 0 0 1-1.6-3.2h-3.2v12.9a2.9 2.9 0 1 1-2.9-2.9c.3 0 .6 0 .9.1V9.6a6.2 6.2 0 0 0-.9-.06 6.1 6.1 0 1 0 6.1 6.1V9.9a8.2 8.2 0 0 0 4.9 1.6V8.3c0-.34-.03-.67-.1-1z",
  whatsapp:
    "M12 2a10 10 0 0 0-8.6 15L2 22l5.2-1.4A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3.1.8.8-3-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.6-6.1c-.25-.13-1.48-.73-1.7-.81-.23-.08-.4-.13-.57.12-.17.25-.65.81-.8.98-.15.17-.3.19-.55.06a6.7 6.7 0 0 1-1.97-1.21 7.4 7.4 0 0 1-1.36-1.7c-.14-.24-.02-.38.11-.5.11-.11.25-.3.37-.44.13-.15.17-.25.25-.42.09-.17.04-.31-.02-.44-.06-.12-.56-1.35-.77-1.85-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.87.86-.87 2.1s.9 2.44 1.03 2.6c.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.47-.07 1.48-.6 1.69-1.18.21-.58.21-1.08.15-1.19-.06-.1-.23-.16-.48-.28z",
  linkedin:
    "M4.98 3.5C4.98 4.88 3.87 6 2.5 6S.02 4.88.02 3.5 1.13 1 2.5 1s2.48 1.12 2.48 2.5zM.5 8h4v15h-4V8zm7.5 0h3.8v2.05h.06c.53-1 1.82-2.05 3.75-2.05 4.01 0 4.76 2.64 4.76 6.07V23h-4v-7.5c0-1.79-.03-4.09-2.49-4.09-2.5 0-2.88 1.95-2.88 3.96V23H8V8z",
  youtube:
    "M23 12s0-3.85-.49-5.68a3 3 0 0 0-2.11-2.11C18.57 3.72 12 3.72 12 3.72s-6.57 0-8.4.49A3 3 0 0 0 1.49 6.32C1 8.15 1 12 1 12s0 3.85.49 5.68a3 3 0 0 0 2.11 2.11c1.83.49 8.4.49 8.4.49s6.57 0 8.4-.49a3 3 0 0 0 2.11-2.11C23 15.85 23 12 23 12zM9.75 15.02V8.98L15.5 12l-5.75 3.02z",
  telegram:
    "M21.9 4.1c.3-1-0.8-1.8-1.7-1.4L2.4 9.9c-1 .4-.95 1.85.07 2.18l4.4 1.42 1.66 5.29c.29.92 1.46 1.13 2.05.37l2.33-3 4.33 3.19c.84.62 2.04.17 2.26-.85L21.9 4.1zM8.32 12.86l8.9-5.62c.22-.14.45.17.26.35l-7.24 6.57c-.26.24-.42.56-.46.91l-.25 2.02c-.03.26-.4.29-.47.04l-.96-3.13c-.11-.35.03-.73.33-.94z",
};

export function Footer({
  branding,
  socialLinks,
}: {
  branding: PublicBranding;
  socialLinks: PublicSocialLink[];
}) {
  const year = new Date().getFullYear();
  const t = useTranslations("Nav");

  return (
    <footer className="border-t border-border bg-secondary/30">
      <div className="container-page grid gap-10 py-12 md:grid-cols-3">
        <div>
          <p className="font-display text-lg font-bold">{branding.brandName}</p>
          {branding.address && (
            <p className="mt-3 max-w-xs text-sm text-muted-foreground">{branding.address}</p>
          )}
        </div>

        <div className="space-y-2 text-sm">
          {branding.contactEmail && (
            <p>
              <a href={`mailto:${branding.contactEmail}`} className="text-muted-foreground hover:text-foreground">
                {branding.contactEmail}
              </a>
            </p>
          )}
          {branding.contactPhone && (
            <p>
              <a href={`tel:${branding.contactPhone}`} className="text-muted-foreground hover:text-foreground" dir="ltr">
                {branding.contactPhone}
              </a>
            </p>
          )}
          <p>
            <Link href="/business" className="text-muted-foreground hover:text-foreground">
              {t("business")}
            </Link>
          </p>
        </div>

        {socialLinks.length > 0 && (
          <ul className="flex items-start gap-3 md:justify-end">
            {socialLinks.map((s) => (
              <li key={s.platform}>
                <a
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.platform}
                  className="grid size-9 place-items-center rounded-full border border-border bg-background transition-colors hover:bg-secondary"
                >
                  {PLATFORM_ICONS[s.platform] ? (
                    <svg viewBox="0 0 24 24" className="size-4 fill-current" aria-hidden>
                      <path d={PLATFORM_ICONS[s.platform]} />
                    </svg>
                  ) : (
                    <span className="text-[10px] font-semibold uppercase">{s.platform.slice(0, 2)}</span>
                  )}
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="border-t border-border/60">
        <div className="container-page flex flex-wrap items-center justify-between gap-2 py-4 text-xs text-muted-foreground">
          <p>© {year} {branding.brandName}</p>
          <Link href="/admin" className="hover:text-foreground">Admin</Link>
        </div>
      </div>
    </footer>
  );
}
