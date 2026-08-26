"use client";

import { useMemo, useState, useTransition } from "react";
import { deleteSubmission, setSubmissionStatus } from "@/src/server/actions/contact";
import { Button } from "@/src/components/ui/button";
import { Badge } from "@/src/components/ui/badge";
import { Trash2 } from "lucide-react";

export type SubmissionRow = {
  id: number;
  fullName: string;
  countryCode: string;
  dialCode: string;
  phone: string;
  email: string | null;
  businessType: string | null;
  selectedPlan: string | null;
  locale?: string | null;
  message: string;
  status: string;
  createdAt: string;
};

const STATUS_STYLES: Record<string, string> = {
  NEW: "bg-primary/10 text-primary",
  CONTACTED: "bg-secondary text-secondary-foreground",
  QUALIFIED: "bg-success/10 text-success",
  CLOSED: "bg-muted text-muted-foreground",
};

export function ContactInbox({
  items,
  planNames = {},
}: {
  items: SubmissionRow[];
  /** slug → localized plan name resolved from the DB (admin locale) */
  planNames?: Record<string, string>;
}) {
  const [isPending, startTransition] = useTransition();
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [planFilter, setPlanFilter] = useState("ALL");

  // Plan filter options come from the actual submissions (real DB plan slugs),
  // displayed with their localized names from the plans table.
  const planOptions = useMemo(
    () =>
      Array.from(
        new Map(
          items
            .map((i) => i.selectedPlan)
            .filter((slug): slug is string => Boolean(slug))
            .map((slug) => [slug, planNames[slug] ?? slug]),
        ).entries(),
      ),
    [items, planNames],
  );

  const filtered = items.filter(
    (s) =>
      (statusFilter === "ALL" || s.status === statusFilter) &&
      (planFilter === "ALL" || s.selectedPlan === planFilter),
  );

  return (
    <div className={`space-y-4 ${isPending ? "opacity-60" : ""}`}>
      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          aria-label="Filter by status"
          className="h-9 rounded-md border border-border bg-background px-2 text-sm"
        >
          {["ALL", "NEW", "CONTACTED", "QUALIFIED", "CLOSED"].map((st) => (
            <option key={st} value={st}>{st}</option>
          ))}
        </select>
        <select
          value={planFilter}
          onChange={(e) => setPlanFilter(e.target.value)}
          aria-label="Filter by plan"
          className="h-9 rounded-md border border-border bg-background px-2 text-sm"
        >
          <option value="ALL">All plans</option>
          {planOptions.map(([slug, name]) => (
            <option key={slug} value={slug}>{name}</option>
          ))}
        </select>
      </div>

      <ul className="space-y-3">
        {filtered.map((s) => (
          <li key={s.id} className="rounded-lg border border-border bg-card p-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-medium">{s.fullName}</span>
              <Badge variant="outline">
                <span dir="ltr">
                  {s.countryCode} · {s.dialCode} {s.phone}
                </span>
              </Badge>
              {s.businessType && (
                <span className="text-sm text-muted-foreground">· {s.businessType}</span>
              )}
              {s.selectedPlan && (
                <Badge variant="outline" className="bg-primary/10 text-primary">
                  ★ {planNames[s.selectedPlan] ?? s.selectedPlan}
                </Badge>
              )}
              {s.locale && <Badge variant="outline">{s.locale}</Badge>}
              <Badge className={`border-0 ${STATUS_STYLES[s.status] ?? ""}`}>{s.status}</Badge>
              <span className="text-xs text-muted-foreground">{s.createdAt}</span>

              <div className="ms-auto flex items-center gap-2">
                <select
                  value={s.status}
                  onChange={(e) =>
                    startTransition(async () => {
                      await setSubmissionStatus(s.id, e.target.value);
                    })
                  }
                  aria-label={`Status for ${s.fullName}`}
                  className="h-8 rounded-md border border-border bg-background px-2 text-xs"
                >
                  {["NEW", "CONTACTED", "QUALIFIED", "CLOSED"].map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-destructive"
                  onClick={() =>
                    startTransition(async () => {
                      await deleteSubmission(s.id);
                    })
                  }
                  aria-label={`Delete submission from ${s.fullName}`}
                >
                  <Trash2 className="size-4" aria-hidden />
                </Button>
              </div>
            </div>
            {s.email && (
              <p className="mt-1 text-sm text-muted-foreground" dir="ltr">
                ✉ {s.email}
              </p>
            )}
            <p className="mt-2 whitespace-pre-line text-sm text-card-foreground/90">{s.message}</p>
          </li>
        ))}
        {filtered.length === 0 && (
          <li className="rounded-lg border border-dashed border-border p-6 text-sm text-muted-foreground">
            No submissions match the current filters.
          </li>
        )}
      </ul>
    </div>
  );
}
