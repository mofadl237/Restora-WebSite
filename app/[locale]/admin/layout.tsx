import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft, ShieldAlert } from "lucide-react";
import { isAdminAllowed } from "@/src/server/admin/access";
import { AdminSidebar } from "@/src/components/admin/sidebar-nav";

export const metadata = {
  title: "RESTORA CMS",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const allowed = await isAdminAllowed();

  if (!allowed) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-background p-6">
        <div className="flex max-w-sm flex-col items-center gap-4 text-center">
          <span className="grid size-12 place-items-center rounded-full bg-destructive/12 text-destructive">
            <ShieldAlert className="size-6" aria-hidden />
          </span>
          <h1 className="font-display text-xl font-semibold">Admin access denied</h1>
          <p className="text-sm text-muted-foreground">
            This dashboard is restricted. Access is controlled server-side via
            the <code className="rounded bg-muted px-1 py-0.5 text-xs">ADMIN_ALLOWED_IPS</code> allowlist.
            If you believe this is an error, contact the platform owner.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
          >
            <ArrowLeft className="size-4" aria-hidden />
            Back to website
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-dvh">
      <AdminSidebar />
      <div className="min-w-0 flex-1">
        <main className="mx-auto w-full max-w-5xl p-5 md:p-8">{children}</main>
      </div>
    </div>
  );
}
