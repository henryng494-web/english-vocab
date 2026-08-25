import { MASCOT_CAST_VERSION } from "@/lib/mascot-cast";
import {
  isTopRankMascotWord,
  planMascotScene,
} from "@/lib/mascot-scene-planner";
import {
  mascotSvgToDataUrl,
  renderMascotSceneSvg,
} from "@/lib/mascot-svg-render";
import { requiresSafeImageOnly } from "@/lib/safe-image-search";

export function shouldUseMascotIllustration(word: string): boolean {
  const normalized = word.trim().toLowerCase();
  if (!normalized || requiresSafeImageOnly(normalized)) return false;
  return isTopRankMascotWord(normalized);
}

export function isMascotIllustrationUrl(
  url: string | null | undefined,
): boolean {
  const trimmed = url?.trim();
  if (!trimmed) return false;
  return trimmed.includes(MASCOT_CAST_VERSION);
}

export function resolveMascotWordImageUrl(
  word: string,
  pos?: string | null,
  searchKeyword?: string | null,
  meaning?: string | null,
): string | null {
  if (!shouldUseMascotIllustration(word)) return null;
  try {
    const plan = planMascotScene(word, pos, searchKeyword, meaning);
    const svg = renderMascotSceneSvg(plan.scene, word, pos);
    return mascotSvgToDataUrl(svg);
  } catch (error) {
    console.warn(
      `[mascot-word-images] Failed for "${word}":`,
      error instanceof Error ? error.message : error,
    );
    return null;
  }
}
