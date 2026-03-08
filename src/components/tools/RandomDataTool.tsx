"use client";

import { useState, useCallback } from "react";
import toast from "react-hot-toast";
import { copyToClipboard } from "@/lib/clipboard";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

function randomString(len: number): string {
  let s = "";
  const arr = new Uint8Array(len);
  crypto.getRandomValues(arr);
  for (let i = 0; i < len; i++) s += CHARS[arr[i]! % CHARS.length];
  return s;
}

function randomHex(len: number): string {
  const arr = new Uint8Array(len);
  crypto.getRandomValues(arr);
  return Array.from(arr)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function randomInt(min: number, max: number): number {
  const range = max - min + 1;
  const arr = new Uint8Array(4);
  crypto.getRandomValues(arr);
  const n = (arr[0]! << 24) | (arr[1]! << 16) | (arr[2]! << 8) | arr[3]!;
  return min + (Math.abs(n) % range);
}

function randomJson(): string {
  const types = ["string", "number", "boolean", "null", "array", "object"];
  function gen(): unknown {
    const t = types[randomInt(0, types.length - 1)]!;
    switch (t) {
      case "string":
        return randomString(randomInt(4, 12));
      case "number":
        return randomInt(-1000, 1000);
      case "boolean":
        return Math.random() > 0.5;
      case "null":
        return null;
      case "array":
        return Array.from({ length: randomInt(1, 4) }, () => gen());
      default:
        return {
          [randomString(4)]: gen(),
          [randomString(4)]: gen(),
        };
    }
  }
  // Always return a root object or array (never bare primitives)
  const root = randomInt(0, 1) === 0
    ? Array.from({ length: randomInt(1, 4) }, () => gen())
    : Object.fromEntries(
        Array.from({ length: randomInt(2, 5) }, () => [
          randomString(randomInt(3, 8)),
          gen(),
        ])
      );
  return JSON.stringify(root, null, 2);
}

export function RandomDataTool() {
  const [type, setType] = useState<"string" | "number" | "uuid" | "hex" | "json">("string");
  const [stringLen, setStringLen] = useState(16);
  const [numberMin, setNumberMin] = useState(0);
  const [numberMax, setNumberMax] = useState(100);
  const [hexLen, setHexLen] = useState(32);
  const [outputs, setOutputs] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  const generate = useCallback(() => {
    const count = 1;
    const results: string[] = [];
    for (let i = 0; i < count; i++) {
      switch (type) {
        case "string":
          results.push(randomString(stringLen));
          break;
        case "number":
          results.push(String(randomInt(numberMin, numberMax)));
          break;
        case "uuid":
          results.push(crypto.randomUUID());
          break;
        case "hex":
          results.push(randomHex(Math.ceil(hexLen / 2)));
          break;
        case "json":
          results.push(randomJson());
          break;
      }
    }
    setOutputs(results);
  }, [type, stringLen, numberMin, numberMax, hexLen]);

  const copyAll = useCallback(async () => {
    if (outputs.length === 0) {
      toast.error("Generate data first");
      return;
    }
    const ok = await copyToClipboard(outputs.join("\n"));
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } else {
      toast.error("Copy failed. Try selecting and copying manually.");
    }
  }, [outputs]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {(["string", "number", "uuid", "hex", "json"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setType(t)}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              type === t ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900" : "bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700"
            }`}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>
      {type === "string" && (
        <div>
          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Length</label>
          <input
            type="number"
            min={1}
            max={512}
            value={stringLen}
            onChange={(e) => setStringLen(Math.max(1, parseInt(e.target.value, 10) || 1))}
            className="w-24 px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900"
          />
        </div>
      )}
      {type === "number" && (
        <div className="flex gap-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Min</label>
            <input
              type="number"
              value={numberMin}
              onChange={(e) => setNumberMin(parseInt(e.target.value, 10) || 0)}
              className="w-24 px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Max</label>
            <input
              type="number"
              value={numberMax}
              onChange={(e) => setNumberMax(parseInt(e.target.value, 10) || 100)}
              className="w-24 px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900"
            />
          </div>
        </div>
      )}
      {type === "hex" && (
        <div>
          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Bytes (hex length)</label>
          <input
            type="number"
            min={2}
            max={512}
            value={hexLen}
            onChange={(e) => setHexLen(Math.max(2, parseInt(e.target.value, 10) || 2))}
            className="w-24 px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900"
          />
        </div>
      )}
      <div className="flex gap-2">
        <button
          onClick={generate}
          className="px-4 py-2 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-medium rounded-lg hover:bg-neutral-700 dark:hover:bg-neutral-200"
        >
          Generate
        </button>
        {outputs.length > 0 && (
          <button
            onClick={copyAll}
            className="px-4 py-2 bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-medium rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-700"
          >
            {copied ? "Copied!" : "Copy"}
          </button>
        )}
      </div>
      {outputs.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Output</label>
          <textarea
            readOnly
            value={outputs.join("\n")}
            rows={type === "json" ? 12 : 4}
            className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-neutral-50 dark:bg-neutral-900/50 font-mono text-sm resize-y"
          />
        </div>
      )}
    </div>
  );
}
