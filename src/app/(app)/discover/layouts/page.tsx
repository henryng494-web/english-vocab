"use client";

import { HomeLayoutGallery } from "@/components/discover/home-layouts/HomeLayoutGallery";
import { useAppBootstrap } from "@/context/AppBootstrapContext";
import { WORD_RANGES } from "@/data/word-ranges";
import { DEFAULT_BOOTSTRAP_RANGE } from "@/lib/app-bootstrap";
import { getTodayWordsLearned } from "@/lib/daily-goal";
import { filterDiscoverQueue } from "@/lib/discover-fetch";
import { getGoalProgressSnapshot, subscribeGoalProgress } from "@/lib/goal-progress";
import {
  countLearningWords,
  countMasteredWords,
} from "@/lib/learning-storage";
import { readOnboarding } from "@/lib/onboarding";
import {
  getReviewDueCount,
  subscribeReviewDueCount,
} from "@/lib/review-due-store";
import { getCurrentStreak, subscribeStreak } from "@/lib/streak";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useSyncExternalStore } from "react";

const SERVER_GOAL_PROGRESS = {
  goalType: "minutes" as const,
  current: 0,
  target: 20,
  met: false,
};

export default function HomeLayoutsPage() {
  const router = useRouter();
  const { ranges: bootstrapRanges } = useAppBootstrap();
  const [rangeId, setRangeId] = useState(DEFAULT_BOOTSTRAP_RANGE);
  const [wordsKnown, setWordsKnown] = useState(0);
  const [wordsReviewing, setWordsReviewing] = useState(0);
  const [todayLearned, setTodayLearned] = useState(0);

  const goalProgress = useSyncExternalStore(
    subscribeGoalProgress,
    getGoalProgressSnapshot,
    () => SERVER_GOAL_PROGRESS,
  );
  const streakDays = useSyncExternalStore(subscribeStreak, getCurrentStreak, () => 0);
  const dueReviewCount = useSyncExternalStore(
    subscribeReviewDueCount,
    getReviewDueCount,
    () => 0,
  );

  useEffect(() => {
    const state = readOnboarding();
    if (state.completed) setRangeId(state.preferredRangeId);
  }, []);

  useEffect(() => {
    const refresh = () => {
      setWordsKnown(countMasteredWords());
      setWordsReviewing(countLearningWords());
      setTodayLearned(getTodayWordsLearned());
    };
    refresh();
    window.addEventListener("focus", refresh);
    return () => window.removeEventListener("focus", refresh);
  }, []);

  const rangeLabel = useMemo(
    () => WORD_RANGES.find((r) => r.id === rangeId)?.label ?? rangeId,
    [rangeId],
  );

  const queueLength = useMemo(() => {
    const cached = bootstrapRanges?.[rangeId];
    if (!cached) return 0;
    return filterDiscoverQueue(cached.queue).length;
  }, [bootstrapRanges, rangeId]);

  return (
    <HomeLayoutGallery
      rangeLabel={rangeLabel}
      queueLength={queueLength}
      currentIndex={0}
      dueReviewCount={dueReviewCount}
      wordsKnown={wordsKnown}
      wordsReviewing={wordsReviewing}
      streakDays={streakDays}
      goalType={goalProgress.goalType}
      goalCurrent={goalProgress.current}
      goalTarget={goalProgress.target}
      todayWordsLearned={todayLearned}
      onStartJourney={() => router.push("/journey")}
      onStartReview={() => router.push("/learn")}
      onOpenLibrary={() => router.push("/words")}
    />
  );
}
