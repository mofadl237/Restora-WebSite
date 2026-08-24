"use client";

import { useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence, useMotionValueEvent, useScroll } from "framer-motion";
import { Button } from "@/src/components/ui/button";
import { Menu, X } from "lucide-react";

const LINKS = [
  { href: "#story", key: "howItWorks" },
  { href: "#pricing", key: "pricing" },
  { href: "#faq", key: "faq" },
  { href: "/blog", key: "blog" },
  { href: "/contact", key: "contact" },
] as const;

function NavLink({
  href,
  className,
  onClick,
  children,
}: {
  href: string;
  className?: string;
  onClick?: () => void;
  children: React.ReactNode;
}) {
  if (href.startsWith("#")) {
    return (
      <a href={href} className={className} onClick={onClick}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={className} onClick={onClick}>
      {children}
    </Link>
  );
}

/**
 * Sticky navbar: hides while scrolling down, returns on scroll up;
 * gains a solid blur backdrop once the page is scrolled.
 */
export function Navbar({ brandName }: { brandName: string }) {
  const t = useTranslations("Nav");
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setScrolled(y > 24);
    setHidden(y > prev && y > 160 && !open);
  });

  return (
    <motion.header
      animate={{ y: hidden ? "-100%" : "0%" }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className={`sticky top-0 z-50 transition-colors duration-300 ${
        scrolled || open
          ? "border-b border-border/60 bg-background/85 backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <nav className="container-page flex h-14 items-center gap-6" aria-label="Main">
        <Link href="/" className="flex items-center gap-2">
          <span className="grid size-7 place-items-center rounded-lg bg-primary font-display text-xs font-bold text-primary-foreground">
            R
          </span>
          <span className="font-display text-base font-bold tracking-tight">{brandName}</span>
        </Link>

        <ul className="ms-auto hidden items-center gap-1 md:flex">
          {LINKS.map(({ href, key }) => (
            <li key={key}>
              <NavLink
                href={href}
                className="rounded-full px-4 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              >
                {t(key)}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-2 md:flex">
          <Link href="#pricing">
            <Button size="sm" className="rounded-full">{t("getStarted")}</Button>
          </Link>
        </div>

        <button
          type="button"
          className="ms-auto rounded-md p-2 md:hidden"
          aria-expanded={open}
          aria-label={t("menu")}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="size-5" aria-hidden /> : <Menu className="size-5" aria-hidden />}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-t border-border bg-background md:hidden"
          >
            <ul className="container-page space-y-1 py-3">
              {LINKS.map(({ href, key }) => (
                <li key={key}>
                  <NavLink
                    href={href}
                    onClick={() => setOpen(false)}
                    className="block rounded-md px-3 py-2.5 text-sm hover:bg-secondary"
                  >
                    {t(key)}
                  </NavLink>
                </li>
              ))}
              <li className="pt-2">
                <Link href="#pricing" onClick={() => setOpen(false)} className="block">
                  <Button size="sm" className="w-full rounded-full">{t("getStarted")}</Button>
                </Link>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
