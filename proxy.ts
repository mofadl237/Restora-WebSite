import createMiddleware from "next-intl/middleware";
import { routing } from "./src/i18n/routing";
import { NextRequest } from "next/server";

export default function proxy(req: NextRequest) {
  return createMiddleware(routing)(req);
}

export const config = {
  matcher: [
    // Match root
    "/",
    // Match all localized paths explicitly
    "/(ar|en|al|fr|it)/:path*",
    // Match all other paths except _next, api, _vercel, and static files
    "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
  ],
};
