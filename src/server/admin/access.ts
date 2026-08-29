import { headers } from "next/headers";

/**
 * Server-side admin access gate.
 *
 * The admin routes live behind a secret URL segment (ADMIN_PATH). By default
 * (ADMIN_ACCESS_ENABLED not "true") that secret URL is the only gate — anyone
 * who knows it can reach the CMS.
 *
 * For stricter setups, set ADMIN_ACCESS_ENABLED=true and the CMS becomes
 * reachable ONLY from IPs listed in ADMIN_ALLOWED_IPS.
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
    // The secret ADMIN_PATH is the gate.
    return true;
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
