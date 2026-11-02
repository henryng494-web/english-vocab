"use client";

type HeaderSelectOption = { id: string; label: string; badge?: string };
type HeaderSelectProps = {
  value: string;
  onChange: (id: string) => void;
  options: HeaderSelectOption[];
  "aria-label": string;
};

/** Use the platform picker: every band remains reachable without a WebView overlay. */
export function HeaderSelect({ value, onChange, options, "aria-label": ariaLabel }: HeaderSelectProps) {
  return (
    <div className="header-select" data-header-select-overlay>
      <select
        className="app-header__control"
        aria-label={ariaLabel}
        value={value}
        onPointerDown={(event) => event.stopPropagation()}
        onClick={(event) => event.stopPropagation()}
        onChange={(event) => onChange(event.currentTarget.value)}
      >
        {options.map((option) => (
          <option key={option.id} value={option.id}>
            {option.label}{option.badge ? ` — ${option.badge}` : ""}
          </option>
        ))}
      </select>
    </div>
  );
}
