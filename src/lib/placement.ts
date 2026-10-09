import {
  PLACEMENT_LEVEL_WEIGHT,
  PLACEMENT_QUESTIONS_PER_LEVEL,
  PLACEMENT_QUESTION_BANK,
  type PlacementLevel,
  type PlacementQuestion,
} from "@/data/placement-questions";
import { createClientIfConfigured } from "@/lib/supabase/client";

export type PlacementTier = "bronze" | "silver" | "gold" | "platinum" | "master";

export type PlacementTierInfo = {
  tier: PlacementTier;
  level: PlacementLevel;
  rangeId: string;
  /** Minimum weighted ratio (0–1) required for this tier. */
  minRatio: number;
};

export const PLACEMENT_TIERS: readonly PlacementTierInfo[] = [
  { tier: "bronze", level: "A1", rangeId: "1-100", minRatio: 0 },
  { tier: "silver", level: "A2", rangeId: "501-1000", minRatio: 0.15 },
  { tier: "gold", level: "B1", rangeId: "1001-3000", minRatio: 0.3 },
  { tier: "platinum", level: "B2", rangeId: "3001-5000", minRatio: 0.5 },
  { tier: "master", level: "C1", rangeId: "5001-plus", minRatio: 0.75 },
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

/** 10 questions ordered easy → hard, each with shuffled options. */
export function buildPlacementQuiz(): PlacementQuiz[] {
  const levels = Object.keys(PLACEMENT_QUESTIONS_PER_LEVEL) as PlacementLevel[];
  const picked = levels.flatMap((level) =>
    shuffle(PLACEMENT_QUESTION_BANK.filter((q) => q.level === level)).slice(
      0,
      PLACEMENT_QUESTIONS_PER_LEVEL[level],
    ),
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
  tier: PlacementTierInfo;
};

export function scorePlacement(
  quiz: readonly PlacementQuiz[],
  answers: readonly (string | null)[],
): PlacementOutcome {
  let earned = 0;
  let possible = 0;
  let correct = 0;
  quiz.forEach(({ question }, index) => {
    const weight = PLACEMENT_LEVEL_WEIGHT[question.level];
    possible += weight;
    if (answers[index] === question.answer) {
      earned += weight;
      correct += 1;
    }
  });
  const ratio = possible > 0 ? earned / possible : 0;
  const tier =
    [...PLACEMENT_TIERS].reverse().find((item) => ratio >= item.minRatio) ??
    PLACEMENT_TIERS[0];
  return { correct, total: quiz.length, ratio, tier };
}

const STORAGE_KEY = "english-vocab-placement-v1";
export const PLACEMENT_SAVED_EVENT = "placement-saved";

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
