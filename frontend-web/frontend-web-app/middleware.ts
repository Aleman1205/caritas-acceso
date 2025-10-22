// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname, searchParams } = req.nextUrl;

  // Rutas públicas
  const isPublic =
    pathname.startsWith("/login") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.startsWith("/assets") ||
    pathname === "/robots.txt" ||
    pathname === "/sitemap.xml";

  if (isPublic) return NextResponse.next();

  const auth = req.cookies.get("auth")?.value;

  // Si no hay auth -> manda a /login con next=pathname
  if (!auth) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", pathname + (searchParams.toString() ? `?${searchParams.toString()}` : ""));
    return NextResponse.redirect(url);
  }

  // Si ya está autenticado y pide /login -> manda a /reservas
  if (pathname.startsWith("/login")) {
    const url = req.nextUrl.clone();
    url.pathname = "/reservas";
    url.searchParams.delete("next");
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!login|_next|favicon|assets|robots.txt|sitemap.xml).*)"],
};
