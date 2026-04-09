"use client";

import { useState, useCallback } from "react";
import toast from "react-hot-toast";
import bcrypt from "bcryptjs";
import { InputOutput } from "@/components/InputOutput";
import { useToolSettings } from "@/hooks/useToolSettings";

const ROUNDS = 10;

const BCRYPT_DEFAULTS: {
  mode: "hash" | "compare";
  comparePlain: string;
  compareHash: string;
} = {
  mode: "hash",
  comparePlain: "",
  compareHash: "",
};

export function BcryptGeneratorTool() {
  const [s, setS] = useToolSettings("main", BCRYPT_DEFAULTS);
  const { mode, comparePlain, compareHash } = s;
  const [compareResult, setCompareResult] = useState<boolean | null>(null);

  const handleHash = useCallback((input: string) => {
    if (!input.trim()) throw new Error("Please enter text to hash");
    return bcrypt.hashSync(input, ROUNDS);
  }, []);

  const compareHandler = useCallback(
    (plain: string, hash: string) => {
      if (!plain.trim()) {
        toast.error("Please enter text to compare");
        return;
      }
      if (!hash.trim()) {
        toast.error("Please enter a bcrypt hash to compare");
        return;
      }
      try {
        const match = bcrypt.compareSync(plain, hash);
        setCompareResult(match);
        toast.success(match ? "Hash matches" : "Hash does not match");
      } catch (e) {
        toast.error("Invalid hash format");
        setCompareResult(null);
      }
    },
    []
  );

  if (mode === "compare") {
    return (
      <div className="space-y-4">
        <div className="flex gap-2">
          <button
            onClick={() => setS((p) => ({ ...p, mode: "hash" }))}
            className="px-3 py-1.5 rounded-md text-sm font-medium transition-colors bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700"
          >
            Hash
          </button>
          <button
            onClick={() => setS((p) => ({ ...p, mode: "compare" }))}
            className="px-3 py-1.5 rounded-md text-sm font-medium transition-colors bg-neutral-900 text-white dark:bg-white dark:bg-neutral-900 dark:text-neutral-900"
          >
            Compare
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
              Plain text
            </label>
            <textarea
              value={comparePlain}
              onChange={(e) => setS((p) => ({ ...p, comparePlain: e.target.value }))}
              placeholder="Enter password or text..."
              rows={2}
              className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 font-mono text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
              Bcrypt hash
            </label>
            <textarea
              id="bcrypt-compare-hash"
              value={compareHash}
              onChange={(e) => setS((p) => ({ ...p, compareHash: e.target.value }))}
              placeholder="$2a$10$..."
              rows={2}
              className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 font-mono text-sm"
            />
          </div>
          <button
            onClick={() => compareHandler(comparePlain, compareHash)}
            className="px-4 py-2 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-medium rounded-lg hover:bg-neutral-700 dark:hover:bg-neutral-200"
          >
            Compare
          </button>
          {compareResult !== null && (
            <div
              className={`p-3 rounded-lg text-sm ${
                compareResult
                  ? "bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400"
                  : "bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400"
              }`}
            >
              {compareResult ? "Match: the hash corresponds to the input." : "No match: the hash does not correspond to the input."}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button
          onClick={() => setS((p) => ({ ...p, mode: "hash" }))}
          className="px-3 py-1.5 rounded-md text-sm font-medium transition-colors bg-neutral-900 text-white dark:bg-white dark:text-neutral-900"
        >
          Hash
        </button>
        <button
          onClick={() => setS((p) => ({ ...p, mode: "compare" }))}
          className="px-3 py-1.5 rounded-md text-sm font-medium transition-colors bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700"
        >
          Compare
        </button>
      </div>
      <InputOutput
        inputLabel="Text to hash"
        outputLabel="Bcrypt hash"
        inputPlaceholder="Enter password or text..."
        outputPlaceholder="Hash will appear here..."
        onTransform={(input) => handleHash(input)}
      />
    </div>
  );
}
