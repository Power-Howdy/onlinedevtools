"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { Search } from "lucide-react";
import { TOOLS, TOOL_CATEGORIES } from "@/lib/tools";
import { toolMatches } from "@/lib/tool-matches";
import { getToolNavIcon } from "@/data/tool-nav-icons";
import { useToolNavDrawer } from "@/contexts/ToolNavDrawerContext";

const toolsByCategory = TOOL_CATEGORIES.map((category) => ({
  category,
  tools: TOOLS.filter((t) => t.category === category),
}));

function isToolNavActive(pathname: string, slug: string, href: string): boolean {
  if (pathname === href) return true;
  if (slug === "regex-tester" && pathname.startsWith("/regex/")) return true;
  if (slug === "cron-parser" && pathname.startsWith("/cron-explainer/")) return true;
  return false;
}

export function ToolNav() {
  const pathname = usePathname();
  const { open, setOpen } = useToolNavDrawer();
  const [query, setQuery] = useState("");
  const desktopSearchRef = useRef<HTMLInputElement>(null);
  const mobileSearchRef = useRef<HTMLInputElement>(null);

  const filteredByCategory = useMemo(() => {
    return toolsByCategory
      .map(({ category, tools }) => ({
        category,
        tools: tools.filter((t) => toolMatches(t, query)),
      }))
      .filter((g) => g.tools.length > 0);
  }, [query]);

  useEffect(() => {
    setOpen(false);
  }, [pathname, setOpen]);

  const closeMobile = () => setOpen(false);

  const navContent = (
    <nav className="flex flex-col gap-3 pr-1">
      {filteredByCategory.map(({ category, tools }) => (
        <div key={category}>
          <h3 className="px-3 mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {category}
          </h3>
          <div className="flex flex-col gap-0.5">
            {tools.map((tool) => {
              const href = `/${tool.slug}`;
              const isActive = isToolNavActive(pathname, tool.slug, href);
              const Icon = getToolNavIcon(tool.slug);
              return (
                <Link
                  key={tool.slug}
                  href={href}
                  onClick={closeMobile}
                  className={`flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition-colors border-r-4 ${
                    isActive
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/80 dark:hover:text-slate-100"
                  }`}
                >
                  <Icon className="h-5 w-5 shrink-0 text-primary/70" aria-hidden />
                  <span className="min-w-0 truncate">{tool.title}</span>
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </nav>
  );

  return (
    <>
      <aside className="sidebar-scrollbar hidden md:flex w-72 shrink-0 flex-col min-h-0 border-r border-light-border dark:border-dark-border bg-light-card dark:bg-dark-card py-4 pl-4 pr-2 md:sticky md:top-[var(--header-height)] md:self-start md:max-h-[calc(100dvh-var(--header-height))] md:overflow-y-auto">
        <div className="relative mb-3 shrink-0 px-1">
          <label htmlFor="tool-nav-search-desktop" className="sr-only">
            Filter tools
          </label>
          <input
            id="tool-nav-search-desktop"
            ref={desktopSearchRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`Search ${TOOLS.length} tools…`}
            className="w-full rounded-xl border border-light-border bg-light-bg py-2 pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-dark-border dark:bg-dark-bg dark:text-slate-100 dark:placeholder:text-slate-500"
          />
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-primary/70"
            aria-hidden
          />
        </div>
        {navContent}
      </aside>

      {open && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/50"
          onClick={() => setOpen(false)}
          aria-hidden
        />
      )}
      <aside
        className={`sidebar-scrollbar md:hidden fixed top-0 left-0 z-50 flex h-full w-72 flex-col border-r border-light-border dark:border-dark-border bg-light-card dark:bg-dark-card py-4 pl-4 pr-2 overflow-y-auto transition-transform duration-200 ease-out ${
          open ? "translate-x-0" : "-translate-x-full pointer-events-none"
        }`}
        aria-hidden={!open}
      >
        <div className="relative mb-3 shrink-0 px-1">
          <label htmlFor="tool-nav-search-mobile" className="sr-only">
            Filter tools
          </label>
          <input
            id="tool-nav-search-mobile"
            ref={mobileSearchRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`Search ${TOOLS.length} tools…`}
            className="w-full rounded-xl border border-light-border bg-light-bg py-2 pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-dark-border dark:bg-dark-bg dark:text-slate-100 dark:placeholder:text-slate-500"
          />
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-primary/70"
            aria-hidden
          />
        </div>
        {navContent}
      </aside>
    </>
  );
}
