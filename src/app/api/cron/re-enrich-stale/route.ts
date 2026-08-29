import { runStaleReEnrichBatch } from "@/lib/re-enrich-stale-batch";
import { createServiceSupabase } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";

export const maxDuration = 300;
export const dynamic = "force-dynamic";

function isAuthorized(request: Request): boolean {
  const secret = process.env.CRON_SECRET?.trim();
  if (!secret) return false;

  const authHeader = request.headers.get("authorization");
  if (authHeader === `Bearer ${secret}`) return true;

  const urlSecret = new URL(request.url).searchParams.get("secret");
  return urlSecret === secret;
}

async function handle(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const limit = Number.parseInt(searchParams.get("limit") ?? "25", 10) || 25;
    const offset = Number.parseInt(searchParams.get("offset") ?? "0", 10) || 0;
    const word = searchParams.get("word")?.trim().toLowerCase() || null;
    const dryRun = searchParams.get("dryRun") === "true";

    const supabase = createServiceSupabase();
    const result = await runStaleReEnrichBatch(supabase, {
      limit: word ? 1 : limit,
      offset: word ? 0 : offset,
      word,
      dryRun,
    });

    return NextResponse.json({
      ok: true,
      dryRun,
      ...result,
      hint:
        result.remaining > 0 && result.nextOffset !== null
          ? `Call again with offset=${result.nextOffset}`
          : "All stale rows in this scan are processed.",
    });
  } catch (error) {
    console.error("Cron re-enrich-stale error:", error);
    return NextResponse.json(
      {
        error: "Re-enrich batch failed",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}

export async function GET(request: Request) {
  return handle(request);
}

export async function POST(request: Request) {
  return handle(request);
}
