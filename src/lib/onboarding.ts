import { patchAppSettings, type DailyGoalMinutes } from "@/lib/app-settings";
import { DEFAULT_BOOTSTRAP_RANGE } from "@/lib/app-bootstrap";

const STORAGE_KEY = "english-vocab-onboarding-v1";

export type OnboardingState = {
  completed: boolean;
  preferredRangeId: string;
};

const DEFAULT_STATE: OnboardingState = {
  completed: false,
  preferredRangeId: DEFAULT_BOOTSTRAP_RANGE,
};

export function readOnboarding(): OnboardingState {
  if (typeof window === "undefined") return DEFAULT_STATE;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STATE;
    const parsed = JSON.parse(raw) as Partial<OnboardingState>;
    return {
      completed: parsed.completed === true,
      preferredRangeId:
        typeof parsed.preferredRangeId === "string" && parsed.preferredRangeId.trim()
          ? parsed.preferredRangeId.trim()
          : DEFAULT_BOOTSTRAP_RANGE,
    };
  } catch {
    return DEFAULT_STATE;
  }
}

export function completeOnboarding(
  preferredRangeId: string,
  dailyGoalMinutes: DailyGoalMinutes,
): OnboardingState {
  const next: OnboardingState = {
    completed: true,
    preferredRangeId: preferredRangeId.trim() || DEFAULT_BOOTSTRAP_RANGE,
  };
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    patchAppSettings({ dailyGoalMinutes });
    window.dispatchEvent(new Event("onboarding-completed"));
  }
  return next;
}

export function shouldShowOnboarding(): boolean {
  return !readOnboarding().completed;
}
