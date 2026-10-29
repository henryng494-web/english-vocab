"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { AUTH_SESSION_EVENT } from "@/context/AuthSessionContext";
import {
  runAppBootstrap,
  waitForWelcomeMinimum,
  DEFAULT_BOOTSTRAP_RANGE,
  BOOTSTRAP_PRELOAD_DEFAULT,
  BOOTSTRAP_UI_RELEASE_MS,
  MIN_WELCOME_MS,
  isBootstrapSnapshotUsable,
  type AppBootstrapSnapshot,
  type BootstrapProgress,
  type RangeBootstrapData,
} from "@/lib/app-bootstrap";
import {
  persistBootstrapSnapshot,
  readPersistedBootstrapSnapshot,
} from "@/lib/bootstrap-snapshot-storage";
import {
  seedJourneyBootstrapRanges,
  warmWordPronunciationsBatch,
} from "@/lib/pronunciation-preload";
import { waitForClientAuthReady } from "@/lib/wait-client-auth-ready";
import type { DiscoverWordData } from "@/components/discover/DiscoverCard";
import type { ReviewSession } from "@/lib/review-session";

type AppBootstrapContextValue = {
  ready: boolean;
  /** UI gate — true immediately when local cache exists; else within ~5s failsafe. */
  bootstrapComplete: boolean;
  /** True when at least one discover band loaded successfully. */
  bootstrapHasData: boolean;
  progress: BootstrapProgress;
  ranges: Record<string, RangeBootstrapData> | null;
  wordCache: Record<string, DiscoverWordData> | null;
  defaultRangeId: string | null;
  review: ReviewSession | null;
  updateReviewCache: (data: ReviewSession) => void;
  patchRangeAfterSave: (
    rangeId: string,
    word: string,
    familyMembers?: string[] | null,
  ) => void;
  refreshBootstrap: () => Promise<void>;
};

const AppBootstrapContext = createContext<AppBootstrapContextValue | null>(null);

const INITIAL_PROGRESS: BootstrapProgress = {
  progress: 0,
  message: "Welcome!",
};

const FAILSAFE_SNAPSHOT: AppBootstrapSnapshot = {
  defaultRangeId: DEFAULT_BOOTSTRAP_RANGE,
  ranges: {},
  wordCache: {},
  review: null,
  complete: false,
};

/** In-memory snapshot for same-tab navigation. */
let completedSnapshot: AppBootstrapSnapshot | null = null;

function resolveInitialSnapshot(): AppBootstrapSnapshot | null {
  if (completedSnapshot && isBootstrapSnapshotUsable(completedSnapshot)) {
    return completedSnapshot;
  }
  const persisted = readPersistedBootstrapSnapshot();
  if (persisted) {
    completedSnapshot = persisted;
    return persisted;
  }
  return null;
}

function commitSnapshot(loaded: AppBootstrapSnapshot): void {
  if (!isBootstrapSnapshotUsable(loaded)) return;
  completedSnapshot = loaded;
  persistBootstrapSnapshot(loaded);
}

