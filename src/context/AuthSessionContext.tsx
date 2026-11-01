"use client";

import { createClientIfConfigured } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import {
  displayNameFromUser,
  LEARNER_DISPLAY_NAME_EVENT,
  persistLearnerDisplayName,
  readLearnerDisplayName,
} from "@/lib/user-display-name";
import { syncLearnerNicknameToSupabase } from "@/lib/learner-nickname";
import { persistAuthSignedInFlag } from "@/lib/auth-session";
import { writeProCache } from "@/lib/pro-access";
import type { Session, User } from "@supabase/supabase-js";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export const AUTH_SESSION_EVENT = "auth-session-changed";

type AuthSessionContextValue = {
  ready: boolean;
  session: Session | null;
  user: User | null;
  isSignedIn: boolean;
  displayName: string;
  email: string | null;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
};

const AuthSessionContext = createContext<AuthSessionContextValue | null>(null);

function syncProfileFromUser(user: User | null): void {
  persistAuthSignedInFlag(Boolean(user));
  if (!user) return;
  const local = readLearnerDisplayName();
  if (local) {
    void syncLearnerNicknameToSupabase(local);
    return;
  }
  const name = displayNameFromUser(user);
  if (name) persistLearnerDisplayName(name);
}

function applySessionToState(
  nextSession: Session | null,
  setSession: (s: Session | null) => void,
  setDisplayName: (n: string) => void,
): void {
  setSession(nextSession);
  syncProfileFromUser(nextSession?.user ?? null);
  setDisplayName(displayNameFromUser(nextSession?.user ?? null) || readLearnerDisplayName());
  if (nextSession?.user) {
    void import("@/lib/review-session").then(({ loadReviewSessionFast }) =>
      loadReviewSessionFast().catch(() => {}),
    );
  }
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(AUTH_SESSION_EVENT));
  }
}

export function AuthSessionProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(() => !isSupabaseConfigured());
  const [session, setSession] = useState<Session | null>(null);
  const [displayName, setDisplayName] = useState(() => readLearnerDisplayName());

  const refreshSession = useCallback(async () => {
    const supabase = createClientIfConfigured();
    if (!supabase) {
      setSession(null);
      setReady(true);
      return;
    }
    const { data } = await supabase.auth.getSession();
    applySessionToState(data.session, setSession, setDisplayName);
    setReady(true);
  }, []);

  useEffect(() => {
    const onPageShow = () => {
      void refreshSession();
    };
    window.addEventListener("pageshow", onPageShow);
    window.addEventListener("focus", onPageShow);
    return () => {
      window.removeEventListener("pageshow", onPageShow);
      window.removeEventListener("focus", onPageShow);
    };
  }, [refreshSession]);

  useEffect(() => {
    const supabase = createClientIfConfigured();
    if (!supabase) {
      persistAuthSignedInFlag(false);
      setReady(true);
      return;
    }

    let cancelled = false;
    let initialHydrated = false;

    const markReady = () => {
      if (!initialHydrated) {
        initialHydrated = true;
        setReady(true);
      }
    };

    const pendingEvents = new Set<number>();
    const { data: listener } = supabase.auth.onAuthStateChange((event, nextSession) => {
      // Session application starts profile sync and dispatches events whose listeners
      // call Supabase. Run it outside the auth callback/lock.
      const timer = window.setTimeout(() => {
        pendingEvents.delete(timer);
        if (cancelled) return;
        applySessionToState(nextSession, setSession, setDisplayName);
        markReady();
        if (event === "SIGNED_OUT") writeProCache(false);
      }, 0);
      pendingEvents.add(timer);
    });

    // INITIAL_SESSION may already have fired. Read and APPLY the persisted session
    // before releasing the auth gate; waiting for initialization alone loses it.
    void supabase.auth.getSession().then(({ data }) => {
      if (cancelled || initialHydrated) return;
      applySessionToState(data.session, setSession, setDisplayName);
      markReady();
    }).catch(() => {
      if (!cancelled) markReady();
    });

    const onName = () => setDisplayName(readLearnerDisplayName());
    window.addEventListener(LEARNER_DISPLAY_NAME_EVENT, onName);

    return () => {
      cancelled = true;
      pendingEvents.forEach((timer) => window.clearTimeout(timer));
      listener.subscription.unsubscribe();
      window.removeEventListener(LEARNER_DISPLAY_NAME_EVENT, onName);
    };
  }, []);

  const signOut = useCallback(async () => {
    const supabase = createClientIfConfigured();
    if (supabase) {
      await supabase.auth.signOut({ scope: "local" });
    }
    writeProCache(false);
    setSession(null);
    setDisplayName(readLearnerDisplayName());
    persistAuthSignedInFlag(false);
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event(AUTH_SESSION_EVENT));
    }
  }, []);

  const user = session?.user ?? null;
  const value = useMemo(
    (): AuthSessionContextValue => ({
      ready,
      session,
      user,
      isSignedIn: Boolean(user),
      displayName: displayName || readLearnerDisplayName(),
      email: user?.email ?? null,
      signOut,
      refreshSession,
    }),
    [ready, session, user, displayName, signOut, refreshSession],
  );

  return <AuthSessionContext.Provider value={value}>{children}</AuthSessionContext.Provider>;
}

const FALLBACK: AuthSessionContextValue = {
  ready: true,
  session: null,
  user: null,
  isSignedIn: false,
  displayName: "",
  email: null,
  signOut: async () => {},
  refreshSession: async () => {},
};

export function useAuthSession(): AuthSessionContextValue {
  return useContext(AuthSessionContext) ?? FALLBACK;
}
