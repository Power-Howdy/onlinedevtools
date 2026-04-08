"use client";

import { useState, useCallback, useMemo } from "react";
import toast from "react-hot-toast";
import {
  compareJsonStructure,
  countNonEqual,
  type JsonDiffRow,
  type JsonDiffKind,
} from "@/lib/json-structural-diff";

function kindClass(kind: JsonDiffKind): string {
  switch (kind) {
    case "equal":
      return "bg-neutral-100 dark:bg-neutral-800/80";
    case "added":
      return "bg-green-100/80 dark:bg-green-900/30";
    case "removed":
      return "bg-red-100/80 dark:bg-red-900/30";
    case "changed":
      return "bg-amber-100/80 dark:bg-amber-900/30";
    case "type_mismatch":
      return "bg-violet-100/80 dark:bg-violet-900/30";
    default:
      return "";
  }
}

export function JsonCompareTool() {
  const [textLeft, setTextLeft] = useState("");
  const [textRight, setTextRight] = useState("");
  const [showEqual, setShowEqual] = useState(false);
  const [rows, setRows] = useState<JsonDiffRow[] | null>(null);

  const summary = useMemo(() => {
    if (!rows) return null;
    const nonEq = countNonEqual(rows);
    return { total: rows.length, nonEqual: nonEq };
  }, [rows]);

  const runCompare = useCallback(() => {
    if (!textLeft.trim() && !textRight.trim()) {
      toast.error("Paste JSON in at least one field");
      setRows(null);
      return;
    }
    let left: unknown;
    let right: unknown;
    try {
      left = textLeft.trim() ? JSON.parse(textLeft) : undefined;
    } catch {
      toast.error("Left JSON is invalid");
      setRows(null);
      return;
    }
    try {
      right = textRight.trim() ? JSON.parse(textRight) : undefined;
    } catch {
      toast.error("Right JSON is invalid");
      setRows(null);
      return;
    }
    setRows(compareJsonStructure(left, right, showEqual));
  }, [textLeft, textRight, showEqual]);

  return (
    <div className="space-y-4">
      <p className="text-sm text-neutral-600 dark:text-neutral-400">
        Arrays are compared by index (reordering items counts as changes). Empty left or right is
        treated as missing values at each path.
      </p>
      <label className="flex items-center gap-2 text-sm text-neutral-700 dark:text-neutral-300 cursor-pointer w-fit">
        <input
          type="checkbox"
          checked={showEqual}
          onChange={(e) => {
            setShowEqual(e.target.checked);
            setRows(null);
          }}
          className="rounded border-neutral-300 dark:border-neutral-600"
        />
        Show unchanged paths
      </label>
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
            JSON A
          </label>
          <textarea
            value={textLeft}
            onChange={(e) => {
              setTextLeft(e.target.value);
              setRows(null);
            }}
            placeholder='{"b":1,"a":2}'
            rows={12}
            className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 font-mono text-sm focus:ring-2 focus:ring-neutral-400 outline-none resize-y"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
            JSON B
          </label>
          <textarea
            value={textRight}
            onChange={(e) => {
              setTextRight(e.target.value);
              setRows(null);
            }}
            placeholder='{"a":2,"b":1}'
            rows={12}
            className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 font-mono text-sm focus:ring-2 focus:ring-neutral-400 outline-none resize-y"
          />
        </div>
      </div>
      <button
        type="button"
        onClick={runCompare}
        className="px-4 py-2 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-medium rounded-lg hover:bg-neutral-700 dark:hover:bg-neutral-200 transition-colors"
      >
        Compare
      </button>
      {summary && (
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          {summary.nonEqual === 0 ? (
            <>No differences found ({summary.total} path{summary.total === 1 ? "" : "s"}).</>
          ) : (
            <>
              {summary.nonEqual} differing path{summary.nonEqual === 1 ? "" : "s"}
              {showEqual ? ` (${summary.total} rows including unchanged)` : ""}.
            </>
          )}
        </p>
      )}
      {rows && rows.length > 0 && (
        <div className="rounded-lg border border-neutral-300 dark:border-neutral-600 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-neutral-50 dark:bg-neutral-900/80">
              <tr>
                <th className="text-left px-3 py-2 font-medium">Path</th>
                <th className="text-left px-3 py-2 font-medium">A</th>
                <th className="text-left px-3 py-2 font-medium">B</th>
                <th className="text-left px-3 py-2 font-medium">Change</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr
                  key={`${row.path}-${i}`}
                  className={`border-t border-neutral-200 dark:border-neutral-700 ${kindClass(row.kind)}`}
                >
                  <td className="px-3 py-2 font-mono align-top whitespace-nowrap">{row.path}</td>
                  <td className="px-3 py-2 font-mono align-top break-all max-w-[min(280px,40vw)]">
                    {row.left}
                  </td>
                  <td className="px-3 py-2 font-mono align-top break-all max-w-[min(280px,40vw)]">
                    {row.right}
                  </td>
                  <td className="px-3 py-2 align-top whitespace-nowrap">{row.kind}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {rows && rows.length === 0 && summary && summary.total === 0 && (
        <p className="text-sm text-neutral-500">No rows to display.</p>
      )}
    </div>
  );
}
