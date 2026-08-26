"use client";

import Image from "next/image";
import { displayFontClass } from "@/lib/fonts";
import { APP_MASCOT_BRAND, WELCOME_SPLASH_IMAGE } from "@/data/jungle-cast-brand";
import type { BootstrapProgress } from "@/lib/app-bootstrap";

type WelcomeSplashProps = {
  progress: BootstrapProgress;
};

export function WelcomeSplash({ progress }: WelcomeSplashProps) {
  const pct = Math.min(100, Math.max(0, progress.progress));

  return (
    <div className="welcome-splash" role="status" aria-live="polite" aria-busy="true">
      <div className="welcome-splash__hero-wrap">
        <Image
          src={WELCOME_SPLASH_IMAGE.path}
          alt={WELCOME_SPLASH_IMAGE.alt}
          width={768}
          height={1344}
          priority
          className="welcome-splash__hero"
          sizes="100vw"
        />
        <h1 className={`welcome-splash__title welcome-splash__title--sr ${displayFontClass}`}>
          {APP_MASCOT_BRAND.name}
        </h1>
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
