import { useTranslations } from "next-intl";
import { CopyLink } from "@/src/components/site/copy-link";

function XIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-3.5" fill="currentColor" aria-hidden>
      <path d="M18.9 2H22l-6.8 7.8L23.2 22h-6.3l-4.9-6.4L6.4 22H3.3l7.3-8.3L1.6 2H8l4.4 5.9L18.9 2Zm-1.1 18.1h1.7L7.1 3.8H5.3l12.5 16.3Z" />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-3.5" fill="currentColor" aria-hidden>
      <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2c-1.5 0-3-.4-4.3-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.6-6.1c-.3-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.4-3c-.3-.4 0-.5.1-.7l.4-.5c.1-.2.2-.3.3-.5v-.5L9.6 7.4c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.9.9-1.1 2.1-.4 3.5a11 11 0 0 0 4.4 4.3c1.7.8 2.5.9 3.4.7.6-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.1-1.2l-.4-.3Z" />
    </svg>
  );
}

function TelegramIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-3.5" fill="currentColor" aria-hidden>
      <path d="M21.9 3.4 2.7 10.8c-1.3.5-1.3 1.3-.2 1.6l4.9 1.5 1.9 5.8c.2.6.1.9.8.9.5 0 .7-.2 1-.5l2.4-2.3 5 3.7c.9.5 1.6.2 1.8-.9l3.3-15.6c.3-1.3-.5-1.9-1.7-1.6ZM8.5 13.6l10.3-6.5c.5-.3 1-.1.6.2l-8.8 8-.3 3.4-1.8-5.1Z" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-3.5" fill="currentColor" aria-hidden>
      <path d="M14 8.5V6.8c0-.8.2-1.3 1.4-1.3H17V2.6h-2.6C11.2 2.6 10 4.4 10 6.6v1.9H8v3h2v9.9h4v-9.9h2.7l.3-3h-3Z" />
    </svg>
  );
}

/** Share row for blog articles: WhatsApp / X / Telegram / Facebook + copy link. */
export function ShareRow({ url, title }: { url: string; title: string }) {
  const t = useTranslations("Share");
  const text = encodeURIComponent(title);
  const link = encodeURIComponent(url);

  const items = [
    { label: "WhatsApp", href: `https://wa.me/?text=${text}%20${link}`, icon: <WhatsAppIcon /> },
    { label: "X", href: `https://twitter.com/intent/tweet?text=${text}&url=${link}`, icon: <XIcon /> },
    { label: "Telegram", href: `https://t.me/share/url?url=${link}&text=${text}`, icon: <TelegramIcon /> },
    { label: "Facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${link}`, icon: <FacebookIcon /> },
  ];

  return (
    <div className="mt-10 flex flex-wrap items-center gap-2 border-t border-border/60 pt-6">
      <span className="me-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {t("label")}
      </span>
      {items.map((s) => (
        <a
          key={s.label}
          href={s.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${t("label")} — ${s.label}`}
          className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
        >
          {s.icon}
          {s.label}
        </a>
      ))}
      <CopyLink url={url} />
    </div>
  );
}
