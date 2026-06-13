import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { LEGACY_HOSTS, SITE_HOST } from "@/lib/site";

export function middleware(request: NextRequest) {
  const host = request.headers.get("host")?.split(":")[0]?.toLowerCase() ?? "";

  if (LEGACY_HOSTS.has(host) || host === `www.${SITE_HOST}`) {
    const url = request.nextUrl.clone();
    url.protocol = "https:";
    url.host = SITE_HOST;
    return NextResponse.redirect(url, 308);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Skip Next.js internals and static files unless present in the public folder.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
