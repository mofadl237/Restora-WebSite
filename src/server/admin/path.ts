/**
 * Secret admin URL segment.
 *
 * The CMS no longer lives at the guessable `/admin`. Set ADMIN_PATH in .env
 * to any name you like (e.g. `my-company-portal`) and open it as
 * `/{locale}/{ADMIN_PATH}`. Only this path renders the dashboard; every
 * other value for the segment returns a 404.
 */

function normalize(value: string | undefined): string {
  const v = (value ?? "admin").trim();
  return v.replace(/^\/+|\/+$/g, "").replace(/\s+/g, "-");
}

export const ADMIN_PATH = normalize(process.env.ADMIN_PATH);

/** URL-safe href for admin pages, e.g. `/my-secret/branding`. */
export function adminHref(subpath = "/") {
  const sub = subpath.startsWith("/") ? subpath : `/${subpath}`;
  return `/${ADMIN_PATH}${sub === "/" ? "" : sub}`;
}

/** Route pattern for revalidatePath() — mirrors the real file-system route. */
export function adminRoutePattern(subpath = "") {
  const sub = subpath.startsWith("/") ? subpath : `/${subpath}`;
  return `/[locale]/${ADMIN_PATH}${sub}`;
}