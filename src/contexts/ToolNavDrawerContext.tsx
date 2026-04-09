"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type ToolNavDrawerContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
  toggle: () => void;
};

const ToolNavDrawerContext = createContext<ToolNavDrawerContextValue | null>(null);

export function ToolNavDrawerProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const toggle = useCallback(() => setOpen((o) => !o), []);

  const value = useMemo(
    () => ({ open, setOpen, toggle }),
    [open, toggle]
  );

  return (
    <ToolNavDrawerContext.Provider value={value}>
      {children}
    </ToolNavDrawerContext.Provider>
  );
}

export function useToolNavDrawer() {
  const ctx = useContext(ToolNavDrawerContext);
  if (!ctx) {
    throw new Error("useToolNavDrawer must be used within ToolNavDrawerProvider");
  }
  return ctx;
}
