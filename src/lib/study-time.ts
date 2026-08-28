const STORAGE_KEY = "vocab-study-time-v1";

type StudyTimeState = {
  date: string;
  seconds: number;
};

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

function readState(): StudyTimeState {
  if (typeof window === "undefined") {
    return { date: todayKey(), seconds: 0 };
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { date: todayKey(), seconds: 0 };
    const parsed = JSON.parse(raw) as StudyTimeState;
    if (parsed.date !== todayKey()) return { date: todayKey(), seconds: 0 };
    return {
      date: todayKey(),
      seconds: Number.isFinite(parsed.seconds) ? Math.max(0, parsed.seconds) : 0,
    };
  } catch {
    return { date: todayKey(), seconds: 0 };
  }
}

function writeState(state: StudyTimeState): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  window.dispatchEvent(
    new CustomEvent("study-time-changed", { detail: state }),
  );
}

/** Seconds studied today while learning/reviewing. */
export function getTodayStudySeconds(): number {
  return readState().seconds;
}

export function getTodayStudyMinutes(): number {
  return Math.floor(getTodayStudySeconds() / 60);
}

export function addStudySeconds(seconds: number): number {
  if (typeof window === "undefined" || seconds <= 0) return getTodayStudySeconds();
  const state = readState();
  const next = { date: todayKey(), seconds: state.seconds + seconds };
  writeState(next);
  return next.seconds;
}

export function formatStudyMinutes(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const rem = minutes % 60;
  return rem > 0 ? `${hours}h ${rem}m` : `${hours}h`;
}
