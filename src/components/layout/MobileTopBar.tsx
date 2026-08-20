type MobileTopBarProps = {
  title: string;
  subtitle?: string;
  leading?: React.ReactNode;
  trailing?: React.ReactNode;
};

export function MobileTopBar({
  title,
  subtitle,
  leading,
  trailing,
}: MobileTopBarProps) {
  return (
    <header className="mobile-top-bar">
      <div className="mobile-top-bar__surface">
        <div className="mobile-top-bar__glow" aria-hidden />
        <div className="mobile-top-bar__glow mobile-top-bar__glow--left" aria-hidden />

        <div className="relative flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-start gap-2.5">
            {leading ? (
              <div className="mobile-top-bar__leading shrink-0 pt-0.5">
                {leading}
              </div>
            ) : null}
            <div className="min-w-0 pt-0.5">
              <h1 className="mobile-top-bar__title">{title}</h1>
              {subtitle ? (
                <p className="mobile-top-bar__subtitle">{subtitle}</p>
              ) : null}
            </div>
          </div>
          {trailing ? (
            <div className="mobile-top-bar__trailing shrink-0">{trailing}</div>
          ) : null}
        </div>
      </div>
    </header>
  );
}
