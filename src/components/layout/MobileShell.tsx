"use client";

import { BottomTabBar } from "@/components/layout/BottomTabBar";

export function MobileShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="app-page">
      <div className="app-shell mx-auto w-full max-w-lg bg-background">
        <div className="shell-content">{children}</div>
        <BottomTabBar />
      </div>
    </div>
  );
}
