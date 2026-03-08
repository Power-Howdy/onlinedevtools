"use client";

import { useState, useCallback } from "react";
import cronstrue from "cronstrue";

export function CronParserTool() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleParse = useCallback(() => {
    setError(null);
    const trimmed = input.trim();
    if (!trimmed) {
      setOutput("");
      return;
    }
    try {
      const description = cronstrue.toString(trimmed);
      setOutput(description);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Invalid cron expression");
      setOutput("");
    }
  }, [input]);

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
          Cron Expression
        </label>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="e.g. */5 * * * * or 0 0 * * *"
          className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 font-mono text-sm focus:ring-2 focus:ring-neutral-400 outline-none"
        />
      </div>
      <button
        onClick={handleParse}
        className="px-4 py-2 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-medium rounded-lg hover:bg-neutral-700 dark:hover:bg-neutral-200 transition-colors"
      >
        Explain
      </button>
      {error && (
        <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400 text-sm">
          {error}
        </div>
      )}
      {output && (
        <div>
          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
            Human-Readable Schedule
          </label>
          <div className="p-3 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-neutral-50 dark:bg-neutral-900/50 text-neutral-900 dark:text-neutral-100">
            {output}
          </div>
        </div>
      )}
    </div>
  );
}
