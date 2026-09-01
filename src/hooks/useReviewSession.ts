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
import {
  hasReviewClueFields,
  hydrateReviewWordLocal,
} from "@/lib/review-word-hydrate";
import type { VocabWord } from "@/types/database";

function firstCardDueReady(queue: VocabWord[]): boolean {
  const first = queue[0];
  if (!first) return false;
  return hasReviewClueFields(hydrateReviewWordLocal(first));
}

function readInstantReviewState(): ReviewSessionState {
  if (typeof window === "undefined") {
    return {
      ready: false,
      loading: true,
      enriching: false,
      dueReady: false,
      dueCount: 0,
      queue: [],
      pool: [],
      error: null,
    };
  }
  const instant = resolveReviewSession(getCachedLearningSummary());
  const queue = instant.queue.map(hydrateReviewWordLocal);
  const hasQueue = queue.length > 0;
  const dueReady = hasQueue && firstCardDueReady(queue);
  return {
    ready: true,
    loading: !hasQueue,
    enriching: hasQueue,
    dueReady,
    dueCount: instant.dueCount,
    queue,
    pool: queue,
    error: null,
  };
}

export type ReviewSessionState = {
  ready: boolean;
  /** True only while waiting for the first queue (no cards to show yet). */
  loading: boolean;
  /** True while the full review pool is still loading in the background. */
  enriching: boolean;
  /** True when the first card has clue text (local cache or due-word DB fetch). */
  dueReady: boolean;
  dueCount: number;
  queue: VocabWord[];
  pool: VocabWord[];
  error: string | null;
};

const INITIAL_REVIEW_STATE: ReviewSessionState = {
  ready: false,
  loading: true,
  enriching: false,
  dueReady: false,
  dueCount: 0,
  queue: [],
  pool: [],
  error: null,
};

export function useReviewSession() {
  const enrichGenRef = useRef(0);
  const [state, setState] = useState<ReviewSessionState>(INITIAL_REVIEW_STATE);

  const apply = useCallback(
    (
      dueCount: number,
      queue: VocabWord[],
      pool: VocabWord[],
      error: string | null,
      options?: {
        loading?: boolean;
        enriching?: boolean;
        dueReady?: boolean;
        mergeQueue?: boolean;
      },
    ) => {
      setState((prev) => {
        const hydratedQueue = queue.map(hydrateReviewWordLocal);
        const hydratedPool = pool.map(hydrateReviewWordLocal);
        const sameOrder =
          options?.mergeQueue &&
          prev.queue.length > 0 &&
          prev.queue.length === hydratedQueue.length &&
          prev.queue.every(
            (word, index) =>
              word.word.trim().toLowerCase() ===
              hydratedQueue[index]?.word.trim().toLowerCase(),
          );
        const poolByKey = new Map(
          hydratedPool.map((word) => [word.word.trim().toLowerCase(), word]),
        );
        const nextQueue = sameOrder
          ? prev.queue.map(
              (word) =>
                hydrateReviewWordLocal(
                  poolByKey.get(word.word.trim().toLowerCase()) ?? word,
                ),
            )
          : hydratedQueue;

        return {
          ready: true,
          loading: options?.loading ?? false,
          enriching: options?.enriching ?? false,
          dueReady:
            options?.dueReady ??
            (nextQueue.length > 0 && firstCardDueReady(nextQueue)),
          dueCount,
          queue: nextQueue,
          pool: hydratedPool,
          error,
        };
      });
    },
    [],
  );

  const reload = useCallback(async () => {
    const instant = resolveReviewSession(getCachedLearningSummary());
    const instantQueue = instant.queue.map(hydrateReviewWordLocal);
    if (instantQueue.length > 0) {
      apply(instant.dueCount, instantQueue, instantQueue, null, {
        loading: false,
        enriching: true,
        dueReady: firstCardDueReady(instantQueue),
      });
    } else {
      const cached = readInstantReviewState();
      if (cached.queue.length > 0) {
        apply(cached.dueCount, cached.queue, cached.pool, null, {
          loading: false,
          enriching: true,
          dueReady: cached.dueReady,
        });
      } else {
        setState((prev) => ({ ...prev, loading: true, error: null }));
      }
    }

    const enrichGen = enrichGenRef.current + 1;
    enrichGenRef.current = enrichGen;

    try {
      const summaryPromise = refreshReviewDueSummary();
      const dueEnrichedPromise =
        instantQueue.length > 0
          ? enrichDueReviewWords(getCachedLearningSummary(), instantQueue)
          : Promise.resolve<{ dueCount: number; queue: VocabWord[]; pool: VocabWord[] } | null>(null);

      await summaryPromise;
      const summary = getCachedLearningSummary();
      const sync = resolveReviewSession(summary);
      const syncQueue = sync.queue.map(hydrateReviewWordLocal);

      if (instantQueue.length === 0 && syncQueue.length > 0) {
        apply(sync.dueCount, syncQueue, syncQueue, null, {
          loading: false,
          enriching: true,
          dueReady: firstCardDueReady(syncQueue),
        });
      }

      const dueEnriched = await dueEnrichedPromise;
      if (enrichGenRef.current !== enrichGen) return;

      const baseQueue =
        dueEnriched?.queue.length
          ? dueEnriched.queue
          : syncQueue.length > 0
            ? syncQueue
            : instantQueue;

      if (baseQueue.length > 0) {
        apply(
          sync.dueCount || dueEnriched?.dueCount || instant.dueCount,
          baseQueue,
          dueEnriched?.pool ?? baseQueue,
          null,
          {
            loading: false,
            enriching: true,
            dueReady: true,
            mergeQueue: true,
          },
        );
      } else if (instantQueue.length === 0 && syncQueue.length === 0) {
        apply(0, [], [], null, { loading: false, enriching: false, dueReady: false });
        return;
      }

      const enriched = await enrichReviewSession(summary, baseQueue);
      if (enrichGenRef.current !== enrichGen) return;

      apply(enriched.dueCount || sync.dueCount, enriched.queue, enriched.pool, null, {
        loading: false,
        enriching: false,
        dueReady: true,
        mergeQueue: true,
      });
    } catch (err) {
      if (enrichGenRef.current !== enrichGen) return;
      const fallback = resolveReviewSession(getCachedLearningSummary());
      const fallbackQueue = fallback.queue.map(hydrateReviewWordLocal);
      apply(
        fallback.dueCount,
        fallbackQueue,
        fallbackQueue,
        fallbackQueue.length > 0
          ? null
          : err instanceof Error
            ? err.message
            : "Failed to load review",
        {
          loading: false,
          enriching: false,
          dueReady: firstCardDueReady(fallbackQueue),
        },
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

  const patchWordFields = useCallback(
    (mutator: (item: VocabWord) => VocabWord) => {
      setState((prev) => ({
        ...prev,
        queue: prev.queue.map(mutator),
        pool: prev.pool.map(mutator),
      }));
    },
    [],
  );

  return {
    ...state,
    reload,
    patchQueue,
    patchPool,
    patchBoth,
    patchWordFields,
  };
}
