import { MASCOT_CAST_VERSION } from "@/lib/mascot-cast";
import {
  isTopRankMascotWord,
  planMascotScene,
} from "@/lib/mascot-scene-planner";
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
  if (!trimmed.includes(MASCOT_CAST_VERSION)) return false;
  return (
    trimmed.includes("/api/mascot-image") ||
    trimmed.startsWith("data:image/svg+xml")
  );
}

export function buildMascotImageApiUrl(
  word: string,
  pos?: string | null,
): string {
  const normalized = word.trim().toLowerCase();
  const params = new URLSearchParams({
    word: normalized,
    v: MASCOT_CAST_VERSION,
  });
  if (pos?.trim()) params.set("pos", pos.trim());
  return `/api/mascot-image?${params.toString()}`;
}

export function resolveMascotWordImageUrl(
  word: string,
  pos?: string | null,
  searchKeyword?: string | null,
  meaning?: string | null,
): string | null {
  void searchKeyword;
  void meaning;
  if (!shouldUseMascotIllustration(word)) return null;
  try {
    void planMascotScene(word, pos, searchKeyword, meaning);
    return buildMascotImageApiUrl(word, pos);
  } catch (error) {
    console.warn(
      `[mascot-word-images] Failed for "${word}":`,
      error instanceof Error ? error.message : error,
    );
    return null;
  }
}
