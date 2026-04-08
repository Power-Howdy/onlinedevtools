"use client";

import { useState, useCallback, useMemo } from "react";
import toast from "react-hot-toast";

type CookieEntry = { name: string; value: string };

type ParseResult = {
  entries: CookieEntry[];
  warnings: { segment: string; message: string }[];
  hadDuplicateNames: boolean;
};

function tryDecodeURIComponent(s: string): string {
  try {
    return decodeURIComponent(s.replace(/\+/g, " "));
  } catch {
    return s;
  }
}

export function parseCookieHeader(raw: string): ParseResult {
  let s = raw.trim();
  if (/^cookie\s*:/i.test(s)) {
    s = s.replace(/^cookie\s*:/i, "").trim();
  }
  const warnings: { segment: string; message: string }[] = [];
  if (!s) {
    return { entries: [], warnings, hadDuplicateNames: false };
  }
  const segments = s.split(";").map((x) => x.trim()).filter(Boolean);
  const lastWin = new Map<string, string>();
  const seen = new Set<string>();
  let hadDuplicateNames = false;

  for (const seg of segments) {
    const eq = seg.indexOf("=");
    if (eq === -1) {
      const name = tryDecodeURIComponent(seg);
      if (!name) {
        warnings.push({ segment: seg, message: "Empty cookie name" });
        continue;
      }
      if (seen.has(name)) hadDuplicateNames = true;
      seen.add(name);
      lastWin.set(name, "");
      continue;
    }
    const nameRaw = seg.slice(0, eq).trim();
    const valueRaw = seg.slice(eq + 1).trim();
    const name = tryDecodeURIComponent(nameRaw);
    if (!name) {
      warnings.push({ segment: seg, message: "Empty cookie name" });
      continue;
    }
    if (seen.has(name)) hadDuplicateNames = true;
    seen.add(name);
    lastWin.set(name, tryDecodeURIComponent(valueRaw));
  }

  const entries = Array.from(lastWin.entries(), ([name, value]) => ({ name, value })).sort(
    (a, b) => a.name.localeCompare(b.name)
  );

  return { entries, warnings, hadDuplicateNames };
}

function entriesToMap(entries: CookieEntry[]): Map<string, string> {
  return new Map(entries.map((e) => [e.name, e.value]));
}

type RowStatus = "match" | "value differs" | "only in A" | "only in B";

function compareCookies(
  a: Map<string, string>,
  b: Map<string, string>
): { name: string; valueA: string; valueB: string; status: RowStatus }[] {
  const names = new Set([...Array.from(a.keys()), ...Array.from(b.keys())]);
  return Array.from(names)
    .sort((x, y) => x.localeCompare(y))
    .map((name) => {
      const ha = a.has(name);
      const hb = b.has(name);
      const va = ha ? a.get(name)! : "";
      const vb = hb ? b.get(name)! : "";
      let status: RowStatus;
      if (ha && hb) {
        status = va === vb ? "match" : "value differs";
      } else if (ha) {
        status = "only in A";
      } else {
        status = "only in B";
      }
      return { name, valueA: ha ? va : "—", valueB: hb ? vb : "—", status };
    });
}

function statusClass(status: RowStatus): string {
  switch (status) {
    case "match":
      return "bg-neutral-100 dark:bg-neutral-800/80";
    case "value differs":
      return "bg-amber-100/80 dark:bg-amber-900/30";
    case "only in A":
      return "bg-red-100/80 dark:bg-red-900/30";
    case "only in B":
      return "bg-green-100/80 dark:bg-green-900/30";
    default:
      return "";
  }
}

