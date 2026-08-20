"use client";

import { BottomTabBar } from "@/components/layout/BottomTabBar";

export function MobileShell({
  children,
  actionDock = false,
}: {
  children: React.ReactNode;
  actionDock?: boolean;
}) {
  return (
    <div
      className={`app-shell mx-auto flex min-h-dvh w-full max-w-lg flex-col bg-background${
        actionDock ? " has-action-dock" : ""
      }`}
    >
      <div className="shell-content flex-1 overflow-x-hidden overflow-y-auto">
        {children}
      </div>
      <BottomTabBar />
    </div>
  );
}
