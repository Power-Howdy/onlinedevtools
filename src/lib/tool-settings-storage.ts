const PREFIX = "odt-tool-settings";

/** Max serialized characters per string value to avoid quota issues. */
const MAX_STRING_CHARS = 512 * 1024;

export function toolSettingsStorageKey(slug: string, segment: string): string {
  return `${PREFIX}:${slug}:${segment}`;
}

function truncateStrings(value: unknown): unknown {
  if (typeof value === "string") {
    return value.length > MAX_STRING_CHARS ? value.slice(0, MAX_STRING_CHARS) : value;
  }
  if (Array.isArray(value)) {
    return value.map(truncateStrings);
  }
  if (value !== null && typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value)) {
      out[k] = truncateStrings(v);
    }
    return out;
  }
  return value;
}

export function readToolSettingsSegment(
  slug: string,
  segment: string
): Record<string, unknown> | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(toolSettingsStorageKey(slug, segment));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as unknown;
    if (parsed !== null && typeof parsed === "object" && !Array.isArray(parsed)) {
      return parsed as Record<string, unknown>;
    }
  } catch {
    /* ignore corrupt storage */
  }
  return null;
}

export function writeToolSettingsSegment(
  slug: string,
  segment: string,
  value: Record<string, unknown>
): void {
  if (typeof window === "undefined") return;
  try {
    const safe = truncateStrings(value) as Record<string, unknown>;
    localStorage.setItem(toolSettingsStorageKey(slug, segment), JSON.stringify(safe));
  } catch {
    /* quota or private mode */
  }
}
