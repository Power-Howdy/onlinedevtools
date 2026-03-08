"use client";

import { useState, useCallback } from "react";
import toast from "react-hot-toast";
import { copyToClipboard } from "@/lib/clipboard";

function generateUuid(): string {
  return crypto.randomUUID();
}

export function UuidGeneratorTool() {
  const [uuids, setUuids] = useState<string[]>([]);
  const [count, setCount] = useState(1);
  const [copied, setCopied] = useState(false);

  const handleGenerate = useCallback(() => {
    const n = Math.min(Math.max(1, count), 100);
    const generated = Array.from({ length: n }, generateUuid);
    setUuids(generated);
  }, [count]);

  const handleCopy = useCallback(async () => {
    if (uuids.length === 0) {
      toast.error("Generate UUIDs first");
      return;
    }
    const ok = await copyToClipboard(uuids.join("\n"));
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } else {
      toast.error("Copy failed. Try selecting and copying manually.");
    }
  }, [uuids]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4 items-center">
        <div>
          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
            Count
          </label>
          <input
            type="number"
            min={1}
            max={100}
            value={count}
            onChange={(e) => setCount(parseInt(e.target.value, 10) || 1)}
            className="w-20 px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 font-mono"
          />
        </div>
        <div className="flex gap-2 pt-6">
          <button
            onClick={handleGenerate}
            className="px-4 py-2 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-medium rounded-lg hover:bg-neutral-700 dark:hover:bg-neutral-200 transition-colors"
          >
            Generate
          </button>
          {uuids.length > 0 && (
            <button
              onClick={handleCopy}
              className="px-4 py-2 bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-medium rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
            >
              {copied ? "Copied!" : "Copy All"}
            </button>
          )}
        </div>
      </div>
      {uuids.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
            Generated UUIDs
          </label>
          <textarea
            readOnly
            value={uuids.join("\n")}
            rows={Math.min(uuids.length + 1, 12)}
            className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-neutral-50 dark:bg-neutral-900/50 font-mono text-sm resize-none"
          />
        </div>
      )}
    </div>
  );
}
