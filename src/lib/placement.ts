import {
  PLACEMENT_LEVEL_DIFFICULTY,
  PLACEMENT_QUESTIONS_PER_DIFFICULTY,
  PLACEMENT_QUESTION_BANK,
  type PlacementDifficulty,
  type PlacementLevel,
  type PlacementQuestion,
} from "@/data/placement-questions";
import { createClientIfConfigured } from "@/lib/supabase/client";

export type PlacementTier = "bronze" | "silver" | "gold" | "platinum" | "master";

export type PlacementTierInfo = {
  tier: PlacementTier;
  level: PlacementLevel;
  rangeId: string;
};

export const PLACEMENT_TIERS: readonly PlacementTierInfo[] = [
  { tier: "bronze", level: "A1", rangeId: "1-100" },
  { tier: "silver", level: "A2", rangeId: "501-1000" },
  { tier: "gold", level: "B1", rangeId: "1001-3000" },
  { tier: "platinum", level: "B2", rangeId: "3001-5000" },
  { tier: "master", level: "C1", rangeId: "5001-plus" },
];

export type PlacementQuiz = {
  question: PlacementQuestion;
  options: string[];
};

function shuffle<T>(items: readonly T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/** 3 easy + 4 medium + 3 hard questions ordered easy → hard, each with shuffled options. */
export function buildPlacementQuiz(): PlacementQuiz[] {
  const order: PlacementDifficulty[] = ["easy", "medium", "hard"];
  const picked = order.flatMap((difficulty) =>
    shuffle(
      PLACEMENT_QUESTION_BANK.filter(
        (q) => PLACEMENT_LEVEL_DIFFICULTY[q.level] === difficulty,
      ),
    ).slice(0, PLACEMENT_QUESTIONS_PER_DIFFICULTY[difficulty]),
  );
  return picked.map((question) => ({
    question,
    options: shuffle([question.answer, ...question.distractors]),
  }));
}

export type PlacementOutcome = {
  correct: number;
  total: number;
  ratio: number;
  byDifficulty: Record<PlacementDifficulty, { correct: number; total: number }>;
  tier: PlacementTierInfo;
};

/** C1 (rank 5000+) needs ≥ 2/3 hard answers AND ≥ 8/10 overall. */
export const C1_MIN_HARD_CORRECT = 2;
export const C1_MIN_TOTAL_CORRECT = 8;

function tierByTier(tier: PlacementTier): PlacementTierInfo {
  return PLACEMENT_TIERS.find((item) => item.tier === tier) ?? PLACEMENT_TIERS[0];
}

export function pickPlacementTier(
  byDifficulty: Record<PlacementDifficulty, { correct: number; total: number }>,
): PlacementTierInfo {
  const easy = byDifficulty.easy.correct;
  const medium = byDifficulty.medium.correct;
  const hard = byDifficulty.hard.correct;
  const total = easy + medium + hard;
  if (hard >= C1_MIN_HARD_CORRECT && total >= C1_MIN_TOTAL_CORRECT) {
    return tierByTier("master");
  }
  // Without the C1 gate, strong easy/medium answers top out at B2 (rank 3001–5000).
  if (medium >= 3 && total >= 6) return tierByTier("platinum");
  if (medium >= 2 || total >= 5) return tierByTier("gold");
  if (easy >= 2 || total >= 3) return tierByTier("silver");
  return tierByTier("bronze");
}

export function scorePlacement(
  quiz: readonly PlacementQuiz[],
  answers: readonly (string | null)[],
): PlacementOutcome {
  const byDifficulty: PlacementOutcome["byDifficulty"] = {
    easy: { correct: 0, total: 0 },
    medium: { correct: 0, total: 0 },
    hard: { correct: 0, total: 0 },
  };
  let correct = 0;
  quiz.forEach(({ question }, index) => {
    const bucket = byDifficulty[PLACEMENT_LEVEL_DIFFICULTY[question.level]];
    bucket.total += 1;
    if (answers[index] === question.answer) {
      bucket.correct += 1;
      correct += 1;
    }
  });
  const ratio = quiz.length > 0 ? correct / quiz.length : 0;
  return { correct, total: quiz.length, ratio, byDifficulty, tier: pickPlacementTier(byDifficulty) };
}

const STORAGE_KEY = "english-vocab-placement-v1";
export const PLACEMENT_SAVED_EVENT = "placement-saved";

export const RECOMMENDED_RANK_KEY = "user_recommended_rank";
export const SELECTED_RANK_KEY = "user_selected_rank";

function readRankKey(key: string): string | null {
  if (typeof window === "undefined") return null;
  try {
    const value = localStorage.getItem(key)?.trim();
    return value || null;
  } catch {
    return null;
  }
}

function writeRankKey(key: string, rangeId: string): void {
  try {
    localStorage.setItem(key, rangeId);
  } catch {
    /* private mode */
  }
}

export function readRecommendedRank(): string | null {
  return readRankKey(RECOMMENDED_RANK_KEY);
}

export function readSelectedRank(): string | null {
  return readRankKey(SELECTED_RANK_KEY);
}

export function saveSelectedRank(rangeId: string): void {
  if (typeof window === "undefined") return;
  writeRankKey(SELECTED_RANK_KEY, rangeId);
}

/** Rank the Discover screen opens on: last pick, else test recommendation. */
export function readInitialRank(): string | null {
  return readSelectedRank() ?? readRecommendedRank();
}

export type StoredPlacement = {
  rangeId: string;
  tier: PlacementTier;
  level: PlacementLevel;
  source: "test" | "manual";
  correct?: number;
  total?: number;
  savedAt: number;
};

export function readPlacement(): StoredPlacement | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<StoredPlacement>;
    if (typeof parsed.rangeId !== "string" || !parsed.rangeId) return null;
    return parsed as StoredPlacement;
  } catch {
    return null;
  }
}

/** Saves locally and, when signed in, mirrors the rank to the Supabase user profile. */
export function savePlacement(placement: Omit<StoredPlacement, "savedAt">): StoredPlacement {
  const stored: StoredPlacement = { ...placement, savedAt: Date.now() };
  if (typeof window === "undefined") return stored;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
  } catch {
    /* private mode */
  }
  if (stored.source === "test") writeRankKey(RECOMMENDED_RANK_KEY, stored.rangeId);
  writeRankKey(SELECTED_RANK_KEY, stored.rangeId);
  void syncPlacementToAccount(stored);
  window.dispatchEvent(new Event(PLACEMENT_SAVED_EVENT));
  return stored;
}

export function tierForRange(rangeId: string): PlacementTierInfo | null {
  return PLACEMENT_TIERS.find((item) => item.rangeId === rangeId) ?? null;
}

export async function syncPlacementToAccount(placement: StoredPlacement): Promise<void> {
  try {
    const supabase = createClientIfConfigured();
    if (!supabase) return;
    const { data } = await supabase.auth.getSession();
    if (!data.session) return;
    await supabase.auth.updateUser({
      data: {
        placement_range: placement.rangeId,
        placement_tier: placement.tier,
        placement_level: placement.level,
        placement_source: placement.source,
      },
    });
  } catch {
    /* best effort; local copy remains the source of truth */
  }
}
