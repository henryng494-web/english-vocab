import {
  resolveWordImageForApi,
  type WordImageLookupInput,
} from "@/lib/word-image-api";
import { NextResponse } from "next/server";

const MAX_BATCH = 12;

/** Resolve several word photos in one round trip (Review sense quiz, queue warm). */
export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { items?: WordImageLookupInput[] };
    const items = Array.isArray(body.items) ? body.items.slice(0, MAX_BATCH) : [];

    const entries = await Promise.all(
      items.map(async (item) => {
        const url = await resolveWordImageForApi(
          item.word,
          item.keyword,
          item.pos,
          item.meaning,
        );
        return [item.word.trim().toLowerCase(), url] as const;
      }),
    );

    return NextResponse.json({
      images: Object.fromEntries(entries),
    });
  } catch (error) {
    console.error("word-image batch error:", error);
    return NextResponse.json({ images: {} });
  }
}
