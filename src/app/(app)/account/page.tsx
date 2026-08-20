"use client";

import { MobileTopBar } from "@/components/layout/MobileTopBar";
import { InstallAppHint } from "@/components/layout/InstallAppHint";
import { ThemePicker } from "@/components/theme/ThemePicker";
import Link from "next/link";

export default function AccountPage() {
  return (
    <>
      <MobileTopBar
        title="Account"
        subtitle="Appearance and sign-in"
      />

      <div className="space-y-6 px-4 pt-4 pb-6">
        <section>
          <h2 className="text-base font-bold uppercase tracking-wide text-foreground/70">
            Color tone
          </h2>
          <p className="mt-1 text-xs text-foreground/60">
            Pick a vibrant canvas theme for the whole app.
          </p>
          <div className="mt-3">
            <ThemePicker />
          </div>
        </section>

        <InstallAppHint />

        <section className="rounded-2xl border border-primary-200 bg-surface p-4 shadow-sm">
          <h2 className="text-base font-bold text-foreground">Sign in</h2>
          <p className="mt-1 text-xs text-foreground/65">
            Save learning progress to Supabase when you are signed in.
          </p>
          <Link
            href="/auth/login"
            className="mt-3 inline-flex rounded-xl bg-primary px-4 py-3 text-base font-semibold text-white shadow-sm transition active:bg-primary-hover"
          >
            Go to sign in
          </Link>
        </section>
      </div>
    </>
  );
}
