"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { Copy, Download } from "lucide-react";
import { copyToClipboard } from "@/lib/clipboard";
import { useToolSettings } from "@/hooks/useToolSettings";
import {
  downloadTextFile,
  EXPORT_MIME,
  recordsToCsv,
  recordsToJson,
} from "@/lib/data-export";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
const MAX_COUNT = 1000;
const COUNT_PRESETS = [1, 10, 100, 1000] as const;

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

function randomInt(min: number, max: number): string {
  const range = max - min + 1;
  const arr = new Uint8Array(4);
  crypto.getRandomValues(arr);
  const n = (arr[0]! << 24) | (arr[1]! << 16) | (arr[2]! << 8) | arr[3]!;
  return String(min + (Math.abs(n) % range));
}

function randomJsonValue(): unknown {
  const types = ["string", "number", "boolean", "null", "array", "object"];
  function gen(): unknown {
    const t = types[Number(randomInt(0, types.length - 1))]!;
    switch (t) {
      case "string":
        return randomString(Number(randomInt(4, 12)));
      case "number":
        return Number(randomInt(-1000, 1000));
      case "boolean":
        return Math.random() > 0.5;
      case "null":
        return null;
      case "array":
        return Array.from({ length: Number(randomInt(1, 4)) }, () => gen());
      default:
        return {
          [randomString(4)]: gen(),
          [randomString(4)]: gen(),
        };
    }
  }
  const root =
    Number(randomInt(0, 1)) === 0
      ? Array.from({ length: Number(randomInt(1, 4)) }, () => gen())
      : Object.fromEntries(
          Array.from({ length: Number(randomInt(2, 5)) }, () => [
            randomString(Number(randomInt(3, 8))),
            gen(),
          ])
        );
  return root;
}

const RANDOM_DATA_DEFAULTS: {
  type: "string" | "number" | "uuid" | "hex" | "json";
  stringLen: number;
  numberMin: number;
  numberMax: number;
  hexLen: number;
  count: number;
} = {
  type: "string",
  stringLen: 16,
  numberMin: 0,
  numberMax: 100,
  hexLen: 32,
  count: 1,
};

