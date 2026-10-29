"use client";

import { BottomTabBar } from "@/components/layout/BottomTabBar";
import type { ReactNode } from "react";

type AppNavigationFrameProps = {
  children: ReactNode;
  /** Extra classes on the outer `app-page` wrapper (e.g. app-setup-enter). */
  pageClassName?: string;
};

/** Shared shell: scrollable content + fixed bottom tab bar on every in-app screen. */
export function AppNavigationFrame({
  children,
  pageClassName = "",
}: AppNavigationFrameProps) {
  return (
    <div className={`app-page${pageClassName ? ` ${pageClassName}` : ""}`}>
      <div className="app-shell mx-auto w-full max-w-lg bg-background">
        <div className="shell-content">{children}</div>
        <BottomTabBar />
      </div>
    </div>
  );
}
