"use client";

import { useState, useCallback } from "react";
import toast from "react-hot-toast";
import { diffLines, Change } from "diff";

function getChangeClass(change: Change): string {
  if (change.added) return "bg-green-200 dark:bg-green-900/50";
  if (change.removed) return "bg-red-200 dark:bg-red-900/50";
  return "";
}

export function DiffCheckerTool() {
  const [text1, setText1] = useState("");
  const [text2, setText2] = useState("");
  const [diffResult, setDiffResult] = useState<Change[] | null>(null);

  const handleDiff = useCallback(() => {
    if (!text1.trim() && !text2.trim()) {
      toast.error("Please enter text in at least one field to compare");
      return;
    }
    const changes = diffLines(text1, text2);
    setDiffResult(changes);
  }, [text1, text2]);

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
            Text 1
          </label>
          <textarea
            value={text1}
            onChange={(e) => setText1(e.target.value)}
            placeholder="Original text..."
            rows={8}
            className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 font-mono text-sm focus:ring-2 focus:ring-neutral-400 outline-none resize-y"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
            Text 2
          </label>
          <textarea
            value={text2}
            onChange={(e) => setText2(e.target.value)}
            placeholder="Modified text..."
            rows={8}
            className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 font-mono text-sm focus:ring-2 focus:ring-neutral-400 outline-none resize-y"
          />
        </div>
      </div>
      <button
        onClick={handleDiff}
        className="px-4 py-2 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-medium rounded-lg hover:bg-neutral-700 dark:hover:bg-neutral-200 transition-colors"
      >
        Compare
      </button>
      {diffResult && (
        <div>
          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
            Diff Result
          </label>
          <div className="rounded-lg border border-neutral-300 dark:border-neutral-600 overflow-hidden">
            <pre className="p-3 font-mono text-sm overflow-x-auto whitespace-pre-wrap bg-neutral-50 dark:bg-neutral-900/50">
              {diffResult.map((part, i) => (
                <span
                  key={i}
                  className={part.value ? getChangeClass(part) : ""}
                >
                  {part.added ? "+" : part.removed ? "-" : " "}
                  {part.value}
                </span>
              ))}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
