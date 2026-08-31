/** @deprecated Use `@/lib/review-session` — kept for legacy imports. */
export {
  enrichReviewSession,
  fetchLearningSummary,
  loadReviewSession,
  loadReviewSessionFast,
  resolveReviewSession,
  type LearningSummaryRow,
  type ReviewSession,
} from "@/lib/review-session";

import {
  fetchLearningSummary,
  loadReviewSession,
  resolveReviewSession,
  type LearningSummaryRow,
  type ReviewSession,
} from "@/lib/review-session";

/** @deprecated Use ReviewSession */
export type ReviewSessionData = {
  allWords: ReviewSession["pool"];
  dueQueue: ReviewSession["queue"];
};

export function toReviewSessionData(session: ReviewSession): ReviewSessionData {
  return { allWords: session.pool, dueQueue: session.queue };
}

export async function fetchReviewSessionBundle(): Promise<{
  summary: LearningSummaryRow[];
  expectedDue: number;
  session: ReviewSessionData;
}> {
  const summary = await fetchLearningSummary();
  const expectedDue = resolveReviewSession(summary).dueCount;
  const session = await loadReviewSession();
  return {
    summary,
    expectedDue,
    session: toReviewSessionData(session),
  };
}

export async function fetchExpectedDueReviewCount(): Promise<number> {
  const summary = await fetchLearningSummary();
  return resolveReviewSession(summary).dueCount;
}

export function countLocalDueReviewWords(): number {
  return resolveReviewSession([]).dueCount;
}

export function loadLocalReviewSessionSync(): ReviewSessionData {
  return toReviewSessionData(resolveReviewSession([]));
}

export async function loadActionableReviewSession(
  prefetchedSummary?: LearningSummaryRow[],
): Promise<ReviewSessionData> {
  if (prefetchedSummary) {
    return toReviewSessionData(resolveReviewSession(prefetchedSummary));
  }
  return toReviewSessionData(await loadReviewSession());
}
