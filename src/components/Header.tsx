import Link from "next/link";
import { ThemeSwitch } from "./ThemeSwitch";
import { ToolSearch } from "./ToolSearch";

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-20 border-b border-neutral-200 dark:border-neutral-800 bg-white/70 dark:bg-neutral-950/70 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center gap-2 w-full">
        <Link
          href="/"
          className="flex items-center gap-2 text-xl font-semibold text-neutral-900 dark:text-neutral-100 hover:text-neutral-600 dark:hover:text-neutral-400 transition-colors shrink-0"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-6 h-6 shrink-0"
            aria-hidden
          >
            <path d="M16 18 22 12 16 6" />
            <path d="M8 6 2 12 8 18" />
          </svg>
          Online Dev Tools
        </Link>
        <ToolSearch />
        <div className="shrink-0 ml-auto">
          <ThemeSwitch />
        </div>
      </div>
    </header>
  );
}
