"use client";

import { AppMenuButton } from "@/components/layout/AppMenuButton";
import { useAppMenu } from "@/context/AppMenuContext";
import { displayFontClass } from "@/lib/fonts";

type AppHeaderProps = {
  title: string;
  trailing?: React.ReactNode;
  /** Hide visible title (e.g. Home — tab bar already labels the screen). */
  hideTitle?: boolean;
};

export function AppHeader({
  title,
  trailing,
  hideTitle = false,
}: AppHeaderProps) {
  const { open: menuOpen } = useAppMenu();

  if (menuOpen) {
    return null;
  }

  return (
    <header className="app-header">
      <div className="app-header__safe-area">
        <div className="app-header__inner">
          <div className="app-header__side app-header__side--left">
            <AppMenuButton />
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
