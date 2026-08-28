"use client";

import { AppHeader } from "@/components/layout/AppHeader";
import { AppMenuButton } from "@/components/layout/AppMenuButton";
import { useRouter } from "next/navigation";

export default function TermsPage() {
  const router = useRouter();

  return (
    <div className="app-screen app-screen--home">
      <AppHeader
        title="Terms"
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
            <h2>Using the app</h2>
            <p>
              Jungle Jokers is provided for personal English vocabulary study. Content is for
              educational purposes and may be updated without notice.
            </p>
          </section>

          <section>
            <h2>Acceptable use</h2>
            <p>
              Do not abuse bug reporting, attempt to break the service, or use the app for
              unlawful purposes. We may limit access if these terms are violated.
            </p>
          </section>

          <section>
            <h2>Content accuracy</h2>
            <p>
              Definitions, images, and pronunciations are generated or curated automatically.
              We strive for quality but do not guarantee perfection for every word sense.
            </p>
          </section>

          <section>
            <h2>Disclaimer</h2>
            <p>
              The app is provided &quot;as is&quot; without warranties. We are not liable for
              indirect damages arising from use of the service.
            </p>
          </section>

          <section>
            <h2>Changes</h2>
            <p>
              We may update these terms. Continued use after changes means you accept the
              updated terms.
            </p>
          </section>
        </article>
      </div>
    </div>
  );
}
