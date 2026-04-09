"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { TOOLS } from "@/lib/tools";
import {
  clearRecentTools,
  getRecentTools,
  RecentToolEntry,
  toggleFavorite,
} from "@/lib/recent-tools";

type PanelState = {
  open: boolean;
};

const STORAGE_KEY_PANEL = "recent-tools-panel-open";

function readPanelState(): PanelState {
  if (typeof window === "undefined") return { open: false };
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY_PANEL);
    if (!raw) return { open: false };
    const parsed = JSON.parse(raw) as PanelState;
    return {
      open: !!parsed?.open,
    };
  } catch {
    return { open: false };
  }
}

function writePanelState(state: PanelState) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY_PANEL, JSON.stringify(state));
  } catch {
    // ignore
  }
}

function splitFavorites(entries: RecentToolEntry[]) {
  const favorites = entries.filter((item) => item.isFavorite);
  const recent = entries.filter((item) => !item.isFavorite);
  return { favorites, recent };
}

export function RecentToolsPanel() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [entries, setEntries] = useState<RecentToolEntry[]>([]);

  useEffect(() => {
    setOpen(readPanelState().open);
  }, []);

  useEffect(() => {
    const update = () => setEntries(getRecentTools());
    update();
    window.addEventListener("recent-tools-updated", update);
    return () => window.removeEventListener("recent-tools-updated", update);
  }, []);

  useEffect(() => {
    writePanelState({ open });
  }, [open]);

  const { favorites, recent } = splitFavorites(entries);
  const hasItems = favorites.length > 0 || recent.length > 0;

  const toggle = () => setOpen((prev) => !prev);

  const handleClear = () => {
    clearRecentTools();
    setEntries([]);
  };

  const activeSlug = pathname?.replace(/^\//, "").split("/")[0];

  return (
    <>
      {!open && (
        <button
          type="button"
          aria-label="Show recent tools"
          onClick={toggle}
          className="fixed right-2 top-1/2 z-40 -translate-y-1/2 rounded-full bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 p-2 shadow-lg flex items-center justify-center md:right-0"
        >
          <svg
            className="h-4 w-4"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10 3.333c-3.682 0-6.667 2.985-6.667 6.667 0 3.682 2.985 6.667 6.667 6.667 3.682 0 6.667-2.985 6.667-6.667 0-1.228-.333-2.378-.915-3.361"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M10 6.667V10l2.333 1.333"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M10 2.5V4.167"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      )}

      <aside
        className={`fixed inset-y-0 right-0 z-30 w-72 max-w-[80vw] transform border-l border-neutral-200 bg-white/70 shadow-lg backdrop-blur-sm transition-transform dark:border-neutral-800 dark:bg-neutral-950/70 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
        aria-hidden={!open}
      >
        <div className="flex h-full flex-col">
          <header className="flex items-center justify-between border-b border-neutral-200 px-4 py-3 dark:border-neutral-800">
            <div className="space-y-0.5">
              <h2 className="text-sm font-semibold text-neutral-900 dark:text-neutral-50">
                Recent tools
              </h2>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                Your recently used tools across this session.
              </p>
            </div>
            <button
              type="button"
              onClick={toggle}
              className="rounded-md p-1 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-900 dark:hover:text-neutral-100"
            >
              <span className="sr-only">Close</span>
              <svg
                className="h-4 w-4"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M5 5L15 15M15 5L5 15"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </header>

          <div className="flex-1 overflow-y-auto px-3 py-3 space-y-4">
            {hasItems ? (
              <>
                {favorites.length > 0 && (
                  <section>
                    <h3 className="px-1 mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
                      Favorites
                    </h3>
                    <nav className="space-y-0.5">
                      {favorites.map((entry) => {
                        const tool = TOOLS.find((t) => t.slug === entry.slug);
                        if (!tool) return null;
                        const href = `/${tool.slug}`;
                        const active = activeSlug === tool.slug;
                        return (
                          <ToolRow
                            key={`fav-${tool.slug}`}
                            tool={tool.title}
                            slug={tool.slug}
                            href={href}
                            active={active}
                            favorite
                          />
                        );
                      })}
                    </nav>
                  </section>
                )}

                {recent.length > 0 && (
                  <section>
                    <h3 className="px-1 mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
                      Recent
                    </h3>
                    <nav className="space-y-0.5">
                      {recent.map((entry) => {
                        const tool = TOOLS.find((t) => t.slug === entry.slug);
                        if (!tool) return null;
                        const href = `/${tool.slug}`;
                        const active = activeSlug === tool.slug;
                        return (
                          <ToolRow
                            key={`recent-${tool.slug}`}
                            tool={tool.title}
                            slug={tool.slug}
                            href={href}
                            active={active}
                            favorite={entry.isFavorite}
                          />
                        );
                      })}
                    </nav>
                  </section>
                )}
              </>
            ) : (
              <div className="mt-6 rounded-lg border border-dashed border-neutral-200 px-3 py-4 text-center text-xs text-neutral-500 dark:border-neutral-800 dark:text-neutral-400">
                Use any tool and it will appear here for quick access.
              </div>
            )}
          </div>

          <footer className="border-t border-neutral-200 px-3 py-2.5 text-right text-[11px] dark:border-neutral-800">
            <button
              type="button"
              onClick={handleClear}
              disabled={!hasItems}
              className="rounded-md px-2 py-1 text-[11px] font-medium text-neutral-500 hover:bg-neutral-100 hover:text-neutral-800 disabled:opacity-40 disabled:hover:bg-transparent dark:text-neutral-400 dark:hover:bg-neutral-900 dark:hover:text-neutral-100"
            >
              Clear history
            </button>
          </footer>
        </div>
      </aside>
    </>
  );
}

type ToolRowProps = {
  tool: string;
  slug: string;
  href: string;
  active?: boolean;
  favorite?: boolean;
};

function ToolRow({ tool, slug, href, active, favorite }: ToolRowProps) {
  const handleToggleFavorite = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    toggleFavorite(slug as any);
  };

  return (
    <Link
      href={href}
      className={`group flex items-center justify-between rounded-md px-2 py-1.5 text-xs transition-colors ${
        active
          ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900"
          : "bg-transparent text-neutral-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-900"
      }`}
    >
      <span className="truncate">{tool}</span>
      <button
        type="button"
        onClick={handleToggleFavorite}
        aria-label={favorite ? "Unpin from favorites" : "Pin to favorites"}
        className="ml-2 rounded p-1 text-neutral-400 hover:text-neutral-700 group-hover:text-neutral-700 dark:text-neutral-500 dark:hover:text-neutral-200"
      >
        <svg
          className="h-3.5 w-3.5"
          viewBox="0 0 20 20"
          fill={favorite ? "currentColor" : "none"}
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M10 2.5L12.4721 7.50846L18 8.2918L13.9 12.0915L14.9443 17.5L10 14.75L5.05573 17.5L6.1 12.0915L2 8.2918L7.52786 7.50846L10 2.5Z"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </Link>
  );
}

