"use client";

import { PaywallContent } from "@/components/paywall/PaywallContent";
import { useI18n } from "@/hooks/use-i18n";
import { AUTH_SESSION_EVENT } from "@/context/AuthSessionContext";
import { loginPathWithReturn, isClientSignedIn } from "@/lib/auth-session";
import { FREE_DAILY_REVIEWS, PRO_STATUS_EVENT, isGatingActive, readProCache, writeProCache } from "@/lib/pro-access";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { getProStatus, type ProStatus } from "@/lib/revenuecat";
import { usePathname, useRouter } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type PaywallContextValue = {
  isPro: boolean;
  /** True when the free-tier limits apply (subscriptions purchasable and user is not Pro). */
  isFree: boolean;
  openPaywall: () => void;
  closePaywall: () => void;
  /** Explains a Pro-only limit and offers to open the Paywall. */
  showUpgradePrompt: (reason: UpgradeReason) => void;
};

export type UpgradeReason = "reviews" | "ai" | "learn";

const PaywallContext = createContext<PaywallContextValue | null>(null);

export function PaywallProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [isPro, setIsPro] = useState(false);

  const [gating, setGating] = useState(false);
  const [prompt, setPrompt] = useState<UpgradeReason | null>(null);
  const { t } = useI18n();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    let cancelled = false;
    const active = isGatingActive();
    setGating(active);

    const applyProStatus = (status: ProStatus) => {
      if (cancelled) return;
      if (!status.checked) {
        if (active) {
          setIsPro(false);
          writeProCache(false);
        }
        return;
      }
      setIsPro(status.isPro);
      writeProCache(status.isPro);
    };

    const refreshPro = (delayMs = 0) => {
      setIsPro(active ? false : readProCache());
      window.setTimeout(() => {
        void getProStatus().then(applyProStatus);
      }, delayMs);
    };

    refreshPro();
    const syncCache = () => setIsPro(readProCache());
    const onAuth = () => refreshPro(400);
    window.addEventListener(PRO_STATUS_EVENT, syncCache);
    window.addEventListener(AUTH_SESSION_EVENT, onAuth);
    return () => {
      cancelled = true;
      window.removeEventListener(PRO_STATUS_EVENT, syncCache);
      window.removeEventListener(AUTH_SESSION_EVENT, onAuth);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    document.body.classList.add("app-menu-open");
    return () => document.body.classList.remove("app-menu-open");
  }, [open]);

  const openPaywall = useCallback(() => {
    void (async () => {
      setPrompt(null);
      if (gating && isSupabaseConfigured() && !(await isClientSignedIn())) {
        router.push(loginPathWithReturn(pathname || "/discover"));
        return;
      }
      setOpen(true);
    })();
  }, [gating, pathname, router]);
  const showUpgradePrompt = useCallback((reason: UpgradeReason) => setPrompt(reason), []);
  const closePaywall = useCallback(() => setOpen(false), []);
  const onProChange = useCallback((status: ProStatus) => {
    setIsPro(status.isPro);
    writeProCache(status.isPro);
  }, []);

  const value = useMemo(
    () => ({ isPro, isFree: gating && !isPro, openPaywall, closePaywall, showUpgradePrompt }),
    [isPro, gating, openPaywall, closePaywall, showUpgradePrompt],
  );

  return (
    <PaywallContext.Provider value={value}>
      {children}
      {prompt && !open ? (
        <div
          className="fixed inset-0 z-[1090] flex items-center justify-center bg-slate-900/45 px-6"
          role="presentation"
          onClick={() => setPrompt(null)}
        >
          <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="upgrade-prompt-title"
            className="w-full max-w-sm rounded-2xl bg-surface p-5 text-center shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/mascot-croc.png" alt="" aria-hidden className="mx-auto h-12 w-auto" />
            <h2 id="upgrade-prompt-title" className="mt-2 text-lg font-bold text-foreground">
              {t("paywall.promptTitle")}
            </h2>
            <p className="mt-2 text-sm text-foreground/75">
              {prompt === "reviews"
                ? t("paywall.reviewLimit", { count: FREE_DAILY_REVIEWS })
                : prompt === "learn"
                  ? t("paywall.freeLearnDone")
                  : t("paywall.aiLocked")}
            </p>
            <button
              type="button"
              onClick={openPaywall}
              className="mt-4 flex w-full justify-center rounded-full bg-[#7c3aed] py-3 font-bold text-white"
            >
              {t("paywall.ctaUpgrade")}
            </button>
            <button
              type="button"
              onClick={() => setPrompt(null)}
              className="mt-2 w-full py-2 text-sm text-foreground/60"
            >
              {t("paywall.later")}
            </button>
          </div>
        </div>
      ) : null}
      {open ? (
        <div
          className="fixed inset-0 z-[1100] overflow-y-auto bg-background"
          role="dialog"
          aria-modal="true"
          style={{
            paddingTop: "env(safe-area-inset-top, 0px)",
            paddingBottom: "env(safe-area-inset-bottom, 0px)",
          }}
        >
          <PaywallContent onClose={closePaywall} onProChange={onProChange} />
        </div>
      ) : null}
    </PaywallContext.Provider>
  );
}

const FALLBACK: PaywallContextValue = {
  isPro: false,
  isFree: false,
  openPaywall: () => {},
  closePaywall: () => {},
  showUpgradePrompt: () => {},
};

export function usePaywall(): PaywallContextValue {
  return useContext(PaywallContext) ?? FALLBACK;
}
