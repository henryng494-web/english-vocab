"use client";

import Image from "next/image";
import { displayFontClass } from "@/lib/fonts";
import {
  APP_MASCOT_BRAND,
  MASCOT_PUBLIC_PATHS,
} from "@/data/jungle-cast-brand";
import type { BootstrapProgress } from "@/lib/app-bootstrap";

type WelcomeSplashProps = {
  progress: BootstrapProgress;
};

export function WelcomeSplash({ progress }: WelcomeSplashProps) {
  const pct = Math.min(100, Math.max(0, progress.progress));

  return (
    <div className="welcome-splash" role="status" aria-live="polite" aria-busy="true">
      <div className="welcome-splash__stage">
        <div className="welcome-splash__accents" aria-hidden>
          <span className="welcome-splash__accent welcome-splash__accent--grass" />
          <span className="welcome-splash__accent welcome-splash__accent--swing" />
          <span className="welcome-splash__accent welcome-splash__accent--flower" />
        </div>

        <div className={`welcome-splash__logo ${displayFontClass}`}>
          <Image
            src={MASCOT_PUBLIC_PATHS.monkey}
            alt=""
            width={120}
            height={120}
            priority
            className="welcome-splash__mascot welcome-splash__mascot--monkey"
          />
          <Image
            src={MASCOT_PUBLIC_PATHS.elephant}
            alt=""
            width={80}
            height={200}
            priority
            className="welcome-splash__mascot welcome-splash__mascot--elephant"
          />
          <Image
            src={MASCOT_PUBLIC_PATHS.crocodile}
            alt=""
            width={160}
            height={48}
            priority
            className="welcome-splash__mascot welcome-splash__mascot--crocodile"
          />
          <Image
            src={MASCOT_PUBLIC_PATHS.tiger}
            alt=""
            width={72}
            height={72}
            priority
            className="welcome-splash__mascot welcome-splash__mascot--tiger"
          />

          <h1 className="welcome-splash__title">
            <span className="welcome-splash__title-line">Jungle</span>
            <span className="welcome-splash__title-line">Jokers</span>
          </h1>
          <p className="welcome-splash__title--sr">{APP_MASCOT_BRAND.name}</p>
        </div>
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
