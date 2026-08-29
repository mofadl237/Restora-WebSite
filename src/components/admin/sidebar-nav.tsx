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
  { suffix: "", label: "Overview", icon: LayoutDashboard },
  { suffix: "/branding", label: "Branding", icon: Palette },
  { suffix: "/countries", label: "Countries", icon: Globe },
  { suffix: "/plans", label: "Plans", icon: Tag },
  { suffix: "/features", label: "Features", icon: Sparkles },
  { suffix: "/gifts", label: "Gifts", icon: Gift },
  { suffix: "/story", label: "Product Story", icon: Clapperboard },
  { suffix: "/sections", label: "Marketing Sections", icon: PanelsTopLeft },
  { suffix: "/testimonials", label: "Testimonials", icon: Quote },
  { suffix: "/clients", label: "Clients", icon: Building2 },
  { suffix: "/blog", label: "Blog", icon: Newspaper },
  { suffix: "/contact", label: "Contact inbox", icon: Inbox },
  { suffix: "/faqs", label: "FAQs", icon: HelpCircle },
  { suffix: "/seo", label: "SEO", icon: Search },
] as const;

export function AdminSidebar({ basePath }: { basePath: string }) {
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
        {NAV_ITEMS.map(({ suffix, label, icon: Icon }) => {
          const href = `${basePath}${suffix}`;
          const active = suffix === "" ? pathname === href : pathname.startsWith(href);
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
