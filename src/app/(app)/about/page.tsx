"use client";

import { AppHeader } from "@/components/layout/AppHeader";
import { AppMenuButton } from "@/components/layout/AppMenuButton";
import { JungleCastPill } from "@/components/mascot/JungleMascot";
import { useI18n } from "@/hooks/use-i18n";
import { API_BASE_URL } from "@/lib/api-base";
import { displayFontClass } from "@/lib/fonts";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const APP_VERSION = process.env.NEXT_PUBLIC_APP_VERSION || "1.0.0";

export default function AboutPage() {
  const router = useRouter();
  const { t } = useI18n();
  const [website, setWebsite] = useState(API_BASE_URL);

  useEffect(() => {
    if (!API_BASE_URL) setWebsite(window.location.origin);
  }, []);

  function goBack() {
    if (window.history.length > 1) router.back();
    else router.push("/discover");
  }

  return (
    <div className="app-screen app-screen--home">
      <AppHeader
        title={t("about.title")}
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
        <article className="settings-page px-4 pb-8">
          <div className="home-card flex flex-col items-center border-primary-200 bg-card text-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/icon-192.png"
              alt="Jungle Jokers"
              width={80}
              height={80}
              className="h-20 w-20 rounded-2xl shadow-sm"
            />
            <h2 className={`home-section-title mt-3 ${displayFontClass}`}>Jungle Jokers</h2>
            <p className="mt-1 text-xs text-foreground/50">
              {t("about.version", { version: APP_VERSION })}
            </p>
            <p className="home-body-text mt-2 text-pink-700">{t("account.tagline")}</p>
            <div className="mt-3">
              <JungleCastPill size={28} />
            </div>
            <p className="home-body-text mt-3">{t("about.intro")}</p>
          </div>

          <section className="home-card mt-4 border-primary-200 bg-card">
            <h3 className="home-card-title">{t("about.missionTitle")}</h3>
            <p className="home-body-text mt-2">{t("about.missionBody")}</p>
          </section>

          <section className="home-card mt-4 border-primary-200 bg-card">
            <h3 className="home-card-title">{t("about.contactTitle")}</h3>
            <p className="home-body-text mt-2">{t("about.contactBody")}</p>
            <p className="home-body-text mt-3">
              <Link href="/settings/bug-report" className="home-link-text">
                {t("menu.bugReport")}
              </Link>
            </p>
            {website ? (
              <p className="home-body-text mt-2">
                {t("about.website")}: <span className="break-all">{website.replace(/^https?:\/\//, "")}</span>
              </p>
            ) : null}
          </section>

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
