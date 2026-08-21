"use client";

import { createClient } from "@/lib/supabase/client";
import { displayFontClass } from "@/lib/fonts";
import Link from "next/link";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const supabase = createClient();

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMessage(error.message);
    } else {
      window.location.href = "/discover";
    }
    setLoading(false);
  }

  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setMessage(error.message);
    } else {
      setMessage("Sign-up successful! Check your email to confirm your account.");
    }
    setLoading(false);
  }

  return (
    <main
      className="flex min-h-dvh items-center justify-center bg-background px-4"
      style={{
        paddingTop: "env(safe-area-inset-top, 0px)",
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
      }}
    >
      <div className="w-full max-w-md rounded-2xl border border-primary-200 bg-surface p-8 shadow-sm">
        <h1 className={`${displayFontClass} text-3xl font-bold text-foreground`}>
          Sign in
        </h1>
        <p className="mt-2 text-sm text-foreground/60">
          Use your Supabase Auth account to save learning progress
        </p>

        <form className="mt-6 space-y-4" onSubmit={handleSignIn}>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-foreground/80"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 w-full rounded-lg border border-primary-200 bg-background px-3 py-2 text-foreground placeholder:text-foreground/40 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-foreground/80"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="mt-1 w-full rounded-lg border border-primary-200 bg-background px-3 py-2 text-foreground placeholder:text-foreground/40 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          {message && (
            <p className="rounded-lg bg-primary-50 px-3 py-2 text-sm text-primary-800">
              {message}
            </p>
          )}

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 rounded-lg bg-primary px-4 py-2 font-medium text-foreground hover:bg-primary-hover disabled:opacity-50"
            >
              {loading ? "Processing..." : "Sign in"}
            </button>
            <button
              type="button"
              disabled={loading}
              onClick={handleSignUp}
              className="flex-1 rounded-lg border border-primary-200 px-4 py-2 font-medium text-primary-800 hover:bg-primary-50 disabled:opacity-50"
            >
              Sign up
            </button>
          </div>
        </form>

        <Link
          href="/account"
          className="mt-6 block text-center text-sm text-foreground/60 hover:text-primary-700"
        >
          ← Back to app
        </Link>
      </div>
    </main>
  );
}
