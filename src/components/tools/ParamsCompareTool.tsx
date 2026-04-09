"use client";

import { useState, useCallback, useMemo } from "react";
import toast from "react-hot-toast";
import { useToolSettings } from "@/hooks/useToolSettings";

function parseToSearchParams(input: string): URLSearchParams {
  const raw = input.trim();
  if (!raw) return new URLSearchParams();

  const tryAsUrl = (s: string): URLSearchParams | null => {
    try {
      if (/^https?:\/\//i.test(s) || /^\/\//.test(s)) {
        const href = s.startsWith("//") ? `https:${s}` : s;
        return new URL(href).searchParams;
      }
      if (/^[a-z][a-z0-9+.-]*:/i.test(s)) {
        return new URL(s).searchParams;
      }
      if (s.startsWith("/")) {
        return new URL(s, "http://local.invalid").searchParams;
      }
    } catch {
      return null;
    }
    return null;
  };

  const fromUrl = tryAsUrl(raw);
  if (fromUrl !== null) return fromUrl;

  const qs = raw.startsWith("?") ? raw.slice(1) : raw;
  return new URLSearchParams(qs);
}

function paramsMap(sp: URLSearchParams): Map<string, string[]> {
  const keys = new Set<string>(Array.from(sp.keys()));
  const m = new Map<string, string[]>();
  keys.forEach((k) => {
    m.set(k, sp.getAll(k));
  });
  return m;
}

function formatValues(arr: string[]): string {
  if (arr.length === 0) return "(empty)";
  return arr.map((v) => (v === "" ? "(empty)" : v)).join(", ");
}

type RowStatus = "match" | "value differs" | "only in A" | "only in B";

