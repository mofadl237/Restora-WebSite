"use client";

import { useEffect, useState } from "react";
import { Link } from "@/src/i18n/navigation";
import { useTranslations } from "next-intl";

/**
 * Mobile conversion bar (§20): appears after the hero scrolls away.
 * Primary CTA → /pricing + quick WhatsApp contact. Desktop keeps the
 * floating bubble instead.
 */
export function StickyCta({ whatsappUrl }: { whatsappUrl?: string | null }) {
  const t = useTranslations("StickyCta");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 560);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 backdrop-blur transition-transform duration-300 md:hidden ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      aria-hidden={!visible}
    >
      <div className="flex items-center gap-2 p-2.5">
        {whatsappUrl && (
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="WhatsApp"
            className="grid size-11 shrink-0 place-items-center rounded-full bg-[#25D366] text-white"
          >
            <svg viewBox="0 0 24 24" className="size-6 fill-current" aria-hidden>
              <path d="M12 2a10 10 0 0 0-8.6 15L2 22l5-1.3A10 10 0 1 0 12 2Zm4.6 12.1c-.3-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.4-3c-.3-.4 0-.5.1-.7l.4-.5c.1-.2.2-.3.3-.5v-.5L9.6 7.4c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.9.9-1.1 2.1-.4 3.5a11 11 0 0 0 4.4 4.3c1.7.8 2.5.9 3.4.7.6-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.1-1.2l-.4-.3Z" />
            </svg>
          </a>
        )}
        <Link
          href="/pricing"
          className="flex h-11 flex-1 items-center justify-center rounded-full bg-[var(--brand-accent)] text-sm font-semibold text-accent-foreground shadow-lift"
        >
          {t("cta")}
        </Link>
      </div>
    </div>
  );
}
