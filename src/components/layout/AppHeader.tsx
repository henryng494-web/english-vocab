import { CoachDog } from "@/components/mascot/CoachDog";
import { displayFontClass } from "@/lib/fonts";

type AppHeaderProps = {
  title: string;
  leading?: React.ReactNode;
  trailing?: React.ReactNode;
  /** Home: full peek. Session: compact half-face so Rank still fits. */
  peekFox?: boolean | "sm";
};

/** Top bar — teal header, optional Coach Fox peeking from the bottom edge. */
export function AppHeader({ title, leading, trailing, peekFox = false }: AppHeaderProps) {
  const foxSize = peekFox === "sm" ? "sm" : peekFox ? "home" : null;
  const innerClass =
    foxSize === "home"
      ? "app-header__inner app-header__inner--fox"
      : foxSize === "sm"
        ? "app-header__inner app-header__inner--fox-sm"
        : "app-header__inner";

  return (
    <header className="app-header">
      <div className={innerClass}>
        <div className="app-header__side app-header__side--left">
          {leading ?? <span className="app-header__spacer" aria-hidden />}
          {foxSize ? (
            <div
              className={`app-header__fox${foxSize === "sm" ? " app-header__fox--sm" : ""}`}
              aria-hidden
            >
              <CoachDog
                pose="happy"
                size={foxSize === "sm" ? 48 : 68}
                title="Coach Fox"
              />
            </div>
          ) : null}
        </div>
        <h1 className={`app-header__title ${displayFontClass}`}>{title}</h1>
        <div className="app-header__side app-header__side--right">
          {trailing ?? <span className="app-header__spacer" aria-hidden />}
        </div>
      </div>
    </header>
  );
}
