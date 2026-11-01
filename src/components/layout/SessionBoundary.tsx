"use client";

import { usePathname } from "next/navigation";
import { AuthSessionProvider } from "@/context/AuthSessionContext";
import { RevenueCatSync } from "@/components/layout/RevenueCatSync";

/** Keep recovery URL tokens away from the normal browser auth client and SDKs. */
export function SessionBoundary({ children }: { children: React.ReactNode }) {
  const pathname = usePathname().replace(/\/+$/, "");
  if (["/auth/reset-password", "/privacy", "/terms", "/delete-account"].includes(pathname)) return children;
  return <AuthSessionProvider><RevenueCatSync />{children}</AuthSessionProvider>;
}
