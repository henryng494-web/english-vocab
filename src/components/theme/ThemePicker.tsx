"use client";

import { APP_THEME_LIST, APP_THEMES } from "@/data/app-themes";
import { useAppTheme } from "@/components/theme/ThemeProvider";

export function ThemePicker() {
  const { themeId, setThemeId } = useAppTheme();

  return (
    <div className="space-y-3">
      {APP_THEME_LIST.map((theme) => {
        const selected = theme.id === themeId;
        const vars = theme.cssVars;

        return (
          <button
            key={theme.id}
            type="button"
            onClick={() => setThemeId(theme.id)}
            aria-pressed={selected}
            className={`w-full rounded-2xl border-2 p-3 text-left transition active:scale-[0.99] ${
              selected
                ? "border-primary bg-surface shadow-md"
                : "border-primary-200 bg-surface/70"
            }`}
          >
            <div className="flex items-start gap-3">
              <div
                className="h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-primary-200 shadow-sm"
                style={{
                  background: `linear-gradient(135deg, ${vars["--primary"]} 0%, ${vars["--primary-hover"]} 45%, ${vars["--secondary"]} 100%)`,
                }}
                aria-hidden
              />

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="rounded-md bg-primary px-2 py-0.5 text-xs font-black uppercase tracking-wide text-white">
                    {theme.letter}
                  </span>
                  <span className="font-bold text-foreground">{theme.name}</span>
                  {selected ? (
                    <span className="ml-auto rounded-full bg-accent px-2 py-0.5 text-xs font-bold text-white">
                      Active
                    </span>
                  ) : null}
                </div>
                <p className="mt-0.5 text-xs text-foreground/65">{theme.tagline}</p>

                <div className="mt-2 flex gap-1.5">
                  {theme.swatches.map((color) => (
                    <span
                      key={`${theme.id}-${color}`}
                      className="h-4 w-4 rounded-full border border-foreground/10 shadow-sm"
                      style={{ backgroundColor: color }}
                      aria-hidden
                    />
                  ))}
                </div>
              </div>
            </div>
          </button>
        );
      })}

      <p className="text-xs text-foreground/55">
        Current: {APP_THEMES[themeId].name}. Saved on this device.
      </p>
    </div>
  );
}
