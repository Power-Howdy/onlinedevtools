"use client";

import { useState, useCallback } from "react";

function testRegex(pattern: string, text: string): { matches: string[]; error?: string } {
  if (!pattern.trim()) return { matches: [] };
  try {
    const regex = new RegExp(pattern, "g");
    const matches = Array.from(text.matchAll(regex), (m) => m[0]);
    return { matches };
  } catch (e) {
    return { matches: [], error: e instanceof Error ? e.message : "Invalid regex" };
  }
}

export function RegexTesterTool() {
  const [pattern, setPattern] = useState("");
  const [text, setText] = useState("");
  const [result, setResult] = useState<{ matches: string[]; error?: string } | null>(null);

  const handleTest = useCallback(() => {
    setResult(testRegex(pattern, text));
  }, [pattern, text]);

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
          Regular Expression
        </label>
        <input
          type="text"
          value={pattern}
          onChange={(e) => setPattern(e.target.value)}
          placeholder="e.g. \w+@\w+\.\w+"
          className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 font-mono text-sm focus:ring-2 focus:ring-neutral-400 outline-none"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
          Test String
        </label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter text to test against..."
          rows={6}
          className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 font-mono text-sm focus:ring-2 focus:ring-neutral-400 outline-none resize-y"
        />
      </div>
      <button
        onClick={handleTest}
        className="px-4 py-2 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-medium rounded-lg hover:bg-neutral-700 dark:hover:bg-neutral-200 transition-colors"
      >
        Test
      </button>
      {result && (
        <div>
          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
            Result
          </label>
          {result.error ? (
            <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400 text-sm">
              {result.error}
            </div>
          ) : (
            <div className="p-3 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-neutral-50 dark:bg-neutral-900/50">
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                {result.matches.length} match(es) found
              </p>
              {result.matches.length > 0 && (
                <pre className="mt-2 font-mono text-sm overflow-x-auto">
                  {JSON.stringify(result.matches, null, 2)}
                </pre>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
