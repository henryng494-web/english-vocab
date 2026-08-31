"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  getCachedLearningSummary,
  refreshReviewDueSummary,
} from "@/lib/review-due-store";
import {
  enrichDueReviewWords,
  enrichReviewSession,
  resolveReviewSession,
} from "@/lib/review-session";
import { hydrateReviewWordLocal } from "@/lib/review-word-hydrate";
import type { VocabWord } from "@/types/database";

function readInstantReviewState(): ReviewSessionState {
  if (typeof window === "undefined") {
    return {
      ready: false,
      loading: true,
      enriching: false,
      dueCount: 0,
      queue: [],
      pool: [],
      error: null,
    };
  }
  const instant = resolveReviewSession(getCachedLearningSummary());
  const hasQueue = instant.queue.length > 0;
  return {
    ready: true,
    loading: !hasQueue,
    enriching: hasQueue,
    dueCount: instant.dueCount,
    queue: instant.queue,
    pool: instant.pool,
    error: null,
  };
}

export type ReviewSessionState = {
  ready: boolean;
  /** True only while waiting for the first queue (no cards to show yet). */
  loading: boolean;
  enriching: boolean;
  dueCount: number;
  queue: VocabWord[];
  pool: VocabWord[];
  error: string | null;
};

export function useReviewSession() {
  const enrichGenRef = useRef(0);
  const [state, setState] = useState<ReviewSessionState>(readInstantReviewState);

  const apply = useCallback(
    (
      dueCount: number,
      queue: VocabWord[],
      pool: VocabWord[],
      error: string | null,
      options?: { loading?: boolean; enriching?: boolean },
    ) => {
      setState({
        ready: true,
        loading: options?.loading ?? false,
        enriching: options?.enriching ?? false,
        dueCount,
        queue,
        pool,
        error,
      });
    },
    [],
  );

  const reload = useCallback(async () => {
    const instant = resolveReviewSession(getCachedLearningSummary());
    if (instant.queue.length > 0) {
      apply(instant.dueCount, instant.queue, instant.pool, null, {
        loading: false,
        enriching: true,
      });
    } else {
      setState((prev) => ({ ...prev, loading: true, error: null }));
    }

    const enrichGen = enrichGenRef.current + 1;
    enrichGenRef.current = enrichGen;

    try {
      await refreshReviewDueSummary();
      const summary = getCachedLearningSummary();
      const sync = resolveReviewSession(summary);

      if (sync.queue.length > 0) {
        apply(sync.dueCount, sync.queue, sync.pool, null, {
          loading: false,
          enriching: true,
        });
      } else if (instant.queue.length === 0) {
        apply(0, [], [], null, { loading: false, enriching: false });
        return;
      }

      const baseQueue = sync.queue.length > 0 ? sync.queue : instant.queue;

      const dueEnriched = await enrichDueReviewWords(summary, baseQueue);
      if (enrichGenRef.current !== enrichGen) return;
      if (dueEnriched.queue.length > 0) {
        apply(dueEnriched.dueCount, dueEnriched.queue, dueEnriched.pool, null, {
          loading: false,
          enriching: true,
        });
      }

      const enriched = await enrichReviewSession(summary, dueEnriched.queue);
      if (enrichGenRef.current !== enrichGen) return;

      apply(enriched.dueCount, enriched.queue, enriched.pool, null, {
        loading: false,
        enriching: false,
      });
    } catch (err) {
      if (enrichGenRef.current !== enrichGen) return;
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
        { loading: false, enriching: false },
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