export function AppBootstrapProvider({ children }: { children: ReactNode }) {
  const initialSnapshot = resolveInitialSnapshot();
  const hadInstantCache = isBootstrapSnapshotUsable(initialSnapshot);

  const [ready, setReady] = useState(hadInstantCache);
  const [progress, setProgress] = useState<BootstrapProgress>(() =>
    hadInstantCache
      ? { progress: 35, message: "Welcome back!" }
      : INITIAL_PROGRESS,
  );
  const [snapshot, setSnapshot] = useState<AppBootstrapSnapshot | null>(
    initialSnapshot,
  );
  const [reviewOverride, setReviewOverride] = useState<ReviewSession | null>(null);
  const [uiReleased, setUiReleased] = useState(hadInstantCache);
  const bootstrapRunRef = useRef(0);
  const backgroundSyncStarted = useRef(false);

  const releaseUi = useCallback(() => {
    setUiReleased(true);
  }, []);

  useEffect(() => {
    if (uiReleased) return;
    const timer = window.setTimeout(releaseUi, BOOTSTRAP_UI_RELEASE_MS);
    return () => window.clearTimeout(timer);
  }, [uiReleased, releaseUi]);

  useEffect(() => {
    if (initialSnapshot) {
      seedJourneyBootstrapRanges(initialSnapshot.ranges);
    }
  }, [initialSnapshot]);

  useEffect(() => {
    if (!hadInstantCache) return;
    const mid = window.setTimeout(
      () => setProgress({ progress: 78, message: "Loading your journey…" }),
      420,
    );
    const done = window.setTimeout(
      () => setProgress({ progress: 100, message: "" }),
      Math.max(900, MIN_WELCOME_MS - 280),
    );
    return () => {
      window.clearTimeout(mid);
      window.clearTimeout(done);
    };
  }, [hadInstantCache]);

  const syncBootstrapFromNetwork = useCallback(
    async (options?: { awaitWelcomeMinimum?: boolean }) => {
      const runId = ++bootstrapRunRef.current;
      const startedAt = Date.now();
      const instantCache = isBootstrapSnapshotUsable(snapshot ?? initialSnapshot);

      if (instantCache) {
        releaseUi();
        setReady(true);
      }

      try {
        await waitForClientAuthReady();
        if (runId !== bootstrapRunRef.current) return;

        const loaded = await Promise.race([
          runAppBootstrap((next) => {
            if (runId === bootstrapRunRef.current) setProgress(next);
          }),
          new Promise<AppBootstrapSnapshot>((resolve) => {
            window.setTimeout(
              () => resolve(FAILSAFE_SNAPSHOT),
              instantCache ? 30_000 : BOOTSTRAP_UI_RELEASE_MS,
            );
          }),
        ]);

        if (options?.awaitWelcomeMinimum && !instantCache) {
          await waitForWelcomeMinimum(startedAt);
        }
        if (runId !== bootstrapRunRef.current) return;

        if (isBootstrapSnapshotUsable(loaded)) {
          commitSnapshot(loaded);
          setSnapshot(loaded);
          seedJourneyBootstrapRanges(loaded.ranges);
          const defaultQueue = loaded.ranges[DEFAULT_BOOTSTRAP_RANGE]?.queue ?? [];
          const reviewWords =
            loaded.review?.queue?.slice(0, 3).map((item) => item.word) ?? [];
          void warmWordPronunciationsBatch([
            ...reviewWords,
            ...defaultQueue
              .slice(0, BOOTSTRAP_PRELOAD_DEFAULT)
              .map((item) => item.word),
          ]);
        } else if (completedSnapshot && isBootstrapSnapshotUsable(completedSnapshot)) {
          setSnapshot(completedSnapshot);
          seedJourneyBootstrapRanges(completedSnapshot.ranges);
        }

        setReady(true);
        releaseUi();
      } catch {
        if (!instantCache) {
          await waitForWelcomeMinimum(startedAt);
        }
        if (runId !== bootstrapRunRef.current) return;
        if (completedSnapshot && isBootstrapSnapshotUsable(completedSnapshot)) {
          setSnapshot(completedSnapshot);
        }
        setProgress({ progress: 100, message: "Ready to learn!" });
        setReady(true);
        releaseUi();
      }
    },
    [initialSnapshot, releaseUi, snapshot],
  );

  useEffect(() => {
    if (backgroundSyncStarted.current) return;
    backgroundSyncStarted.current = true;
    void syncBootstrapFromNetwork({ awaitWelcomeMinimum: true });
  }, [syncBootstrapFromNetwork]);

  useEffect(() => {
    const retryIfNeeded = () => {
      void syncBootstrapFromNetwork({ awaitWelcomeMinimum: false });
    };
    window.addEventListener(AUTH_SESSION_EVENT, retryIfNeeded);
    return () => {
      window.removeEventListener(AUTH_SESSION_EVENT, retryIfNeeded);
    };
  }, [syncBootstrapFromNetwork]);

  const refreshBootstrap = useCallback(async () => {
    await syncBootstrapFromNetwork({ awaitWelcomeMinimum: false });
  }, [syncBootstrapFromNetwork]);

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
        const next = {
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
          complete: true,
        };
        commitSnapshot(next);
        return next;
      });
    },
    [],
  );

  const bootstrapHasData = isBootstrapSnapshotUsable(snapshot);
  const bootstrapComplete = uiReleased;

  const value = useMemo<AppBootstrapContextValue>(
    () => ({
      ready,
      bootstrapComplete,
      bootstrapHasData,
      progress,
      ranges: snapshot?.ranges ?? null,
      wordCache: snapshot?.wordCache ?? null,
      defaultRangeId: snapshot?.defaultRangeId ?? null,
      review: reviewOverride ?? snapshot?.review ?? null,
      updateReviewCache,
      patchRangeAfterSave,
      refreshBootstrap,
    }),
    [
      ready,
      bootstrapComplete,
      bootstrapHasData,
      progress,
      snapshot,
      reviewOverride,
      updateReviewCache,
      patchRangeAfterSave,
      refreshBootstrap,
    ],
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
