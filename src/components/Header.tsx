"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Terminal } from "lucide-react";
import { ThemeSwitch } from "./ThemeSwitch";
import { ToolSearch } from "./ToolSearch";
import { useToolNavDrawer } from "@/contexts/ToolNavDrawerContext";

const githubRepo = process.env.NEXT_PUBLIC_GITHUB_REPO;

export function Header() {
  const pathname = usePathname();
  const { toggle } = useToolNavDrawer();
  const showMenu = pathname !== "/";

  return (
    <header className="fixed top-0 left-0 right-0 z-20 border-b border-light-border dark:border-dark-border bg-light-card dark:bg-dark-card">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-3 w-full min-w-0">
        <div className="flex items-center gap-2 sm:gap-3 shrink-0 min-w-0">
          {showMenu && (
            <button
              type="button"
              aria-label="Open tools menu"
              onClick={toggle}
              className="md:hidden shrink-0 p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <Menu className="w-5 h-5" strokeWidth={2} />
            </button>
          )}
          <Link
            href="/"
            className="flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-slate-100 hover:text-primary dark:hover:text-primary transition-colors min-w-0"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Terminal className="w-5 h-5" strokeWidth={2} aria-hidden />
            </span>
            <span className="truncate">DevToolBox</span>
          </Link>
        </div>

        <div className="flex flex-1 min-w-0 items-center justify-end gap-1.5 sm:gap-2">
          <ToolSearch
            className="relative min-w-0 w-[7.25rem] sm:w-36 md:w-44 lg:w-52"
            dropdownAlign="right"
          />
          {githubRepo && (
            <a
              href={githubRepo}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-light-border dark:border-dark-border px-2.5 py-1.5 sm:px-3 text-sm font-medium text-slate-600 dark:text-slate-300 hover:border-primary/50 hover:text-primary transition-colors"
              title="Star on GitHub"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              <span className="hidden sm:inline">Star</span>
            </a>
          )}
          <ThemeSwitch />
        </div>
      </div>
    </header>
  );
}
