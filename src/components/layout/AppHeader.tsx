import { CoachDog } from "@/components/mascot/CoachDog";
import { displayFontClass } from "@/lib/fonts";

type AppHeaderProps = {
  title: string;
  leading?: React.ReactNode;
  trailing?: React.ReactNode;
  peekFox?: boolean;
};

/** Top bar — teal header, optional Coach Fox peeking from the bottom edge. */
export function AppHeader({ title, leading, trailing, peekFox = false }: AppHeaderProps) {
  return (
    <header className="app-header">
      <div className={`app-header__inner${peekFox ? " app-header__inner--fox" : ""}`}>
        <div className="app-header__side app-header__side--left">
          {leading ?? <span className="app-header__spacer" aria-hidden />}
        </div>
        {peekFox && (
          <div className="app-header__fox" aria-hidden>
            <CoachDog pose="happy" size={68} title="Coach Fox" />
          </div>
        )}
        <h1 className={`app-header__title ${displayFontClass}`}>{title}</h1>
        <div className="app-header__side app-header__side--right">
          {trailing ?? <span className="app-header__spacer" aria-hidden />}
        </div>
      </div>
    </header>
  );
}
