"use client";

import {
  HomeLayout1,
  HomeLayout2,
  HomeLayout3,
  HomeLayout4,
  HomeLayout5,
} from "@/components/discover/home-layouts/HomeLayoutVariants";
import type { HomeLayoutProps, HomeLayoutVariant } from "@/components/discover/home-layouts/types";
import { HOME_LAYOUT_VARIANTS } from "@/components/discover/home-layouts/types";
import { AppHeader } from "@/components/layout/AppHeader";
import { useI18n } from "@/hooks/use-i18n";
import {
  readHomeLayoutVariant,
  writeHomeLayoutVariant,
} from "@/lib/home-layout-preference";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const PREVIEW_LAYOUTS: Record<
  HomeLayoutVariant,
  (props: HomeLayoutProps) => React.JSX.Element
> = {
  "1": HomeLayout1,
  "2": HomeLayout2,
  "3": HomeLayout3,
  "4": HomeLayout4,
  "5": HomeLayout5,
};

type HomeLayoutGalleryProps = {
  rangeLabel: string;
  queueLength: number;
  currentIndex: number;
  dueReviewCount: number;
  wordsKnown: number;
  wordsReviewing: number;
  streakDays: number;
  goalType: HomeLayoutProps["goalType"];
  goalCurrent: number;
  goalTarget: number;
  todayWordsLearned: number;
  onStartJourney: () => void;
  onStartReview: () => void;
  onOpenLibrary: () => void;
};

export function HomeLayoutGallery(props: HomeLayoutGalleryProps) {
  const { t } = useI18n();
  const router = useRouter();
  const [selected, setSelected] = useState<HomeLayoutVariant>(() => readHomeLayoutVariant());
  const rankProgress =
    props.queueLength > 0 ? Math.round((props.currentIndex / props.queueLength) * 100) : 0;

  const layoutProps: HomeLayoutProps = {
    preview: true,
    rangeLabel: props.rangeLabel,
    queueLength: props.queueLength,
    rankProgress,
    dueReviewCount: props.dueReviewCount,
    wordsKnown: props.wordsKnown,
    wordsReviewing: props.wordsReviewing,
    streakDays: props.streakDays,
    goalType: props.goalType,
    goalCurrent: props.goalCurrent,
    goalTarget: props.goalTarget,
    todayWordsLearned: props.todayWordsLearned,
    onStartJourney: props.onStartJourney,
    onStartReview: props.onStartReview,
    onOpenLibrary: props.onOpenLibrary,
  };

  function chooseVariant(variant: HomeLayoutVariant) {
    writeHomeLayoutVariant(variant);
    setSelected(variant);
  }

  return (
    <div className="app-screen app-screen--home">
      <AppHeader
        title={t("home.layoutGalleryTitle")}
        leading={
          <Link href="/discover" className="app-header__icon-btn" aria-label={t("journey.backHome")}>
            ←
          </Link>
        }
      />
      <div className="home-scroll page-scroll">
        <div className="home-content px-4 home-layout-gallery">
          <p className="home-body-text mb-4">{t("home.layoutGalleryHint")}</p>
          {HOME_LAYOUT_VARIANTS.map((variant) => {
            const Layout = PREVIEW_LAYOUTS[variant];
            const isSelected = selected === variant;
            return (
              <div key={variant} className="home-layout-gallery__item">
                <Layout {...layoutProps} variant={variant} />
                <button
                  type="button"
                  className={`btn-pill-primary w-full mt-3 ${isSelected ? "opacity-80" : ""}`}
                  onClick={() => {
                    chooseVariant(variant);
                    router.push("/discover");
                  }}
                >
                  {isSelected ? t("home.layoutGallerySelected") : t("home.layoutGalleryChoose")}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
