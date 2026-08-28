"use client";

import { BottomTabBar } from "@/components/layout/BottomTabBar";
import { StudyReminderScheduler } from "@/components/layout/StudyReminderScheduler";
import { StudyTimeTracker } from "@/components/layout/StudyTimeTracker";
import { ViewportHeightSync } from "@/components/layout/ViewportHeightSync";
import { WelcomeSplash } from "@/components/welcome/WelcomeSplash";
import { AppMenuProvider } from "@/context/AppMenuContext";
import { AppSettingsProvider } from "@/context/AppSettingsContext";
import {
  AppBootstrapProvider,
  useAppBootstrap,
} from "@/context/AppBootstrapContext";

function MobileShellInner({ children }: { children: React.ReactNode }) {
  const { ready, progress } = useAppBootstrap();

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

export function MobileShell({ children }: { children: React.ReactNode }) {
  return (
    <AppSettingsProvider>
      <AppMenuProvider>
        <AppBootstrapProvider>
          <MobileShellInner>{children}</MobileShellInner>
        </AppBootstrapProvider>
      </AppMenuProvider>
    </AppSettingsProvider>
  );
}
