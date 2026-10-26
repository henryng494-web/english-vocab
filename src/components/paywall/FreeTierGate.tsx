"use client";

import { useAuthSession } from "@/context/AuthSessionContext";
import { usePaywall } from "@/context/PaywallContext";
import { useI18n } from "@/hooks/use-i18n";
import { isGuestUser, loginPathWithReturn } from "@/lib/auth-session";
import { freeTierBlockReason } from "@/lib/free-tier-gate";
import { FREE_DAILY_REVIEWS } from "@/lib/pro-access";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { usePathname, useRouter } from "next/navigation";
import type { ReactNode } from "react";

type FreeTierGateProps = {
  action: "review" | "learn";
  dueReviewCount?: number;
  rangeId?: string;
  children: ReactNode;
};

/** Blocks children when daily Free/guest limits are exhausted. */
export function FreeTierGate({ action, dueReviewCount, rangeId, children }: FreeTierGateProps) {
  const { isFree, openPaywall } = usePaywall();
  const { isSignedIn } = useAuthSession();
  const { t } = useI18n();
  const router = useRouter();
  const pathname = usePathname();
  const reason = freeTierBlockReason(action, { dueReviewCount, rangeId });
  const guest = (isSupabaseConfigured() && !isSignedIn) || isGuestUser();

  if (!isFree || !reason) {
    return <>{children}</>;
  }

  const message =
    guest && reason === "reviews"
      ? t("paywall.guestReviewLimit", { count: FREE_DAILY_REVIEWS })
      : guest && reason === "learn"
        ? t("paywall.guestLearnLimit")
        : reason === "reviews"
          ? t("paywall.reviewLimit", { count: FREE_DAILY_REVIEWS })
          : t("paywall.freeLearnDone");

  return (
    <div className="app-screen app-screen--home flex flex-col">
      <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/assets/mascot-croc.png" alt="" aria-hidden className="h-16 w-auto" />
        <h1 className="text-lg font-bold text-foreground">{t("paywall.promptTitle")}</h1>
        <p className="text-sm text-foreground/75">{message}</p>
        {guest ? (
          <button
            type="button"
            onClick={() => router.push(loginPathWithReturn(pathname || "/discover"))}
            className="w-full max-w-xs rounded-full bg-[#7c3aed] py-3 font-bold text-white"
          >
            {t("paywall.signInToContinue")}
          </button>
        ) : null}
        <button
          type="button"
          onClick={openPaywall}
          className={`w-full max-w-xs rounded-full py-3 font-bold ${
            guest
              ? "border-2 border-[#7c3aed] bg-transparent text-[#7c3aed]"
              : "bg-[#7c3aed] text-white"
          }`}
        >
          {t("paywall.ctaUpgrade")}
        </button>
      </div>
    </div>
  );
}
