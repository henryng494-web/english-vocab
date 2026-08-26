"use client";

import Image from "next/image";
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
        <div className="welcome-splash__art-wrapper">
          <Image
            src={WELCOME_SPLASH_ART.path}
            alt={APP_MASCOT_BRAND.name}
            width={512}
            height={768}
            priority
            unoptimized
            className="welcome-splash__art-image"
          />
        </div>
        <h1 className="welcome-splash__title--sr">{APP_MASCOT_BRAND.name}</h1>
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
