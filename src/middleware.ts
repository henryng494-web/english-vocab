import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

import { isAllowedMobileOrigin, mobileCorsHeaders } from "@/lib/mobile-api-cors";

export async function middleware(request: NextRequest) {
  const origin = request.headers.get("origin") ?? "";
  const isApi = request.nextUrl.pathname.startsWith("/api/");
  const allowCors = isApi && isAllowedMobileOrigin(origin);

  if (allowCors && request.method === "OPTIONS") {
    return new NextResponse(null, { status: 204, headers: mobileCorsHeaders(origin) });
  }

  let response: NextResponse;
  try {
    response = await updateSession(request);
  } catch {
    response = NextResponse.next({ request });
  }

  if (allowCors) {
    for (const [key, value] of Object.entries(mobileCorsHeaders(origin))) {
      response.headers.set(key, value);
    }
  }
  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|webmanifest)$).*)",
  ],
};
