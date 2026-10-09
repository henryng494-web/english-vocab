"use client";

import { initRevenueCat, logInRevenueCat, logOutRevenueCat, syncPlacementAttributes } from "@/lib/revenuecat";
import { PLACEMENT_SAVED_EVENT, readPlacement } from "@/lib/placement";
import { createClientIfConfigured } from "@/lib/supabase/client";
import { useEffect } from "react";

/** Keeps RevenueCat in step with the Supabase session and the stored placement rank. */
export function RevenueCatSync() {
  useEffect(() => {
    let cancelled = false;

    const pushPlacement = () => {
      const placement = readPlacement();
      if (placement) void syncPlacementAttributes(placement);
    };

    void (async () => {
      await initRevenueCat();
      if (cancelled) return;
      const supabase = createClientIfConfigured();
      const userId = supabase ? (await supabase.auth.getSession()).data.session?.user.id : null;
      if (cancelled) return;
      if (userId) await logInRevenueCat(userId);
      pushPlacement();
    })();

    const supabase = createClientIfConfigured();
    const { data } = supabase
      ? supabase.auth.onAuthStateChange((_event, session) => {
          if (session?.user) {
            void logInRevenueCat(session.user.id).then(pushPlacement);
          } else {
            void logOutRevenueCat();
          }
        })
      : { data: null };

    window.addEventListener(PLACEMENT_SAVED_EVENT, pushPlacement);
    return () => {
      cancelled = true;
      data?.subscription.unsubscribe();
      window.removeEventListener(PLACEMENT_SAVED_EVENT, pushPlacement);
    };
  }, []);

  return null;
}
