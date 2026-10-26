"use client";

import { usePaywall } from "@/context/PaywallContext";
import { useI18n } from "@/hooks/use-i18n";
import { freeTierBlockReason } from "@/lib/free-tier-gate";
import { FREE_DAILY_REVIEWS } from "@/lib/pro-access";
import type { ReactNode } from "react";

type FreeTierGateProps = {
  action: "review" | "learn";
  dueReviewCount?: number;
  rangeId?: string;
  children: ReactNode;
};

/** Blocks children and shows upgrade prompt when Free daily limits are exhausted. */
export function FreeTierGate({ action, dueReviewCount, rangeId, children }: FreeTierGateProps) {
  const { isFree, showUpgradePrompt, openPaywall } = usePaywall();
  const { t } = useI18n();
  const reason = freeTierBlockReason(action, { dueReviewCount, rangeId });

  if (!isFree || !reason) {
    return <>{children}</>;
  }

  return (
    <div className="app-screen app-screen--home flex flex-col">
      <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/assets/mascot-croc.png" alt="" aria-hidden className="h-16 w-auto" />
        <h1 className="text-lg font-bold text-foreground">
          {reason === "reviews" ? t("paywall.promptTitle") : t("paywall.promptTitle")}
        </h1>
        <p className="text-sm text-foreground/75">
          {reason === "reviews"
            ? t("paywall.reviewLimit", { count: FREE_DAILY_REVIEWS })
            : t("paywall.freeLearnDone")}
        </p>
        <button
          type="button"
          onClick={() => showUpgradePrompt(reason)}
          className="w-full max-w-xs rounded-full bg-[#7c3aed] py-3 font-bold text-white"
        >
          {t("paywall.ctaUpgrade")}
        </button>
        <button
          type="button"
          onClick={openPaywall}
          className="text-sm text-foreground/60 underline"
        >
          {t("paywall.upgradeBtn")}
        </button>
      </div>
    </div>
  );
}
