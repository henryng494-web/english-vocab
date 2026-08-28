"use client";

import { AppMenuDrawer } from "@/components/layout/AppMenuDrawer";
import { useState } from "react";

type AppMenuButtonProps = {
  className?: string;
};

export function AppMenuButton({ className = "app-header__icon-btn" }: AppMenuButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        className={className}
        aria-label="Menu"
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen(true)}
      >
        ☰
      </button>
      <AppMenuDrawer open={open} onClose={() => setOpen(false)} />
    </>
  );
}
