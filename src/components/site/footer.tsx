import Link from "next/link";
import type { PublicBranding, PublicSocialLink } from "@/src/server/branding";

const PLATFORM_ICONS: Record<string, string> = {
  facebook: "M13.5 9H16l.5-3h-3V4.5c0-.9.3-1.5 1.6-1.5H16.6V.2C16.3.2 15.3 0 14.1 0 11.6 0 10 1.5 10 4.2V6H7v3h3v9h3.5V9z",
  instagram: "M12 8.8A3.2 3.2 0 1 0 12 15.2 3.2 3.2 0 0 0 12 8.8zM12 6.8a5.2 5.2 0 1 1 0 10.4 5.2 5.2 0 0 1 0-10.4zm6.6-.2a1.2 1.2 0 1 1-2.4 0 1.2 1.2 0 0 1 2.4 0zM12 4c-2.2 0-2.5 0-3.3.05a4.6 4.6 0 0 0-3 1.1 4.6 4.6 0 0 0-1.1 3C4.5 9 4.5 9.3 4.5 12s0 3 .05 3.85a4.6 4.6 0 0 0 1.1 3 4.6 4.6 0 0 0 3 1.1C9.5 20 9.8 20 12 20s2.5 0 3.35-.05a4.6 4.6 0 0 0 3-1.1 4.6 4.6 0 0 0 1.1-3C19.5 15 19.5 14.7 19.5 12s0-3-.05-3.85a4.6 4.6 0 0 0-1.1-3 4.6 4.6 0 0 0-3-1.1C14.5 4 14.2 4 12 4z",
  x: "M17.8 3h3l-6.6 7.6L22 21h-6.1l-4.8-6.3L5.6 21h-3l7.1-8.1L2 3h6.3l4.3 5.7L17.8 3zm-1 16h1.7L7.4 4.7H5.6L16.8 19z",
  tiktok: "M19.6 7.3a5 5 0 0 1-3.4-1.3 5 5 0 0 1-1.6-3.2h-3.2v12.9a2.9 2.9 0 1 1-2.9-2.9c.3 0 .6 0 .9.1V9.6a6.2 6.2 0 0 0-.9-.06 6.1 6.1 0 1 0 6.1 6.1V9.9a8.2 8.2 0 0 0 4.9 1.6V8.3c0-.34-.03-.67-.1-1z",
};

export function Footer({
  branding,
  socialLinks,
}: {
  branding: PublicBranding;
  socialLinks: PublicSocialLink[];
}) {
  const year = new Date().getFullYear();

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
