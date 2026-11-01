"use client";

import { learnerScope, isLearnerScopeCurrent } from "@/lib/learner-storage";

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
let cacheScope = "";
function ensureScope(): void {
  if (cacheScope === learnerScope()) return;
  cacheScope = learnerScope();
  cachedSummary = null;
  summaryFetch = null;
}
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
  ensureScope();
  if (typeof window === "undefined") return 0;
  return getReviewBadgeDueCount(cachedSummary ?? []);
}

export function getTotalDueReviewCount(): number {
  ensureScope();
  if (typeof window === "undefined") return 0;
  return countDueReviewWordKeys(cachedSummary ?? []);
}

export function getCachedLearningSummary(): LearningSummaryRow[] {
  ensureScope();
  return cachedSummary ?? [];
}

/** Seed summary from splash bootstrap so Review tab skips a cold fetch. */
export function seedCachedLearningSummary(rows: LearningSummaryRow[]): void {
  ensureScope();
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
  ensureScope();
  if (typeof window === "undefined") return 0;

  const scope = learnerScope();
  if (!summaryFetch) {
    summaryFetch = fetchLearningSummary().finally(() => {
      if (isLearnerScopeCurrent(scope)) summaryFetch = null;
    });
  }

  const rows = await summaryFetch;
  if (!isLearnerScopeCurrent(scope)) return 0;
  cachedSummary = rows;
  const count = getReviewBadgeDueCount(cachedSummary);
  emit();
  return count;
}
