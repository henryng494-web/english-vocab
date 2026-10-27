/** Unified first-run guide: nickname → welcome → daily goal → how Journey works */
export const ONBOARDING_SETUP_STEPS = [
  "nickname",
  "welcome",
  "goal",
  "how",
] as const;

export type OnboardingSetupStep = (typeof ONBOARDING_SETUP_STEPS)[number];

export const ONBOARDING_NICKNAME_STEP_INDEX = 0;

export const ONBOARDING_GUIDE_STEP_OFFSET = 1;

export function onboardingGuideStepIndex(guideStep: "welcome" | "goal" | "how"): number {
  const guideSteps = ["welcome", "goal", "how"] as const;
  return ONBOARDING_GUIDE_STEP_OFFSET + guideSteps.indexOf(guideStep);
}