export function RandomDataTool() {
  const [s, setS] = useToolSettings("main", RANDOM_DATA_DEFAULTS);
  const { type, stringLen, numberMin, numberMax, hexLen } = s;
  const count = Math.min(MAX_COUNT, Math.max(1, Number(s.count) || 1));
  const [outputs, setOutputs] = useState<string[]>([]);
  const [copiedKind, setCopiedKind] = useState<"plain" | "json" | "csv" | null>(
    null
  );

  const generate = useCallback(() => {
    const results: string[] = [];
    for (let i = 0; i < count; i++) {
      switch (type) {
        case "string":
          results.push(randomString(Number(stringLen) || 16));
          break;
        case "number":
          results.push(
            randomInt(Number(numberMin) || 0, Number(numberMax) || 100)
          );
          break;
        case "uuid":
          results.push(crypto.randomUUID());
          break;
        case "hex":
          results.push(randomHex(Math.ceil((Number(hexLen) || 32) / 2)));
          break;
        case "json":
          results.push(JSON.stringify(randomJsonValue(), null, 2));
          break;
      }
    }
    setOutputs(results);
  }, [type, stringLen, numberMin, numberMax, hexLen, count]);

  const markCopied = useCallback((kind: "plain" | "json" | "csv") => {
    setCopiedKind(kind);
    window.setTimeout(() => setCopiedKind(null), 2000);
  }, []);

  const asJson = useCallback(() => {
    if (type === "json") {
      const parsed = outputs.map((item) => {
        try {
          return JSON.parse(item) as unknown;
        } catch {
          return item;
        }
      });
      return recordsToJson(
        parsed.map((value, index) =>
          typeof value === "object" && value !== null && !Array.isArray(value)
            ? (value as Record<string, unknown>)
            : { index: index + 1, value }
        )
      );
    }
    return recordsToJson(
      outputs.map((value, index) => ({ index: index + 1, value }))
    );
  }, [outputs, type]);

  const asCsv = useCallback(() => {
    if (type === "json") {
      return recordsToCsv(
        outputs.map((value, index) => ({ index: index + 1, value })),
        ["index", "value"]
      );
    }
    return recordsToCsv(
      outputs.map((value, index) => ({ index: index + 1, value })),
      ["index", "value"]
    );
  }, [outputs]);

  const copyPlain = useCallback(async () => {
    if (outputs.length === 0) {
      toast.error("Generate data first");
      return;
    }
    const ok = await copyToClipboard(outputs.join("\n"));
    if (ok) {
      markCopied("plain");
      toast.success("Copied");
    } else {
      toast.error("Copy failed. Try selecting and copying manually.");
    }
  }, [markCopied, outputs]);

  const copyJson = useCallback(async () => {
    if (outputs.length === 0) {
      toast.error("Generate data first");
      return;
    }
    const ok = await copyToClipboard(asJson());
    if (ok) {
      markCopied("json");
      toast.success("JSON copied");
    } else {
      toast.error("Copy failed. Try selecting and copying manually.");
    }
  }, [asJson, markCopied, outputs.length]);

  const copyCsv = useCallback(async () => {
    if (outputs.length === 0) {
      toast.error("Generate data first");
      return;
    }
    const ok = await copyToClipboard(asCsv());
    if (ok) {
      markCopied("csv");
      toast.success("CSV copied");
    } else {
      toast.error("Copy failed. Try selecting and copying manually.");
    }
  }, [asCsv, markCopied, outputs.length]);

  const download = useCallback(
    (format: "json" | "csv") => {
      if (outputs.length === 0) {
        toast.error("Generate data first");
        return;
      }
      downloadTextFile(
        `random-${type}-${outputs.length}.${format}`,
        format === "json" ? asJson() : asCsv(),
        EXPORT_MIME[format]
      );
      toast.success(`${format.toUpperCase()} downloaded`);
    },
    [asCsv, asJson, outputs.length, type]
  );

  return (
    <div className="space-y-4">
      <p className="text-sm text-neutral-600 dark:text-neutral-400 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/40 px-3 py-2">
        Primitive values only (strings, numbers, UUIDs, hex, random JSON). For
        structured users, products, and orders, use the{" "}
        <Link
          href="/mock-profile-generator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Test User &amp; Test Data Generator
        </Link>
        .
      </p>

      <div className="flex flex-wrap gap-2">
        {(["string", "number", "uuid", "hex", "json"] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setS((p) => ({ ...p, type: t }))}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              type === t
                ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900"
                : "bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700"
            }`}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      <div>
        <span className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
          How many
        </span>
        <div className="flex flex-wrap items-center gap-2">
          {COUNT_PRESETS.map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => setS((p) => ({ ...p, count: preset }))}
              className={`px-3 py-1.5 rounded-md text-sm font-medium ${
                count === preset
                  ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900"
                  : "bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700"
              }`}
            >
              {preset.toLocaleString()}
            </button>
          ))}
          <input
            type="number"
            min={1}
            max={MAX_COUNT}
            value={s.count}
            onChange={(e) =>
              setS((p) => ({
                ...p,
                count: Math.min(
                  MAX_COUNT,
                  Math.max(1, parseInt(e.target.value, 10) || 1)
                ),
              }))
            }
            className="w-24 px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 font-mono text-sm"
            aria-label="Custom count"
          />
        </div>
      </div>

      {type === "string" && (
        <div>
          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
            Length
          </label>
          <input
            type="number"
            min={1}
            max={512}
            value={stringLen}
            onChange={(e) =>
              setS((p) => ({
                ...p,
                stringLen: Math.max(1, parseInt(e.target.value, 10) || 1),
              }))
            }
            className="w-24 px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900"
          />
        </div>
      )}
      {type === "number" && (
        <div className="flex gap-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
              Min
            </label>
            <input
              type="number"
              value={numberMin}
              onChange={(e) =>
                setS((p) => ({
                  ...p,
                  numberMin: parseInt(e.target.value, 10) || 0,
                }))
              }
              className="w-24 px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
              Max
            </label>
            <input
              type="number"
              value={numberMax}
              onChange={(e) =>
                setS((p) => ({
                  ...p,
                  numberMax: parseInt(e.target.value, 10) || 100,
                }))
              }
              className="w-24 px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900"
            />
          </div>
        </div>
      )}
      {type === "hex" && (
        <div>
          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
            Bytes (hex length)
          </label>
          <input
            type="number"
            min={2}
            max={512}
            value={hexLen}
            onChange={(e) =>
              setS((p) => ({
                ...p,
                hexLen: Math.max(2, parseInt(e.target.value, 10) || 2),
              }))
            }
            className="w-24 px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900"
          />
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={generate}
          className="px-4 py-2 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-medium rounded-lg hover:bg-neutral-700 dark:hover:bg-neutral-200"
        >
          Generate {count.toLocaleString()}
        </button>
        {outputs.length > 0 && (
          <>
            <button
              type="button"
              onClick={() => void copyPlain()}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-medium rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-700"
            >
              <Copy className="h-4 w-4" aria-hidden />
              {copiedKind === "plain" ? "Copied" : "Copy"}
            </button>
            <button
              type="button"
              onClick={() => void copyJson()}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-medium rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-700"
            >
              <Copy className="h-4 w-4" aria-hidden />
              {copiedKind === "json" ? "JSON copied" : "Copy JSON"}
            </button>
            <button
              type="button"
              onClick={() => void copyCsv()}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-medium rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-700"
            >
              <Copy className="h-4 w-4" aria-hidden />
              {copiedKind === "csv" ? "CSV copied" : "Copy CSV"}
            </button>
            <button
              type="button"
              onClick={() => download("json")}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-medium rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-700"
            >
              <Download className="h-4 w-4" aria-hidden />
              JSON
            </button>
            <button
              type="button"
              onClick={() => download("csv")}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-medium rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-700"
            >
              <Download className="h-4 w-4" aria-hidden />
              CSV
            </button>
          </>
        )}
      </div>

      {outputs.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
            Output ({outputs.length.toLocaleString()})
          </label>
          <textarea
            readOnly
            value={outputs.join("\n\n")}
            rows={type === "json" ? 14 : Math.min(12, Math.max(4, outputs.length + 1))}
            className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-neutral-50 dark:bg-neutral-900/50 font-mono text-sm resize-y"
          />
        </div>
      )}
    </div>
  );
}
