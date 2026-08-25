import { NextResponse } from "next/server";
import { searchPhotos } from "@/lib/unsplash";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");

    if (!query?.trim()) {
      return NextResponse.json(
        { error: "Query parameter 'q' is required" },
        { status: 400 },
      );
    }

    const perPage = Math.min(
      30,
      Math.max(1, Number(searchParams.get("per_page") ?? "1") || 1),
    );
    const photos = await searchPhotos(query.trim(), perPage);
    return NextResponse.json({ photos });
  } catch (error) {
    console.error("Unsplash search error:", error);
    return NextResponse.json(
      { error: "Failed to search photos" },
      { status: 500 },
    );
  }
}
