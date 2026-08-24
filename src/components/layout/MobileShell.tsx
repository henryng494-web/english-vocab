"use client";

import { BottomTabBar } from "@/components/layout/BottomTabBar";
import { ViewportHeightSync } from "@/components/layout/ViewportHeightSync";
import { WelcomeSplash } from "@/components/welcome/WelcomeSplash";
import {
  AppBootstrapProvider,
  useAppBootstrap,
} from "@/context/AppBootstrapContext";

function MobileShellInner({ children }: { children: React.ReactNode }) {
  const { ready, progress } = useAppBootstrap();

  return (
    <>
      <ViewportHeightSync />
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
    <AppBootstrapProvider>
      <MobileShellInner>{children}</MobileShellInner>
    </AppBootstrapProvider>
  );
}
