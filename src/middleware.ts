import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ADMIN_PAGES } from "./lib/constants";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("torch-admin-token");
  const isAuthPage =
    request.nextUrl.pathname === ADMIN_PAGES.login ||
    request.nextUrl.pathname === ADMIN_PAGES.setup;

  if (!token && !isAuthPage) {
    return NextResponse.redirect(new URL(ADMIN_PAGES.login, request.url));
  }

  if (token && isAuthPage) {
    return NextResponse.redirect(new URL(ADMIN_PAGES.dashboard, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
