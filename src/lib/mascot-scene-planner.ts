import { getPresetRank } from "@/data/preset-word-details";
import { MASCOT_SCENE_MANIFEST_TOP1000 } from "@/data/mascot-scene-manifest-top1000";
import type { MascotScenePlan, MascotSceneType } from "@/lib/mascot-cast";

/** Scene for preset rank 1–1000 — manifest is authoritative at runtime. */
export function planMascotScene(
  word: string,
  _pos?: string | null,
  _searchKeyword?: string | null,
  _meaning?: string | null,
): MascotScenePlan {
  void _pos;
  void _searchKeyword;
  void _meaning;
  const normalized = word.trim().toLowerCase();
  const scene: MascotSceneType =
    MASCOT_SCENE_MANIFEST_TOP1000[normalized] ?? "default_duo";
  return { scene, propHint: null };
}

export function isTopRankMascotWord(word: string): boolean {
  const rank = getPresetRank(word.trim().toLowerCase());
  return rank !== undefined && rank <= 1000;
}
