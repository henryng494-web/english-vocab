"use client";

import { AppHeader } from "@/components/layout/AppHeader";
import { InstallAppHint } from "@/components/layout/InstallAppHint";
import { JungleMascot, JungleCastPill } from "@/components/mascot/JungleMascot";
import { useI18n } from "@/hooks/use-i18n";
import { displayFontClass } from "@/lib/fonts";
import { LAYOUT_VERSION } from "@/lib/layout-version";
import Link from "next/link";

export default function AccountPage() {
  const { t } = useI18n();

  return (
    <div className="app-screen app-screen--home">
      <AppHeader
        title={t("account.title")}
        leading={
          <Link href="/discover" className="app-header__icon-btn" aria-label={t("account.backHome")}>
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
            <h2 className={`home-section-title ${displayFontClass}`}>{t("account.signIn")}</h2>
            <p className="home-body-text mt-1">{t("account.signInDesc")}</p>
            <Link
              href="/auth/login"
              className="btn-pill-primary mt-3 inline-flex px-5 py-3"
            >
              {t("account.signInBtn")}
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
