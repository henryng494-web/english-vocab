"use client";

import { createClientIfConfigured } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import {
  displayNameFromUser,
  LEARNER_DISPLAY_NAME_EVENT,
  persistLearnerDisplayName,
  readLearnerDisplayName,
} from "@/lib/user-display-name";
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
  const name = displayNameFromUser(user);
  if (name) persistLearnerDisplayName(name);
  persistAuthSignedInFlag(Boolean(user));
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
    setSession(data.session);
    syncProfileFromUser(data.session?.user ?? null);
    setDisplayName(displayNameFromUser(data.session?.user ?? null) || readLearnerDisplayName());
    setReady(true);
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event(AUTH_SESSION_EVENT));
    }
  }, []);

  useEffect(() => {
    const supabase = createClientIfConfigured();
    if (!supabase) {
      persistAuthSignedInFlag(false);
      setReady(true);
      return;
    }

    let cancelled = false;
    void supabase.auth.getSession().then(({ data }) => {
      if (cancelled) return;
      setSession(data.session);
      syncProfileFromUser(data.session?.user ?? null);
      setDisplayName(
        displayNameFromUser(data.session?.user ?? null) || readLearnerDisplayName(),
      );
      setReady(true);
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event(AUTH_SESSION_EVENT));
      }
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      syncProfileFromUser(nextSession?.user ?? null);
      setDisplayName(
        displayNameFromUser(nextSession?.user ?? null) || readLearnerDisplayName(),
      );
      if (!nextSession) {
        writeProCache(false);
      }
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event(AUTH_SESSION_EVENT));
      }
    });

    const onName = () => setDisplayName(readLearnerDisplayName());
    window.addEventListener(LEARNER_DISPLAY_NAME_EVENT, onName);

    return () => {
      cancelled = true;
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
