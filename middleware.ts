import { NextRequest, NextResponse } from "next/server";
import { defaultLocale, isLocale } from "@/lib/i18n/locales";
import { decodeSession } from "@/lib/session";
import { SESSION_COOKIE } from "@/lib/session";

function detectLocale(req: NextRequest): string {
  const cookieLocale = req.cookies.get("NEXT_LOCALE")?.value;
  if (cookieLocale && isLocale(cookieLocale)) return cookieLocale;
  const header = req.headers.get("accept-language") ?? "";
  if (header.toLowerCase().startsWith("es") || header.toLowerCase().includes(",es")) return "es";
  return defaultLocale;
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".") // static assets
  ) {
    return NextResponse.next();
  }

  const segments = pathname.split("/").filter(Boolean);
  const first = segments[0];

  if (!first || !isLocale(first)) {
    const locale = detectLocale(req);
    const url = req.nextUrl.clone();
    url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
    const res = NextResponse.redirect(url);
    res.cookies.set("NEXT_LOCALE", locale, { path: "/", maxAge: 60 * 60 * 24 * 365 });
    return res;
  }

  const locale = first;
  const res = NextResponse.next();
  res.cookies.set("NEXT_LOCALE", locale, { path: "/", maxAge: 60 * 60 * 24 * 365 });

  const rest = "/" + segments.slice(1).join("/");
  const session = await decodeSession(req.cookies.get(SESSION_COOKIE)?.value);

  if (rest.startsWith("/admin") && session?.role !== "organizer") {
    const url = req.nextUrl.clone();
    url.pathname = `/${locale}/signin`;
    return NextResponse.redirect(url);
  }
  if (rest.startsWith("/referee") && session?.role !== "referee") {
    const url = req.nextUrl.clone();
    url.pathname = `/${locale}/signin`;
    return NextResponse.redirect(url);
  }

  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
