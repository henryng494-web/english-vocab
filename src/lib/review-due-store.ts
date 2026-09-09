"use client";

import {
  countDueReviewWordKeys,
  getReviewBadgeDueCount,
} from "@/lib/review-schedule";
import {
  fetchLearningSummary,
  type LearningSummaryRow,
} from "@/lib/review-session";

let cachedSummary: LearningSummaryRow[] | null = null;
let summaryFetch: Promise<LearningSummaryRow[]> | null = null;
const listeners = new Set<() => void>();

function emit() {
  for (const listener of listeners) {
    listener();
  }
}

export function getReviewDueCount(): number {
  if (typeof window === "undefined") return 0;
  return getReviewBadgeDueCount(cachedSummary ?? []);
}

export function getTotalDueReviewCount(): number {
  if (typeof window === "undefined") return 0;
  return countDueReviewWordKeys(cachedSummary ?? []);
}

export function getCachedLearningSummary(): LearningSummaryRow[] {
  return cachedSummary ?? [];
}

/** Seed summary from splash bootstrap so Review tab skips a cold fetch. */
export function seedCachedLearningSummary(rows: LearningSummaryRow[]): void {
  if (rows.length === 0) return;
  cachedSummary = rows;
  emit();
}

export function subscribeReviewDueCount(listener: () => void): () => void {
  listeners.add(listener);

  const onChange = () => {
    void refreshReviewDueSummary();
  };

  if (typeof window !== "undefined") {
    window.addEventListener("vocab-learning-changed", onChange);
    void refreshReviewDueSummary();
  }

  return () => {
    listeners.delete(listener);
    if (typeof window !== "undefined") {
      window.removeEventListener("vocab-learning-changed", onChange);
    }
  };
}

export async function refreshReviewDueSummary(): Promise<number> {
  if (typeof window === "undefined") return 0;

  if (!summaryFetch) {
    summaryFetch = fetchLearningSummary().finally(() => {
      summaryFetch = null;
    });
  }

  cachedSummary = await summaryFetch;
  const count = getReviewBadgeDueCount(cachedSummary);
  emit();
  return count;
}
