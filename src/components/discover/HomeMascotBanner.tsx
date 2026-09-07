"use client";

import { JungleMascot } from "@/components/mascot/JungleMascot";

export function HomeMascotBanner() {
  return (
    <div className="home-galaxy__mascot-float" aria-hidden>
      <span className="home-galaxy__mascot-spark home-galaxy__mascot-spark--a">⭐</span>
      <span className="home-galaxy__mascot-spark home-galaxy__mascot-spark--b">✨</span>
      <span className="home-galaxy__mascot-spark home-galaxy__mascot-spark--c">💫</span>

      <div className="home-galaxy__mascot-actor home-galaxy__mascot-actor--tiger">
        <span className="home-galaxy__mascot-wave" aria-hidden>👋</span>
        <JungleMascot character="tiger" size={58} />
      </div>

      <div className="home-galaxy__mascot-actor home-galaxy__mascot-actor--monkey">
        <JungleMascot character="monkey" size={54} />
      </div>

      <div className="home-galaxy__mascot-actor home-galaxy__mascot-actor--elephant">
        <JungleMascot character="elephant" size={52} />
      </div>

      <div className="home-galaxy__mascot-actor home-galaxy__mascot-actor--crocodile">
        <JungleMascot character="crocodile" size={52} />
      </div>
    </div>
  );
}
