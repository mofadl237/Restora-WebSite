"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Globe,
  LayoutDashboard,
  Palette,
  Tag,
  Sparkles,
  Gift,
  Clapperboard,
  PanelsTopLeft,
  Quote,
  HelpCircle,
  Search,
  Building2,
  Newspaper,
  Inbox,
} from "lucide-react";
import { cn } from "@/src/lib/utils";

const NAV_ITEMS = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/branding", label: "Branding", icon: Palette },
  { href: "/admin/countries", label: "Countries", icon: Globe },
  { href: "/admin/plans", label: "Plans", icon: Tag },
  { href: "/admin/features", label: "Features", icon: Sparkles },
  { href: "/admin/gifts", label: "Gifts", icon: Gift },
  { href: "/admin/story", label: "Product Story", icon: Clapperboard },
  { href: "/admin/sections", label: "Marketing Sections", icon: PanelsTopLeft },
  { href: "/admin/testimonials", label: "Testimonials", icon: Quote },
  { href: "/admin/clients", label: "Clients", icon: Building2 },
  { href: "/admin/blog", label: "Blog", icon: Newspaper },
  { href: "/admin/contact", label: "Contact inbox", icon: Inbox },
  { href: "/admin/faqs", label: "FAQs", icon: HelpCircle },
  { href: "/admin/seo", label: "SEO", icon: Search },
] as const;

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 hidden h-dvh w-60 shrink-0 flex-col border-e border-border bg-card md:flex">
      <div className="flex h-14 items-center gap-2.5 border-b border-border px-5">
        <span className="grid size-7 place-items-center rounded-md bg-primary font-display text-xs font-bold text-primary-foreground">
          R
        </span>
        <div className="leading-tight">
          <p className="text-sm font-semibold">RESTORA CMS</p>
          <p className="text-[11px] text-muted-foreground">Internal dashboard</p>
        </div>
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto p-3" aria-label="Admin">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active =
            href === "/admin" ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "group relative flex items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-colors",
                active
                  ? "bg-primary/10 font-medium text-primary"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground",
              )}
            >
              {active && (
                <span className="absolute inset-y-1.5 start-0 w-0.5 rounded-full bg-primary" aria-hidden />
              )}
              <Icon className="size-4 shrink-0" aria-hidden />
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
