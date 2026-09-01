"use client";

import type { HomeLayoutVariant } from "@/components/discover/home-layouts/types";
import { useI18n } from "@/hooks/use-i18n";

function WireBlock({
  label,
  className = "",
  children,
  tall,
}: {
  label: string;
  className?: string;
  children?: React.ReactNode;
  tall?: boolean;
}) {
  return (
    <div className={`home-wireframe__block ${tall ? "home-wireframe__block--tall" : ""} ${className}`}>
      <span className="home-wireframe__block-label">{label}</span>
      {children}
    </div>
  );
}

function WireMonkey({ className = "" }: { className?: string }) {
  return (
    <span className={`home-wireframe__monkey ${className}`} aria-hidden>
      🐵
    </span>
  );
}

function WireCta({ label }: { label: string }) {
  return <span className="home-wireframe__cta">{label}</span>;
}

function WireHeader() {
  const { t } = useI18n();
  return (
    <div className="home-wireframe__header">
      <span>☰</span>
      <span>🔍</span>
      <span className="home-wireframe__header-spacer" />
      <span>🪙</span>
      <span className="home-wireframe__block-label home-wireframe__header-note">
        {t("home.wireframeHeader")}
      </span>
    </div>
  );
}

function Wireframe1() {
  const { t } = useI18n();
  return (
    <div className="home-wireframe__body">
      <WireBlock label={t("home.wireframeBanner")} className="home-wireframe__block--banner home-wireframe__block--split">
        <div className="home-wireframe__split-copy">
          <strong>{t("home.bannerTitle")}</strong>
          <small>{t("home.wireframeSubtitle")}</small>
          <WireCta label={t("home.bannerCta")} />
        </div>
        <WireMonkey />
      </WireBlock>
      <WireBlock label={t("home.wireframeProgress")} className="home-wireframe__block--thin">
        <span className="home-wireframe__bar" />
      </WireBlock>
      <div className="home-wireframe__chip-row">
        <WireBlock label={t("home.flowReview")} className="home-wireframe__block--chip" />
        <WireBlock label={t("home.wireframeCoins")} className="home-wireframe__block--chip" />
        <WireBlock label={t("home.streak")} className="home-wireframe__block--chip" />
      </div>
    </div>
  );
}

function Wireframe2() {
  const { t } = useI18n();
  return (
    <div className="home-wireframe__body home-wireframe__body--float">
      <WireMonkey className="home-wireframe__monkey--float" />
      <WireBlock label={t("home.wireframeBanner")} className="home-wireframe__block--banner home-wireframe__block--card" tall>
        <strong>{t("home.bannerTitle")}</strong>
        <small>{t("home.wireframeSubtitle")}</small>
        <WireCta label={`${t("home.bannerCta")} →`} />
      </WireBlock>
      <WireBlock label={t("home.wireframeMiniStats")} className="home-wireframe__block--thin" />
      <div className="home-wireframe__chip-row">
        <WireBlock label={t("home.flowReview")} className="home-wireframe__block--chip" />
        <WireBlock label={t("home.wireframeCoins")} className="home-wireframe__block--chip" />
        <WireBlock label={t("home.streak")} className="home-wireframe__block--chip" />
      </div>
    </div>
  );
}

function Wireframe3() {
  const { t } = useI18n();
  return (
    <div className="home-wireframe__body">
      <WireBlock label={t("home.wireframeBanner")} className="home-wireframe__block--banner home-wireframe__block--center" tall>
        <small>{t("home.wireframeSubtitle")}</small>
        <WireMonkey className="home-wireframe__monkey--center" />
        <strong>{t("home.bannerTitle")}</strong>
        <WireCta label={t("home.bannerCta")} />
      </WireBlock>
      <div className="home-wireframe__tile-row">
        <WireBlock label={t("home.flowReview")} className="home-wireframe__block--tile" />
        <WireBlock label={t("home.flowLibrary")} className="home-wireframe__block--tile" />
        <WireBlock label={t("home.wireframeGoal")} className="home-wireframe__block--tile" />
      </div>
    </div>
  );
}

function Wireframe4() {
  const { t } = useI18n();
  return (
    <div className="home-wireframe__body">
      <WireBlock label={t("home.wireframeBanner")} className="home-wireframe__block--banner home-wireframe__block--magazine" tall>
        <WireMonkey className="home-wireframe__monkey--magazine" />
        <div className="home-wireframe__magazine-copy">
          <strong>{t("home.bannerTitle")}</strong>
          <small>{t("home.wireframeSubtitle")}</small>
          <span className="home-wireframe__bar" />
          <WireCta label={`${t("home.bannerCta")} →`} />
          <div className="home-wireframe__link-row">
            <span>{t("home.flowReview")}</span>
            <span>{t("home.flowLibrary")}</span>
          </div>
        </div>
      </WireBlock>
    </div>
  );
}

function Wireframe5() {
  const { t } = useI18n();
  return (
    <div className="home-wireframe__body">
      <WireBlock label={t("home.wireframeBanner")} className="home-wireframe__block--banner home-wireframe__block--bubble" tall>
        <div className="home-wireframe__bubble-copy">
          <strong>{t("home.bannerTitle")}</strong>
          <small>{t("home.wireframeSubtitle")}</small>
          <span className="home-wireframe__big-num">123</span>
          <WireCta label={`${t("home.bannerCta")} →`} />
        </div>
        <WireMonkey className="home-wireframe__monkey--bubble" />
      </WireBlock>
      <div className="home-wireframe__chip-row">
        <WireBlock label={t("home.flowReview")} className="home-wireframe__block--chip" />
        <WireBlock label={t("home.streak")} className="home-wireframe__block--chip" />
        <WireBlock label={t("home.wireframeCoins")} className="home-wireframe__block--chip" />
      </div>
    </div>
  );
}

const WIREFRAMES: Record<HomeLayoutVariant, () => React.JSX.Element> = {
  "1": Wireframe1,
  "2": Wireframe2,
  "3": Wireframe3,
  "4": Wireframe4,
  "5": Wireframe5,
};

const WIREFRAME_NAMES: Record<HomeLayoutVariant, { vi: string; en: string }> = {
  "1": { vi: "Hero split — chữ trái, khỉ phải", en: "Hero split — copy left, monkey right" },
  "2": { vi: "Floating card — khỉ chồng lên card", en: "Floating card — monkey overlaps card" },
  "3": { vi: "Center stage — khỉ giữa + 3 ô", en: "Center stage — monkey center + 3 tiles" },
  "4": { vi: "Magazine — khỉ trái, nội dung phải", en: "Magazine — monkey left, content right" },
  "5": { vi: "Bubble tím — số từ lớn", en: "Purple bubble — big word count" },
};

export function LayoutWireframe({ variant }: { variant: HomeLayoutVariant }) {
  const { t, locale } = useI18n();
  const Body = WIREFRAMES[variant];
  const name = locale === "en" ? WIREFRAME_NAMES[variant].en : WIREFRAME_NAMES[variant].vi;

  return (
    <div className="home-wireframe" aria-hidden>
      <div className="home-wireframe__title-row">
        <span className="home-wireframe__variant">Layout {variant}</span>
        <span className="home-wireframe__name">{name}</span>
      </div>
      <div className="home-wireframe__phone">
        <WireHeader />
        <Body />
      </div>
      <p className="home-wireframe__caption">{t("home.wireframeCaption")}</p>
    </div>
  );
}
