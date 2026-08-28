"use client";

import { AppHeader } from "@/components/layout/AppHeader";
import { AppMenuButton } from "@/components/layout/AppMenuButton";
import { useRouter } from "next/navigation";

export default function PrivacyPage() {
  const router = useRouter();

  return (
    <div className="app-screen app-screen--home">
      <AppHeader
        title="Privacy"
        leading={
          <button
            type="button"
            className="app-header__icon-btn"
            aria-label="Back"
            onClick={() => router.back()}
          >
            ←
          </button>
        }
        trailing={<AppMenuButton />}
      />

      <div className="page-scroll">
        <article className="settings-page settings-page--legal px-4 pb-8">
          <p className="settings-page__updated">Last updated: August 2026</p>

          <section>
            <h2>What we collect</h2>
            <p>
              Learning progress (words studied, review schedules), app settings (daily goal,
              reminder time, auto-pronounce preference), and optional account data when you
              sign in with Supabase.
            </p>
          </section>

          <section>
            <h2>Local storage</h2>
            <p>
              Most settings and progress are stored on your device first. Signed-in users may
              sync learning data to our database.
            </p>
          </section>

          <section>
            <h2>Bug reports</h2>
            <p>
              If you submit a bug report, we receive your message, optional screenshot, page
              URL, and basic device information to diagnose the issue.
            </p>
          </section>

          <section>
            <h2>Third-party services</h2>
            <p>
              We use dictionary pronunciation audio, stock image providers, and optional cloud
              AI enrichment. Those services receive only the data needed to fetch content for
              the word you are studying.
            </p>
          </section>

          <section>
            <h2>Your choices</h2>
            <p>
              You can clear site data in your browser, turn off reminders, disable
              auto-pronounce, and sign out at any time.
            </p>
          </section>
        </article>
      </div>
    </div>
  );
}
