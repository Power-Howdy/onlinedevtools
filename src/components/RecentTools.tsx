"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getRecentToolSlugs } from "@/lib/recent-tools";
import { TOOLS } from "@/lib/tools";

export function RecentTools() {
  const [recent, setRecent] = useState<string[]>([]);

  useEffect(() => {
    const update = () => setRecent(getRecentToolSlugs());
    update();
    window.addEventListener("recent-tools-updated", update);
    return () => window.removeEventListener("recent-tools-updated", update);
  }, []);

  if (recent.length === 0) return null;

  const items = recent
    .map((slug) => TOOLS.find((t) => t.slug === slug))
    .filter(Boolean);

  return (
    <div className="mb-4">
      <h2 className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
        Recently used
      </h2>
      <nav className="flex flex-col gap-0.5">
        {items.map((tool) =>
          tool ? (
            <Link
              key={tool.slug}
              href={`/${tool.slug}`}
              className="block px-3 py-2 rounded-md text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
            >
              {tool.title}
            </Link>
          ) : null
        )}
      </nav>
    </div>
  );
}
