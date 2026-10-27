import { mobileCorsHeaders, isAllowedMobileOrigin } from "@/lib/mobile-api-cors";
import { getSupabaseConfigOptional } from "@/lib/supabase/env";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ path: string[] }> };

function withCors(response: NextResponse, origin: string | null): NextResponse {
  if (!isAllowedMobileOrigin(origin)) return response;
  for (const [key, value] of Object.entries(mobileCorsHeaders(origin!))) {
    response.headers.set(key, value);
  }
  return response;
}

export async function OPTIONS(request: NextRequest) {
  const origin = request.headers.get("origin");
  if (!isAllowedMobileOrigin(origin)) {
    return new NextResponse(null, { status: 403 });
  }
  return new NextResponse(null, { status: 204, headers: mobileCorsHeaders(origin!) });
}

async function forwardAuth(request: NextRequest, pathSegments: string[]): Promise<NextResponse> {
  const origin = request.headers.get("origin");
  const config = getSupabaseConfigOptional();
  if (!config) {
    return withCors(
      NextResponse.json({ error: "Supabase not configured" }, { status: 503 }),
      origin,
    );
  }

  const path = pathSegments.join("/");
  const target = `${config.url.replace(/\/+$/, "")}/auth/v1/${path}${request.nextUrl.search}`;

  const headers = new Headers();
  headers.set("apikey", request.headers.get("apikey") ?? config.anonKey);
  const authorization = request.headers.get("authorization");
  if (authorization) headers.set("authorization", authorization);
  const contentType = request.headers.get("content-type");
  if (contentType) headers.set("content-type", contentType);
  const clientInfo = request.headers.get("x-client-info");
  if (clientInfo) headers.set("x-client-info", clientInfo);
  const apiVersion = request.headers.get("x-supabase-api-version");
  if (apiVersion) headers.set("x-supabase-api-version", apiVersion);

  const method = request.method.toUpperCase();
  const body =
    method === "GET" || method === "HEAD" ? undefined : await request.arrayBuffer();

  let upstream: Response;
  try {
    upstream = await fetch(target, { method, headers, body, cache: "no-store" });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Upstream auth fetch failed";
    return withCors(NextResponse.json({ error: message }, { status: 502 }), origin);
  }

  const responseHeaders = new Headers();
  const forwardContentType = upstream.headers.get("content-type");
  if (forwardContentType) responseHeaders.set("content-type", forwardContentType);

  const response = new NextResponse(upstream.body, {
    status: upstream.status,
    headers: responseHeaders,
  });
  return withCors(response, origin);
}

export async function GET(request: NextRequest, context: RouteContext) {
  const { path } = await context.params;
  return forwardAuth(request, path);
}

export async function POST(request: NextRequest, context: RouteContext) {
  const { path } = await context.params;
  return forwardAuth(request, path);
}

export async function PUT(request: NextRequest, context: RouteContext) {
  const { path } = await context.params;
  return forwardAuth(request, path);
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  const { path } = await context.params;
  return forwardAuth(request, path);
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  const { path } = await context.params;
  return forwardAuth(request, path);
}
