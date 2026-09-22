import { parseLearnerLocale } from "@/lib/learner-locale";
import { prefetchWordsLocaleInBackground } from "@/lib/prefetch-next-word-locale-server";
import { after, NextResponse } from "next/server";

export const runtime = "nodejs";

type PrefetchBody = {
  words?: unknown;
  locale?: unknown;
};

/** Queue background ES hydration for up to 10 upcoming words (non-blocking). */
export async function POST(request: Request) {
  let body: PrefetchBody = {};
  try {
    body = (await request.json()) as PrefetchBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const locale = parseLearnerLocale(
    typeof body.locale === "string" ? body.locale : null,
  );
  const words = Array.isArray(body.words) ? body.words : [];

  if (!words.length) {
    return NextResponse.json({ ok: true, queued: 0 });
  }

  after(async () => {
    try {
      await prefetchWordsLocaleInBackground(words, locale);
    } catch (error) {
      console.warn("[prefetch-locale] background job failed:", error);
    }
  });

  return NextResponse.json({
    ok: true,
    queued: Math.min(words.length, 10),
    locale,
  });
}
