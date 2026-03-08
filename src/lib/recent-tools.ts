import { TOOLS } from "./tools";

const STORAGE_KEY = "recent-tools";
const MAX_RECENT = 5;

export type ToolSlug = (typeof TOOLS)[number]["slug"];

export function getRecentToolSlugs(): ToolSlug[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as string[];
    return parsed.filter((s): s is ToolSlug =>
      TOOLS.some((t) => t.slug === s)
    ).slice(0, MAX_RECENT);
  } catch {
    return [];
  }
}

export function addRecentTool(slug: string): void {
  if (typeof window === "undefined") return;
  const valid = TOOLS.some((t) => t.slug === slug);
  if (!valid) return;
  try {
    const current = getRecentToolSlugs();
    const next = [slug, ...current.filter((s) => s !== slug)].slice(0, MAX_RECENT);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    window.dispatchEvent(new CustomEvent("recent-tools-updated"));
  } catch {
    // ignore
  }
}
