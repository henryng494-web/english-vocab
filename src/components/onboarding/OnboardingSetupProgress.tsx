import { ONBOARDING_SETUP_STEPS } from "@/components/onboarding/onboarding-setup-steps";

type OnboardingSetupProgressProps = {
  activeStepIndex: number;
};

export function OnboardingSetupProgress({ activeStepIndex }: OnboardingSetupProgressProps) {
  return (
    <div className="onboarding__progress" aria-hidden>
      {ONBOARDING_SETUP_STEPS.map((item, index) => (
        <span
          key={item}
          className={`onboarding__dot${index <= activeStepIndex ? " is-active" : ""}`}
        />
      ))}
    </div>
  );
}
