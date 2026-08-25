import {
  resolveWordImageForApi,
  type WordImageLookupInput,
} from "@/lib/word-image-api";
import {
  toWordImageApiResponse,
  type WordImageApiResponse,
} from "@/lib/word-image-result";
import { getDefaultLearningImageDataUrl } from "@/lib/unsplash";
import { NextResponse } from "next/server";

const MAX_BATCH = 12;

/** Resolve several word photos in one round trip (Review sense quiz, queue warm). */
export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { items?: WordImageLookupInput[] };
    const items = Array.isArray(body.items) ? body.items.slice(0, MAX_BATCH) : [];

    const entries = await Promise.all(
      items.map(async (item) => {
        const word = item?.word?.trim().toLowerCase();
        if (!word) return null;
        try {
          const result = await resolveWordImageForApi(
            word,
            item.keyword,
            item.pos,
            item.meaning,
          );
          return [word, toWordImageApiResponse(result)] as const;
        } catch (error) {
          console.warn(
            `[word-image/batch] Failed for "${word}":`,
            error instanceof Error ? error.message : error,
          );
          const fallback = getDefaultLearningImageDataUrl(word, item.pos);
          return [
            word,
            toWordImageApiResponse({
              url: fallback,
              source: "error",
              error: true,
              searchKeyword: null,
            }),
          ] as const;
        }
      }),
    );

    const images: Record<string, WordImageApiResponse> = {};
    for (const entry of entries) {
      if (entry) {
        images[entry[0]] = entry[1];
      }
    }

    return NextResponse.json({ images });
  } catch (error) {
    console.error("word-image batch error:", error);
    return NextResponse.json({ images: {} }, { status: 500 });
  }
}
