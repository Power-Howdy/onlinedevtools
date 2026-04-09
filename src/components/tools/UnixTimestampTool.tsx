"use client";

import { useState, useCallback } from "react";
import toast from "react-hot-toast";
import { useToolSettings } from "@/hooks/useToolSettings";

function timestampToDate(input: string): { iso: string; local: string; timezone: string } {
  const trimmed = input.trim();
  if (!trimmed) return { iso: "", local: "", timezone: "" };
  const num = parseInt(trimmed, 10);
  if (isNaN(num)) throw new Error("Invalid timestamp: must be a number");
  const ms = trimmed.length <= 10 ? num * 1000 : num;
  const date = new Date(ms);
  if (isNaN(date.getTime())) throw new Error("Invalid timestamp");
  const iso = date.toISOString();
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const local = date.toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "long",
  });
  return { iso, local, timezone };
}

function dateToTimestamp(input: string): string {
  const trimmed = input.trim();
  if (!trimmed) return "";
  const date = new Date(trimmed);
  if (isNaN(date.getTime())) throw new Error("Invalid date format");
  return Math.floor(date.getTime() / 1000).toString();
}

const UNIX_TS_DEFAULTS: {
  input: string;
  mode: "toDate" | "toTimestamp";
} = {
  input: "",
  mode: "toDate",
};

export function UnixTimestampTool() {
  const [s, setS] = useToolSettings("main", UNIX_TS_DEFAULTS);
  const { input, mode } = s;
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [dateDetails, setDateDetails] = useState<{
    iso: string;
    local: string;
    timezone: string;
  } | null>(null);

  const handleConvert = useCallback(() => {
    setError(null);
    setDateDetails(null);
    if (!input.trim()) {
      toast.error("Please enter a timestamp or date");
      return;
    }
    try {
      if (mode === "toDate") {
        const result = timestampToDate(input);
        setDateDetails(result);
        setOutput(`${result.iso}\n\nLocal (${result.timezone}): ${result.local}`);
      } else {
        setOutput(dateToTimestamp(input));
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Conversion failed";
      setError(msg);
      setOutput("");
      toast.error(msg);
    }
  }, [input, mode]);

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button
          onClick={() => setS((p) => ({ ...p, mode: "toDate" }))}
          className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
            mode === "toDate"
              ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900"
              : "bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700"
          }`}
        >
          Timestamp → Date
        </button>
        <button
          onClick={() => setS((p) => ({ ...p, mode: "toTimestamp" }))}
          className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
            mode === "toTimestamp"
              ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900"
              : "bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700"
          }`}
        >
          Date → Timestamp
        </button>
      </div>
      <div>
        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
          {mode === "toDate" ? "Unix Timestamp" : "Date (ISO or any parseable format)"}
        </label>
        <textarea
          value={input}
          onChange={(e) => setS((p) => ({ ...p, input: e.target.value }))}
          placeholder={
            mode === "toDate"
              ? "e.g. 1700000000 or 1700000000000"
              : "e.g. 2024-01-01 or 2024-01-01T00:00:00Z"
          }
          rows={2}
          className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 font-mono text-sm focus:ring-2 focus:ring-neutral-400 outline-none"
        />
      </div>
      <button
        onClick={handleConvert}
        className="px-4 py-2 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-medium rounded-lg hover:bg-neutral-700 dark:hover:bg-neutral-200 transition-colors"
      >
        Convert
      </button>
      {error && (
        <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400 text-sm">
          {error}
        </div>
      )}
      {output && (
        <div>
          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
            Result
            {dateDetails && (
              <span className="ml-2 font-normal text-neutral-500 dark:text-neutral-400">
                (Timezone: {dateDetails.timezone})
              </span>
            )}
          </label>
          <div className="p-3 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-neutral-50 dark:bg-neutral-900/50 font-mono text-sm whitespace-pre-wrap">
            {output}
          </div>
        </div>
      )}
    </div>
  );
}
