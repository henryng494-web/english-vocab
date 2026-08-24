"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  runAppBootstrap,
  waitForWelcomeMinimum,
  type AppBootstrapSnapshot,
  type BootstrapProgress,
} from "@/lib/app-bootstrap";

type AppBootstrapContextValue = {
  ready: boolean;
  progress: BootstrapProgress;
  snapshot: AppBootstrapSnapshot | null;
  consumeSnapshot: (rangeId: string) => AppBootstrapSnapshot | null;
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
  const consumedRef = useRef(false);

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

  const value = useMemo<AppBootstrapContextValue>(
    () => ({
      ready,
      progress,
      snapshot,
      consumeSnapshot(rangeId: string) {
        if (consumedRef.current || !snapshot || snapshot.rangeId !== rangeId) {
          return null;
        }
        consumedRef.current = true;
        return snapshot;
      },
    }),
    [ready, progress, snapshot],
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
