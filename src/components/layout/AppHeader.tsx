"use client";

import { useAppMenu } from "@/context/AppMenuContext";
import { displayFontClass } from "@/lib/fonts";

type AppHeaderProps = {
  title: string;
  leading?: React.ReactNode;
  trailing?: React.ReactNode;
  /** Hide visible title (e.g. Home — tab bar already labels the screen). */
  hideTitle?: boolean;
};

export function AppHeader({
  title,
  leading,
  trailing,
  hideTitle = false,
}: AppHeaderProps) {
  const { open: menuOpen } = useAppMenu();

  if (menuOpen) {
    return (
      <header className="app-header app-header--menu-open">
        <div className="app-header__safe-area">
          <div className="app-header__inner">
            <div className="app-header__side app-header__side--left">
              <span className="app-header__spacer" aria-hidden />
            </div>
            <div className="app-header__title-container">
              <h1 className={`app-header__title ${displayFontClass}`}>Menu</h1>
            </div>
            <div className="app-header__side app-header__side--right">
              <span className="app-header__spacer" aria-hidden />
            </div>
          </div>
        </div>
      </header>
    );
  }

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
