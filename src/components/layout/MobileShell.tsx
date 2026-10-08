"use client";

import { usePathname } from "next/navigation";
import { AppLocaleSync } from "@/components/layout/AppLocaleSync";
import { BottomTabBar } from "@/components/layout/BottomTabBar";
import { StudyReminderScheduler } from "@/components/layout/StudyReminderScheduler";
import { StudyTimeTracker } from "@/components/layout/StudyTimeTracker";
import { ViewportHeightSync } from "@/components/layout/ViewportHeightSync";
import { OnboardingScreen } from "@/components/onboarding/OnboardingScreen";
import { WelcomeSplash } from "@/components/welcome/WelcomeSplash";
import { AppMenuProvider } from "@/context/AppMenuContext";
import { AppSettingsProvider, useAppSettings } from "@/context/AppSettingsContext";
import {
  AppBootstrapProvider,
  useAppBootstrap,
} from "@/context/AppBootstrapContext";

function MobileShellInner({ children }: { children: React.ReactNode }) {
  const { ready, progress } = useAppBootstrap();
  const { settingsReady, hasOnboarded } = useAppSettings();

  if (!settingsReady) {
    return <div className="app-page" aria-busy="true" />;
  }

  if (!hasOnboarded) {
    return (
      <div className="app-page">
        <div className="app-shell mx-auto w-full max-w-lg bg-background">
          <OnboardingScreen />
        </div>
      </div>
    );
  }

  return (
    <>
      <ViewportHeightSync />
      <StudyTimeTracker />
      <StudyReminderScheduler />
      <div className="app-page">
        <div className="app-shell mx-auto w-full max-w-lg bg-background">
          <div className="shell-content">
            {ready ? children : null}
            {!ready ? <WelcomeSplash progress={progress} /> : null}
          </div>
          {ready ? <BottomTabBar /> : null}
        </div>
      </div>
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
      <AppSettingsProvider>
        <AppLocaleSync />
        <AppMenuProvider>
          <div className="app-page">
            <div className="app-shell mx-auto w-full max-w-lg bg-background">
              <div className="shell-content">{children}</div>
            </div>
          </div>
        </AppMenuProvider>
      </AppSettingsProvider>
    );
  }

  return (
    <AppSettingsProvider>
      <AppLocaleSync />
      <AppMenuProvider>
        <AppBootstrapProvider>
          <MobileShellInner>{children}</MobileShellInner>
        </AppBootstrapProvider>
      </AppMenuProvider>
    </AppSettingsProvider>
  );
}
