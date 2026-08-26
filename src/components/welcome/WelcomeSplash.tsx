"use client";

import Image from "next/image";
import { displayFontClass } from "@/lib/fonts";
import {
  APP_MASCOT_BRAND,
  MASCOT_SPLASH_PATHS,
} from "@/data/jungle-cast-brand";
import type { BootstrapProgress } from "@/lib/app-bootstrap";

type WelcomeSplashProps = {
  progress: BootstrapProgress;
};

export function WelcomeSplash({ progress }: WelcomeSplashProps) {
  const pct = Math.min(100, Math.max(0, progress.progress));

  return (
    <div className="welcome-splash" role="status" aria-live="polite" aria-busy="true">
      <div className="welcome-splash__accents" aria-hidden>
        <span className="welcome-splash__accent welcome-splash__accent--grass" />
        <span className="welcome-splash__accent welcome-splash__accent--swing" />
        <span className="welcome-splash__accent welcome-splash__accent--flower" />
      </div>

      <div className="welcome-splash__hero">
        <div className={`welcome-splash__wordmark ${displayFontClass}`}>
          <h1 className="welcome-splash__title">
            <span className="welcome-splash__title-line">
              <span className="welcome-splash__word">
                <span className="welcome-splash__letter welcome-splash__letter--j">
                  J
                  <Image
                    src={MASCOT_SPLASH_PATHS.monkey}
                    alt=""
                    width={54}
                    height={74}
                    priority
                    unoptimized
                    className="welcome-splash__mascot welcome-splash__mascot--monkey"
                  />
                </span>
                ng
                <span className="welcome-splash__letter welcome-splash__letter--u">
                  u
                  <Image
                    src={MASCOT_SPLASH_PATHS.elephant}
                    alt=""
                    width={40}
                    height={88}
                    priority
                    unoptimized
                    className="welcome-splash__mascot welcome-splash__mascot--elephant"
                  />
                </span>
                <span className="welcome-splash__letter welcome-splash__letter--g">
                  g
                  <Image
                    src={MASCOT_SPLASH_PATHS.crocodile}
                    alt=""
                    width={80}
                    height={44}
                    priority
                    unoptimized
                    className="welcome-splash__mascot welcome-splash__mascot--crocodile"
                  />
                </span>
                le
              </span>
            </span>
            <span className="welcome-splash__title-line">
              <span className="welcome-splash__word">
                Joker
                <span className="welcome-splash__letter welcome-splash__letter--s">
                  s
                  <Image
                    src={MASCOT_SPLASH_PATHS.tiger}
                    alt=""
                    width={66}
                    height={64}
                    priority
                    unoptimized
                    className="welcome-splash__mascot welcome-splash__mascot--tiger"
                  />
                </span>
              </span>
            </span>
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
