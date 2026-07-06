import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import createIntlMiddleware from "next-intl/middleware";
import {
  verifyAdminSession,
  verifyFamilySession,
  ADMIN_COOKIE,
  FAMILY_COOKIE,
} from "@/lib/auth/session";
import { routing } from "@/i18n/routing";
import {
  getLocaleFromPathname,
  localizedHref,
  stripLocaleFromPathname,
} from "@/i18n/config";

const intlMiddleware = createIntlMiddleware(routing);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin")) {
    const isAdminLogin = pathname === "/admin/login";
    if (!isAdminLogin) {
      const token = request.cookies.get(ADMIN_COOKIE)?.value;
      const session = token ? await verifyAdminSession(token) : null;
      if (!session) {
        return NextResponse.redirect(new URL("/admin/login", request.url));
      }
    }
    return NextResponse.next();
  }

  const locale = getLocaleFromPathname(pathname);
  const pathWithoutLocale = stripLocaleFromPathname(pathname);

  if (pathWithoutLocale === "/mi-esquela") {
    const token = request.cookies.get(FAMILY_COOKIE)?.value;
    const session = token ? await verifyFamilySession(token) : null;
    if (!session) {
      return NextResponse.redirect(
        new URL(localizedHref("/acceso", locale), request.url),
      );
    }
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
