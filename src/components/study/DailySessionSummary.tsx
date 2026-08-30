"use client";

import { JungleMascot } from "@/components/mascot/JungleMascot";
import { useI18n } from "@/hooks/use-i18n";
import { dismissDailySummary, type DailySession } from "@/lib/daily-session";
import { displayFontClass } from "@/lib/fonts";

type DailySessionSummaryProps = {
  session: DailySession;
};

export function DailySessionSummary({ session }: DailySessionSummaryProps) {
  const { t } = useI18n();

  return (
    <div className="home-scroll page-scroll">
      <div className="home-content px-4">
        <section className="home-card home-today border-accent-200 bg-accent-50/40 text-center">
          <JungleMascot character="monkey" size={88} className="mx-auto" />
          <h2 className={`home-section-title mt-4 ${displayFontClass}`}>
            {t("session.summaryTitle")}
          </h2>
          <p className="home-body-text mt-2">{t("session.summaryBody")}</p>

          <div className="home-stat-grid mt-5">
            <div className="home-card home-stat-card border-secondary-200 bg-secondary-50/50">
              <span className="home-stat-icon text-xl" aria-hidden>
                🔁
              </span>
              <p className="home-stat-label text-secondary-800">{t("session.reviewed")}</p>
              <p className={`home-stat-value text-secondary-700 ${displayFontClass}`}>
                {session.reviewsCompleted}
              </p>
            </div>
            <div className="home-card home-stat-card border-primary-200 bg-primary-50/50">
              <span className="home-stat-icon text-xl" aria-hidden>
                📖
              </span>
              <p className="home-stat-label text-primary-800">{t("session.newWords")}</p>
              <p className={`home-stat-value text-primary-700 ${displayFontClass}`}>
                {session.newWordsCompleted}
              </p>
            </div>
          </div>

          <button
            type="button"
            className="btn-pill-primary mt-6 w-full"
            onClick={() => dismissDailySummary()}
          >
            {t("session.done")}
          </button>
        </section>
      </div>
    </div>
  );
}

export function DailySessionProgressBanner({
  phase,
  newCompleted,
  newTarget,
  reviewCompleted,
  reviewPlanned,
}: {
  phase: "review" | "journey";
  newCompleted: number;
  newTarget: number;
  reviewCompleted?: number;
  reviewPlanned?: number;
}) {
  const { t } = useI18n();

  const label =
    phase === "review"
      ? t("session.bannerReview", {
          current: reviewCompleted ?? 0,
          total: reviewPlanned ?? 0,
        })
      : t("session.bannerNew", { current: newCompleted, total: newTarget });

  return (
    <p className="daily-session-banner" role="status">
      {t("session.bannerPrefix")} · {label}
    </p>
  );
}