function compareParams(
  a: Map<string, string[]>,
  b: Map<string, string[]>
): { key: string; displayA: string; displayB: string; status: RowStatus }[] {
  const keys = new Set([...Array.from(a.keys()), ...Array.from(b.keys())]);
  return Array.from(keys)
    .sort((x, y) => x.localeCompare(y))
    .map((key) => {
      const inA = a.has(key);
      const inB = b.has(key);
      const va = inA ? a.get(key)! : [];
      const vb = inB ? b.get(key)! : [];
      let status: RowStatus;
      if (inA && !inB) status = "only in A";
      else if (!inA && inB) status = "only in B";
      else {
        const same =
          va.length === vb.length && va.every((v, i) => v === vb[i]);
        status = same ? "match" : "value differs";
      }
      return {
        key,
        displayA: inA ? formatValues(va) : "—",
        displayB: inB ? formatValues(vb) : "—",
        status,
      };
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

const PARAMS_COMPARE_DEFAULTS = {
  textA: "",
  textB: "",
  showCompare: false,
};

export function ParamsCompareTool() {
  const [s, setS] = useToolSettings("main", PARAMS_COMPARE_DEFAULTS);
  const { textA, textB, showCompare } = s;

  const paramsA = useMemo(() => parseToSearchParams(textA), [textA]);
  const paramsB = useMemo(() => parseToSearchParams(textB), [textB]);

  const mapA = useMemo(() => paramsMap(paramsA), [paramsA]);
  const mapB = useMemo(() => paramsMap(paramsB), [paramsB]);

  const previewA = useMemo(
    () => Array.from(mapA.entries()).sort((x, y) => x[0].localeCompare(y[0])),
    [mapA]
  );
  const previewB = useMemo(
    () => Array.from(mapB.entries()).sort((x, y) => x[0].localeCompare(y[0])),
    [mapB]
  );

  const compareRows = useMemo(
    () => (showCompare ? compareParams(mapA, mapB) : []),
    [showCompare, mapA, mapB]
  );

  const runCompare = useCallback(() => {
    if (!textA.trim() && !textB.trim()) {
      toast.error("Paste at least one URL or query string");
      return;
    }
    setS((p) => ({ ...p, showCompare: true }));
  }, [textA, textB, setS]);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
            URL or query A
          </label>
          <textarea
            value={textA}
            onChange={(e) => {
              setS((p) => ({ ...p, textA: e.target.value, showCompare: false }));
            }}
            placeholder={"https://example.com?foo=1&bar=2\nor: /search?q=test\nor: foo=1&bar=2"}
            rows={5}
            className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 font-mono text-sm focus:ring-2 focus:ring-neutral-400 outline-none resize-y"
          />
          <p className="mt-2 text-xs font-medium text-neutral-600 dark:text-neutral-400">
            Params ({previewA.length} keys)
          </p>
          <div className="mt-2 rounded-lg border border-neutral-200 dark:border-neutral-700 overflow-x-auto max-h-48 overflow-y-auto">
            <table className="w-full text-sm">
              <thead className="bg-neutral-50 dark:bg-neutral-900/80 sticky top-0">
                <tr>
                  <th className="text-left px-3 py-2 font-medium">Key</th>
                  <th className="text-left px-3 py-2 font-medium">Values (order)</th>
                </tr>
              </thead>
              <tbody>
                {previewA.length === 0 ? (
                  <tr>
                    <td colSpan={2} className="px-3 py-2 text-neutral-500">
                      No parameters
                    </td>
                  </tr>
                ) : (
                  previewA.map(([key, vals]) => (
                    <tr key={key} className="border-t border-neutral-200 dark:border-neutral-700">
                      <td className="px-3 py-1.5 font-mono text-neutral-800 dark:text-neutral-200">
                        {key}
                      </td>
                      <td className="px-3 py-1.5 font-mono text-neutral-600 dark:text-neutral-400 break-all">
                        {vals.map((v, i) => (
                          <span key={i}>
                            {i > 0 ? " · " : null}
                            {v === "" ? <span className="italic text-neutral-400">(empty)</span> : v}
                          </span>
                        ))}
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
            URL or query B
          </label>
          <textarea
            value={textB}
            onChange={(e) => {
              setS((p) => ({ ...p, textB: e.target.value, showCompare: false }));
            }}
            placeholder={"https://example.com?foo=1&baz=3"}
            rows={5}
            className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 font-mono text-sm focus:ring-2 focus:ring-neutral-400 outline-none resize-y"
          />
          <p className="mt-2 text-xs font-medium text-neutral-600 dark:text-neutral-400">
            Params ({previewB.length} keys)
          </p>
          <div className="mt-2 rounded-lg border border-neutral-200 dark:border-neutral-700 overflow-x-auto max-h-48 overflow-y-auto">
            <table className="w-full text-sm">
              <thead className="bg-neutral-50 dark:bg-neutral-900/80 sticky top-0">
                <tr>
                  <th className="text-left px-3 py-2 font-medium">Key</th>
                  <th className="text-left px-3 py-2 font-medium">Values (order)</th>
                </tr>
              </thead>
              <tbody>
                {previewB.length === 0 ? (
                  <tr>
                    <td colSpan={2} className="px-3 py-2 text-neutral-500">
                      No parameters
                    </td>
                  </tr>
                ) : (
                  previewB.map(([key, vals]) => (
                    <tr key={key} className="border-t border-neutral-200 dark:border-neutral-700">
                      <td className="px-3 py-1.5 font-mono text-neutral-800 dark:text-neutral-200">
                        {key}
                      </td>
                      <td className="px-3 py-1.5 font-mono text-neutral-600 dark:text-neutral-400 break-all">
                        {vals.map((v, i) => (
                          <span key={i}>
                            {i > 0 ? " · " : null}
                            {v === "" ? <span className="italic text-neutral-400">(empty)</span> : v}
                          </span>
                        ))}
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
                  <th className="text-left px-3 py-2 font-medium">Key</th>
                  <th className="text-left px-3 py-2 font-medium">A</th>
                  <th className="text-left px-3 py-2 font-medium">B</th>
                  <th className="text-left px-3 py-2 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {compareRows.map((row) => (
                  <tr
                    key={row.key}
                    className={`border-t border-neutral-200 dark:border-neutral-700 ${statusClass(row.status)}`}
                  >
                    <td className="px-3 py-2 font-mono font-medium">{row.key}</td>
                    <td className="px-3 py-2 font-mono break-all max-w-[220px]">{row.displayA}</td>
                    <td className="px-3 py-2 font-mono break-all max-w-[220px]">{row.displayB}</td>
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
