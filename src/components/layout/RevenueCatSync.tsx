"use client";

import { ensureRevenueCatUser, syncPlacementAttributes } from "@/lib/revenuecat";
import { PLACEMENT_SAVED_EVENT, readPlacement } from "@/lib/placement";
import { useAuthSession } from "@/context/AuthSessionContext";
import { useEffect } from "react";

/** Identity changes run outside Supabase's auth callback and are serialized by the SDK wrapper. */
export function RevenueCatSync() {
  const { ready, user } = useAuthSession();
  const userId = user?.id ?? null;
  useEffect(() => {
    if (!ready) return;
    let cancelled = false;
    const pushPlacement = async () => {
      if (!(await ensureRevenueCatUser(userId)) || cancelled) return;
      const placement = readPlacement();
      if (placement && userId) await syncPlacementAttributes(placement);
    };
    void pushPlacement();
    const onPlacement = () => { void pushPlacement(); };
    window.addEventListener(PLACEMENT_SAVED_EVENT, onPlacement);
    return () => {
      cancelled = true;
      window.removeEventListener(PLACEMENT_SAVED_EVENT, onPlacement);
    };
  }, [ready, userId]);
  return null;
}
