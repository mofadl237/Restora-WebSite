import { cn } from "@/src/lib/utils";

/* ---------------------------------------------------------------------------
   Decorative product-UI illustrations used across the marketing site.
   Pure DOM (no images) so they stay crisp on every display, adapt to
   light/dark + RTL automatically, and inherit brand CSS variables.
   Demo values are illustrative UI filler only — never commercial claims.
--------------------------------------------------------------------------- */

const DEMO_DISHES = [
  { name: "Mixed Grill", price: "220", hue: 28 },
  { name: "Margherita", price: "95", hue: 8 },
  { name: "Caesar Salad", price: "70", hue: 120 },
  { name: "Cheese Burger", price: "110", hue: 40 },
];

const DEMO_ORDERS = [
  { id: "#1287", table: "T4", items: 3 },
  { id: "#1286", table: "T9", items: 2 },
  { id: "#1285", table: "Delivery", items: 5 },
];

function Frame({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-border bg-card shadow-lift",
        className,
      )}
    >
      {children}
    </div>
  );
}

/** Browser-style chrome wrapper */
export function BrowserFrame({ url = "app.restora.com", className, children }: {
  url?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Frame className={className}>
      <div className="flex items-center gap-2 border-b border-border bg-secondary/60 px-3 py-2">
        <span className="size-2.5 rounded-full bg-destructive/70" aria-hidden />
        <span className="size-2.5 rounded-full bg-warning/80" aria-hidden />
        <span className="size-2.5 rounded-full bg-success/80" aria-hidden />
        <span className="mx-auto rounded-md bg-background px-6 py-0.5 text-[10px] text-muted-foreground" dir="ltr">
          {url}
        </span>
      </div>
      {children}
    </Frame>
  );
}

/** KPI stat tile */
function Kpi({ label, value, delta }: { label: string; value: string; delta?: string }) {
  return (
    <div className="rounded-lg border border-border bg-background p-3">
      <p className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</p>
      <div className="mt-1 flex items-baseline gap-1.5">
        <span className="font-display text-lg font-bold leading-none">{value}</span>
        {delta && <span className="text-[10px] font-semibold text-success">{delta}</span>}
      </div>
    </div>
  );
}

