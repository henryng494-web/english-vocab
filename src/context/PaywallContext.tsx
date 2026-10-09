"use client";

import { PaywallContent } from "@/components/paywall/PaywallContent";
import { getProStatus, type ProStatus } from "@/lib/revenuecat";
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
  openPaywall: () => void;
  closePaywall: () => void;
};

const PaywallContext = createContext<PaywallContextValue | null>(null);

export function PaywallProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [isPro, setIsPro] = useState(false);

  useEffect(() => {
    let cancelled = false;
    void getProStatus().then((status) => {
      if (!cancelled) setIsPro(status.isPro);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    document.body.classList.add("app-menu-open");
    return () => document.body.classList.remove("app-menu-open");
  }, [open]);

  const openPaywall = useCallback(() => setOpen(true), []);
  const closePaywall = useCallback(() => setOpen(false), []);
  const onProChange = useCallback((status: ProStatus) => setIsPro(status.isPro), []);

  const value = useMemo(
    () => ({ isPro, openPaywall, closePaywall }),
    [isPro, openPaywall, closePaywall],
  );

  return (
    <PaywallContext.Provider value={value}>
      {children}
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
  openPaywall: () => {},
  closePaywall: () => {},
};

export function usePaywall(): PaywallContextValue {
  return useContext(PaywallContext) ?? FALLBACK;
}
