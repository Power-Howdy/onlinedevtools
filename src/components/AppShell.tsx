"use client";

import { ToolNavDrawerProvider } from "@/contexts/ToolNavDrawerContext";
import { Header } from "@/components/Header";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <ToolNavDrawerProvider>
      <Header />
      <main className="flex flex-1 flex-col min-h-0 w-full pt-[var(--header-height)]">
        {children}
      </main>
    </ToolNavDrawerProvider>
  );
}
