"use client";

import { HomeLayoutRenderer } from "@/components/discover/home-layouts/HomeLayoutRenderer";
import type { HomeLayoutProps } from "@/components/discover/home-layouts/types";

type DiscoverDashboardProps = Omit<HomeLayoutProps, "rankProgress" | "preview"> & {
  currentIndex: number;
};

export function CoinBadge({
  value,
  label,
}: {
  value: number;
  label: string;
}) {
  return (
    <span className="coin-badge" title={label} aria-label={label}>
      <span className="coin-badge__icon" aria-hidden>
        🪙
      </span>
      {value.toLocaleString()}
    </span>
  );
}

export function DiscoverDashboard({
  currentIndex,
  queueLength,
  ...layoutProps
}: DiscoverDashboardProps) {
  const rankProgress =
    queueLength > 0 ? Math.round((currentIndex / queueLength) * 100) : 0;

  return (
    <div className="home-scroll page-scroll home-scroll--fill">
      <div className="home-content home-content--fill px-4">
        <HomeLayoutRenderer
          {...layoutProps}
          queueLength={queueLength}
          rankProgress={rankProgress}
        />
      </div>
    </div>
  );
}
