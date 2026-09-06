"use client";

import { JungleMascot, type JungleMascotName } from "@/components/mascot/JungleMascot";
import { useI18n } from "@/hooks/use-i18n";

type MascotPose = "peek" | "cheer" | "sleep" | "wink";

const MASCOT_CAST: { character: JungleMascotName; pose: MascotPose; size: number }[] = [
  { character: "tiger", pose: "peek", size: 44 },
  { character: "monkey", pose: "cheer", size: 48 },
  { character: "elephant", pose: "sleep", size: 44 },
  { character: "crocodile", pose: "wink", size: 44 },
];

export function HomeMascotBanner() {
  const { t } = useI18n();

  return (
    <section className="home-galaxy__mascot-banner" aria-hidden>
      <div className="home-galaxy__mascot-speeches">
        <span className="home-galaxy__mascot-speech home-galaxy__mascot-speech--left">
          {t("home.mascotBubbleGo")}
        </span>
        <span className="home-galaxy__mascot-speech home-galaxy__mascot-speech--right">
          {t("home.mascotBubbleCheer")}
        </span>
      </div>
      <div className="home-galaxy__mascot-row">
        {MASCOT_CAST.map(({ character, pose, size }) => (
          <div
            key={character}
            className={`home-galaxy__mascot home-galaxy__mascot--${pose}`}
          >
            <JungleMascot character={character} size={size} />
          </div>
        ))}
      </div>
    </section>
  );
}
