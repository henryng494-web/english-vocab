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
  /** Hide visible title (e.g. Home — tab bar already labels the screen). */
  hideTitle?: boolean;
};

export function AppHeader({
  title,
  leading,
  trailing,
  peekMascot = false,
  hideTitle = false,
}: AppHeaderProps) {
  const branchCharacter = resolveHeaderBranchCharacter(peekMascot);

  if (!branchCharacter) {
    return (
      <header className="app-header">
        <div className="app-header__safe-area">
          <div className="app-header__inner">
            <div className="app-header__side app-header__side--left">
              {leading ?? <span className="app-header__spacer" aria-hidden />}
            </div>
            {!hideTitle ? (
              <div className="app-header__title-container">
                <h1 className={`app-header__title ${displayFontClass}`}>{title}</h1>
              </div>
            ) : (
              <h1 className="sr-only">{title}</h1>
            )}
            <div className="app-header__side app-header__side--right">
              {trailing ?? <span className="app-header__spacer" aria-hidden />}
            </div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="app-header app-header--branch">
      <div className="headerContainer app-header__safe-area app-header__safe-area--branch">
        <div className="app-header__left">
          <div className="app-header__toolbar">
            {leading}
            {trailing}
          </div>
        </div>

        <div className="app-header__right app-header__branch-col">
          <HeaderBranchScene character={branchCharacter} />
        </div>

        {!hideTitle ? (
          <h1 className={`app-header__title app-header__title--branch ${displayFontClass}`}>
            {title}
          </h1>
        ) : (
          <h1 className="sr-only">{title}</h1>
        )}
      </div>
    </header>
  );
}
