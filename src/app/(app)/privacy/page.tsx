"use client";

import { AppHeader } from "@/components/layout/AppHeader";
import { AppMenuButton } from "@/components/layout/AppMenuButton";
import { useI18n } from "@/hooks/use-i18n";
import Link from "next/link";
import { useRouter } from "next/navigation";

const SECTIONS = [1, 2, 3, 4, 5] as const;

export default function PrivacyPage() {
  const router = useRouter();
  const { t } = useI18n();

  function goBack() {
    if (window.history.length > 1) router.back();
    else router.push("/discover");
  }

  return (
    <div className="app-screen app-screen--home">
      <AppHeader
        title={t("menu.privacy")}
        leading={
          <button
            type="button"
            className="app-header__icon-btn"
            aria-label={t("support.back")}
            onClick={goBack}
          >
            ←
          </button>
        }
        trailing={<AppMenuButton />}
      />

      <div className="page-scroll">
        <article className="settings-page settings-page--legal px-4 pb-8">
          <p className="settings-page__updated">{t("legal.lastUpdated")}</p>

          {SECTIONS.map((n) => (
            <section key={n}>
              <h2>{t(`privacy.s${n}.title` as never)}</h2>
              <p>{t(`privacy.s${n}.body` as never)}</p>
            </section>
          ))}

          <p className="settings-page__foot">
            <Link href="/discover" className="home-link-text">
              {t("reportBug.backToHome")}
            </Link>
          </p>
        </article>
      </div>
    </div>
  );
}
