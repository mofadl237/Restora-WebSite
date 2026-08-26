"use client";

import { useState } from "react";
import { Link } from "@/src/i18n/navigation";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence, useMotionValueEvent, useScroll } from "framer-motion";
import { Button } from "@/src/components/ui/button";
import { Menu, X } from "lucide-react";
import { ThemeToggle } from "@/src/components/site/theme-toggle";
import { LanguageSwitcher } from "@/src/components/site/language-switcher";

/**
 * Minimal first-class destinations only — homepage storytelling sections
 * stay on the page, not in the nav (see execution plan §34).
 */
const LINKS = [
  { href: "/", key: "home" },
  { href: "/business", key: "business" },
  { href: "/pricing", key: "pricing" },
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
  return (
    <Link href={href} className={className} onClick={onClick}>
      {children}
    </Link>
  );
}

/**
 * Premium sticky navbar: hides scrolling down, returns on scroll up;
 * glass blur once scrolled; language + theme + one strong conversion CTA.
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
      className={`sticky top-0 z-50 transition-[background-color,border-color,box-shadow] duration-300 ${
        scrolled || open
          ? "border-b border-border/60 bg-background/75 shadow-[0_8px_32px_-24px_rgb(0_0_0/0.4)] backdrop-blur-xl"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <nav className="container-page flex h-16 items-center gap-3 md:h-16" aria-label="Main">
        {/* Logo */}
        <Link href="/" className="group flex items-center gap-2.5" aria-label={brandName}>
          <span className="grid size-8 place-items-center rounded-xl bg-primary font-display text-sm font-bold text-primary-foreground shadow-card transition-transform duration-300 group-hover:-rotate-6 motion-reduce:transition-none">
            R
          </span>
          <span className="font-display text-lg font-bold tracking-tight">{brandName}</span>
        </Link>

        {/* Desktop links */}
        <ul className="ms-auto hidden items-center gap-0.5 lg:flex">
          {LINKS.map(({ href, key }) => (
            <li key={key}>
              <NavLink
                href={href}
                className="relative rounded-full px-3.5 py-2 text-sm text-muted-foreground transition-colors after:absolute after:inset-x-3.5 after:-bottom-px after:h-px after:origin-center after:scale-x-0 after:bg-primary after:transition-transform after:duration-300 hover:text-foreground hover:after:scale-x-100 motion-reduce:after:hidden"
              >
                {t(key)}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Right cluster */}
        <div className="ms-auto flex items-center gap-2 lg:ms-6">
          <LanguageSwitcher />
          <ThemeToggle />
          <Link href="/contact" className="hidden sm:block">
            <Button size="sm" className="rounded-full px-5 shadow-card transition-shadow hover:shadow-glow">
              {t("getStarted")}
            </Button>
          </Link>
          <button
            type="button"
            className="rounded-md p-2 lg:hidden"
            aria-expanded={open}
            aria-label={t("menu")}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="size-5" aria-hidden /> : <Menu className="size-5" aria-hidden />}
          </button>
        </div>
      </nav>

      {/* Mobile sheet */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-t border-border bg-background/95 backdrop-blur-xl lg:hidden"
          >
            <ul className="container-page space-y-1 py-4">
              {LINKS.map(({ href, key }) => (
                <li key={key}>
                  <NavLink
                    href={href}
                    onClick={() => setOpen(false)}
                    className="block rounded-xl px-3 py-2.5 text-base hover:bg-secondary"
                  >
                    {t(key)}
                  </NavLink>
                </li>
              ))}
              <li className="flex items-center justify-between rounded-xl px-3 py-1">
                <LanguageSwitcher variant="mobile" />
              </li>
              <li className="flex items-center justify-between rounded-xl px-3 py-2">
                <span className="text-sm text-muted-foreground">{t("theme")}</span>
                <ThemeToggle />
              </li>
              <li className="pt-2">
                <Link href="/contact" onClick={() => setOpen(false)} className="block">
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
