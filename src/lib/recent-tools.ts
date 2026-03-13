import { TOOLS } from "./tools";

const STORAGE_KEY = "recent-tools-v2";
const MAX_RECENT = 10;

export type ToolSlug = (typeof TOOLS)[number]["slug"];

export type RecentToolEntry = {
  slug: ToolSlug;
  lastUsedAt: number;
  isFavorite?: boolean;
};

type RecentToolsState = {
  items: RecentToolEntry[];
};

function readState(): RecentToolsState {
  if (typeof window === "undefined") return { items: [] };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { items: [] };
    const parsed = JSON.parse(raw) as RecentToolsState;
    if (!parsed || !Array.isArray(parsed.items)) return { items: [] };
    const validSlugs = new Set(TOOLS.map((t) => t.slug));
    const items = parsed.items
      .filter(
        (item): item is RecentToolEntry =>
          typeof item?.slug === "string" &&
          validSlugs.has(item.slug as ToolSlug) &&
          typeof item.lastUsedAt === "number"
      )
      .slice(0, MAX_RECENT);
    return { items };
  } catch {
    return { items: [] };
  }
}

function writeState(state: RecentToolsState) {
  if (typeof window === "undefined") return;
  try {
    const trimmed = {
      items: state.items.slice(0, MAX_RECENT),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
    window.dispatchEvent(new CustomEvent("recent-tools-updated"));
  } catch {
    // ignore
  }
}

export function getRecentToolSlugs(): ToolSlug[] {
  const state = readState();
  return state.items
    .filter((item) => !item.isFavorite)
    .sort((a, b) => b.lastUsedAt - a.lastUsedAt)
    .map((item) => item.slug);
}

export function getRecentTools(): RecentToolEntry[] {
  const state = readState();
  return [...state.items].sort((a, b) => b.lastUsedAt - a.lastUsedAt);
}

export function addRecentTool(slug: string): void {
  if (typeof window === "undefined") return;
  const valid = TOOLS.some((t) => t.slug === slug);
  if (!valid) return;
  const state = readState();
  const now = Date.now();
  const existing = state.items.find((item) => item.slug === slug);
  const updated: RecentToolEntry = {
    slug,
    lastUsedAt: now,
    isFavorite: existing?.isFavorite,
  };
  const items = [updated, ...state.items.filter((item) => item.slug !== slug)];
  writeState({ items });
}

export function toggleFavorite(slug: ToolSlug): void {
  if (typeof window === "undefined") return;
  const state = readState();
  const items = state.items.map((item) =>
    item.slug === slug ? { ...item, isFavorite: !item.isFavorite } : item
  );
  writeState({ items });
}

export function clearRecentTools(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new CustomEvent("recent-tools-updated"));
  } catch {
    // ignore
  }
}

