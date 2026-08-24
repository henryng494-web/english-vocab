"use client";

import { CoachDog } from "@/components/mascot/CoachDog";
import { displayFontClass } from "@/lib/fonts";
import type { BootstrapProgress } from "@/lib/app-bootstrap";

type WelcomeSplashProps = {
  progress: BootstrapProgress;
};

export function WelcomeSplash({ progress }: WelcomeSplashProps) {
  const pct = Math.min(100, Math.max(0, progress.progress));

  return (
    <div className="welcome-splash" role="status" aria-live="polite">
      <div className="welcome-splash__glow" aria-hidden />
      <div className="welcome-splash__content">
        <CoachDog
          pose="wave"
          size={120}
          className="welcome-splash__fox"
          title="Coach Fox"
        />
        <h1 className={`welcome-splash__title ${displayFontClass}`}>
          English Vocab
        </h1>
        <p className="welcome-splash__subtitle">
          Hi there! Coach Fox is getting things ready for you.
        </p>
        <div className="welcome-splash__progress-wrap">
          <div className="ui-progress welcome-splash__progress">
            <div
              className="ui-progress__fill welcome-splash__progress-fill"
              style={{ width: `${pct}%` }}
            />
          </div>
          <p className="welcome-splash__status">{progress.message}</p>
        </div>
      </div>
    </div>
  );
}
