const DAILY_GOAL_KEY = "vocab-journey-daily-goal-v1";
const DEFAULT_GOAL = 10;

type DailyGoalState = {
  date: string;
  count: number;
};

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

function readState(): DailyGoalState {
  if (typeof window === "undefined") {
    return { date: todayKey(), count: 0 };
  }
  try {
    const raw = localStorage.getItem(DAILY_GOAL_KEY);
    if (!raw) return { date: todayKey(), count: 0 };
    const parsed = JSON.parse(raw) as DailyGoalState;
    if (parsed.date !== todayKey()) return { date: todayKey(), count: 0 };
    return parsed;
  } catch {
    return { date: todayKey(), count: 0 };
  }
}

export function getDailyGoalTarget(): number {
  return DEFAULT_GOAL;
}

export function getTodayWordsLearned(): number {
  return readState().count;
}

export function incrementTodayWordsLearned(): number {
  if (typeof window === "undefined") return 0;
  const next = { date: todayKey(), count: readState().count + 1 };
  localStorage.setItem(DAILY_GOAL_KEY, JSON.stringify(next));
  return next.count;
}

export function countWordsLearned(): number {
  if (typeof window === "undefined") return 0;
  try {
    const raw = localStorage.getItem("english-vocab-learning");
    if (!raw) return 0;
    const map = JSON.parse(raw) as Record<string, { status: string }>;
    return Object.values(map).filter((e) => e.status === "new" || e.status === "learning").length;
  } catch {
    return 0;
  }
}
