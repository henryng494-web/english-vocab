"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  runAppBootstrap,
  waitForWelcomeMinimum,
  type AppBootstrapSnapshot,
  type BootstrapProgress,
  type RangeBootstrapData,
} from "@/lib/app-bootstrap";
import type { DiscoverWordData } from "@/components/discover/DiscoverCard";
import type { ReviewSessionData } from "@/lib/review-fetch";

type AppBootstrapContextValue = {
  ready: boolean;
  progress: BootstrapProgress;
  ranges: Record<string, RangeBootstrapData> | null;
  wordCache: Record<string, DiscoverWordData> | null;
  defaultRangeId: string | null;
  review: ReviewSessionData | null;
  updateReviewCache: (data: ReviewSessionData) => void;
};

const AppBootstrapContext = createContext<AppBootstrapContextValue | null>(null);

const INITIAL_PROGRESS: BootstrapProgress = {
  progress: 0,
  message: "Welcome!",
};

export function AppBootstrapProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [progress, setProgress] = useState<BootstrapProgress>(INITIAL_PROGRESS);
  const [snapshot, setSnapshot] = useState<AppBootstrapSnapshot | null>(null);
  const [reviewOverride, setReviewOverride] =
    useState<ReviewSessionData | null>(null);

  useEffect(() => {
    let cancelled = false;
    const startedAt = Date.now();

    void (async () => {
      try {
        const loaded = await runAppBootstrap((next) => {
          if (!cancelled) setProgress(next);
        });
        await waitForWelcomeMinimum(startedAt);
        if (cancelled) return;
        setSnapshot(loaded);
        setReady(true);
      } catch {
        await waitForWelcomeMinimum(startedAt);
        if (cancelled) return;
        setProgress({ progress: 100, message: "Ready to learn!" });
        setReady(true);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const updateReviewCache = useCallback((data: ReviewSessionData) => {
    setReviewOverride(data);
  }, []);

  const value = useMemo<AppBootstrapContextValue>(
    () => ({
      ready,
      progress,
      ranges: snapshot?.ranges ?? null,
      wordCache: snapshot?.wordCache ?? null,
      defaultRangeId: snapshot?.defaultRangeId ?? null,
      review: reviewOverride ?? snapshot?.review ?? null,
      updateReviewCache,
    }),
    [ready, progress, snapshot, reviewOverride, updateReviewCache],
  );

  return (
    <AppBootstrapContext.Provider value={value}>
      {children}
    </AppBootstrapContext.Provider>
  );
}

export function useAppBootstrap() {
  const ctx = useContext(AppBootstrapContext);
  if (!ctx) {
    throw new Error("useAppBootstrap must be used within AppBootstrapProvider");
  }
  return ctx;
}
