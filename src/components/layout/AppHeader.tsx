import { HeaderMascotScene, type HeaderSceneCharacter } from "@/components/layout/HeaderMascotScene";
import { displayFontClass } from "@/lib/fonts";
import type { JungleMascotName } from "@/components/mascot/JungleMascot";

type AppHeaderProps = {
  title: string;
  leading?: React.ReactNode;
  trailing?: React.ReactNode;
  /** SVG branch scene featuring this Jungle Jokers mascot. */
  peekMascot?: JungleMascotName | boolean | "sm";
};

function resolveSceneCharacter(
  peekMascot: JungleMascotName | boolean | "sm",
): HeaderSceneCharacter | null {
  if (!peekMascot || peekMascot === "sm" || peekMascot === "lineup") return null;
  if (peekMascot === true) return "monkey";
  return peekMascot;
}

export function AppHeader({
  title,
  leading,
  trailing,
  peekMascot = false,
}: AppHeaderProps) {
  const sceneCharacter = resolveSceneCharacter(peekMascot);
  const showScene = Boolean(peekMascot);

  return (
    <header className={`app-header${showScene ? " app-header--scene" : ""}`}>
      <div className="app-header__inner">
        <div className="app-header__side app-header__side--left">
          {leading ?? <span className="app-header__spacer" aria-hidden />}
        </div>

        <div className="app-header__title-container">
          <h1 className={`app-header__title ${displayFontClass}`}>{title}</h1>
        </div>

        <div className="app-header__side app-header__side--right">
          {trailing ?? <span className="app-header__spacer" aria-hidden />}
        </div>
      </div>

      {sceneCharacter ? <HeaderMascotScene character={sceneCharacter} /> : null}
    </header>
  );
}
