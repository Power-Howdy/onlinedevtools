"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { TOOLS } from "@/lib/tools";

export function ToolNav() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navContent = (
    <nav className="flex flex-col gap-0.5">
      {TOOLS.map((tool) => {
        const href = `/${tool.slug}`;
        const isActive = pathname === href;
        return (
          <Link
            key={tool.slug}
            href={href}
            onClick={() => setMobileOpen(false)}
            className={`block px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              isActive
                ? "bg-neutral-200 dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100"
                : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-neutral-100"
            }`}
          >
            {tool.title}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-56 shrink-0 flex-col border-r border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 py-4 pl-4 pr-2">
        <h2 className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
          Tools
        </h2>
        {navContent}
      </aside>

      {/* Mobile: toggle button */}
      <div className="md:hidden border-b border-neutral-200 dark:border-neutral-800 px-4 py-2">
        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="flex items-center gap-2 text-sm font-medium text-neutral-700 dark:text-neutral-300"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {mobileOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
          Tools
        </button>
      </div>

      {/* Mobile: drawer overlay */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/50"
          onClick={() => setMobileOpen(false)}
          aria-hidden
        />
      )}
      {mobileOpen && (
        <aside className="md:hidden fixed top-0 left-0 z-50 h-full w-56 border-r border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 py-4 pl-4 pr-2 overflow-y-auto">
          <h2 className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
            Tools
          </h2>
          {navContent}
        </aside>
      )}
    </>
  );
}
