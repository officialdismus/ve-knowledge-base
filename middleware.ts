import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ADMIN_PATH_PREFIX = "/admin";
const ADMIN_COOKIE = "ve_admin_auth";

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  if (!pathname.startsWith(ADMIN_PATH_PREFIX)) {
    return NextResponse.next();
  }

  // Allow the public admin login page
  if (pathname.startsWith("/admin-login")) {
    return NextResponse.next();
  }

  const adminPassword = process.env.ADMIN_PASSWORD;
  const cookie = request.cookies.get(ADMIN_COOKIE)?.value;

  if (!adminPassword) {
    // If not configured, do not block
    return NextResponse.next();
  }

  if (cookie === adminPassword) {
    return NextResponse.next();
  }

  const loginUrl = new URL("/admin-login", request.url);
  loginUrl.searchParams.set("from", pathname + search);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/admin/:path*", "/admin"],
};

