import { headers } from "next/headers";

/**
 * Server-side admin access gate.
 *
 * Rules:
 * - ADMIN_ACCESS_ENABLED=true → only IPs in ADMIN_ALLOWED_IPS may access.
 * - Otherwise → allowed in development only (local/private CMS), always
 *   denied in production until a real authentication system is wired in.
 *
 * Never expose this decision logic to the client; every admin page and
 * server action must call these helpers.
 */

function getAllowedIps(): string[] {
  return (process.env.ADMIN_ALLOWED_IPS ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

async function getClientIp(): Promise<string> {
  const h = await headers();
  const forwarded = h.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return h.get("x-real-ip") ?? "unknown";
}

export async function isAdminAllowed(): Promise<boolean> {
  const enabled = process.env.ADMIN_ACCESS_ENABLED === "true";

  if (!enabled) {
    // Local development convenience only; production stays locked.
    return process.env.NODE_ENV === "development";
  }

  const allowed = getAllowedIps();
  if (allowed.length === 0) return false;

  const ip = await getClientIp();
  return allowed.includes(ip);
}

export async function assertAdminAllowed(): Promise<void> {
  if (!(await isAdminAllowed())) {
    throw new Error("Admin access denied");
  }
}
