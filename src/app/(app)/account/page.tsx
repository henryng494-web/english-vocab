"use client";

import { AppHeader } from "@/components/layout/AppHeader";
import { InstallAppHint } from "@/components/layout/InstallAppHint";
import { JungleMascot, JungleCastPill } from "@/components/mascot/JungleMascot";
import { displayFontClass } from "@/lib/fonts";
import { LAYOUT_VERSION } from "@/lib/layout-version";
import Link from "next/link";

export default function AccountPage() {
  return (
    <div className="app-screen app-screen--home">
      <AppHeader
        title="Account"
        peekMascot="elephant"
        leading={
          <Link href="/discover" className="app-header__icon-btn" aria-label="Back home">
            ←
          </Link>
        }
      />

      <div className="page-scroll">
        <div className="space-y-6 px-4 pb-6">
          <section className="home-card flex items-center gap-4 border-pink-200 bg-pink-50/40">
            <JungleMascot character="elephant" size={68} />
            <div>
              <div className="flex items-center gap-2">
                <h2 className={`home-section-title ${displayFontClass}`}>Jungle Jokers</h2>
              </div>
              <p className="home-body-text text-pink-700">Bộ tứ đồng hành học từ vựng mỗi ngày</p>
              <div className="mt-2">
                <JungleCastPill size={24} />
              </div>
            </div>
          </section>

          <InstallAppHint />

          <section className="home-card border-primary-200 bg-card">
            <h2 className={`home-section-title ${displayFontClass}`}>Sign in</h2>
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
