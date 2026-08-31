"use client";

import { useCallback, useEffect, useState } from "react";
import {
  getCachedLearningSummary,
  refreshReviewDueSummary,
} from "@/lib/review-due-store";
import {
  loadReviewSession,
  resolveReviewSession,
} from "@/lib/review-session";
import type { VocabWord } from "@/types/database";

export type ReviewSessionState = {
  /** Client mounted and first load attempted */
  ready: boolean;
  loading: boolean;
  dueCount: number;
  queue: VocabWord[];
  pool: VocabWord[];
  error: string | null;
};

export function useReviewSession() {
  const [state, setState] = useState<ReviewSessionState>({
    ready: false,
    loading: true,
    dueCount: 0,
    queue: [],
    pool: [],
    error: null,
  });

  const apply = useCallback(
    (dueCount: number, queue: VocabWord[], pool: VocabWord[], error: string | null) => {
      setState({
        ready: true,
        loading: false,
        dueCount,
        queue,
        pool,
        error,
      });
    },
    [],
  );

  const reload = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      await refreshReviewDueSummary();
      const summary = getCachedLearningSummary();
      const sync = resolveReviewSession(summary);
      if (sync.queue.length > 0) {
        apply(sync.dueCount, sync.queue, sync.pool, null);
      }

      const full = await loadReviewSession();
      apply(full.dueCount, full.queue, full.pool, null);
    } catch (err) {
      const fallback = resolveReviewSession(getCachedLearningSummary());
      apply(
        fallback.dueCount,
        fallback.queue,
        fallback.pool,
        fallback.queue.length > 0
          ? null
          : err instanceof Error
            ? err.message
            : "Failed to load review",
      );
    }
  }, [apply]);

  useEffect(() => {
    void reload();
  }, [reload]);

  const patchQueue = useCallback((queue: VocabWord[]) => {
    setState((prev) => ({ ...prev, queue }));
  }, []);

  const patchPool = useCallback((pool: VocabWord[]) => {
    setState((prev) => ({ ...prev, pool }));
  }, []);

  const patchBoth = useCallback((queue: VocabWord[], pool: VocabWord[]) => {
    setState((prev) => ({ ...prev, queue, pool }));
  }, []);

  return {
    ...state,
    reload,
    patchQueue,
    patchPool,
    patchBoth,
  };
}
