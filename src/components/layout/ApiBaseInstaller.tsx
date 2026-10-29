"use client";

import { API_BASE_URL, IS_MOBILE_BUILD, installApiBase } from "@/lib/api-base";
import { isSupabaseConfigured } from "@/lib/supabase/env";

if (IS_MOBILE_BUILD && typeof console !== "undefined") {
  if (!API_BASE_URL) {
    console.error(
      "[mobile] NEXT_PUBLIC_API_BASE_URL was not baked into this build — API calls will fail (Load failed). Rebuild with Capawesome env vars.",
    );
  }
  if (!isSupabaseConfigured()) {
    console.error(
      "[mobile] Supabase public keys missing from this build — Sign in will fail. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in CI before capawesome:build.",
    );
  }
}

installApiBase();

export function ApiBaseInstaller() {
  return null;
}
