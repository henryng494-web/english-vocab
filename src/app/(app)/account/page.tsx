"use client";

import { AppHeader } from "@/components/layout/AppHeader";
import { InstallAppHint } from "@/components/layout/InstallAppHint";
import { CoachDog } from "@/components/mascot/CoachDog";
import { LAYOUT_VERSION } from "@/lib/layout-version";
import Link from "next/link";

export default function AccountPage() {
  return (
    <div className="app-screen app-screen--home">
      <AppHeader
        title="Account"
        leading={
          <Link href="/discover" className="app-header__icon-btn" aria-label="Back home">
            ←
          </Link>
        }
      />

      <div className="page-scroll">
        <div className="space-y-6 px-4 pb-6">
          <section className="home-card flex items-center gap-3">
            <CoachDog pose="smirk" size={56} />
            <div>
              <h2 className="home-section-title font-display">Coach Dog</h2>
              <p className="home-body-text">Your vocabulary learning buddy</p>
            </div>
          </section>

          <InstallAppHint />

          <section className="home-card">
            <h2 className="home-section-title font-display">Sign in</h2>
            <p className="home-body-text mt-1">
              Save learning progress to Supabase when you are signed in.
            </p>
            <Link
              href="/auth/login"
              className="btn-pill-primary mt-3 inline-flex px-5 py-3"
            >
              Go to sign in
            </Link>
          </section>

          <p className="text-center text-xs text-foreground/45">
            Layout {LAYOUT_VERSION}
          </p>
        </div>
      </div>
    </div>
  );
}