export function CookieCompareTool() {
  const [textA, setTextA] = useState("");
  const [textB, setTextB] = useState("");
  const [showCompare, setShowCompare] = useState(false);

  const parseA = useMemo(() => parseCookieHeader(textA), [textA]);
  const parseB = useMemo(() => parseCookieHeader(textB), [textB]);

  const mapA = useMemo(() => entriesToMap(parseA.entries), [parseA.entries]);
  const mapB = useMemo(() => entriesToMap(parseB.entries), [parseB.entries]);

  const compareRows = useMemo(
    () => (showCompare ? compareCookies(mapA, mapB) : []),
    [showCompare, mapA, mapB]
  );

  const runCompare = useCallback(() => {
    if (!textA.trim() && !textB.trim()) {
      toast.error("Paste at least one cookie header to compare");
      return;
    }
    setShowCompare(true);
  }, [textA, textB]);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
            Cookie A
          </label>
          <textarea
            value={textA}
            onChange={(e) => {
              setTextA(e.target.value);
              setShowCompare(false);
            }}
            placeholder={'session=abc; user_id=1\nor: Cookie: session=abc'}
            rows={6}
            className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 font-mono text-sm focus:ring-2 focus:ring-neutral-400 outline-none resize-y"
          />
          {parseA.warnings.length > 0 && (
            <ul className="mt-1 text-xs text-amber-700 dark:text-amber-300 list-disc list-inside">
              {parseA.warnings.map((w, i) => (
                <li key={i}>
                  {w.message}: <code className="text-neutral-600 dark:text-neutral-400">{w.segment}</code>
                </li>
              ))}
            </ul>
          )}
          {parseA.hadDuplicateNames && (
            <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
              Duplicate names on this side: last occurrence wins.
            </p>
          )}
          <p className="mt-2 text-xs font-medium text-neutral-600 dark:text-neutral-400">
            Parsed ({parseA.entries.length} names)
          </p>
          <div className="mt-2 rounded-lg border border-neutral-200 dark:border-neutral-700 overflow-x-auto max-h-48 overflow-y-auto">
            <table className="w-full text-sm">
              <thead className="bg-neutral-50 dark:bg-neutral-900/80 sticky top-0">
                <tr>
                  <th className="text-left px-3 py-2 font-medium">Name</th>
                  <th className="text-left px-3 py-2 font-medium">Value</th>
                </tr>
              </thead>
              <tbody>
                {parseA.entries.length === 0 ? (
                  <tr>
                    <td colSpan={2} className="px-3 py-2 text-neutral-500">
                      No cookies
                    </td>
                  </tr>
                ) : (
                  parseA.entries.map((e) => (
                    <tr key={e.name} className="border-t border-neutral-200 dark:border-neutral-700">
                      <td className="px-3 py-1.5 font-mono text-neutral-800 dark:text-neutral-200">
                        {e.name}
                      </td>
                      <td className="px-3 py-1.5 font-mono text-neutral-600 dark:text-neutral-400 break-all">
                        {e.value || <span className="italic text-neutral-400">(empty)</span>}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
            Cookie B
          </label>
          <textarea
            value={textB}
            onChange={(e) => {
              setTextB(e.target.value);
              setShowCompare(false);
            }}
            placeholder={'session=xyz; theme=dark'}
            rows={6}
            className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 font-mono text-sm focus:ring-2 focus:ring-neutral-400 outline-none resize-y"
          />
          {parseB.warnings.length > 0 && (
            <ul className="mt-1 text-xs text-amber-700 dark:text-amber-300 list-disc list-inside">
              {parseB.warnings.map((w, i) => (
                <li key={i}>
                  {w.message}: <code className="text-neutral-600 dark:text-neutral-400">{w.segment}</code>
                </li>
              ))}
            </ul>
          )}
          {parseB.hadDuplicateNames && (
            <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
              Duplicate names on this side: last occurrence wins.
            </p>
          )}
          <p className="mt-2 text-xs font-medium text-neutral-600 dark:text-neutral-400">
            Parsed ({parseB.entries.length} names)
          </p>
          <div className="mt-2 rounded-lg border border-neutral-200 dark:border-neutral-700 overflow-x-auto max-h-48 overflow-y-auto">
            <table className="w-full text-sm">
              <thead className="bg-neutral-50 dark:bg-neutral-900/80 sticky top-0">
                <tr>
                  <th className="text-left px-3 py-2 font-medium">Name</th>
                  <th className="text-left px-3 py-2 font-medium">Value</th>
                </tr>
              </thead>
              <tbody>
                {parseB.entries.length === 0 ? (
                  <tr>
                    <td colSpan={2} className="px-3 py-2 text-neutral-500">
                      No cookies
                    </td>
                  </tr>
                ) : (
                  parseB.entries.map((e) => (
                    <tr key={e.name} className="border-t border-neutral-200 dark:border-neutral-700">
                      <td className="px-3 py-1.5 font-mono text-neutral-800 dark:text-neutral-200">
                        {e.name}
                      </td>
                      <td className="px-3 py-1.5 font-mono text-neutral-600 dark:text-neutral-400 break-all">
                        {e.value || <span className="italic text-neutral-400">(empty)</span>}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <button
        type="button"
        onClick={runCompare}
        className="px-4 py-2 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-medium rounded-lg hover:bg-neutral-700 dark:hover:bg-neutral-200 transition-colors"
      >
        Compare
      </button>
      {showCompare && compareRows.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-neutral-800 dark:text-neutral-200 mb-2">
            Comparison
          </h2>
          <div className="rounded-lg border border-neutral-300 dark:border-neutral-600 overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-neutral-50 dark:bg-neutral-900/80">
                <tr>
                  <th className="text-left px-3 py-2 font-medium">Name</th>
                  <th className="text-left px-3 py-2 font-medium">A</th>
                  <th className="text-left px-3 py-2 font-medium">B</th>
                  <th className="text-left px-3 py-2 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {compareRows.map((row) => (
                  <tr
                    key={row.name}
                    className={`border-t border-neutral-200 dark:border-neutral-700 ${statusClass(row.status)}`}
                  >
                    <td className="px-3 py-2 font-mono font-medium">{row.name}</td>
                    <td className="px-3 py-2 font-mono break-all max-w-[200px]">{row.valueA}</td>
                    <td className="px-3 py-2 font-mono break-all max-w-[200px]">{row.valueB}</td>
                    <td className="px-3 py-2 whitespace-nowrap">{row.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
