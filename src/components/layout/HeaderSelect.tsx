"use client";

import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";

type HeaderSelectOption = {
  id: string;
  label: string;
};

type HeaderSelectProps = {
  value: string;
  onChange: (id: string) => void;
  options: HeaderSelectOption[];
  "aria-label": string;
};

/** App-font listbox. Native <select> uses the iOS system picker/font. */
export function HeaderSelect({
  value,
  onChange,
  options,
  "aria-label": ariaLabel,
}: HeaderSelectProps) {
  const [open, setOpen] = useState(false);
  const [menuBox, setMenuBox] = useState<{ top: number; right: number } | null>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLUListElement>(null);
  const listId = useId();
  const selected = options.find((item) => item.id === value) ?? options[0];

  const placeMenu = () => {
    const btn = btnRef.current;
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    setMenuBox({
      top: rect.bottom + 6,
      right: Math.max(8, window.innerWidth - rect.right),
    });
  };

  useEffect(() => {
    if (!open) return;
    placeMenu();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    const onPointer = (event: PointerEvent) => {
      const node = event.target as Node;
      if (btnRef.current?.contains(node) || menuRef.current?.contains(node)) return;
      setOpen(false);
    };
    window.addEventListener("resize", placeMenu);
    window.addEventListener("scroll", placeMenu, true);
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      window.removeEventListener("resize", placeMenu);
      window.removeEventListener("scroll", placeMenu, true);
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [open]);

  return (
    <div className="header-select">
      <button
        ref={btnRef}
        type="button"
        className="app-header__control"
        aria-label={ariaLabel}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => setOpen((current) => !current)}
      >
        {selected?.label}
      </button>
      {open && menuBox
        ? createPortal(
            <ul
              ref={menuRef}
              id={listId}
              role="listbox"
              className="header-select__menu"
              style={{ top: menuBox.top, right: menuBox.right }}
            >
              {options.map((option) => {
                const active = option.id === value;
                return (
                  <li key={option.id} role="none">
                    <button
                      type="button"
                      role="option"
                      aria-selected={active}
                      className={`header-select__option${active ? " is-active" : ""}`}
                      onClick={() => {
                        onChange(option.id);
                        setOpen(false);
                      }}
                    >
                      <span className="header-select__check" aria-hidden>
                        {active ? "✓" : ""}
                      </span>
                      {option.label}
                    </button>
                  </li>
                );
              })}
            </ul>,
            document.body,
          )
        : null}
    </div>
  );
}
