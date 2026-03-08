"use client";

import { useCallback, useState } from "react";
import { InputOutput } from "@/components/InputOutput";

function parseJson(input: string): unknown {
  const trimmed = input.trim();
  if (!trimmed) throw new Error("Input is empty");
  return JSON.parse(trimmed);
}

function jsonToTypeScript(obj: unknown, name = "Root"): string {
  if (obj === null) return "null";
  if (typeof obj === "string") return "string";
  if (typeof obj === "number") return "number";
  if (typeof obj === "boolean") return "boolean";
  if (Array.isArray(obj)) {
    const itemType = obj.length > 0 ? jsonToTypeScript(obj[0], "Item") : "unknown";
    return `${itemType}[]`;
  }
  if (typeof obj === "object") {
    const entries = Object.entries(obj as Record<string, unknown>);
    const props = entries
      .map(([key, val]) => {
        const safeKey = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(key) ? key : JSON.stringify(key);
        return `  ${safeKey}: ${jsonToTypeScript(val, key)};`;
      })
      .join("\n");
    return `{\n${props}\n}`;
  }
  return "unknown";
}

export function JsonFormatterTool() {
  const [mode, setMode] = useState<"format" | "typescript">("format");

  const handleTransform = useCallback(
    (input: string) => {
      const parsed = parseJson(input);
      if (mode === "format") {
        return JSON.stringify(parsed, null, 2);
      }
      const ts = jsonToTypeScript(parsed);
      return `interface Root ${ts}`;
    },
    [mode]
  );

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button
          onClick={() => setMode("format")}
          className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
            mode === "format"
              ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900"
              : "bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700"
          }`}
        >
          Format
        </button>
        <button
          onClick={() => setMode("typescript")}
          className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
            mode === "typescript"
              ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900"
              : "bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700"
          }`}
        >
          TypeScript Interface
        </button>
      </div>
      <InputOutput
        inputLabel="JSON Input"
        outputLabel={mode === "format" ? "Formatted JSON" : "TypeScript Interface"}
        inputPlaceholder='{"key": "value", "array": [1, 2, 3]}'
        outputPlaceholder={
          mode === "format"
            ? "Formatted output will appear here..."
            : "interface Root { ... }"
        }
        onTransform={handleTransform}
      />
    </div>
  );
}
