"use client";

import { JungleMascot } from "@/components/mascot/JungleMascot";
import { useI18n } from "@/hooks/use-i18n";

export function HomeMascotBanner() {
  const { t } = useI18n();

  return (
    <div className="home-galaxy__mascot-float" aria-hidden>
      <div className="home-galaxy__mascot-actor home-galaxy__mascot-actor--tiger">
        <span className="home-galaxy__mascot-bubble home-galaxy__mascot-bubble--team">
          {t("home.mascotTeamWord")}
        </span>
        <span className="home-galaxy__mascot-point" aria-hidden>👉</span>
        <JungleMascot character="tiger" size={56} />
      </div>

      <div className="home-galaxy__mascot-actor home-galaxy__mascot-actor--monkey">
        <span className="home-galaxy__mascot-bubble home-galaxy__mascot-bubble--work">
          {t("home.mascotWorkWord")}
        </span>
        <span className="home-galaxy__mascot-tease" aria-hidden>🫳</span>
        <JungleMascot character="monkey" size={52} />
      </div>

      <div className="home-galaxy__mascot-duo">
        <div className="home-galaxy__mascot-actor home-galaxy__mascot-actor--elephant">
          <JungleMascot character="elephant" size={48} />
        </div>
        <span className="home-galaxy__mascot-highfive" aria-hidden>🤝</span>
        <div className="home-galaxy__mascot-actor home-galaxy__mascot-actor--crocodile">
          <JungleMascot character="crocodile" size={48} />
        </div>
      </div>
    </div>
  );
}
