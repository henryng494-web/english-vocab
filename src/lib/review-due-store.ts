"use client";

import { getDailyReviewPlanRemaining } from "@/lib/daily-goal";
import { countDueReviewWordKeys } from "@/lib/review-schedule";
import {
  fetchLearningSummary,
  type LearningSummaryRow,
} from "@/lib/review-session";

let cachedSummary: LearningSummaryRow[] | null = null;
let summaryFetch: Promise<LearningSummaryRow[]> | null = null;
const listeners = new Set<() => void>();
let globalListenersBound = false;

function emit() {
  for (const listener of listeners) {
    listener();
  }
}

function bindGlobalListeners(): void {
  if (globalListenersBound || typeof window === "undefined") return;
  globalListenersBound = true;
  const onChange = () => {
    emit();
    void refreshReviewDueSummary();
  };
  window.addEventListener("vocab-learning-changed", onChange);
  window.addEventListener("daily-reviews-changed", onChange);
  window.addEventListener("app-settings-changed", onChange);
}

export function getReviewDueCount(): number {
  if (typeof window === "undefined") return 0;
  return getDailyReviewPlanRemaining();
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
  bindGlobalListeners();
  listeners.add(listener);
  if (listeners.size === 1) {
    void refreshReviewDueSummary();
  }
  return () => {
    listeners.delete(listener);
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
  const count = getDailyReviewPlanRemaining();
  emit();
  return count;
}
