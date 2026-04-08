export type JsonDiffKind =
  | "equal"
  | "added"
  | "removed"
  | "changed"
  | "type_mismatch";

export type JsonDiffRow = {
  path: string;
  left: string;
  right: string;
  kind: JsonDiffKind;
};

function fmt(v: unknown): string {
  if (v === undefined) return "—";
  return JSON.stringify(v);
}

function typeTag(v: unknown): string {
  if (v === null) return "null";
  if (Array.isArray(v)) return "array";
  return typeof v;
}

function rootPath(path: string): string {
  return path || "(root)";
}

function emitAdded(b: unknown, path: string, rows: JsonDiffRow[]): void {
  if (b !== null && typeof b === "object" && !Array.isArray(b)) {
    const ob = b as Record<string, unknown>;
    for (const k of Object.keys(ob).sort((x, y) => x.localeCompare(y))) {
      const p = path ? `${path}.${k}` : k;
      emitAdded(ob[k], p, rows);
    }
    return;
  }
  if (Array.isArray(b)) {
    for (let i = 0; i < b.length; i++) {
      emitAdded(b[i], `${path}[${i}]`, rows);
    }
    return;
  }
  rows.push({ path: rootPath(path), left: "—", right: fmt(b), kind: "added" });
}

function emitRemoved(a: unknown, path: string, rows: JsonDiffRow[]): void {
  if (a !== null && typeof a === "object" && !Array.isArray(a)) {
    const oa = a as Record<string, unknown>;
    for (const k of Object.keys(oa).sort((x, y) => x.localeCompare(y))) {
      const p = path ? `${path}.${k}` : k;
      emitRemoved(oa[k], p, rows);
    }
    return;
  }
  if (Array.isArray(a)) {
    for (let i = 0; i < a.length; i++) {
      emitRemoved(a[i], `${path}[${i}]`, rows);
    }
    return;
  }
  rows.push({ path: rootPath(path), left: fmt(a), right: "—", kind: "removed" });
}

function walk(
  a: unknown,
  b: unknown,
  path: string,
  rows: JsonDiffRow[],
  showEqual: boolean
): void {
  if (a === undefined && b === undefined) {
    if (showEqual) {
      rows.push({
        path: rootPath(path),
        left: "—",
        right: "—",
        kind: "equal",
      });
    }
    return;
  }
  if (a === undefined) {
    emitAdded(b, path, rows);
    return;
  }
  if (b === undefined) {
    emitRemoved(a, path, rows);
    return;
  }

  const ta = typeTag(a);
  const tb = typeTag(b);

  if (ta !== tb) {
    rows.push({
      path: rootPath(path),
      left: fmt(a),
      right: fmt(b),
      kind: "type_mismatch",
    });
    return;
  }

  if (a === null && b === null) {
    if (showEqual) {
      rows.push({
        path: rootPath(path),
        left: "null",
        right: "null",
        kind: "equal",
      });
    }
    return;
  }

  if (typeof a !== "object" || a === null) {
    const same =
      a === b ||
      (typeof a === "number" &&
        typeof b === "number" &&
        Number.isNaN(a) &&
        Number.isNaN(b));
    if (same) {
      if (showEqual) {
        rows.push({
          path: rootPath(path),
          left: fmt(a),
          right: fmt(b),
          kind: "equal",
        });
      }
    } else {
      rows.push({
        path: rootPath(path),
        left: fmt(a),
        right: fmt(b),
        kind: "changed",
      });
    }
    return;
  }

  if (Array.isArray(a) && Array.isArray(b)) {
    const max = Math.max(a.length, b.length);
    for (let i = 0; i < max; i++) {
      const p = `${path}[${i}]`;
      const hasA = i < a.length;
      const hasB = i < b.length;
      if (!hasA && hasB) {
        rows.push({ path: p, left: "—", right: fmt(b[i]), kind: "added" });
      } else if (hasA && !hasB) {
        rows.push({ path: p, left: fmt(a[i]), right: "—", kind: "removed" });
      } else {
        walk(a[i], b[i], p, rows, showEqual);
      }
    }
    return;
  }

  const oa = a as Record<string, unknown>;
  const ob = b as Record<string, unknown>;
  const sortedKeys = Array.from(
    new Set(Object.keys(oa).concat(Object.keys(ob)))
  ).sort((x, y) => x.localeCompare(y));
  for (let ki = 0; ki < sortedKeys.length; ki++) {
    const k = sortedKeys[ki];
    const p = path ? `${path}.${k}` : k;
    const ha = Object.prototype.hasOwnProperty.call(oa, k);
    const hb = Object.prototype.hasOwnProperty.call(ob, k);
    if (!ha && hb) {
      rows.push({ path: p, left: "—", right: fmt(ob[k]), kind: "added" });
    } else if (ha && !hb) {
      rows.push({ path: p, left: fmt(oa[k]), right: "—", kind: "removed" });
    } else {
      walk(oa[k], ob[k], p, rows, showEqual);
    }
  }
}

/** Structural JSON diff: object keys are compared by name (order ignored); arrays use index. */
export function compareJsonStructure(
  left: unknown,
  right: unknown,
  showEqual: boolean
): JsonDiffRow[] {
  const rows: JsonDiffRow[] = [];
  walk(left, right, "", rows, showEqual);
  return rows;
}

export function countNonEqual(rows: JsonDiffRow[]): number {
  return rows.filter((r) => r.kind !== "equal").length;
}
