import {
  HeaderBranchScene,
  resolveHeaderBranchCharacter,
} from "@/components/layout/HeaderBranchScene";
import { displayFontClass } from "@/lib/fonts";
import type { JungleMascotName } from "@/components/mascot/JungleMascot";

type AppHeaderProps = {
  title: string;
  leading?: React.ReactNode;
  trailing?: React.ReactNode;
  /** Branch scene with one Jungle Jokers mascot for this tab. */
  peekMascot?: JungleMascotName | boolean | "sm";
};

export function AppHeader({
  title,
  leading,
  trailing,
  peekMascot = false,
}: AppHeaderProps) {
  const branchCharacter = resolveHeaderBranchCharacter(peekMascot);

  if (!branchCharacter) {
    return (
      <header className="app-header">
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
      </header>
    );
  }

  return (
    <header className="app-header app-header--branch">
      <div className="app-header__branch-col">
        <HeaderBranchScene character={branchCharacter} />
      </div>

      <div className="app-header__meta-col">
        <div className="app-header__meta-toolbar">
          <div className="app-header__side app-header__side--left">
            {leading ?? <span className="app-header__spacer" aria-hidden />}
          </div>
          <div className="app-header__side app-header__side--right">
            {trailing ?? <span className="app-header__spacer" aria-hidden />}
          </div>
        </div>
        <h1 className={`app-header__title app-header__title--branch ${displayFontClass}`}>
          {title}
        </h1>
      </div>
    </header>
  );
}
