"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { toolMatches } from "@/lib/tool-matches";
import { TOOLS } from "@/lib/tools";

export type ToolSearchProps = {
  /** Wrapper width / flex; omit for full-width bar between logo and actions */
  className?: string;
  /** Align results under the field (use `right` when the field sits on the right of the header) */
  dropdownAlign?: "left" | "right";
};

export function ToolSearch({ className, dropdownAlign = "left" }: ToolSearchProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(
    () => TOOLS.filter((t) => toolMatches(t, query)),
    [query]
  );

  useEffect(() => {
    setActiveIndex(0);
  }, [query, open]);

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
    setActiveIndex(0);
    // Drop focus so we are not stuck with a "focused" input after picking a result
    // (mousedown preventDefault on links keeps focus on the input otherwise).
    inputRef.current?.blur();
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
        inputRef.current?.blur();
      }
    };
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [open, close]);

  const goTo = useCallback(
    (slug: string) => {
      close();
      router.push(`/${slug}`);
    },
    [router, close]
  );

  useEffect(() => {
    close();
  }, [pathname, close]);

  const onInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open || filtered.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => (i + 1) % filtered.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => (i - 1 + filtered.length) % filtered.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      const t = filtered[activeIndex];
      if (t) goTo(t.slug);
    }
  };

  useEffect(() => {
    const el = wrapRef.current;
    if (!el || !open) return;
    const onFocusOut = (e: FocusEvent) => {
      const related = e.relatedTarget as Node | null;
      if (related && el.contains(related)) return;
      setOpen(false);
    };
    el.addEventListener("focusout", onFocusOut);
    return () => el.removeEventListener("focusout", onFocusOut);
  }, [open]);

  const wrapClass =
    className ??
    "relative flex-1 max-w-md min-w-0 mx-2 md:mx-6";

  return (
    <div ref={wrapRef} className={wrapClass}>
      {open && (
        <button
          type="button"
          aria-label="Close search"
          className="fixed inset-0 z-[90] bg-black/40 dark:bg-black/50"
          onMouseDown={(e) => {
            e.preventDefault();
            close();
            inputRef.current?.blur();
          }}
        />
      )}
      <div className="relative z-[100]">
        <label htmlFor="tool-search-input" className="sr-only">
          Search tools
        </label>
        <input
          id="tool-search-input"
          ref={inputRef}
          type="search"
          autoComplete="off"
          placeholder="Search tools…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setOpen(true)}
          onKeyDown={onInputKeyDown}
          className="w-full px-3 py-2 pl-9 rounded-lg border border-light-border bg-light-bg text-sm text-slate-900 placeholder:text-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none dark:border-dark-border dark:bg-dark-bg dark:text-slate-100 dark:placeholder:text-slate-500"
        />
        <span
          className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-primary/60"
          aria-hidden
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </span>
        {open && (
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Tool search results"
            className={`absolute top-full mt-1 max-h-[min(70vh,24rem)] w-[min(calc(100vw-2rem),22rem)] overflow-y-auto rounded-lg border border-light-border bg-light-card shadow-lg dark:border-dark-border dark:bg-dark-card ${
              dropdownAlign === "right" ? "right-0 left-auto" : "left-0 right-0 w-auto"
            }`}
          >
            {filtered.length === 0 ? (
              <p className="px-3 py-4 text-sm text-slate-500 text-center dark:text-slate-400">
                No tools match.
              </p>
            ) : (
              <ul className="py-1" role="listbox" aria-label="Matching tools">
                {filtered.map((tool, index) => {
                  const active = index === activeIndex;
                  return (
                    <li key={tool.slug} role="option" aria-selected={active}>
                      <Link
                        href={`/${tool.slug}`}
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={(e) => {
                          if (e.metaKey || e.ctrlKey || e.altKey || e.shiftKey) return;
                          e.preventDefault();
                          goTo(tool.slug);
                        }}
                        onMouseEnter={() => setActiveIndex(index)}
                        className={`block px-3 py-2.5 text-left transition-colors ${
                          active
                            ? "bg-primary/10 dark:bg-primary/15"
                            : "hover:bg-slate-100 dark:hover:bg-slate-800/80"
                        }`}
                      >
                        <div className="font-medium text-sm text-slate-900 dark:text-slate-100">
                          {tool.title}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">
                          {tool.description}
                        </div>
                        <div className="text-[10px] uppercase tracking-wider text-slate-400 mt-1">
                          {tool.category}
                        </div>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
            <p className="px-3 py-2 text-[10px] text-slate-400 border-t border-light-border dark:border-dark-border">
              <kbd className="px-1 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono">
                ↑↓
              </kbd>{" "}
              navigate ·{" "}
              <kbd className="px-1 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono">
                Enter
              </kbd>{" "}
              open ·{" "}
              <kbd className="px-1 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono">
                Esc
              </kbd>{" "}
              close ·{" "}
              <kbd className="px-1 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono">
                Ctrl K
              </kbd>{" "}
              focus
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
