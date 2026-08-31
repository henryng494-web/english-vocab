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
  DEFAULT_BOOTSTRAP_RANGE,
  BOOTSTRAP_PRELOAD_DEFAULT,
  type AppBootstrapSnapshot,
  type BootstrapProgress,
  type RangeBootstrapData,
} from "@/lib/app-bootstrap";
import { warmWordPronunciationsBatch } from "@/lib/pronunciation-preload";
import type { DiscoverWordData } from "@/components/discover/DiscoverCard";
import type { ReviewSession } from "@/lib/review-session";

type AppBootstrapContextValue = {
  ready: boolean;
  progress: BootstrapProgress;
  ranges: Record<string, RangeBootstrapData> | null;
  wordCache: Record<string, DiscoverWordData> | null;
  defaultRangeId: string | null;
  review: ReviewSession | null;
  updateReviewCache: (data: ReviewSession) => void;
  /** Remove a word (and optional family) from a cached discover band after Journey save. */
  patchRangeAfterSave: (
    rangeId: string,
    word: string,
    familyMembers?: string[] | null,
  ) => void;
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
  const [reviewOverride, setReviewOverride] = useState<ReviewSession | null>(null);

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
        const defaultQueue = loaded.ranges[DEFAULT_BOOTSTRAP_RANGE]?.queue ?? [];
        void warmWordPronunciationsBatch(
          defaultQueue.slice(0, BOOTSTRAP_PRELOAD_DEFAULT).map((item) => item.word),
        );
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

  const updateReviewCache = useCallback((data: ReviewSession) => {
    setReviewOverride(data);
  }, []);

  const patchRangeAfterSave = useCallback(
    (rangeId: string, word: string, familyMembers?: string[] | null) => {
      setSnapshot((prev) => {
        if (!prev?.ranges[rangeId]) return prev;
        const range = prev.ranges[rangeId];
        const taken = new Set(
          [word, ...(familyMembers ?? [word])].map((member) =>
            member.trim().toLowerCase(),
          ),
        );
        const queue = range.queue.filter((item) => {
          const family = item.family_members?.length
            ? item.family_members
            : [item.word];
          return !family.some((member) =>
            taken.has(member.trim().toLowerCase()),
          );
        });
        return {
          ...prev,
          ranges: {
            ...prev.ranges,
            [rangeId]: {
              queue,
              stats: {
                total: range.stats.total,
                hidden: Math.min(range.stats.total, range.stats.hidden + 1),
              },
            },
          },
        };
      });
    },
    [],
  );

  const value = useMemo<AppBootstrapContextValue>(
    () => ({
      ready,
      progress,
      ranges: snapshot?.ranges ?? null,
      wordCache: snapshot?.wordCache ?? null,
      defaultRangeId: snapshot?.defaultRangeId ?? null,
      review: reviewOverride ?? snapshot?.review ?? null,
      updateReviewCache,
      patchRangeAfterSave,
    }),
    [ready, progress, snapshot, reviewOverride, updateReviewCache, patchRangeAfterSave],
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
