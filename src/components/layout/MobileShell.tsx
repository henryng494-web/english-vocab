"use client";

import { usePathname } from "next/navigation";
import { AppLocaleSync } from "@/components/layout/AppLocaleSync";
import { AppNavigationFrame } from "@/components/layout/AppNavigationFrame";
import { StudyReminderScheduler } from "@/components/layout/StudyReminderScheduler";
import { StudyTimeTracker } from "@/components/layout/StudyTimeTracker";
import { ViewportHeightSync } from "@/components/layout/ViewportHeightSync";
import { NicknamePrompt } from "@/components/onboarding/NicknamePrompt";
import { OnboardingScreen } from "@/components/onboarding/OnboardingScreen";
import { needsLearnerNicknamePrompt } from "@/lib/learner-nickname";
import { LEARNER_DISPLAY_NAME_EVENT } from "@/lib/user-display-name";
import { WelcomeSplash } from "@/components/welcome/WelcomeSplash";
import { PaywallProvider } from "@/context/PaywallContext";
import { AppMenuProvider } from "@/context/AppMenuContext";
import { AppSettingsProvider, useAppSettings } from "@/context/AppSettingsContext";
import {
  AppBootstrapProvider,
  useAppBootstrap,
} from "@/context/AppBootstrapContext";
import { MIN_WELCOME_MS, type BootstrapProgress } from "@/lib/app-bootstrap";
import { markStartupSplashCompleted } from "@/lib/startup-splash-session";
import { useCallback, useEffect, useState } from "react";

function StartupSplash({ progress }: { progress: BootstrapProgress }) {
  return (
    <div className="app-page">
      <div className="app-shell mx-auto w-full max-w-lg bg-background">
        <div className="shell-content">
          <WelcomeSplash progress={progress} />
        </div>
      </div>
    </div>
  );
}

function MobileShellInner({ children }: { children: React.ReactNode }) {
  const { ready: bootstrapReady, bootstrapHasData, progress } = useAppBootstrap();
  const { settingsReady, hasOnboarded } = useAppSettings();
  const [nicknameReady, setNicknameReady] = useState(false);
  const [minSplashElapsed, setMinSplashElapsed] = useState(false);
  /** Welcome splash on every cold start / full reload — never skip. */
  const [startupSplashDone, setStartupSplashDone] = useState(false);

  const syncNicknameGate = useCallback(() => {
    setNicknameReady(!needsLearnerNicknamePrompt());
  }, []);

  useEffect(() => {
    syncNicknameGate();
    window.addEventListener(LEARNER_DISPLAY_NAME_EVENT, syncNicknameGate);
    return () => window.removeEventListener(LEARNER_DISPLAY_NAME_EVENT, syncNicknameGate);
  }, [syncNicknameGate]);

  useEffect(() => {
    const timer = window.setTimeout(() => setMinSplashElapsed(true), MIN_WELCOME_MS);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (hasOnboarded && nicknameReady) {
      markStartupSplashCompleted();
    }
  }, [hasOnboarded, nicknameReady]);

  useEffect(() => {
    if (!settingsReady || !minSplashElapsed) return;
    if (!bootstrapHasData && !bootstrapReady) return;
    setStartupSplashDone(true);
    markStartupSplashCompleted();
  }, [bootstrapReady, bootstrapHasData, settingsReady, minSplashElapsed]);

  if (!startupSplashDone) {
    return <StartupSplash progress={progress} />;
  }

  if (!hasOnboarded) {
    return (
      <AppNavigationFrame pageClassName="app-setup-enter">
        <OnboardingScreen />
      </AppNavigationFrame>
    );
  }

  if (!nicknameReady) {
    return (
      <AppNavigationFrame pageClassName="app-setup-enter">
        <NicknamePrompt onComplete={syncNicknameGate} />
      </AppNavigationFrame>
    );
  }

  return (
    <>
      <ViewportHeightSync />
      <StudyTimeTracker />
      <StudyReminderScheduler />
      <AppNavigationFrame pageClassName="app-setup-enter">{children}</AppNavigationFrame>
    </>
  );
}

/** Legal pages must open for anyone (store reviewers, crawlers) without onboarding or bootstrap. */
const PUBLIC_PATHS = ["/privacy", "/terms"];

function isPublicPath(pathname: string | null): boolean {
  if (!pathname) return false;
  const normalized = pathname.replace(/\/+$/, "") || "/";
  return PUBLIC_PATHS.includes(normalized);
}

export function MobileShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (isPublicPath(pathname)) {
    return (
      <AppSettingsProvider fallbackLanguage="en">
        <AppLocaleSync />
        <AppMenuProvider>
          <AppNavigationFrame>{children}</AppNavigationFrame>
        </AppMenuProvider>
      </AppSettingsProvider>
    );
  }

  return (
    <AppSettingsProvider>
      <AppLocaleSync />
      <AppMenuProvider>
        <AppBootstrapProvider>
          <PaywallProvider>
            <MobileShellInner>{children}</MobileShellInner>
          </PaywallProvider>
        </AppBootstrapProvider>
      </AppMenuProvider>
    </AppSettingsProvider>
  );
}
