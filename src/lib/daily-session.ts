import { getDailyGoalTarget } from "@/lib/daily-goal";

const STORAGE_KEY = "english-vocab-daily-session-v1";

export type DailySessionPhase = "review" | "journey" | "summary";

export type DailySession = {
  date: string;
  active: true;
  phase: DailySessionPhase;
  reviewsCompleted: number;
  reviewsPlanned: number;
  newWordsCompleted: number;
  newWordsTarget: number;
};

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

function defaultSession(reviewsDue: number): DailySession {
  const hasReview = reviewsDue > 0;
  return {
    date: todayKey(),
    active: true,
    phase: hasReview ? "review" : "journey",
    reviewsCompleted: 0,
    reviewsPlanned: hasReview ? reviewsDue : 0,
    newWordsCompleted: 0,
    newWordsTarget: getDailyGoalTarget(),
  };
}

function readRaw(): DailySession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as DailySession;
    if (parsed.date !== todayKey() || parsed.active !== true) return null;
    if (
      parsed.phase !== "review" &&
      parsed.phase !== "journey" &&
      parsed.phase !== "summary"
    ) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

function write(session: DailySession | null): void {
  if (typeof window === "undefined") return;
  if (!session) {
    localStorage.removeItem(STORAGE_KEY);
  } else {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  }
  window.dispatchEvent(new Event("daily-session-changed"));
}

export function readDailySession(): DailySession | null {
  return readRaw();
}

export function isDailySessionActive(): boolean {
  return readRaw() !== null;
}

export function isDailySessionPhase(phase: DailySessionPhase): boolean {
  return readRaw()?.phase === phase;
}

/** Begin today's ordered session: review first (if due), then new words. */
export function startDailySession(reviewsDue: number): DailySession {
  const session = defaultSession(reviewsDue);
  write(session);
  return session;
}

/** Resume an in-progress session or start fresh (unless already on summary). */
export function resumeOrStartDailySession(reviewsDue: number): DailySession {
  const existing = readRaw();
  if (existing && existing.phase !== "summary") return existing;
  return startDailySession(reviewsDue);
}

export function setDailySessionReviewPlanned(count: number): void {
  const session = readRaw();
  if (!session || session.phase !== "review") return;
  write({ ...session, reviewsPlanned: Math.max(0, count) });
}

export function finishReviewPhase(completed: number): DailySession | null {
  const session = readRaw();
  if (!session || session.phase !== "review") return session;
  const next: DailySession = {
    ...session,
    phase: "journey",
    reviewsCompleted: Math.max(0, completed),
  };
  write(next);
  return next;
}

export function skipReviewPhase(): DailySession | null {
  return finishReviewPhase(0);
}

export function recordDailyNewWord(): {
  completed: number;
  target: number;
  reached: boolean;
} {
  const session = readRaw();
  if (!session || session.phase !== "journey") {
    return {
      completed: 0,
      target: getDailyGoalTarget(),
      reached: false,
    };
  }
  const completed = session.newWordsCompleted + 1;
  const next: DailySession = { ...session, newWordsCompleted: completed };
  write(next);
  const reached = completed >= session.newWordsTarget;
  if (reached) {
    finishDailySession();
  }
  return { completed, target: session.newWordsTarget, reached };
}

export function finishDailySession(): DailySession | null {
  const session = readRaw();
  if (!session) return null;
  const next: DailySession = { ...session, phase: "summary" };
  write(next);
  return next;
}

export function dismissDailySummary(): void {
  write(null);
}

export function dailySessionRoute(session: DailySession | null): "/learn" | "/journey" {
  if (!session) return "/journey";
  if (session.phase === "review") return "/learn";
  return "/journey";
}

export function dailySessionQuery(session: DailySession | null): string {
  return session ? "?daily=1" : "";
}
