"use client";

import { useAppMenu } from "@/context/AppMenuContext";

type AppMenuButtonProps = {
  className?: string;
};

export function AppMenuButton({ className = "app-header__icon-btn" }: AppMenuButtonProps) {
  const { openMenu, open } = useAppMenu();

  return (
    <button
      type="button"
      className={className}
      aria-label="Menu"
      aria-haspopup="dialog"
      aria-expanded={open}
      onClick={openMenu}
    >
      ☰
    </button>
  );
}
