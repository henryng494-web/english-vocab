"use client";

import { useAppSettings } from "@/context/AppSettingsContext";
import { capitalizeFirst } from "@/lib/format-text";
import {
  countGoalMessageKey,
  dailyGoalMessageKey,
  pronounceSpeedMessageKey,
  translate,
  type AppLocale,
  type MessageKey,
} from "@/lib/i18n/messages";
import { normalizeWordType } from "@/lib/word-type";
import {
  displayWordRegister,
  type WordRegister,
} from "@/lib/word-meanings";
import { useCallback, useMemo } from "react";
import type { CountGoalTarget, DailyGoalMinutes, GoalType, PronounceSpeed } from "@/lib/app-settings";
import type { ReviewIntervalDays } from "@/lib/review-schedule";

export function useI18n() {
  const { appLanguage } = useAppSettings();
  const locale = appLanguage;

  const t = useCallback(
    (key: MessageKey, params?: Record<string, string | number>) =>
      translate(locale, key, params),
    [locale],
  );

  const dailyGoalLabel = useCallback(
    (minutes: DailyGoalMinutes) => {
      const key = dailyGoalMessageKey(minutes);
      return key ? t(key) : `${minutes} min`;
    },
    [t],
  );

  const countGoalLabel = useCallback(
    (count: CountGoalTarget) => {
      const key = countGoalMessageKey(count);
      return key ? t(key) : String(count);
    },
    [t],
  );

  const goalTypeLabel = useCallback(
    (goalType: GoalType) => {
      const map: Record<GoalType, MessageKey> = {
        minutes: "menu.goalMinutes",
        new_words: "menu.goalNewWords",
        reviews: "menu.goalReviews",
      };
      return t(map[goalType]);
    },
    [t],
  );

  const pronounceSpeedLabel = useCallback(
    (speed: PronounceSpeed) => {
      const key = pronounceSpeedMessageKey(speed);
      return key ? t(key) : speed;
    },
    [t],
  );

  const registerLabel = useCallback(
    (register: WordRegister | null | undefined): string | null => {
      const displayed = displayWordRegister(register);
      if (!displayed) return null;
      return t(`register.${displayed}` as MessageKey);
    },
    [t],
  );

  const wordTypeLabel = useCallback(
    (pos: string | null | undefined, word?: string): string | null => {
      const normalized = normalizeWordType(pos, word);
      if (!normalized) return null;
      const key = `pos.${normalized}` as MessageKey;
      const localized = translate(locale, key);
      if (localized !== key) return localized;
      return locale === "en" ? capitalizeFirst(normalized) : null;
    },
    [locale],
  );

  const reviewTimesLabel = useCallback(
    (timesReviewed: number): string => {
      if (timesReviewed <= 0) return t("review.notYet");
      if (timesReviewed === 1) return t("review.onceSoFar");
      return t("review.timesSoFar", { count: timesReviewed });
    },
    [t],
  );

  const reviewInLabel = useCallback(
    (days: ReviewIntervalDays): string => {
      return days === 1
        ? t("review.reviewIn1Day")
        : t("review.reviewInDays", { days });
    },
    [t],
  );

  const reviewConfirmLabel = useCallback(
    (days: ReviewIntervalDays, markMastered: boolean): string => {
      return markMastered ? t("review.alreadyKnow") : reviewInLabel(days);
    },
    [reviewInLabel, t],
  );

  return useMemo(
    () => ({
      locale,
      t,
      dailyGoalLabel,
      countGoalLabel,
      goalTypeLabel,
      pronounceSpeedLabel,
      registerLabel,
      wordTypeLabel,
      reviewTimesLabel,
      reviewInLabel,
      reviewConfirmLabel,
    }),
    [
      locale,
      t,
      dailyGoalLabel,
      countGoalLabel,
      goalTypeLabel,
      pronounceSpeedLabel,
      registerLabel,
      wordTypeLabel,
      reviewTimesLabel,
      reviewInLabel,
      reviewConfirmLabel,
    ],
  );
}

export function useLocale(): AppLocale {
  return useAppSettings().appLanguage;
}
