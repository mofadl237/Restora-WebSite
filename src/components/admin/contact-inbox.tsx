"use client";

import { useTransition } from "react";
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

export function ContactInbox({ items }: { items: SubmissionRow[] }) {
  const [isPending, startTransition] = useTransition();

  return (
    <div className={`space-y-4 ${isPending ? "opacity-60" : ""}`}>
      <ul className="space-y-3">
        {items.map((s) => (
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
        {items.length === 0 && (
          <li className="rounded-lg border border-dashed border-border p-6 text-sm text-muted-foreground">
            No submissions yet. Leads from the public contact form will appear here.
          </li>
        )}
      </ul>
    </div>
  );
}
