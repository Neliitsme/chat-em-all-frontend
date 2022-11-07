import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const hasAccessToken = request.cookies.has("access_token");
  if (request.nextUrl.pathname.startsWith("/sign")) {
    if (hasAccessToken) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }

  if (hasAccessToken) {
    return NextResponse.next();
  }

  return NextResponse.redirect(new URL("/signin", request.url));
}

export const config = {
  matcher: ["/((?!api|_next/static|favicon.ico).*)"],
};
