"use client";

import { addStudySeconds } from "@/lib/study-time";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

const TRACKED_PREFIXES = ["/journey", "/learn", "/word/"];

/** Accumulate study seconds while the learner is on Journey / Review / word detail. */
export function StudyTimeTracker() {
  const pathname = usePathname();
  const active = TRACKED_PREFIXES.some((prefix) => pathname.startsWith(prefix));

  useEffect(() => {
    if (!active) return;
    const tick = window.setInterval(() => {
      if (document.visibilityState === "visible") {
        addStudySeconds(15);
      }
    }, 15_000);
    return () => window.clearInterval(tick);
  }, [active]);

  return null;
}
