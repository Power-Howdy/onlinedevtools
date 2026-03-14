"use client";

import { useState, useCallback } from "react";
import toast from "react-hot-toast";
import { copyToClipboard } from "@/lib/clipboard";

const UPPERCASE = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const LOWERCASE = "abcdefghijklmnopqrstuvwxyz";
const NUMBERS = "0123456789";
const SYMBOLS = "!@#$%^&*()-_=+[]{}|;:,.<>?";

function generatePassword(
  length: number,
  opts: { uppercase: boolean; lowercase: boolean; numbers: boolean; symbols: boolean }
): string {
  let pool = "";
  if (opts.uppercase) pool += UPPERCASE;
  if (opts.lowercase) pool += LOWERCASE;
  if (opts.numbers) pool += NUMBERS;
  if (opts.symbols) pool += SYMBOLS;
  if (!pool) {
    pool = LOWERCASE + NUMBERS;
  }

  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  let result = "";
  for (let i = 0; i < length; i++) {
    result += pool[bytes[i] % pool.length];
  }
  return result;
}

export function PasswordGeneratorTool() {
  const [length, setLength] = useState(16);
  const [uppercase, setUppercase] = useState(true);
  const [lowercase, setLowercase] = useState(true);
  const [numbers, setNumbers] = useState(true);
  const [symbols, setSymbols] = useState(true);
  const [password, setPassword] = useState("");
  const [copied, setCopied] = useState(false);

  const handleGenerate = useCallback(() => {
    const len = Math.min(64, Math.max(8, length));
    setPassword(
      generatePassword(len, { uppercase, lowercase, numbers, symbols })
    );
  }, [length, uppercase, lowercase, numbers, symbols]);

  const handleCopy = useCallback(async () => {
    if (!password) {
      toast.error("Generate a password first");
      return;
    }
    const ok = await copyToClipboard(password);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } else {
      toast.error("Copy failed. Try selecting and copying manually.");
    }
  }, [password]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-6 items-start">
        <div>
          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
            Length
          </label>
          <input
            type="number"
            min={8}
            max={64}
            value={length}
            onChange={(e) => setLength(parseInt(e.target.value, 10) || 16)}
            className="w-20 px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 font-mono"
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
            Include
          </label>
          <div className="flex flex-wrap gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={uppercase}
                onChange={(e) => setUppercase(e.target.checked)}
                className="rounded border-neutral-300"
              />
              <span className="text-sm">Uppercase</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={lowercase}
                onChange={(e) => setLowercase(e.target.checked)}
                className="rounded border-neutral-300"
              />
              <span className="text-sm">Lowercase</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={numbers}
                onChange={(e) => setNumbers(e.target.checked)}
                className="rounded border-neutral-300"
              />
              <span className="text-sm">Numbers</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={symbols}
                onChange={(e) => setSymbols(e.target.checked)}
                className="rounded border-neutral-300"
              />
              <span className="text-sm">Symbols</span>
            </label>
          </div>
        </div>
        <div className="flex gap-2 pt-6">
          <button
            onClick={handleGenerate}
            className="px-4 py-2 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-medium rounded-lg hover:bg-neutral-700 dark:hover:bg-neutral-200 transition-colors"
          >
            Generate
          </button>
          {password && (
            <button
              onClick={handleCopy}
              className="px-4 py-2 bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-medium rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          )}
        </div>
      </div>
      {password && (
        <div>
          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
            Generated Password
          </label>
          <input
            type="text"
            readOnly
            value={password}
            className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-neutral-50 dark:bg-neutral-900/50 font-mono text-sm"
          />
        </div>
      )}
    </div>
  );
}
