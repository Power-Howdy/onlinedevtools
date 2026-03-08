"use client";

import { useState, useCallback } from "react";
import { copyToClipboard as copyText } from "@/lib/clipboard";

type InputOutputProps = {
  inputLabel?: string;
  outputLabel?: string;
  inputPlaceholder?: string;
  outputPlaceholder?: string;
  onTransform?: (input: string) => string | Promise<string>;
  inputMode?: "encode" | "decode" | "both";
  onEncode?: (input: string) => string;
  onDecode?: (input: string) => string;
  readOnly?: boolean;
};

export function InputOutput({
  inputLabel = "Input",
  outputLabel = "Output",
  inputPlaceholder = "Paste or type your input here...",
  outputPlaceholder = "Output will appear here...",
  onTransform,
  inputMode = "both",
  onEncode,
  onDecode,
  readOnly = true,
}: InputOutputProps) {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<"encode" | "decode">(
    inputMode === "both" ? "encode" : inputMode
  );
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleTransform = useCallback(async () => {
    setError(null);
    try {
      if (inputMode === "both" && onEncode && onDecode) {
        const result = mode === "encode" ? onEncode(input) : onDecode(input);
        setOutput(result);
      } else if (onTransform) {
        const result = await onTransform(input);
        setOutput(result);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "An error occurred");
      setOutput("");
    }
  }, [input, mode, inputMode, onTransform, onEncode, onDecode]);

  const copyToClipboard = useCallback(async () => {
    if (!output) return;
    const ok = await copyText(output);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [output]);

  const downloadOutput = useCallback(() => {
    if (!output) return;
    const blob = new Blob([output], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "output.txt";
    a.click();
    URL.revokeObjectURL(url);
  }, [output]);

  const clearAll = useCallback(() => {
    setInput("");
    setOutput("");
    setError(null);
  }, []);

  return (
    <div className="space-y-4">
      {inputMode === "both" && onEncode && onDecode && (
        <div className="flex gap-2">
          <button
            onClick={() => setMode("encode")}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              mode === "encode"
                ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900"
                : "bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700"
            }`}
          >
            Encode
          </button>
          <button
            onClick={() => setMode("decode")}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              mode === "decode"
                ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900"
                : "bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700"
            }`}
          >
            Decode
          </button>
        </div>
      )}
      <div>
        <label
          htmlFor="input"
          className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1"
        >
          {inputLabel}
        </label>
        <textarea
          id="input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={inputPlaceholder}
          rows={6}
          className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 font-mono text-sm focus:ring-2 focus:ring-neutral-400 dark:focus:ring-neutral-500 focus:border-transparent outline-none resize-y"
        />
      </div>
      <div className="flex gap-2">
        <button
          onClick={handleTransform}
          className="px-4 py-2 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-medium rounded-lg hover:bg-neutral-700 dark:hover:bg-neutral-200 transition-colors"
        >
          {inputMode === "both" ? (mode === "encode" ? "Encode" : "Decode") : "Transform"}
        </button>
        <button
          onClick={clearAll}
          className="px-4 py-2 bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-medium rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
        >
          Clear
        </button>
      </div>
      {error && (
        <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400 text-sm">
          {error}
        </div>
      )}
      <div>
        <label
          htmlFor="output"
          className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1"
        >
          {outputLabel}
        </label>
        <textarea
          id="output"
          value={output}
          readOnly={readOnly}
          placeholder={outputPlaceholder}
          rows={6}
          className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-neutral-50 dark:bg-neutral-900/50 text-neutral-900 dark:text-neutral-100 font-mono text-sm resize-y"
        />
      </div>
      {output && (
        <div className="flex gap-2">
          <button
            onClick={copyToClipboard}
            className="px-4 py-2 bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-medium rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors text-sm"
          >
            {copied ? "Copied!" : "Copy"}
          </button>
          <button
            onClick={downloadOutput}
            className="px-4 py-2 bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-medium rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors text-sm"
          >
            Download
          </button>
        </div>
      )}
    </div>
  );
}
