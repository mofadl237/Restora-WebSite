"use client";

import { useTranslations } from "next-intl";
import { useReducedMotion } from "framer-motion";

/** Floating WhatsApp CTA — rendered only when a whatsapp:// link exists in CMS. */
export function WhatsappFloat({ url }: { url: string }) {
  const t = useTranslations("WhatsApp");
  const reduced = useReducedMotion();

  return (
    <div className="fixed bottom-4 end-4 z-40 hidden md:block md:bottom-6 md:end-6">
      <span className="relative grid place-items-center">
        {!reduced && (
          <span
            className="absolute inset-0 animate-ping rounded-full bg-[#25D366]/30"
            aria-hidden
            style={{ animationDuration: "2.4s" }}
          />
        )}
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={t("label")}
          className="relative grid size-14 place-items-center rounded-full bg-[#25D366] text-white shadow-card transition-transform duration-300 hover:scale-105 motion-reduce:transition-none"
        >
          <svg viewBox="0 0 24 24" className="size-7 fill-current" aria-hidden>
            <path d="M12 2a10 10 0 0 0-8.6 15L2 22l5.2-1.4A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3.1.8.8-3-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.6-6.1c-.25-.13-1.48-.73-1.7-.81-.23-.08-.4-.13-.57.12-.17.25-.65.81-.8.98-.15.17-.3.19-.55.06a6.7 6.7 0 0 1-1.97-1.21 7.4 7.4 0 0 1-1.36-1.7c-.14-.24-.02-.38.11-.5.11-.11.25-.3.37-.44.13-.15.17-.25.25-.42.09-.17.04-.31-.02-.44-.06-.12-.56-1.35-.77-1.85-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.87.86-.87 2.1s.9 2.44 1.03 2.6c.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.47-.07 1.48-.6 1.69-1.18.21-.58.21-1.08.15-1.19-.06-.1-.23-.16-.48-.28z" />
          </svg>
        </a>
      </span>
    </div>
  );
}
