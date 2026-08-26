"use client";

import Image from "next/image";
import { displayFontClass } from "@/lib/fonts";
import { APP_MASCOT_BRAND, WELCOME_SPLASH_ART } from "@/data/jungle-cast-brand";
import type { BootstrapProgress } from "@/lib/app-bootstrap";

type WelcomeSplashProps = {
  progress: BootstrapProgress;
};

export function WelcomeSplash({ progress }: WelcomeSplashProps) {
  const pct = Math.min(100, Math.max(0, progress.progress));

  return (
    <div className="welcome-splash" role="status" aria-live="polite" aria-busy="true">
      <div className="welcome-splash__hero">
        <Image
          src={WELCOME_SPLASH_ART.path}
          alt=""
          width={1024}
          height={1536}
          priority
          className="welcome-splash__art"
          sizes="100vw"
        />
        <div className={`welcome-splash__title-wrap ${displayFontClass}`}>
          <h1 className="welcome-splash__title">
            <span className="welcome-splash__title-line">Jungle</span>
            <span className="welcome-splash__title-line">Jokers</span>
          </h1>
        </div>
        <p className="welcome-splash__title--sr">{APP_MASCOT_BRAND.name}</p>
      </div>

      <div className="welcome-splash__footer">
        <div
          className="ui-progress welcome-splash__progress"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(pct)}
          aria-label="Loading"
        >
          <div
            className="ui-progress__fill welcome-splash__progress-fill"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    </div>
  );
}
