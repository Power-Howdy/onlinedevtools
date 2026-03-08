"use client";

import { createContext, useContext } from "react";

const ToolAnalyticsContext = createContext<string | null>(null);

export function ToolAnalyticsProvider({
  slug,
  children,
}: {
  slug: string;
  children: React.ReactNode;
}) {
  return (
    <ToolAnalyticsContext.Provider value={slug}>
      {children}
    </ToolAnalyticsContext.Provider>
  );
}

export function useToolSlug(): string | null {
  return useContext(ToolAnalyticsContext);
}
