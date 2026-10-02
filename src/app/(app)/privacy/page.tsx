"use client";

import { AppHeader } from "@/components/layout/AppHeader";
import { AppMenuButton } from "@/components/layout/AppMenuButton";
import { useI18n } from "@/hooks/use-i18n";

const SECTIONS = [1, 2, 3, 4, 5] as const;

export default function PrivacyPage() {
  const { t } = useI18n();

  return (
    <div className="app-screen app-screen--home">
      <AppHeader
        title={t("menu.privacy")}
        leading={<AppMenuButton />}
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
        </article>
      </div>
    </div>
  );
}
