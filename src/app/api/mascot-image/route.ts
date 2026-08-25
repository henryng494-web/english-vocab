import { isExcludedVocabWord } from "@/lib/proper-noun";
import { planMascotScene } from "@/lib/mascot-scene-planner";
import { renderMascotSceneSvg } from "@/lib/mascot-svg-render";
import {
  shouldUseMascotIllustration,
} from "@/lib/mascot-word-images";
import { getFamilyHeadword } from "@/lib/word-family";
import { normalizeVocabInput } from "@/lib/word-validation";
import { NextResponse } from "next/server";

/** Serve mascot scene SVG using approved cast PNG sprites. */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const word = normalizeVocabInput(searchParams.get("word") ?? "");
  const pos = searchParams.get("pos")?.trim() || null;

  if (!word) {
    return NextResponse.json({ error: "Word is required" }, { status: 400 });
  }
  if (
    isExcludedVocabWord(word) ||
    isExcludedVocabWord(getFamilyHeadword(word))
  ) {
    return NextResponse.json({ error: "Word not available" }, { status: 404 });
  }
  if (!shouldUseMascotIllustration(word)) {
    return NextResponse.json({ error: "Word not in mascot range" }, { status: 404 });
  }

  const plan = planMascotScene(word, pos);
  const svg = renderMascotSceneSvg(plan.scene, word, pos);

  return new NextResponse(svg, {
    headers: {
      "Content-Type": "image/svg+xml; charset=utf-8",
      "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
    },
  });
}