/** Full RESTORA operations dashboard illustration */
export function DashboardMockup({ compact = false }: { compact?: boolean }) {
  const bars = [42, 68, 55, 84, 62, 92, 74];
  return (
    <BrowserFrame>
      <div className="flex" dir="ltr">
        {/* Sidebar */}
        <div className="hidden w-32 shrink-0 flex-col gap-1 border-e border-border p-3 sm:flex">
          <div className="mb-3 flex items-center gap-1.5 px-1">
            <span className="grid size-6 place-items-center rounded-md bg-primary font-display text-[11px] font-bold text-primary-foreground">R</span>
            <span className="text-xs font-semibold tracking-tight">RESTORA</span>
          </div>
          {["Overview", "Orders", "Menu", "Delivery", "Analytics"].map((item, i) => (
            <span
              key={item}
              className={cn(
                "rounded-md px-2 py-1.5 text-[11px]",
                i === 0 ? "bg-primary/10 font-medium text-primary" : "text-muted-foreground",
              )}
            >
              {item}
            </span>
          ))}
        </div>

        {/* Main */}
        <div className="min-w-0 flex-1 space-y-3 p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold">Today</p>
              <p className="text-[10px] text-muted-foreground">Friday · Live overview</p>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-2 py-1 text-[10px] font-medium text-success">
              <span className="size-1.5 animate-pulse-dot rounded-full bg-success" aria-hidden />
              Live
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <Kpi label="Orders" value="86" delta="+18%" />
            <Kpi label="Revenue" value="24.6K" delta="+12%" />
            <Kpi label="Avg. time" value="14m" delta="-8%" />
          </div>

          {/* Chart */}
          <div className="rounded-lg border border-border bg-background p-3">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-[10px] font-medium text-muted-foreground">Orders by hour</p>
            </div>
            <div className="flex h-20 items-end gap-1.5 md:h-24" data-mockup="bars">
              {bars.map((h, i) => (
                <div key={i} className="mock-bar flex-1 rounded-t-sm bg-primary/85" style={{ height: `${h}%`, opacity: i === 5 ? 1 : 0.35 }} aria-hidden />
              ))}
            </div>
          </div>

          {!compact && (
            <div className="space-y-1.5 rounded-lg border border-border bg-background p-3" data-mockup="feed">
              {DEMO_ORDERS.map((o) => (
                <div key={o.id} className="flex items-center justify-between rounded-md bg-card px-2 py-1.5 text-[10px]">
                  <span className="font-mono">{o.id}</span>
                  <span className="text-muted-foreground">{o.table}</span>
                  <span>{o.items} items</span>
                  <span className="rounded-full bg-success/15 px-1.5 py-0.5 font-medium text-success">new</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </BrowserFrame>
  );
}

/** Phone frame */
export function PhoneFrame({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={cn("relative", className)}>
      <div className="overflow-hidden rounded-[2rem] border-[6px] border-foreground/90 bg-card shadow-lift">
        <div className="relative mx-auto mt-2 h-4 w-16 rounded-full bg-foreground/90" aria-hidden />
        <div className="aspect-[9/17] overflow-hidden">{children}</div>
        <div className="mx-auto mb-1.5 h-1 w-20 rounded-full bg-foreground/30" aria-hidden />
      </div>
    </div>
  );
}

/** QR scan moment — floating over table scene */
export function QrBadge({ className }: { className?: string }) {
  return (
    <div className={cn("rounded-2xl border border-border bg-card p-3 shadow-lift", className)}>
      <svg viewBox="0 0 64 64" className="size-16" aria-hidden>
        <rect width="64" height="64" rx="8" fill="none" stroke="currentColor" strokeOpacity="0.25" strokeWidth="2" />
        {[
          [4, 4], [44, 4], [4, 44],
        ].map(([x, y]) => (
          <g key={`${x}-${y}`}>
            <rect x={x} y={y} width="16" height="16" rx="3" fill="currentColor" fillOpacity="0.9" />
            <rect x={x + 4} y={y + 4} width="8" height="8" rx="2" fill="var(--card)" />
            <rect x={x + 6} y={y + 6} width="4" height="4" rx="1" fill="currentColor" fillOpacity="0.9" />
          </g>
        ))}
        {[24, 34].map((y) =>
          [24, 34].map((x) => (
            <rect key={`${x}-${y}`} x={x} y={y} width="6" height="6" rx="1" fill="currentColor" fillOpacity={((x + y) / 10) % 2 ? 0.75 : 0.35} />
          )),
        )}
      </svg>
    </div>
  );
}

/** Phone showing the digital QR menu */
export function PhoneMenuScreen() {
  return (
    <div className="flex h-full flex-col">
      {/* header */}
      <div className="bg-gradient-to-br from-[color-mix(in_srgb,var(--brand-primary)_88%,black)] to-[var(--brand-secondary)] p-3 pb-8 text-primary-foreground">
        <div className="flex items-center gap-2">
          <span className="grid size-8 place-items-center rounded-lg bg-white/15 font-display text-xs font-bold backdrop-blur">R</span>
          <div>
            <p className="text-xs font-semibold">Nile Breeze</p>
            <p className="text-[9px] opacity-70">Digital menu</p>
          </div>
          <span className="ms-auto inline-flex items-center gap-1 rounded-full bg-white/15 px-1.5 py-0.5 text-[8px] font-medium backdrop-blur">
            <span className="size-1 animate-pulse-dot rounded-full bg-[#4ade80]" aria-hidden /> Open
          </span>
        </div>
      </div>

      {/* categories */}
      <div className="-mt-4 flex gap-1.5 overflow-hidden px-3">
        {["All", "Grill", "Pizza", "Drinks"].map((c, i) => (
          <span key={c} className={cn("whitespace-nowrap rounded-full px-2 py-1 text-[9px] font-medium", i === 0 ? "bg-primary text-primary-foreground" : "border border-border bg-background text-muted-foreground")}>
            {c}
          </span>
        ))}
      </div>

      {/* dishes */}
      <div className="mt-2 flex-1 space-y-2 overflow-hidden px-3">
        {DEMO_DISHES.map((d) => (
          <div key={d.name} className="flex items-center gap-2 rounded-xl border border-border bg-background p-1.5">
            <span
              className="size-9 shrink-0 rounded-lg"
              style={{ background: `linear-gradient(135deg, hsl(${d.hue} 42% 58%), hsl(${d.hue + 22} 48% 42%))` }}
              aria-hidden
            />
            <div className="min-w-0 flex-1">
              <p className="truncate text-[10px] font-medium">{d.name}</p>
              <p className="text-[9px] text-muted-foreground">{d.price}</p>
            </div>
            <span className="grid size-6 place-items-center rounded-full bg-accent text-[11px] font-bold text-accent-foreground" aria-hidden>+</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Phone showing cart → order placed */
export function PhoneOrderScreen({ done = false }: { done?: boolean }) {
  if (done) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 p-6 text-center">
        <span className="grid size-14 place-items-center rounded-full bg-success/15">
          <svg viewBox="0 0 24 24" className="size-7 text-success" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M4 12.5l5 5L20 6.5" className="order-check" />
          </svg>
        </span>
        <p className="text-sm font-semibold">Order placed!</p>
        <p className="text-[10px] text-muted-foreground">#1287 · The kitchen is on it</p>
        <span className="mt-1 h-1 w-24 overflow-hidden rounded-full bg-muted" aria-hidden>
          <span className="block h-full w-1/3 rounded-full bg-primary" style={{ marginInlineStart: 0 }} />
        </span>
      </div>
    );
  }
  return (
    <div className="flex h-full flex-col p-3 pt-5">
      <p className="text-xs font-semibold">Your order</p>
      <div className="mt-2 space-y-2">
        {DEMO_DISHES.slice(0, 3).map((d) => (
          <div key={d.name} className="flex items-center gap-2 rounded-xl border border-border bg-background p-1.5 text-[10px]">
            <span className="grid size-5 place-items-center rounded-md bg-primary/10 font-semibold text-primary">1</span>
            <span className="flex-1 truncate">{d.name}</span>
            <span className="text-muted-foreground">{d.price}</span>
          </div>
        ))}
      </div>
      <div className="mt-auto space-y-2">
        <div className="flex justify-between border-t border-dashed border-border pt-2 text-[11px] font-semibold">
          <span>Total</span>
          <span>385</span>
        </div>
        <div className="rounded-lg bg-primary py-2 text-center text-[11px] font-semibold text-primary-foreground">
          Place order
        </div>
      </div>
    </div>
  );
}

/** Analytics-focused visual */
export function AnalyticsMockup() {
  const top = [
    { name: "Mixed Grill", pct: 92 },
    { name: "Pepperoni Pizza", pct: 74 },
    { name: "Cheese Burger", pct: 61 },
  ];
  return (
    <BrowserFrame url="app.restora.com/analytics">
      <div className="space-y-3 p-3" dir="ltr">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold">Analytics</p>
          <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">Last 7 days</span>
        </div>

        {/* Line chart */}
        <div className="rounded-lg border border-border bg-background p-3">
          <svg viewBox="0 0 200 64" className="h-20 w-full" preserveAspectRatio="none" aria-hidden>
            <path
              d="M0 52 C 20 50, 26 40, 42 42 S 66 54, 82 46 S 108 20, 124 26 S 152 34, 168 18 S 190 10, 200 8"
              fill="none"
              stroke="var(--brand-primary)"
              strokeWidth="2.5"
              strokeLinecap="round"
              className="chart-line"
            />
            <path
              d="M0 56 C 24 56, 30 48, 48 50 S 78 58, 96 52 S 126 36, 144 40 S 176 44, 200 30"
              fill="none"
              stroke="var(--brand-accent)"
              strokeWidth="2"
              strokeDasharray="4 4"
              strokeLinecap="round"
              className="chart-line-2"
            />
          </svg>
          <div className="mt-1 flex justify-between text-[9px] text-muted-foreground">
            <span>Mon</span><span>Wed</span><span>Fri</span><span>Sun</span>
          </div>
        </div>

        {/* Top items */}
        <div className="space-y-1.5 rounded-lg border border-border bg-background p-3">
          <p className="text-[10px] font-medium text-muted-foreground">Top sellers</p>
          {top.map((t, i) => (
            <div key={t.name} className="flex items-center gap-2 text-[10px]">
              <span className={cn("grid size-5 place-items-center rounded-md font-bold", i === 0 ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground")}>
                {i + 1}
              </span>
              <span className="w-20 shrink-0 truncate">{t.name}</span>
              <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                <span className="mock-bar block h-full rounded-full bg-primary" style={{ width: `${t.pct}%` }} />
              </span>
              <span className="font-mono text-muted-foreground">{t.pct}%</span>
            </div>
          ))}
        </div>
      </div>
    </BrowserFrame>
  );
}

/** Growth / multi-branch visual */
export function GrowthMockup() {
  const branches = [
    { name: "Zamalek", orders: "128", up: true },
    { name: "New Cairo", orders: "94", up: true },
    { name: "Alexandria", orders: "61", up: true },
  ];
  return (
    <BrowserFrame url="app.restora.com/branches">
      <div className="space-y-3 p-3" dir="ltr">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold">Branches</p>
          <span className="inline-flex items-center gap-1 rounded-full bg-success/10 px-2 py-0.5 text-[10px] font-semibold text-success">
            <svg viewBox="0 0 24 24" className="size-3" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden>
              <path d="M4 18 L10 12 L14 15 L20 6" />
              <path d="M14 6 h6 v6" />
            </svg>
            +38% growth
          </span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {branches.map((b) => (
            <div key={b.name} className="rounded-lg border border-border bg-background p-2.5 text-center">
              <span className="mx-auto mb-1.5 grid size-7 place-items-center rounded-full bg-primary/10 text-primary">
                <svg viewBox="0 0 24 24" className="mx-auto size-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                  <path d="M12 21s-7-5.5-7-11a7 7 0 1 1 14 0c0 5.5-7 11-7 11z" />
                  <circle cx="12" cy="10" r="2.5" />
                </svg>
              </span>
              <p className="truncate text-[10px] font-medium">{b.name}</p>
              <p className="text-[9px] text-muted-foreground">{b.orders} orders today</p>
            </div>
          ))}
        </div>
        <div className="rounded-lg border border-border bg-background p-3">
          <div className="flex h-16 items-end gap-1.5" data-mockup="bars">
            {[30, 45, 38, 58, 66, 80, 96].map((h, i) => (
              <div key={i} className="mock-bar flex-1 rounded-t-sm bg-gradient-to-t from-primary/50 to-primary" style={{ height: `${h}%` }} aria-hidden />
            ))}
          </div>
        </div>
      </div>
    </BrowserFrame>
  );
}
