"use client";

import { AppMenuDrawer } from "@/components/layout/AppMenuDrawer";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type AppMenuContextValue = {
  open: boolean;
  openMenu: () => void;
  closeMenu: () => void;
};

const AppMenuContext = createContext<AppMenuContextValue | null>(null);

export function AppMenuProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  const openMenu = useCallback(() => setOpen(true), []);
  const closeMenu = useCallback(() => setOpen(false), []);

  const value = useMemo(
    () => ({ open, openMenu, closeMenu }),
    [open, openMenu, closeMenu],
  );

  return (
    <AppMenuContext.Provider value={value}>
      {children}
      <AppMenuDrawer open={open} onClose={closeMenu} />
    </AppMenuContext.Provider>
  );
}

export function useAppMenu() {
  const context = useContext(AppMenuContext);
  if (!context) {
    throw new Error("useAppMenu must be used within AppMenuProvider");
  }
  return context;
}
