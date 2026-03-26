import { NextRequest, NextResponse } from "next/server";
import { locales, defaultLocale, isValidLocale } from "@/lib/i18n/config";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip internal paths, API, admin, auth, static files
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/auth") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Check if the pathname already has a valid locale prefix
  const pathnameHasLocale = locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  );

  if (pathnameHasLocale) {
    const locale = pathname.split("/")[1];
    const response = NextResponse.next();
    response.cookies.set("locale", locale, {
      path: "/",
      maxAge: 365 * 24 * 60 * 60,
      sameSite: "lax",
    });
    return response;
  }

  // Determine locale: cookie → default
  const cookieLocale = request.cookies.get("locale")?.value;
  const locale =
    cookieLocale && isValidLocale(cookieLocale) ? cookieLocale : defaultLocale;

  // Redirect to locale-prefixed path
  const newUrl = new URL(`/${locale}${pathname || "/"}`, request.url);
  newUrl.search = request.nextUrl.search;

  const response = NextResponse.redirect(newUrl);
  response.cookies.set("locale", locale, {
    path: "/",
    maxAge: 365 * 24 * 60 * 60,
    sameSite: "lax",
  });
  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|api|admin|auth|.*\\..*).*)",
  ],
};
